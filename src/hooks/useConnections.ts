"use client";

import { FirebaseError } from "firebase/app";
import {
  collection,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  deleteDoc,
  getDocs,
} from "firebase/firestore";
import { useCallback, useEffect, useMemo, useState } from "react";
import { db } from "../lib/firebase";
import { useUser } from "./useUser";

export type ConnectionStatus = "none" | "pending_sent" | "pending_received" | "connected";

export interface ConnectionRecord {
  id: string;
  fromUid: string;
  toUid: string;
  status: "pending" | "connected";
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface ConnectedUser {
  uid: string;
  displayName: string;
  username: string;
  email: string;
  photoURL: string;
  title: string;
}

function getFirebaseMessage(error: unknown) {
  if (error instanceof FirebaseError && error.code === "permission-denied") {
    return "Firestore rejected the connection request. Deploy rules for the connections collection.";
  }
  return error instanceof Error ? error.message : "Unable to manage connections.";
}

function normalizeUser(uid: string, data: Partial<ConnectedUser>): ConnectedUser {
  const displayName = data.displayName || data.email?.split("@")[0] || "Forge User";
  return {
    uid,
    displayName,
    username:
      data.username ||
      displayName.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, ""),
    email: data.email || "",
    photoURL: data.photoURL || "",
    title: data.title || "Forge member",
  };
}

export function useConnections() {
  const { user, loading: authLoading } = useUser();
  const [allUsers, setAllUsers] = useState<ConnectedUser[]>([]);
  const [connections, setConnections] = useState<ConnectionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState("");

  // Subscribe to all users
  useEffect(() => {
    if (authLoading) return;
    if (!user || !db) {
      setAllUsers([]);
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      collection(db, "users"),
      (snapshot) => {
        const users = snapshot.docs
          .map((d) => normalizeUser(d.id, d.data() as Partial<ConnectedUser>))
          .filter((u) => u.uid !== user.uid);
        setAllUsers(users);
        setLoading(false);
        setError("");
      },
      (err) => {
        setError(getFirebaseMessage(err));
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [authLoading, user]);

  // Subscribe to connections where current user is involved
  useEffect(() => {
    if (authLoading || !user || !db) {
      setConnections([]);
      return;
    }

    // Listen for connections initiated by current user
    const sentQuery = query(
      collection(db, "connections"),
      where("fromUid", "==", user.uid)
    );

    // Listen for connections received by current user
    const receivedQuery = query(
      collection(db, "connections"),
      where("toUid", "==", user.uid)
    );

    const sentMap = new Map<string, ConnectionRecord>();
    const receivedMap = new Map<string, ConnectionRecord>();

    function merge() {
      const combined = [...sentMap.values(), ...receivedMap.values()];
      setConnections(combined);
    }

    const unsubSent = onSnapshot(
      sentQuery,
      (snap) => {
        sentMap.clear();
        snap.docs.forEach((d) => {
          sentMap.set(d.id, { id: d.id, ...d.data() } as ConnectionRecord);
        });
        merge();
      },
      (err) => setError(getFirebaseMessage(err))
    );

    const unsubReceived = onSnapshot(
      receivedQuery,
      (snap) => {
        receivedMap.clear();
        snap.docs.forEach((d) => {
          receivedMap.set(d.id, { id: d.id, ...d.data() } as ConnectionRecord);
        });
        merge();
      },
      (err) => setError(getFirebaseMessage(err))
    );

    return () => {
      unsubSent();
      unsubReceived();
    };
  }, [authLoading, user]);

  // Derive connection status for any given target user
  const getConnectionStatus = useCallback(
    (targetUid: string): ConnectionStatus => {
      if (!user) return "none";

      const conn = connections.find(
        (c) =>
          (c.fromUid === user.uid && c.toUid === targetUid) ||
          (c.fromUid === targetUid && c.toUid === user.uid)
      );

      if (!conn) return "none";
      if (conn.status === "connected") return "connected";
      if (conn.fromUid === user.uid) return "pending_sent";
      return "pending_received";
    },
    [connections, user]
  );

  // Send a connection request
  const sendRequest = useCallback(
    async (targetUid: string) => {
      if (!user || !db) return;
      const connId = [user.uid, targetUid].sort().join("__");
      setActionLoading(targetUid);
      try {
        await setDoc(doc(db, "connections", connId), {
          fromUid: user.uid,
          toUid: targetUid,
          status: "pending",
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
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

  // Accept an incoming connection request
  const acceptRequest = useCallback(
    async (targetUid: string) => {
      if (!user || !db) return;
      const connId = [user.uid, targetUid].sort().join("__");
      setActionLoading(targetUid);
      try {
        await updateDoc(doc(db, "connections", connId), {
          status: "connected",
          updatedAt: serverTimestamp(),
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

  // Remove/withdraw a connection or request
  const removeConnection = useCallback(
    async (targetUid: string) => {
      if (!user || !db) return;
      const connId = [user.uid, targetUid].sort().join("__");
      setActionLoading(targetUid);
      try {
        await deleteDoc(doc(db, "connections", connId));
        setError("");
      } catch (err) {
        setError(getFirebaseMessage(err));
      } finally {
        setActionLoading(null);
      }
    },
    [user]
  );

  // List of fully connected users (for messaging, etc.)
  const connectedUsers = useMemo(() => {
    if (!user) return [];
    const connectedUids = new Set(
      connections
        .filter((c) => c.status === "connected")
        .flatMap((c) => [c.fromUid, c.toUid])
        .filter((uid) => uid !== user.uid)
    );
    return allUsers.filter((u) => connectedUids.has(u.uid));
  }, [allUsers, connections, user]);

  // Pending received requests (for notification badge)
  const pendingReceivedCount = useMemo(() => {
    if (!user) return 0;
    return connections.filter(
      (c) => c.toUid === user.uid && c.status === "pending"
    ).length;
  }, [connections, user]);

  return {
    user,
    allUsers,
    connections,
    connectedUsers,
    pendingReceivedCount,
    loading: authLoading || loading,
    actionLoading,
    error,
    getConnectionStatus,
    sendRequest,
    acceptRequest,
    removeConnection,
  };
}
