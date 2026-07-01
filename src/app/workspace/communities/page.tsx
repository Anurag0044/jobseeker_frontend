"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Users, UserPlus, LogOut, Trash2, MoreHorizontal,
  MessageCircle, Info, User, Loader2, X, Globe, Lock,
  ChevronRight, Hash, Settings, Search, Edit3
} from "lucide-react";
import { useCommunity, type Community } from "../../../hooks/useCommunity";
import CreateCommunityModal from "../../../components/communities/CreateCommunityModal";
import CommunityChat from "../../../components/communities/CommunityChat";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
};

const itemVariants = {
  hidden: { y: 15, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring" as const, stiffness: 350, damping: 26 } },
};

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
  const [searchQuery, setSearchQuery] = useState("");

  const selected = communities.find((c) => c.id === selectedId) ?? null;
  const isMember = selectedId ? joinedIds.has(selectedId) : false;
  const isOwner = selected ? selected.ownerUid === user?.uid : false;

  // Auto-select first joined community on load
  useEffect(() => {
    if (!membershipLoaded || selectedId) return;
    const first = communities.find((c) => joinedIds.has(c.id));
    if (first) setSelectedId(first.id);
  }, [membershipLoaded, communities, joinedIds, selectedId]);

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

  const filteredCommunities = communities.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const joinedCommunities = filteredCommunities.filter((c) => joinedIds.has(c.id));
  const discoverCommunities = filteredCommunities.filter((c) => !joinedIds.has(c.id));

  const glassPanelClass = "bg-[#0A0A0A]/40 backdrop-blur-[40px] rounded-[24px] lg:rounded-[32px] border border-white/[0.05] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden relative flex flex-col h-full";

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex-1 w-full min-h-0 p-4 flex flex-col md:flex-row gap-4 overflow-hidden"
    >
      {/* ── Left Sidebar (Communities list) ── */}
      <motion.div 
        variants={itemVariants} 
        className={`${glassPanelClass} w-full md:w-[280px] lg:w-[320px] shrink-0 ${selectedId ? "hidden md:flex" : "flex"}`}
      >
        {/* Header */}
        <div className="p-6 pb-4 flex items-center justify-between relative z-10">
          <h2 className="text-[20px] font-semibold text-white tracking-tight drop-shadow-sm">Communities</h2>
          <button
            onClick={() => setIsCreateOpen(true)}
            title="Create Community"
            className="w-9 h-9 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] flex items-center justify-center text-slate-350 hover:text-white transition-all active:scale-95 shadow-sm"
          >
            <Plus size={16} />
          </button>
        </div>

        {/* Search */}
        <div className="px-6 pb-4 relative z-10">
          <div className="h-10 bg-[#0F172A]/50 border border-white/[0.05] hover:border-blue-500/30 focus-within:border-blue-500/50 focus-within:bg-[#0F172A]/80 focus-within:shadow-[0_0_15px_rgba(59,130,246,0.15)] rounded-xl flex items-center px-3.5 transition-all">
            <Search size={15} className="text-slate-400 mr-2.5 shrink-0" />
            <input
              type="text"
              placeholder="Search communities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none w-full text-[13px] text-white placeholder-slate-500"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="text-slate-400 hover:text-white transition-colors">
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Scrollable list */}
        <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] relative z-10 px-3 pb-3">
          {joinedCommunities.length > 0 && (
            <div className="mb-4">
              <p className="px-3 py-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Your Communities</p>
              <div className="flex flex-col gap-1">
                {joinedCommunities.map((c) => (
                  <SidebarItem
                    key={c.id}
                    community={c}
                    active={selectedId === c.id}
                    onClick={() => handleSelect(c.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {joinedCommunities.length > 0 && discoverCommunities.length > 0 && (
            <div className="my-2 border-t border-white/[0.04] mx-3" />
          )}

          {discoverCommunities.length > 0 && (
            <div>
              <p className="px-3 py-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Discover</p>
              <div className="flex flex-col gap-1">
                {discoverCommunities.map((c) => (
                  <SidebarItem
                    key={c.id}
                    community={c}
                    active={selectedId === c.id}
                    onClick={() => handleSelect(c.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {loading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 size={18} className="text-slate-500 animate-spin" />
            </div>
          )}

          {!loading && filteredCommunities.length === 0 && (
            <div className="px-4 py-12 flex flex-col items-center text-center gap-4">
              <div className="w-14 h-14 rounded-full bg-white/[0.03] border border-white/[0.05] flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
                <Hash size={24} className="text-blue-450/60" />
              </div>
              <div>
                <p className="text-[14px] font-semibold text-white mb-1">No Communities Found</p>
                <p className="text-[12px] text-slate-400 px-4">
                  {searchQuery ? "Try searching for a different keyword." : "Create your own community to start connecting."}
                </p>
              </div>
              {!searchQuery && (
                <button
                  onClick={() => setIsCreateOpen(true)}
                  className="mt-2 text-[12px] font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Create first community
                </button>
              )}
            </div>
          )}

          {error && <p className="px-3 py-2 text-[11px] text-red-400">{error}</p>}
        </div>
      </motion.div>

      {/* ── Main Panel (Chat / Overview) ── */}
      <motion.div 
        variants={itemVariants} 
        className={`${glassPanelClass} flex-1 ${!selectedId ? "hidden md:flex" : "flex"}`}
      >
        {selected ? (
          <>
            {/* Panel Header */}
            <div className="h-16 shrink-0 flex items-center justify-between px-6 border-b border-white/[0.05] relative z-10">
              <div className="flex items-center gap-3 min-w-0">
                <button 
                  onClick={() => setSelectedId(null)} 
                  className="md:hidden flex items-center justify-center w-8 h-8 rounded-full bg-white/[0.03] border border-white/[0.05] text-slate-300 hover:text-white shrink-0 active:scale-95"
                >
                  <ChevronRight size={16} className="rotate-180" />
                </button>
                <div className="w-9 h-9 rounded-xl bg-[#121212] border border-white/[0.08] overflow-hidden shrink-0 flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
                  {selected.bannerUrl ? (
                    <img src={selected.bannerUrl} alt={selected.name} className="w-full h-full object-cover" />
                  ) : (
                    <Users size={16} className="text-blue-400" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-[14.5px] font-bold text-white tracking-tight truncate leading-snug">{selected.name}</p>
                  <p className="text-[10px] text-slate-400 leading-normal">{selected.memberCount ?? 0} members · {selected.category}</p>
                </div>
              </div>

              {/* Header Tab Switcher (Glass Pill) */}
              {isMember && (
                <div className="hidden sm:flex items-center bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-full p-1 h-11 shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)]">
                  {(["chat", "overview", "members"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`relative flex items-center justify-center gap-1.5 px-4 h-9 rounded-full text-[11px] font-semibold tracking-wide transition-colors duration-300 z-10 capitalize ${
                        activeTab === tab ? "text-white" : "text-white/40 hover:text-white/60"
                      }`}
                    >
                      {activeTab === tab && (
                        <motion.div
                          layoutId="comm-tab-active"
                          className="absolute inset-0 backdrop-blur-xl border border-white/10 rounded-full shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_2px_8px_rgba(0,0,0,0.1)] bg-white/[0.08] -z-10"
                          transition={{ type: "spring", stiffness: 420, damping: 27 }}
                        />
                      )}
                      {tab === "chat" && <MessageCircle size={12} />}
                      {tab === "overview" && <Info size={12} />}
                      {tab === "members" && <User size={12} />}
                      <span>{tab}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-2.5 shrink-0">
                {isMember ? (
                  <>
                    {isOwner && (
                      <button
                        onClick={() => setConfirmDeleteId(selected.id)}
                        className="hidden sm:flex items-center gap-1.5 px-4 py-2 text-[12px] font-medium text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl transition-all active:scale-95"
                      >
                        <Trash2 size={12} /> Delete
                      </button>
                    )}
                    <button
                      onClick={() => handleLeave(selected.id)}
                      disabled={actionLoading === selected.id}
                      className="flex items-center gap-1.5 px-4 py-2 text-[12px] font-medium text-slate-300 hover:text-white bg-[#121212] border border-[#262626] rounded-xl transition-all active:scale-95"
                    >
                      {actionLoading === selected.id ? <Loader2 size={12} className="animate-spin" /> : <LogOut size={12} />}
                      Leave
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleJoin(selected.id)}
                    disabled={actionLoading === selected.id}
                    className="flex items-center gap-1.5 px-4 py-2 text-[12px] font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 rounded-xl shadow-[0_4px_15px_rgba(59,130,246,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    {actionLoading === selected.id ? <Loader2 size={12} className="animate-spin" /> : <UserPlus size={12} />}
                    Join Community
                  </button>
                )}
              </div>
            </div>

            {/* Tab Switched Content */}
            <div className="flex-1 overflow-hidden min-h-0 relative z-0 flex flex-col">
              {activeTab === "chat" && isMember && (
                <div className="flex-1 flex flex-col overflow-hidden bg-transparent">
                  <CommunityChat communityId={selected.id} />
                </div>
              )}

              {activeTab === "overview" || !isMember ? (
                <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] p-6">
                  {/* Banner Cover */}
                  <div className="h-44 w-full rounded-[24px] overflow-hidden relative mb-6 shadow-md border border-white/[0.04]">
                    {selected.bannerUrl ? (
                      <img src={selected.bannerUrl} alt="banner" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-600/20 via-purple-600/10 to-transparent" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent pointer-events-none" />
                  </div>

                  <div className="max-w-2xl mx-auto flex flex-col gap-6">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-[20px] bg-[#121212] border border-white/[0.08] flex items-center justify-center shrink-0 overflow-hidden shadow-inner">
                        {selected.bannerUrl ? (
                          <img src={selected.bannerUrl} alt={selected.name} className="w-full h-full object-cover" />
                        ) : (
                          <Users size={28} className="text-blue-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h2 className="text-[22px] font-bold text-white mb-1.5 tracking-tight">{selected.name}</h2>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[12.5px] text-slate-400">
                          <span className="font-semibold text-white/90">{selected.memberCount ?? 0} members</span>
                          <span className="text-white/10">•</span>
                          <span>{selected.category}</span>
                          <span className="text-white/10">•</span>
                          <span className="flex items-center gap-1">
                            {selected.privacy === "public" ? <Globe size={13} className="text-blue-400" /> : <Lock size={13} className="text-amber-400" />}
                            <span className="capitalize">{selected.privacy}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Glass Box */}
                    <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 backdrop-blur-md shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
                      <h3 className="text-[13.5px] font-bold text-white mb-2.5 tracking-wide">About</h3>
                      <p className="text-[13px] text-slate-300 leading-relaxed font-medium">{selected.description}</p>
                    </div>

                    {!isMember && (
                      <button
                        onClick={() => handleJoin(selected.id)}
                        disabled={actionLoading === selected.id}
                        className="w-full py-3.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white text-[13.5px] font-bold rounded-xl transition-all shadow-[0_4px_20px_rgba(59,130,246,0.3)] hover:scale-[1.01] active:scale-[0.98] flex items-center justify-center gap-2"
                      >
                        {actionLoading === selected.id ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={16} />}
                        Join Community to Chat
                      </button>
                    )}
                  </div>
                </div>
              ) : null}

              {activeTab === "members" && isMember && (
                <div className="flex-1 overflow-hidden">
                  <MembersPanel communityId={selected.id} />
                </div>
              )}
            </div>
          </>
        ) : (
          /* Empty state */
          <div className="m-auto flex flex-col items-center justify-center max-w-[384px] text-center px-6">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-blue-500/20 blur-[30px] rounded-full" />
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500/10 to-blue-500/10 border border-white/[0.1] flex items-center justify-center backdrop-blur-md relative z-10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]">
                <Users size={32} className="text-blue-300" />
              </div>
            </div>
            <h3 className="text-[20px] font-bold text-white mb-2 tracking-tight drop-shadow-md">Welcome to Communities</h3>
            <p className="text-[13.5px] text-slate-450 leading-relaxed mb-8">
              Join existing communities or create your own to start chatting with like-minded developers.
            </p>
            <button
              onClick={() => setIsCreateOpen(true)}
              className="flex items-center gap-2.5 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white text-[13.5px] font-bold rounded-xl transition-all shadow-[0_4px_15px_rgba(59,130,246,0.3)] hover:scale-105 active:scale-95"
            >
              <Plus size={16} /> Create a Community
            </button>
          </div>
        )}
      </motion.div>

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
              className="bg-[#0a0a0a]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-7 max-w-[400px] w-full mx-4 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[16px] font-bold text-white">Delete Community?</h3>
                <button onClick={() => setConfirmDeleteId(null)} className="text-slate-400 hover:text-white transition-colors">
                  <X size={18} />
                </button>
              </div>
              <p className="text-[13px] text-slate-300 leading-relaxed mb-3">
                This will permanently delete{" "}
                <strong className="text-white">{communities.find((c) => c.id === confirmDeleteId)?.name}</strong>,
                including all chat messages and members. This cannot be undone.
              </p>
              <p className="text-[11px] text-amber-400/90 font-medium mb-6">⚠ Only the community owner can perform this action.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmDeleteId(null)}
                  className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-[13px] font-medium hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(confirmDeleteId)}
                  disabled={deleting}
                  className="flex-1 py-3 rounded-xl bg-red-650 text-white text-[13px] font-bold hover:bg-red-700 transition-all flex items-center justify-center gap-2"
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
    </motion.div>
  );
}

/* ─── Sidebar Item ─── */
function SidebarItem({
  community, active, onClick,
}: { community: Community; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl transition-all text-left group relative ${
        active 
          ? "bg-white/[0.04] text-white border border-white/[0.06] shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.15)]" 
          : "text-slate-400 hover:bg-white/[0.02] hover:text-white border border-transparent"
      }`}
    >
      <div className="w-8 h-8 rounded-lg bg-[#121212] border border-white/[0.06] shrink-0 overflow-hidden flex items-center justify-center shadow-inner">
        {community.bannerUrl ? (
          <img src={community.bannerUrl} alt={community.name} className="w-full h-full object-cover" />
        ) : (
          <Hash size={14} className="text-slate-500" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[12.5px] font-bold truncate tracking-tight">{community.name}</p>
        <p className="text-[10px] text-slate-500">{community.memberCount ?? 0} members</p>
      </div>
      {active ? (
        <ChevronRight size={13} className="text-blue-400 shrink-0" />
      ) : (
        <ChevronRight size={13} className="text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
      )}
    </button>
  );
}

/* ─── Members Panel ─── */
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
      <Loader2 size={18} className="text-slate-500 animate-spin" />
    </div>
  );

  return (
    <div className="p-6 overflow-y-auto h-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      <h3 className="text-[13.5px] font-bold text-white mb-4 tracking-wide">Members — {members.length}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {members.map((m) => (
          <div key={m.uid} className="flex items-center gap-3 p-3.5 bg-white/[0.01] border border-white/[0.04] rounded-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)]">
            <div className="w-9 h-9 rounded-full bg-[#1A1A1A] border border-white/[0.06] overflow-hidden shrink-0 flex items-center justify-center text-[12px] font-bold text-blue-300 shadow-inner">
              {m.photoURL ? <img src={m.photoURL} alt={m.displayName} className="w-full h-full object-cover" /> : m.displayName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-bold text-white truncate tracking-tight">{m.displayName}</p>
            </div>
            {(m.role === "owner" || m.role === "admin") && (
              <span className="px-2 py-0.5 bg-blue-500/10 text-blue-300 text-[9px] font-bold uppercase rounded-md border border-blue-500/20 tracking-wider">
                {m.role}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
