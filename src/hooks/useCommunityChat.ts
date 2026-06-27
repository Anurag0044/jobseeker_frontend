"use client";

import { FirebaseError } from "firebase/app";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  type Timestamp,
} from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { uploadImageToCloudinary } from "../lib/cloudinary";
import { useUser } from "./useUser";

export interface CommunityMessage {
  id: string;
  communityId: string;
  senderId: string;
  senderName: string;
  senderPhotoURL: string;
  text: string;
  imageUrl: string;
  createdAt?: Timestamp;
}

function getFirebaseMessage(error: unknown): string {
  if (error instanceof FirebaseError && error.code === "permission-denied") {
    return "Firestore rejected the message. Make sure community rules are deployed and you are a member.";
  }
  return error instanceof Error ? error.message : "Unable to sync community chat.";
}

export function useCommunityChat(communityId: string | null) {
  const { user, loading: authLoading } = useUser();
  const [messages, setMessages] = useState<CommunityMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!communityId || !db) {
      setTimeout(() => { setMessages([]); setLoading(false); }, 0);
      return;
    }

    const q = query(
      collection(db, "communities", communityId, "messages"),
      orderBy("createdAt", "asc")
    );

    const unsub = onSnapshot(
      q,
      (snap) => {
        setMessages(
          snap.docs.map((d) => ({
            id: d.id,
            communityId,
            ...d.data(),
          } as CommunityMessage))
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
  }, [communityId]);

  /** Send a text message */
  const sendMessage = useCallback(
    async (text: string) => {
      if (!communityId || !user || !db || !text.trim()) return;
      await addDoc(collection(db, "communities", communityId, "messages"), {
        senderId: user.uid,
        senderName: user.displayName || user.email?.split("@")[0] || "Forge User",
        senderPhotoURL: user.photoURL || "",
        text: text.trim(),
        imageUrl: "",
        createdAt: serverTimestamp(),
      });
    },
    [communityId, user]
  );

  /** Upload an image to Cloudinary and send it as a message */
  const sendImage = useCallback(
    async (imageFile: File) => {
      if (!communityId || !user || !db) return;
      try {
        const res = await uploadImageToCloudinary(imageFile, "forgex/community-chats");
        await addDoc(collection(db, "communities", communityId, "messages"), {
          senderId: user.uid,
          senderName: user.displayName || user.email?.split("@")[0] || "Forge User",
          senderPhotoURL: user.photoURL || "",
          text: "",
          imageUrl: res.secure_url,
          createdAt: serverTimestamp(),
        });
      } catch (err) {
        setError(getFirebaseMessage(err));
      }
    },
    [communityId, user]
  );

  return {
    user,
    messages,
    loading: authLoading || loading,
    error,
    sendMessage,
    sendImage,
  };
}
