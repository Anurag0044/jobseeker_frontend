"use client";

import { FirebaseError } from "firebase/app";
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  collectionGroup,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
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
  role: "owner" | "admin" | "member";
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
  // joinedIds is loaded from Firestore (user doc) so it persists across refreshes
  const [joinedIds, setJoinedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [membershipLoaded, setMembershipLoaded] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState("");

  // Subscribe to all communities (no orderBy — avoids composite index requirement)
  useEffect(() => {
    if (authLoading) return;
    if (!db) {
      setTimeout(() => { setCommunities([]); setLoading(false); }, 0);
      return;
    }

    const q = query(collection(db, "communities"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Community));
        // Sort newest-first client-side
        list.sort((a, b) => {
          const ta = (a.createdAt as { toMillis?: () => number })?.toMillis?.() ?? 0;
          const tb = (b.createdAt as { toMillis?: () => number })?.toMillis?.() ?? 0;
          return tb - ta;
        });
        setCommunities(list);
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

  // Persist membership: subscribe to user doc's `joinedCommunities` array
  useEffect(() => {
    if (authLoading || !user || !db) {
      setJoinedIds(new Set());
      setMembershipLoaded(!authLoading);
      return;
    }

    const userRef = doc(db, "users", user.uid);
    const unsub = onSnapshot(userRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data() as { joinedCommunities?: string[] };
        setJoinedIds(new Set(data.joinedCommunities || []));
      } else {
        setJoinedIds(new Set());
      }
      setMembershipLoaded(true);
    });
    return unsub;
  }, [authLoading, user]);

  /** Create a new community — creator becomes admin/owner */
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

        // Write creator as owner member
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

        // Persist membership in user doc
        await updateDoc(doc(db, "users", user.uid), {
          joinedCommunities: arrayUnion(communityRef.id),
        });

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

  /** Join a community — persisted to Firestore */
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
        await updateDoc(doc(db, "communities", communityId), {
          memberCount: increment(1),
          updatedAt: serverTimestamp(),
        });
        // Persist in user doc so membership survives page refreshes
        await updateDoc(doc(db, "users", user.uid), {
          joinedCommunities: arrayUnion(communityId),
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
        // Remove from user doc
        await updateDoc(doc(db, "users", user.uid), {
          joinedCommunities: arrayRemove(communityId),
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

  /**
   * Delete a community (admin/owner only).
   * Removes: members subcollection, messages subcollection, community doc, user membership records.
   */
  const deleteCommunity = useCallback(
    async (communityId: string) => {
      if (!user || !db) throw new Error("Not authenticated.");
      setActionLoading(communityId + "_delete");
      try {
        // Delete all messages
        const messagesSnap = await getDocs(
          collection(db, "communities", communityId, "messages")
        );
        await Promise.all(messagesSnap.docs.map((d) => deleteDoc(d.ref)));

        // Delete all members (and clean up their user docs)
        const membersSnap = await getDocs(
          collection(db, "communities", communityId, "members")
        );
        await Promise.all(
          membersSnap.docs.map(async (d) => {
            const memberId = d.id;
            await deleteDoc(d.ref);
            // Remove from member's user doc
            try {
              await updateDoc(doc(db, "users", memberId), {
                joinedCommunities: arrayRemove(communityId),
              });
            } catch {
              // Non-blocking — user doc may not exist
            }
          })
        );

        // Delete the community document itself
        await deleteDoc(doc(db, "communities", communityId));
        setError("");
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
        // Persist in invited user's doc
        await updateDoc(doc(db, "users", targetUid), {
          joinedCommunities: arrayUnion(communityId),
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
    membershipLoaded,
    loading: authLoading || loading,
    actionLoading,
    error,
    createCommunity,
    joinCommunity,
    leaveCommunity,
    deleteCommunity,
    inviteMember,
  };
}
