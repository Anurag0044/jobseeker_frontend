"use client";

import { FirebaseError } from "firebase/app";
import {
  addDoc,
  arrayRemove,
  collection,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  orderBy,
  type Timestamp,
} from "firebase/firestore";
import { useCallback, useEffect, useMemo, useState } from "react";
import { db } from "../lib/firebase";
import { useUser } from "./useUser";

export interface ChatUser {
  uid: string;
  displayName: string;
  username: string;
  email: string;
  photoURL: string;
  title: string;
  company?: string;
  role?: string;
}

export interface ChatSummary {
  id: string;
  participantIds: string[];
  participantProfiles?: Record<string, ChatUser>;
  lastMessageText?: string;
  lastMessageSenderId?: string;
  unreadBy?: string[];
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  text: string;
  createdAt?: Timestamp;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("") || "FX";
}

function getFirebaseMessage(error: unknown) {
  if (error instanceof FirebaseError && error.code === "permission-denied") {
    return "Firestore rejected the realtime chat request. Deploy rules for users, chats, and chat messages.";
  }

  return error instanceof Error ? error.message : "Unable to sync realtime chat.";
}

function timestampMs(value?: Timestamp) {
  return value?.toMillis?.() || 0;
}

function makeChatId(uidA: string, uidB: string) {
  return [uidA, uidB].sort().join("__");
}

function normalizeUser(uid: string, data: Partial<ChatUser>): ChatUser {
  const displayName = data.displayName || data.email?.split("@")[0] || "Forge User";

  return {
    uid,
    displayName,
    username: data.username || displayName.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, ""),
    email: data.email || "",
    photoURL: data.photoURL || "",
    title: data.title || "Forge member",
    company: data.company || "",
    role: data.role || "",
  };
}

export function useRealtimeChat() {
  const { user, loading: authLoading } = useUser();
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [chats, setChats] = useState<ChatSummary[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    if (!user || !db) {
      queueMicrotask(() => {
        setUsers([]);
        setChats([]);
        setMessages([]);
        setSelectedUserId("");
        setLoading(false);
      });
      return;
    }

    const unsubscribe = onSnapshot(
      collection(db, "users"),
      (snapshot) => {
        const nextUsers = snapshot.docs
          .map((userDoc) => normalizeUser(userDoc.id, userDoc.data() as Partial<ChatUser>))
          .filter((profile) => profile.uid !== user.uid);

        setUsers(nextUsers);
        setLoading(false);
        setError("");
      },
      (snapshotError) => {
        setError(getFirebaseMessage(snapshotError));
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [authLoading, user]);

  useEffect(() => {
    if (authLoading) return;

    if (!user || !db) {
      queueMicrotask(() => setChats([]));
      return;
    }

    const chatsQuery = query(
      collection(db, "chats"),
      where("participantIds", "array-contains", user.uid)
    );

    return onSnapshot(
      chatsQuery,
      (snapshot) => {
        const nextChats = snapshot.docs
          .map((chatDoc) => ({ id: chatDoc.id, ...chatDoc.data() }) as ChatSummary)
          .sort((a, b) => timestampMs(b.updatedAt) - timestampMs(a.updatedAt));

        setChats(nextChats);
        setError("");
      },
      (snapshotError) => setError(getFirebaseMessage(snapshotError))
    );
  }, [authLoading, user]);

  const conversations = useMemo(() => {
    const chatByOtherUser = new Map<string, ChatSummary>();

    chats.forEach((chat) => {
      const otherUserId = chat.participantIds.find((participantId) => participantId !== user?.uid);
      if (otherUserId) {
        chatByOtherUser.set(otherUserId, chat);
      }
    });

    return users
      .map((profile) => ({
        profile,
        chat: chatByOtherUser.get(profile.uid),
      }))
      .sort((a, b) => timestampMs(b.chat?.updatedAt) - timestampMs(a.chat?.updatedAt))
      .map((conversation) => ({
        ...conversation,
        initials: getInitials(conversation.profile.displayName),
        unread: !!user && !!conversation.chat?.unreadBy?.includes(user.uid),
      }));
  }, [chats, users, user]);

  const selectedUser = useMemo(() => {
    return conversations.find((conversation) => conversation.profile.uid === selectedUserId)?.profile || null;
  }, [conversations, selectedUserId]);

  const selectedChatId = user && selectedUserId ? makeChatId(user.uid, selectedUserId) : "";

  useEffect(() => {
    if (!selectedUserId && conversations.length) {
      queueMicrotask(() => setSelectedUserId(conversations[0].profile.uid));
    }
  }, [conversations, selectedUserId]);

  useEffect(() => {
    if (!db || !selectedChatId) {
      queueMicrotask(() => setMessages([]));
      return;
    }

    const messagesQuery = query(
      collection(db, "chats", selectedChatId, "messages"),
      orderBy("createdAt", "asc")
    );

    return onSnapshot(
      messagesQuery,
      (snapshot) => {
        setMessages(
          snapshot.docs.map((messageDoc) => ({
            id: messageDoc.id,
            chatId: selectedChatId,
            ...messageDoc.data(),
          }) as ChatMessage)
        );
        setError("");
      },
      (snapshotError) => setError(getFirebaseMessage(snapshotError))
    );
  }, [selectedChatId]);

  useEffect(() => {
    if (!db || !user || !selectedChatId) return;

    const selectedChat = chats.find((chat) => chat.id === selectedChatId);
    if (!selectedChat?.unreadBy?.includes(user.uid)) return;

    updateDoc(doc(db, "chats", selectedChatId), {
      unreadBy: arrayRemove(user.uid),
    }).catch((updateError) => setError(getFirebaseMessage(updateError)));
  }, [chats, selectedChatId, user]);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || !user || !selectedUser || !db) return;

      const chatId = makeChatId(user.uid, selectedUser.uid);
      const currentUserProfile = normalizeUser(user.uid, {
        displayName: user.displayName || user.email?.split("@")[0] || "Forge User",
        email: user.email || "",
        photoURL: user.photoURL || "",
      });

      await setDoc(
        doc(db, "chats", chatId),
        {
          participantIds: [user.uid, selectedUser.uid],
          participantProfiles: {
            [user.uid]: currentUserProfile,
            [selectedUser.uid]: selectedUser,
          },
          lastMessageText: trimmed,
          lastMessageSenderId: user.uid,
          unreadBy: [selectedUser.uid],
          updatedAt: serverTimestamp(),
          createdAt: serverTimestamp(),
        },
        { merge: true }
      );

      await addDoc(collection(db, "chats", chatId, "messages"), {
        senderId: user.uid,
        text: trimmed,
        createdAt: serverTimestamp(),
      });
    },
    [selectedUser, user]
  );

  return {
    user,
    users,
    conversations,
    selectedUser,
    selectedUserId,
    setSelectedUserId,
    selectedChatId,
    messages,
    sendMessage,
    unreadCount: conversations.filter((conversation) => conversation.unread).length,
    loading: authLoading || loading,
    error,
  };
}
