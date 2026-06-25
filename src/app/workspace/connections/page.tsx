"use client";

import React, { useMemo, useState } from "react";
import { motion, Variants } from "framer-motion";
import {
  Search,
  UserCheck,
  UserPlus,
  UserX,
  Clock,
  Users,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useConnections, type ConnectedUser } from "../../../hooks/useConnections";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.04, delayChildren: 0.05 },
  },
};

const itemVariants: Variants = {
  hidden: { y: 12, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring" as const, stiffness: 300, damping: 24 },
  },
};

type Tab = "Discover" | "Connected" | "Pending";

export default function ConnectionsPage() {
  const {
    allUsers,
    connectedUsers,
    connections,
    pendingReceivedCount,
    loading,
    actionLoading,
    error,
    getConnectionStatus,
    sendRequest,
    acceptRequest,
    removeConnection,
    user,
  } = useConnections();

  const [activeTab, setActiveTab] = useState<Tab>("Discover");
  const [searchQuery, setSearchQuery] = useState("");

  const pendingReceived = useMemo(() => {
    if (!user) return [] as ConnectedUser[];
    const pendingUids = new Set(
      connections
        .filter((c) => c.toUid === user.uid && c.status === "pending")
        .map((c) => c.fromUid)
    );
    return allUsers.filter((u) => pendingUids.has(u.uid));
  }, [allUsers, connections, user]);

  const pendingSent = useMemo(() => {
    if (!user) return [] as ConnectedUser[];
    const pendingUids = new Set(
      connections
        .filter((c) => c.fromUid === user.uid && c.status === "pending")
        .map((c) => c.toUid)
    );
    return allUsers.filter((u) => pendingUids.has(u.uid));
  }, [allUsers, connections, user]);

  const filterUsers = (users: ConnectedUser[]) =>
    users.filter((u) => {
      const query = searchQuery.toLowerCase();
      return (
        u.displayName.toLowerCase().includes(query) ||
        u.username.toLowerCase().includes(query) ||
        u.title.toLowerCase().includes(query)
      );
    });

  const displayUsers =
    activeTab === "Discover"
      ? filterUsers(allUsers)
      : activeTab === "Connected"
      ? filterUsers(connectedUsers)
      : filterUsers([...pendingReceived, ...pendingSent]);

  const tabs: { id: Tab; label: string; badge?: number }[] = [
    { id: "Discover", label: "Discover" },
    { id: "Connected", label: "Connected", badge: connectedUsers.length },
    {
      id: "Pending",
      label: "Pending",
      badge: pendingReceivedCount > 0 ? pendingReceivedCount : undefined,
    },
  ];

  return (
    <div className="px-8 pb-16 pt-8 overflow-x-hidden h-full overflow-y-auto custom-scrollbar">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-[1100px] mx-auto flex flex-col gap-8"
      >
        {/* ── Header ─────────────────────────────────────────── */}
        <motion.div variants={itemVariants} className="flex items-start justify-between">
          <div>
            <h1 className="text-[26px] font-semibold text-white tracking-tight mb-1">
              Connections
            </h1>
            <p className="text-[13px] text-[#a1a1aa]">
              Connect with builders, developers, and professionals on Forge X.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-[#1e1a2e] border border-[#2a2440] rounded-lg text-[13px] text-[#b19cd9]">
              <Users size={15} />
              <span className="font-medium">{connectedUsers.length} Connected</span>
            </div>
          </div>
        </motion.div>

        {/* ── Error Banner ───────────────────────────────────── */}
        {error && (
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-3 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-[13px] text-red-200"
          >
            <AlertCircle size={16} className="shrink-0" />
            {error}
          </motion.div>
        )}

        {/* ── Search + Tabs ───────────────────────────────────── */}
        <motion.div variants={itemVariants} className="flex flex-col gap-4">
          {/* Search */}
          <div className="h-10 bg-[#121212] border border-[#1e1e1e] rounded-xl flex items-center px-4 max-w-[420px]">
            <Search size={15} className="text-[#71717a] mr-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, username, or role..."
              className="bg-transparent border-none outline-none flex-1 text-[13px] text-white placeholder-[#71717a]"
            />
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 p-1 bg-[#121212] border border-[#1e1e1e] rounded-xl w-fit">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-[13px] font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-[#1e1a2e] text-[#b19cd9] border border-[#2a2440]"
                    : "text-[#71717a] hover:text-[#e5e2e1]"
                }`}
              >
                {tab.label}
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                      activeTab === tab.id
                        ? "bg-[#5e5ce6] text-white"
                        : "bg-[#262626] text-[#a1a1aa]"
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </motion.div>

        {/* ── Pending Received section (show at top of Pending tab) ── */}
        {activeTab === "Pending" && pendingReceived.length > 0 && (
          <motion.div variants={itemVariants} className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#5e5ce6]" />
              <span className="text-[12px] font-semibold text-[#b19cd9] uppercase tracking-wider">
                Requests for you
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {pendingReceived
                .filter((u) => {
                  const q = searchQuery.toLowerCase();
                  return (
                    u.displayName.toLowerCase().includes(q) ||
                    u.username.toLowerCase().includes(q) ||
                    u.title.toLowerCase().includes(q)
                  );
                })
                .map((u) => (
                  <UserCard
                    key={u.uid}
                    user={u}
                    status="pending_received"
                    isLoading={actionLoading === u.uid}
                    onAccept={() => acceptRequest(u.uid)}
                    onDecline={() => removeConnection(u.uid)}
                  />
                ))}
            </div>
            {pendingSent.length > 0 && (
              <div className="flex items-center gap-2 mt-2">
                <div className="w-2 h-2 rounded-full bg-[#71717a]" />
                <span className="text-[12px] font-semibold text-[#71717a] uppercase tracking-wider">
                  Sent by you
                </span>
              </div>
            )}
          </motion.div>
        )}

        {/* ── Main Grid ───────────────────────────────────────── */}
        <motion.div variants={itemVariants}>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <Loader2 size={24} className="text-[#b19cd9] animate-spin" />
              <p className="text-[13px] text-[#71717a]">Loading users from Firestore…</p>
            </div>
          ) : displayUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <div className="w-12 h-12 rounded-full bg-[#121212] border border-[#1e1e1e] flex items-center justify-center">
                <Users size={20} className="text-[#71717a]" />
              </div>
              <p className="text-[14px] font-medium text-white">
                {activeTab === "Connected"
                  ? "No connections yet"
                  : activeTab === "Pending"
                  ? "No pending requests"
                  : "No users found"}
              </p>
              <p className="text-[12px] text-[#71717a] text-center max-w-xs">
                {activeTab === "Connected"
                  ? "Connect with people on the Discover tab to start building your network."
                  : activeTab === "Pending"
                  ? "When you send or receive connection requests, they will appear here."
                  : "Profiles from Firestore will appear here once other users sign up."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {displayUsers.map((u) => {
                const status = getConnectionStatus(u.uid);
                return (
                  <UserCard
                    key={u.uid}
                    user={u}
                    status={status}
                    isLoading={actionLoading === u.uid}
                    onConnect={() => sendRequest(u.uid)}
                    onAccept={() => acceptRequest(u.uid)}
                    onDecline={() => removeConnection(u.uid)}
                    onRemove={() => removeConnection(u.uid)}
                    onWithdraw={() => removeConnection(u.uid)}
                  />
                );
              })}
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}

/* ─── UserCard ─────────────────────────────────────────────── */

interface UserCardProps {
  user: ConnectedUser;
  status: "none" | "pending_sent" | "pending_received" | "connected";
  isLoading: boolean;
  onConnect?: () => void;
  onAccept?: () => void;
  onDecline?: () => void;
  onRemove?: () => void;
  onWithdraw?: () => void;
}

function UserCard({
  user,
  status,
  isLoading,
  onConnect,
  onAccept,
  onDecline,
  onRemove,
  onWithdraw,
}: UserCardProps) {
  const initials = user.displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p.charAt(0).toUpperCase())
    .join("") || "FX";

  return (
    <div className="flex flex-col gap-4 p-5 bg-[#0d0d0d] border border-[#1e1e1e] hover:border-[#2a2440] rounded-2xl transition-all group">
      {/* User info */}
      <div className="flex items-start gap-3">
        <div className="w-11 h-11 rounded-full bg-[#1A1A1A] border border-[#262626] flex items-center justify-center text-[12px] font-semibold text-[#b19cd9] shrink-0 overflow-hidden">
          {user.photoURL ? (
            <img src={user.photoURL} alt={user.displayName} className="h-full w-full object-cover" />
          ) : (
            initials
          )}
        </div>
        <div className="flex flex-col min-w-0 flex-1">
          <span className="text-[14px] font-semibold text-white truncate group-hover:text-[#c2c1ff] transition-colors">
            {user.displayName}
          </span>
          <span className="text-[11px] text-[#71717a] truncate">@{user.username}</span>
          <span className="text-[11px] text-[#a1a1aa] truncate mt-0.5">{user.title}</span>
        </div>

        {/* Status indicator */}
        {status === "connected" && (
          <div className="shrink-0 mt-0.5">
            <CheckCircle2 size={16} className="text-[#22c55e]" />
          </div>
        )}
        {status === "pending_sent" && (
          <div className="shrink-0 mt-0.5">
            <Clock size={16} className="text-[#71717a]" />
          </div>
        )}
        {status === "pending_received" && (
          <div className="shrink-0 mt-0.5">
            <div className="w-2 h-2 rounded-full bg-[#5e5ce6] animate-pulse" />
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex gap-2">
        {isLoading ? (
          <button
            disabled
            className="flex-1 flex items-center justify-center gap-2 py-2 bg-[#121212] border border-[#1e1e1e] rounded-lg text-[12px] text-[#71717a]"
          >
            <Loader2 size={13} className="animate-spin" />
            Loading…
          </button>
        ) : status === "none" ? (
          <button
            onClick={onConnect}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-[#5e5ce6] hover:bg-[#4d4ad5] text-white text-[12px] font-medium rounded-lg transition-colors shadow-lg shadow-[#5e5ce6]/10"
          >
            <UserPlus size={13} /> Connect
          </button>
        ) : status === "pending_sent" ? (
          <button
            onClick={onWithdraw}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-[#121212] border border-[#262626] hover:border-[#3f3f46] text-[#a1a1aa] hover:text-white text-[12px] font-medium rounded-lg transition-colors"
          >
            <Clock size={13} /> Pending
          </button>
        ) : status === "pending_received" ? (
          <>
            <button
              onClick={onAccept}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-[#5e5ce6] hover:bg-[#4d4ad5] text-white text-[12px] font-medium rounded-lg transition-colors"
            >
              <UserCheck size={13} /> Accept
            </button>
            <button
              onClick={onDecline}
              className="flex items-center justify-center gap-1.5 px-3 py-2 bg-[#121212] border border-[#262626] hover:border-red-500/40 text-[#71717a] hover:text-red-400 text-[12px] font-medium rounded-lg transition-colors"
            >
              <UserX size={13} />
            </button>
          </>
        ) : (
          <>
            <button
              className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-[#1e1a2e] border border-[#2a2440] text-[#b19cd9] text-[12px] font-medium rounded-lg cursor-default"
            >
              <UserCheck size={13} /> Connected
            </button>
            <button
              onClick={onRemove}
              title="Remove connection"
              className="flex items-center justify-center px-3 py-2 bg-[#121212] border border-[#262626] hover:border-red-500/40 text-[#71717a] hover:text-red-400 rounded-lg transition-colors"
            >
              <UserX size={13} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
