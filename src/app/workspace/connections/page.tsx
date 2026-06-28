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
            <h1 className="text-[32px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 tracking-tight mb-1 drop-shadow-sm">
              Connections
            </h1>
            <p className="text-[14px] text-slate-400 font-medium">
              Connect with builders, developers, and professionals on Forge X.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-indigo-500/[0.08] border border-indigo-500/[0.15] rounded-xl text-[13px] text-indigo-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
              <Users size={15} className="text-indigo-400" />
              <span className="font-semibold">{connectedUsers.length} Connected</span>
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
        <motion.div variants={itemVariants} className="flex flex-col gap-6">
          {/* Search */}
          <div className="h-12 bg-white/[0.03] backdrop-blur-xl border border-white/[0.05] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] rounded-2xl flex items-center px-4 max-w-[420px] focus-within:border-indigo-500/30 focus-within:bg-white/[0.05] transition-all group">
            <Search size={16} className="text-slate-400 mr-3 group-focus-within:text-indigo-400 transition-colors" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, username, or role..."
              className="bg-transparent border-none outline-none flex-1 text-[14px] text-white placeholder-slate-500 font-medium"
            />
          </div>

          {/* Tabs */}
          <div className="flex p-1 bg-black/40 backdrop-blur-xl border border-white/[0.08] rounded-2xl w-fit overflow-x-auto no-scrollbar shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center justify-center gap-2 px-5 py-2.5 text-[13px] font-semibold rounded-xl transition-colors whitespace-nowrap z-10 ${
                  activeTab === tab.id
                    ? "text-white drop-shadow-md"
                    : "text-[#a1a1aa] hover:text-white"
                }`}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeConnectionsTab"
                    className="absolute inset-0 bg-white/[0.08] border border-white/[0.1] rounded-xl -z-10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_0_15px_rgba(255,255,255,0.05)]"
                    initial={false}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                {tab.label}
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                      activeTab === tab.id
                        ? "bg-indigo-500 text-white shadow-[0_0_8px_rgba(99,102,241,0.6)]"
                        : "bg-white/[0.05] text-slate-400 border border-white/[0.05]"
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
            <div className="flex flex-col items-center justify-center py-24 gap-4 w-full">
              <div className="w-16 h-16 rounded-full bg-white/[0.02] border border-white/[0.05] flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
                <Users size={24} className="text-slate-400 drop-shadow-md" />
              </div>
              <div className="flex flex-col items-center justify-center text-center max-w-[320px] mx-auto">
                <h3 className="text-[16px] font-semibold text-white mb-2 tracking-tight">
                  {activeTab === "Connected"
                    ? "No connections yet"
                    : activeTab === "Pending"
                    ? "No pending requests"
                    : "No users found"}
                </h3>
                <p className="text-[13px] text-slate-400 leading-relaxed">
                  {activeTab === "Connected"
                    ? "Connect with people on the Discover tab to start building your network."
                    : activeTab === "Pending"
                    ? "When you send or receive connection requests, they will appear here."
                    : "Profiles from Firestore will appear here once other users sign up."}
                </p>
              </div>
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
    <div className="flex flex-col gap-5 p-5 bg-white/[0.02] backdrop-blur-[40px] saturate-[150%] border border-white/[0.05] hover:border-white/[0.1] rounded-[24px] shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.5)] hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_12px_48px_rgba(0,0,0,0.6)] transition-all duration-300 group hover:-translate-y-1">
      {/* User info */}
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-full bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-[13px] font-bold text-indigo-300 shrink-0 overflow-hidden shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]">
          {user.photoURL ? (
            <img src={user.photoURL} alt={user.displayName} className="h-full w-full object-cover" />
          ) : (
            initials
          )}
        </div>
        <div className="flex flex-col min-w-0 flex-1">
          <span className="text-[15px] font-semibold text-white truncate group-hover:text-indigo-200 transition-colors tracking-tight">
            {user.displayName}
          </span>
          <span className="text-[12px] text-slate-400 truncate mt-0.5">@{user.username}</span>
          <span className="text-[12px] text-slate-500 truncate mt-1">{user.title}</span>
        </div>

        {/* Status indicator */}
        {status === "connected" && (
          <div className="shrink-0 mt-1">
            <CheckCircle2 size={16} className="text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
          </div>
        )}
        {status === "pending_sent" && (
          <div className="shrink-0 mt-1">
            <Clock size={16} className="text-slate-500" />
          </div>
        )}
        {status === "pending_received" && (
          <div className="shrink-0 mt-1">
            <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)] animate-pulse" />
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 mt-auto">
        {isLoading ? (
          <button
            disabled
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white/[0.02] border border-white/[0.05] rounded-xl text-[13px] font-medium text-slate-500"
          >
            <Loader2 size={14} className="animate-spin" />
            Loading…
          </button>
        ) : status === "none" ? (
          <button
            onClick={onConnect}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/30 hover:border-indigo-500/50 text-indigo-100 text-[13px] font-semibold rounded-xl transition-all shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_0_15px_rgba(99,102,241,0.2)] hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_0_20px_rgba(99,102,241,0.4)] active:scale-95"
          >
            <UserPlus size={14} /> Connect
          </button>
        ) : status === "pending_sent" ? (
          <button
            onClick={onWithdraw}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white/[0.03] border border-white/[0.05] hover:border-white/[0.1] hover:bg-white/[0.06] text-slate-400 hover:text-white text-[13px] font-medium rounded-xl transition-all active:scale-95"
          >
            <Clock size={14} /> Pending
          </button>
        ) : status === "pending_received" ? (
          <>
            <button
              onClick={onAccept}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 hover:border-emerald-500/50 text-emerald-100 text-[13px] font-semibold rounded-xl transition-all shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_0_15px_rgba(16,185,129,0.2)] active:scale-95"
            >
              <UserCheck size={14} /> Accept
            </button>
            <button
              onClick={onDecline}
              className="flex items-center justify-center gap-2 px-3.5 py-2.5 bg-white/[0.03] border border-white/[0.05] hover:border-red-500/30 hover:bg-red-500/10 text-slate-400 hover:text-red-400 text-[13px] font-medium rounded-xl transition-all active:scale-95"
            >
              <UserX size={14} />
            </button>
          </>
        ) : (
          <>
            <button
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-200 text-[13px] font-semibold rounded-xl cursor-default shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]"
            >
              <UserCheck size={14} /> Connected
            </button>
            <button
              onClick={onRemove}
              title="Remove connection"
              className="flex items-center justify-center px-3.5 py-2.5 bg-white/[0.03] border border-white/[0.05] hover:border-red-500/30 hover:bg-red-500/10 text-slate-400 hover:text-red-400 rounded-xl transition-all active:scale-95"
            >
              <UserX size={14} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
