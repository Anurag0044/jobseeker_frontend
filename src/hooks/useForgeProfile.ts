"use client";

import { FirebaseError } from "firebase/app";
import { doc, onSnapshot, serverTimestamp, setDoc } from "firebase/firestore";
import { useCallback, useEffect, useMemo, useState } from "react";
import { db, firebaseProjectId, isFirebaseConfigured } from "../lib/firebase";
import { useUser } from "./useUser";

export interface ForgeProfile {
  uid: string;
  email: string;
  displayName: string;
  username: string;
  title: string;
  bio: string;
  location: string;
  portfolioUrl: string;
  github: string;
  linkedin: string;
  photoURL: string;
  techStack: string[];
  skills: string[];
  onboardingComplete: boolean;
  createdAt?: unknown;
  updatedAt?: unknown;
  role?: "admin" | "user";
}

export type ForgeProfileInput = Partial<
  Omit<ForgeProfile, "uid" | "email" | "createdAt" | "updatedAt" | "techStack" | "skills">
> & {
  techStack?: string | string[];
  skills?: string | string[];
};

function splitList(value: string | string[] | undefined): string[] {
  if (Array.isArray(value)) {
    return value.map((item) => item.trim()).filter(Boolean);
  }

  return (value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function getFirestoreErrorMessage(error: unknown) {
  if (error instanceof FirebaseError && error.code === "permission-denied") {
    return [
      "Firestore rejected this profile request.",
      `The app is connected to project "${firebaseProjectId || "unknown"}".`,
      "Make sure that exact Firebase project has test/dev rules deployed for users/{uid}.",
    ].join(" ");
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Unable to load or save your profile.";
}

export function normalizeProfileLists(input: ForgeProfileInput): ForgeProfileInput {
  return {
    ...input,
    techStack: splitList(input.techStack),
    skills: splitList(input.skills),
  };
}

export function useForgeProfile() {
  const { user, loading: authLoading } = useUser();
  const [profile, setProfile] = useState<ForgeProfile | null>(null);
  const [profileExists, setProfileExists] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      queueMicrotask(() => {
        setProfile(null);
        setProfileExists(false);
        setError(null);
        setLoading(false);
      });
      return;
    }

    if (!db) {
      queueMicrotask(() => {
        setProfile(null);
        setProfileExists(false);
        setError(
          isFirebaseConfigured
            ? "Firestore is not available for this Firebase app."
            : "Firebase is not configured. Add the NEXT_PUBLIC_FIREBASE_* variables to your environment."
        );
        setLoading(false);
      });
      return;
    }

    queueMicrotask(() => {
      setLoading(true);
      setError(null);
    });
    const profileRef = doc(db, "users", user.uid);

    return onSnapshot(
      profileRef,
      (snapshot) => {
        setProfileExists(snapshot.exists());
        if (!snapshot.exists()) {
          setProfile(null);
          setLoading(false);
          return;
        }

        setProfile(snapshot.data() as ForgeProfile);
        setLoading(false);
      },
      (snapshotError) => {
        setProfile(null);
        setProfileExists(false);
        setError(getFirestoreErrorMessage(snapshotError));
        setLoading(false);
      }
    );
  }, [authLoading, user]);

  const fallbackProfile = useMemo<ForgeProfile | null>(() => {
    if (!user) return null;

    const fallbackName = user.displayName || user.email?.split("@")[0] || "Forge User";

    return {
      uid: user.uid,
      email: user.email || "",
      displayName: fallbackName,
      username: fallbackName.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, ""),
      title: "Full Stack Developer",
      bio: "I build scalable web applications and AI-powered tools that solve real-world problems.",
      location: "Worldwide",
      portfolioUrl: "",
      github: "",
      linkedin: "",
      photoURL: user.photoURL || "",
      techStack: ["React", "TypeScript", "Next.js"],
      skills: ["Frontend Development", "AI Agents", "Project Building"],
      onboardingComplete: false,
      role: "user",
    };
  }, [user]);

  const displayProfile = profile || fallbackProfile;

  const saveProfile = useCallback(
    async (input: ForgeProfileInput, markComplete = true) => {
      if (!user) {
        throw new Error("You must be signed in to save your profile.");
      }

      if (!db) {
        throw new Error(
          isFirebaseConfigured
            ? "Firestore is not available for this Firebase app."
            : "Firebase is not configured. Add the NEXT_PUBLIC_FIREBASE_* variables to your environment."
        );
      }

      const fallbackName = user.displayName || user.email?.split("@")[0] || "Forge User";
      const normalized = normalizeProfileLists(input);
      const nowPayload = {
        uid: user.uid,
        email: user.email || "",
        displayName: normalized.displayName || profile?.displayName || fallbackName,
        username:
          normalized.username ||
          profile?.username ||
          fallbackName.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, ""),
        title: normalized.title ?? profile?.title ?? "Full Stack Developer",
        bio:
          normalized.bio ??
          profile?.bio ??
          "I build scalable web applications and AI-powered tools that solve real-world problems.",
        location: normalized.location ?? profile?.location ?? "Worldwide",
        portfolioUrl: normalized.portfolioUrl ?? profile?.portfolioUrl ?? "",
        github: normalized.github ?? profile?.github ?? "",
        linkedin: normalized.linkedin ?? profile?.linkedin ?? "",
        photoURL: normalized.photoURL ?? profile?.photoURL ?? user.photoURL ?? "",
        techStack: normalized.techStack?.length ? normalized.techStack : profile?.techStack || [],
        skills: normalized.skills?.length ? normalized.skills : profile?.skills || [],
        onboardingComplete: markComplete ? true : profile?.onboardingComplete || false,
        role: profile?.role || "user",
        updatedAt: serverTimestamp(),
      };

      try {
        await setDoc(
          doc(db, "users", user.uid),
          profileExists
            ? nowPayload
            : {
                ...nowPayload,
                createdAt: serverTimestamp(),
              },
          { merge: true }
        );
        setError(null);
      } catch (saveError) {
        const message = getFirestoreErrorMessage(saveError);
        setError(message);
        throw new Error(message);
      }
    },
    [profile, profileExists, user]
  );

  return {
    user,
    profile,
    displayProfile,
    profileExists,
    loading: authLoading || loading,
    error,
    needsOnboarding: !!user && !loading && (!profileExists || !profile?.onboardingComplete),
    saveProfile,
  };
}
