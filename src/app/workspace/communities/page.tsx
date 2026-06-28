"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Users, UserPlus, LogOut, Trash2, MoreHorizontal,
  MessageCircle, Info, User, Loader2, X, Globe, Lock,
  ChevronRight, Hash, Settings
} from "lucide-react";
import { useCommunity, type Community } from "../../../hooks/useCommunity";
import CreateCommunityModal from "../../../components/communities/CreateCommunityModal";
import CommunityChat from "../../../components/communities/CommunityChat";

export default function CommunitiesPage() {
  const {
    user, communities, joinedIds, membershipLoaded, loading,
    actionLoading, error,
    joinCommunity, leaveCommunity, deleteCommunity,
  } = useCommunity();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"chat" | "overview" | "members">("chat");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const selected = communities.find((c) => c.id === selectedId) ?? null;
  const isMember = selectedId ? joinedIds.has(selectedId) : false;
  const isOwner = selected ? selected.ownerUid === user?.uid : false;

  // Auto-select first joined community on load
  useEffect(() => {
    if (!membershipLoaded || selectedId) return;
    const first = communities.find((c) => joinedIds.has(c.id));
    if (first) setSelectedId(first.id);
  }, [membershipLoaded, communities, joinedIds, selectedId]);

  // When selecting a community, set default tab
  const handleSelect = (id: string) => {
    setSelectedId(id);
    setActiveTab(joinedIds.has(id) ? "chat" : "overview");
  };

  const handleJoin = async (id: string) => {
    await joinCommunity(id);
    setSelectedId(id);
    setActiveTab("chat");
  };

  const handleLeave = async (id: string) => {
    await leaveCommunity(id);
    setActiveTab("overview");
  };

  const handleDelete = async (id: string) => {
    setDeleting(true);
    try {
      await deleteCommunity(id);
      if (selectedId === id) setSelectedId(null);
    } finally {
      setDeleting(false);
      setConfirmDeleteId(null);
    }
  };

  const joinedCommunities = communities.filter((c) => joinedIds.has(c.id));
  const discoverCommunities = communities.filter((c) => !joinedIds.has(c.id));

  return (
    <div className="flex flex-col md:flex-row h-full overflow-hidden w-full">
      {/* ── Left Sidebar ─────────────────────────────── */}
      <div className={`w-full md:w-64 shrink-0 flex-col border-r border-[#1e1e1e] bg-[#080808] overflow-y-auto custom-scrollbar h-full ${selectedId ? "hidden md:flex" : "flex"}`}>
        {/* Header */}
        <div className="p-4 border-b border-[#1e1e1e] flex items-center justify-between">
          <span className="text-[13px] font-semibold text-white">Communities</span>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="w-7 h-7 rounded-full bg-[#5e5ce6] hover:bg-[#4d4ad5] flex items-center justify-center text-white transition-colors"
            title="Create Community"
          >
            <Plus size={14} />
          </button>
        </div>

        {/* Joined */}
        {joinedCommunities.length > 0 && (
          <div className="py-2">
            <p className="px-4 py-1 text-[10px] font-bold text-[#71717a] uppercase tracking-widest">Your Communities</p>
            {joinedCommunities.map((c) => (
              <SidebarItem
                key={c.id}
                community={c}
                active={selectedId === c.id}
                onClick={() => handleSelect(c.id)}
              />
            ))}
          </div>
        )}

        {/* Divider */}
        {joinedCommunities.length > 0 && discoverCommunities.length > 0 && (
          <div className="mx-4 border-t border-[#1e1e1e]" />
        )}

        {/* Discover */}
        {discoverCommunities.length > 0 && (
          <div className="py-2">
            <p className="px-4 py-1 text-[10px] font-bold text-[#71717a] uppercase tracking-widest">Discover</p>
            {discoverCommunities.map((c) => (
              <SidebarItem
                key={c.id}
                community={c}
                active={selectedId === c.id}
                onClick={() => handleSelect(c.id)}
              />
            ))}
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 size={18} className="text-[#71717a] animate-spin" />
          </div>
        )}

        {!loading && communities.length === 0 && (
          <div className="px-4 py-6 flex flex-col items-center text-center gap-2">
            <Hash size={24} className="text-[#3f3f46]" />
            <p className="text-[12px] text-[#71717a]">No communities yet.</p>
            <button
              onClick={() => setIsCreateOpen(true)}
              className="text-[11px] text-[#5e5ce6] hover:text-[#c2c1ff] transition-colors"
            >
              Create the first one
            </button>
          </div>
        )}

        {error && <p className="px-4 py-2 text-[11px] text-red-300">{error}</p>}
      </div>

      {/* ── Main Panel ───────────────────────────────── */}
      {selected ? (
        <div className={`flex-1 flex-col overflow-hidden min-w-0 h-full ${!selectedId ? "hidden md:flex" : "flex"}`}>
          {/* Channel header */}
          <div className="h-14 shrink-0 flex items-center justify-between px-5 border-b border-[#1e1e1e] bg-[#0A0A0A]">
            <div className="flex items-center gap-3 min-w-0">
              <button onClick={() => setSelectedId(null)} className="md:hidden flex items-center justify-center w-8 h-8 rounded-full bg-white/[0.05] text-slate-300 hover:text-white shrink-0">
                <ChevronRight size={16} className="rotate-180" />
              </button>
              <div className="w-8 h-8 rounded-lg bg-[#1A1A1A] border border-[#262626] overflow-hidden shrink-0 flex items-center justify-center">
                {selected.bannerUrl ? (
                  <img src={selected.bannerUrl} alt={selected.name} className="w-full h-full object-cover" />
                ) : (
                  <Users size={14} className="text-[#b19cd9]" />
                )}
              </div>
              <div className="min-w-0">
                <p className="text-[14px] font-semibold text-white truncate">{selected.name}</p>
                <p className="text-[10px] text-[#71717a]">{selected.memberCount ?? 0} members · {selected.category}</p>
              </div>
            </div>

            {/* Tab pills */}
            <div className="hidden sm:flex items-center gap-1 bg-[#121212] border border-[#1e1e1e] rounded-lg p-1">
              {(isMember ? ["chat", "overview", "members"] : ["overview"]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as "chat" | "overview" | "members")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-medium transition-all capitalize ${
                    activeTab === tab
                      ? "bg-[#1e1a2e] text-[#b19cd9]"
                      : "text-[#71717a] hover:text-white"
                  }`}
                >
                  {tab === "chat" && <MessageCircle size={11} />}
                  {tab === "overview" && <Info size={11} />}
                  {tab === "members" && <User size={11} />}
                  {tab}
                </button>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              {isMember ? (
                <>
                  {isOwner && (
                    <button
                      onClick={() => setConfirmDeleteId(selected.id)}
                      className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-[11px] text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg transition-all"
                    >
                      <Trash2 size={11} /> Delete
                    </button>
                  )}
                  <button
                    onClick={() => handleLeave(selected.id)}
                    disabled={actionLoading === selected.id}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] text-[#a1a1aa] hover:text-white bg-[#121212] border border-[#1e1e1e] hover:border-[#3f3f46] rounded-lg transition-all"
                  >
                    {actionLoading === selected.id ? <Loader2 size={11} className="animate-spin" /> : <LogOut size={11} />}
                    Leave
                  </button>
                </>
              ) : (
                <button
                  onClick={() => handleJoin(selected.id)}
                  disabled={actionLoading === selected.id}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium text-white bg-[#5e5ce6] hover:bg-[#4d4ad5] rounded-lg transition-colors"
                >
                  {actionLoading === selected.id ? <Loader2 size={11} className="animate-spin" /> : <UserPlus size={11} />}
                  Join
                </button>
              )}
            </div>
          </div>

          {/* Content area */}
          <div className="flex-1 overflow-hidden min-h-0">
            {activeTab === "chat" && isMember && (
              <CommunityChat communityId={selected.id} />
            )}

            {activeTab === "overview" && (
              <div className="h-full overflow-y-auto custom-scrollbar">
                {/* Banner */}
                {selected.bannerUrl && (
                  <div className="h-48 w-full overflow-hidden relative">
                    <img src={selected.bannerUrl} alt="banner" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent" />
                  </div>
                )}
                <div className="p-6 flex flex-col gap-5 max-w-2xl">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-[#121212] border border-[#1e1e1e] flex items-center justify-center shrink-0 overflow-hidden">
                      {selected.bannerUrl ? (
                        <img src={selected.bannerUrl} alt={selected.name} className="w-full h-full object-cover" />
                      ) : (
                        <Users size={28} className="text-[#b19cd9]" />
                      )}
                    </div>
                    <div>
                      <h2 className="text-[22px] font-bold text-white mb-1">{selected.name}</h2>
                      <div className="flex items-center gap-3 text-[12px] text-[#a1a1aa]">
                        <span>{selected.memberCount ?? 0} members</span>
                        <span className="text-[#3f3f46]">·</span>
                        <span>{selected.category}</span>
                        <span className="text-[#3f3f46]">·</span>
                        <span className="flex items-center gap-1">
                          {selected.privacy === "public" ? <Globe size={11} /> : <Lock size={11} />}
                          {selected.privacy}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#121212] border border-[#1e1e1e] rounded-xl p-5">
                    <h3 className="text-[13px] font-semibold text-white mb-2">About</h3>
                    <p className="text-[13px] text-[#a1a1aa] leading-relaxed">{selected.description}</p>
                  </div>

                  {!isMember && (
                    <button
                      onClick={() => handleJoin(selected.id)}
                      disabled={actionLoading === selected.id}
                      className="flex items-center justify-center gap-2 py-3 bg-[#5e5ce6] hover:bg-[#4d4ad5] text-white text-[14px] font-semibold rounded-xl transition-colors"
                    >
                      {actionLoading === selected.id ? <Loader2 size={15} className="animate-spin" /> : <UserPlus size={15} />}
                      Join Community to Chat
                    </button>
                  )}
                </div>
              </div>
            )}

            {activeTab === "members" && isMember && (
              <MembersPanel communityId={selected.id} />
            )}
          </div>
        </div>
      ) : (
        /* Empty state */
        <div className={`flex-1 flex-col items-center justify-center text-center px-8 bg-[#0A0A0A] ${!selectedId ? "hidden md:flex" : "flex"}`}>
          <div className="w-20 h-20 rounded-2xl bg-[#121212] border border-[#1e1e1e] flex items-center justify-center mb-4">
            <Hash size={36} className="text-[#3f3f46]" />
          </div>
          <h2 className="text-[20px] font-semibold text-white mb-2">Welcome to Communities</h2>
          <p className="text-[13px] text-[#71717a] max-w-xs mb-6">
            Join existing communities or create your own to start chatting with like-minded developers.
          </p>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#5e5ce6] hover:bg-[#4d4ad5] text-white text-[13px] font-semibold rounded-xl transition-colors"
          >
            <Plus size={16} /> Create a Community
          </button>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AnimatePresence>
        {confirmDeleteId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm"
            onClick={() => setConfirmDeleteId(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 max-w-[384px] w-full mx-4 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[16px] font-semibold text-white">Delete Community?</h3>
                <button onClick={() => setConfirmDeleteId(null)} className="text-[#71717a] hover:text-white">
                  <X size={18} />
                </button>
              </div>
              <p className="text-[13px] text-[#a1a1aa] mb-2">
                This will permanently delete{" "}
                <strong className="text-white">{communities.find((c) => c.id === confirmDeleteId)?.name}</strong>,
                including all chat messages and members. This cannot be undone.
              </p>
              <p className="text-[11px] text-red-400 mb-6">⚠ Only the community admin can perform this action.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmDeleteId(null)}
                  className="flex-1 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-[13px] font-medium hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(confirmDeleteId)}
                  disabled={deleting}
                  className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-[13px] font-bold hover:bg-red-700 transition-all flex items-center justify-center gap-2"
                >
                  {deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                  {deleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <CreateCommunityModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
    </div>
  );
}

/* ─── Sidebar Item ─────────────────────────────────────── */
function SidebarItem({
  community, active, onClick,
}: { community: Community; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-2.5 transition-all text-left ${
        active ? "bg-[#1e1a2e] text-white" : "text-[#a1a1aa] hover:bg-[#121212] hover:text-white"
      }`}
    >
      <div className="w-8 h-8 rounded-lg bg-[#1A1A1A] border border-[#262626] shrink-0 overflow-hidden flex items-center justify-center">
        {community.bannerUrl ? (
          <img src={community.bannerUrl} alt={community.name} className="w-full h-full object-cover" />
        ) : (
          <Hash size={14} className="text-[#71717a]" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[12px] font-medium truncate">{community.name}</p>
        <p className="text-[10px] text-[#71717a]">{community.memberCount ?? 0} members</p>
      </div>
      {active && <ChevronRight size={12} className="text-[#b19cd9] shrink-0" />}
    </button>
  );
}

/* ─── Members Panel ────────────────────────────────────── */
function MembersPanel({ communityId }: { communityId: string }) {
  const [members, setMembers] = useState<{ uid: string; displayName: string; photoURL: string; role: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    import("firebase/firestore").then(({ collection, getDocs }) => {
      import("../../../lib/firebase").then(({ db }) => {
        if (!db) return;
        getDocs(collection(db, "communities", communityId, "members")).then((snap) => {
          setMembers(snap.docs.map((d) => d.data() as { uid: string; displayName: string; photoURL: string; role: string }));
          setLoading(false);
        });
      });
    });
  }, [communityId]);

  if (loading) return (
    <div className="flex items-center justify-center h-32">
      <Loader2 size={18} className="text-[#71717a] animate-spin" />
    </div>
  );

  return (
    <div className="p-5 overflow-y-auto h-full custom-scrollbar">
      <h3 className="text-[13px] font-semibold text-white mb-4">Members — {members.length}</h3>
      <div className="flex flex-col gap-2">
        {members.map((m) => (
          <div key={m.uid} className="flex items-center gap-3 p-3 bg-[#121212] border border-[#1e1e1e] rounded-xl">
            <div className="w-9 h-9 rounded-full bg-[#1A1A1A] border border-[#262626] overflow-hidden shrink-0 flex items-center justify-center text-[11px] font-bold text-[#b19cd9]">
              {m.photoURL ? <img src={m.photoURL} alt={m.displayName} className="w-full h-full object-cover" /> : m.displayName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium text-white truncate">{m.displayName}</p>
            </div>
            {(m.role === "owner" || m.role === "admin") && (
              <span className="px-2 py-0.5 bg-[#b19cd9]/20 text-[#b19cd9] text-[9px] font-bold uppercase rounded border border-[#b19cd9]/30">
                {m.role}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
