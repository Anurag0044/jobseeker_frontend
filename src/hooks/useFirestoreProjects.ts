"use client";

import { FirebaseError } from "firebase/app";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { uploadImageToCloudinary } from "../lib/cloudinary";
import { useUser } from "./useUser";

export type ProjectStatus = "Draft" | "Published" | "Private";

export interface CustomLink {
  label: string;
  url: string;
}

export interface FirestoreProject {
  id: string;
  ownerUid: string;
  title: string;
  tagline: string;
  description: string;
  category: string;
  type: string;
  tags: string[];
  status: ProjectStatus;
  featured: boolean;
  coverUrl: string;
  links: {
    github: string;
    demo: string;
    docs: string;
    figma: string;
    custom: CustomLink[];
  };
  createdAt?: unknown;
  updatedAt?: unknown;
}

export type FirestoreProjectInput = Omit<
  FirestoreProject,
  "id" | "ownerUid" | "createdAt" | "updatedAt"
>;

function getFirebaseMessage(error: unknown): string {
  if (error instanceof FirebaseError && error.code === "permission-denied") {
    return "Firestore rejected the projects request. Make sure the projects collection rules are deployed.";
  }
  return error instanceof Error ? error.message : "Unable to manage projects.";
}

export function useFirestoreProjects(ownerUid?: string) {
  const { user, loading: authLoading } = useUser();
  const targetUid = ownerUid || user?.uid;

  const [projects, setProjects] = useState<FirestoreProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading) return;
    if (!targetUid || !db) {
      setTimeout(() => {
        setProjects([]);
        setLoading(false);
      }, 0);
      return;
    }

    const q = query(
      collection(db, "projects"),
      where("ownerUid", "==", targetUid),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(
      q,
      (snap) => {
        setProjects(
          snap.docs.map((d) => ({ id: d.id, ...d.data() } as FirestoreProject))
        );
        setLoading(false);
        setError("");
      },
      (err) => {
        setError(getFirebaseMessage(err));
        setLoading(false);
      }
    );

    return unsub;
  }, [authLoading, targetUid]);

  /** Create a new project. Optionally upload a cover image first. */
  const createProject = useCallback(
    async (input: FirestoreProjectInput, coverFile?: File) => {
      if (!user || !db) throw new Error("Not authenticated.");

      let coverUrl = input.coverUrl || "";
      if (coverFile) {
        const res = await uploadImageToCloudinary(coverFile, "forgex/projects");
        coverUrl = res.secure_url;
      }

      await addDoc(collection(db, "projects"), {
        ...input,
        coverUrl,
        ownerUid: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    },
    [user]
  );

  /** Update an existing project. Optionally re-upload cover. */
  const updateProject = useCallback(
    async (id: string, input: Partial<FirestoreProjectInput>, newCoverFile?: File) => {
      if (!user || !db) throw new Error("Not authenticated.");

      let patch: Record<string, unknown> = { ...input, updatedAt: serverTimestamp() };
      if (newCoverFile) {
        const res = await uploadImageToCloudinary(newCoverFile, "forgex/projects");
        patch.coverUrl = res.secure_url;
      }

      await updateDoc(doc(db, "projects", id), patch);
    },
    [user]
  );

  /** Permanently delete a project. */
  const deleteProject = useCallback(
    async (id: string) => {
      if (!user || !db) throw new Error("Not authenticated.");
      await deleteDoc(doc(db, "projects", id));
    },
    [user]
  );

  return {
    projects,
    loading: authLoading || loading,
    error,
    createProject,
    updateProject,
    deleteProject,
  };
}
