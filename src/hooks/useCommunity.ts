"use client";

import { FirebaseError } from "firebase/app";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  deleteDoc,
  increment,
  where,
} from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { uploadImageToCloudinary } from "../lib/cloudinary";
import { useUser } from "./useUser";

export interface Community {
  id: string;
  name: string;
  description: string;
  bannerUrl: string;
  category: string;
  privacy: "public" | "private";
  ownerUid: string;
  memberCount: number;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface CommunityMember {
  uid: string;
  displayName: string;
  photoURL: string;
  role: "owner" | "member";
  joinedAt?: unknown;
}

export interface CreateCommunityInput {
  name: string;
  description: string;
  category: string;
  privacy: "public" | "private";
  bannerFile?: File;
}

function getFirebaseMessage(error: unknown): string {
  if (error instanceof FirebaseError && error.code === "permission-denied") {
    return "Firestore rejected the request. Make sure community rules are deployed.";
  }
  return error instanceof Error ? error.message : "Unable to manage communities.";
}

export function useCommunity() {
  const { user, loading: authLoading } = useUser();

  const [communities, setCommunities] = useState<Community[]>([]);
  const [joinedIds, setJoinedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState("");

  // Subscribe to all public communities
  useEffect(() => {
    if (authLoading) return;
    if (!db) {
      setTimeout(() => { setCommunities([]); setLoading(false); }, 0);
      return;
    }

    const q = query(collection(db, "communities"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        setCommunities(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Community)));
        setLoading(false);
        setError("");
      },
      (err) => {
        setError(getFirebaseMessage(err));
        setLoading(false);
      }
    );
    return unsub;
  }, [authLoading]);

  // Track which communities the current user has joined
  useEffect(() => {
    if (authLoading || !user || !db) {
      setJoinedIds(new Set());
      return;
    }

    // We can't do a collection-group query without an index, so we poll joined
    // communities by checking /communities/{id}/members/{uid} existence.
    // Instead, use a simpler approach: store a `joinedCommunities` array on the user doc,
    // or just check membership per community. Here we keep a snapshot per community
    // the user might belong to by listening to all communities and checking member docs.
    // For scalability: subscribe to communities the user is part of via a denormalized field.
    // We use a simple "memberOf" subcollection query pattern:
    // We query all communities where the members sub-doc for this uid exists.
    // Since Firestore doesn't support sub-collection existence queries directly,
    // we maintain a `members` array in the community doc for query purposes.
    // However, to avoid complexity, we track membership by storing community IDs
    // on the user profile. Instead, let's keep it simple: after fetching communities,
    // we check membership for each one the user interacts with.
    // For the UI we maintain a local Set that is updated when join/leave actions occur.
    setJoinedIds(new Set());
  }, [authLoading, user]);

  // Check if user is member of a specific community
  const checkMembership = useCallback(
    async (communityId: string): Promise<boolean> => {
      if (!user || !db) return false;
      try {
        const snap = await getDocs(
          query(
            collection(db, "communities", communityId, "members"),
            where("uid", "==", user.uid)
          )
        );
        return !snap.empty;
      } catch {
        return false;
      }
    },
    [user]
  );

  /** Create a new community */
  const createCommunity = useCallback(
    async (input: CreateCommunityInput) => {
      if (!user || !db) throw new Error("Not authenticated.");
      setActionLoading("creating");
      try {
        let bannerUrl = "";
        if (input.bannerFile) {
          const res = await uploadImageToCloudinary(input.bannerFile, "forgex/communities");
          bannerUrl = res.secure_url;
        }

        const communityRef = await addDoc(collection(db, "communities"), {
          name: input.name,
          description: input.description,
          bannerUrl,
          category: input.category,
          privacy: input.privacy,
          ownerUid: user.uid,
          memberCount: 1,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        // Add creator as owner member
        await setDoc(
          doc(db, "communities", communityRef.id, "members", user.uid),
          {
            uid: user.uid,
            displayName: user.displayName || user.email?.split("@")[0] || "Forge User",
            photoURL: user.photoURL || "",
            role: "owner",
            joinedAt: serverTimestamp(),
          }
        );

        setJoinedIds((prev) => new Set([...prev, communityRef.id]));
        setError("");
        return communityRef.id;
      } catch (err) {
        const msg = getFirebaseMessage(err);
        setError(msg);
        throw new Error(msg);
      } finally {
        setActionLoading(null);
      }
    },
    [user]
  );

  /** Join a community */
  const joinCommunity = useCallback(
    async (communityId: string) => {
      if (!user || !db) throw new Error("Not authenticated.");
      setActionLoading(communityId);
      try {
        await setDoc(
          doc(db, "communities", communityId, "members", user.uid),
          {
            uid: user.uid,
            displayName: user.displayName || user.email?.split("@")[0] || "Forge User",
            photoURL: user.photoURL || "",
            role: "member",
            joinedAt: serverTimestamp(),
          }
        );
        // Increment member count
        await updateDoc(doc(db, "communities", communityId), {
          memberCount: increment(1),
          updatedAt: serverTimestamp(),
        });
        setJoinedIds((prev) => new Set([...prev, communityId]));
        setError("");
      } catch (err) {
        setError(getFirebaseMessage(err));
      } finally {
        setActionLoading(null);
      }
    },
    [user]
  );

  /** Leave a community */
  const leaveCommunity = useCallback(
    async (communityId: string) => {
      if (!user || !db) throw new Error("Not authenticated.");
      setActionLoading(communityId);
      try {
        await deleteDoc(doc(db, "communities", communityId, "members", user.uid));
        await updateDoc(doc(db, "communities", communityId), {
          memberCount: increment(-1),
          updatedAt: serverTimestamp(),
        });
        setJoinedIds((prev) => {
          const next = new Set(prev);
          next.delete(communityId);
          return next;
        });
        setError("");
      } catch (err) {
        setError(getFirebaseMessage(err));
      } finally {
        setActionLoading(null);
      }
    },
    [user]
  );

  /** Invite / add a member by uid */
  const inviteMember = useCallback(
    async (
      communityId: string,
      targetUid: string,
      targetProfile: { displayName: string; photoURL: string }
    ) => {
      if (!user || !db) throw new Error("Not authenticated.");
      try {
        await setDoc(
          doc(db, "communities", communityId, "members", targetUid),
          {
            uid: targetUid,
            displayName: targetProfile.displayName,
            photoURL: targetProfile.photoURL || "",
            role: "member",
            joinedAt: serverTimestamp(),
          }
        );
        await updateDoc(doc(db, "communities", communityId), {
          memberCount: increment(1),
          updatedAt: serverTimestamp(),
        });
        setError("");
      } catch (err) {
        setError(getFirebaseMessage(err));
      }
    },
    [user]
  );

  return {
    user,
    communities,
    joinedIds,
    loading: authLoading || loading,
    actionLoading,
    error,
    checkMembership,
    createCommunity,
    joinCommunity,
    leaveCommunity,
    inviteMember,
  };
}
