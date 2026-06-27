"use client";

import React, { useState, useEffect } from "react";
import { motion, Variants } from "framer-motion";
import {
  GraduationCap, Briefcase, Code2, Users, UserCircle, Building2, Plus,
  Search, ChevronDown, Bookmark, MoreHorizontal, Calendar,
  LayoutTemplate, Activity, ArrowRight, Loader2, MessageCircle,
  LogOut, UserPlus
} from "lucide-react";
import ProfileContextStrip from "../../../components/profile/ProfileContextStrip";
import { useForgeProfile } from "../../../hooks/useForgeProfile";
import { useCommunity, type Community } from "../../../hooks/useCommunity";
import CreateCommunityModal from "../../../components/communities/CreateCommunityModal";
import CommunityChat from "../../../components/communities/CommunityChat";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.04, delayChildren: 0.05 } },
};

const itemVariants: Variants = {
  hidden: { y: 15, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring" as const, stiffness: 300, damping: 24 } },
};

export default function CommunitiesPage() {
  const [activeTab, setActiveTab] = useState("Chat");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedCommunityId, setSelectedCommunityId] = useState<string | null>(null);
  const [membershipMap, setMembershipMap] = useState<Record<string, boolean>>({});

  const { displayProfile } = useForgeProfile();
  const {
    user, communities, joinedIds, loading, actionLoading, error,
    checkMembership, joinCommunity, leaveCommunity,
  } = useCommunity();

  const techStack = displayProfile?.techStack?.length ? displayProfile.techStack : ["React", "TypeScript", "Next.js", "Tailwind CSS"];
  const firstSkill = displayProfile?.skills?.[0] || techStack[0] || "technology";

  // Check membership for selected community
  useEffect(() => {
    if (!selectedCommunityId || !user) return;
    if (membershipMap[selectedCommunityId] !== undefined) return;
    checkMembership(selectedCommunityId).then((isMember) => {
      setMembershipMap((prev) => ({ ...prev, [selectedCommunityId]: isMember }));
    });
  }, [selectedCommunityId, user, checkMembership, membershipMap]);

  // Also track joined communities from the hook
  useEffect(() => {
    if (!joinedIds.size) return;
    const updates: Record<string, boolean> = {};
    joinedIds.forEach((id) => { updates[id] = true; });
    setMembershipMap((prev) => ({ ...prev, ...updates }));
  }, [joinedIds]);

  const selectedCommunity = communities.find((c) => c.id === selectedCommunityId) || null;
  const isMember = selectedCommunityId ? (membershipMap[selectedCommunityId] || joinedIds.has(selectedCommunityId)) : false;

  const handleJoin = async (communityId: string) => {
    await joinCommunity(communityId);
    setMembershipMap((prev) => ({ ...prev, [communityId]: true }));
    setActiveTab("Chat");
  };

  const handleLeave = async (communityId: string) => {
    await leaveCommunity(communityId);
    setMembershipMap((prev) => ({ ...prev, [communityId]: false }));
  };

  const TABS = isMember ? ["Chat", "Overview", "Members"] : ["Overview"];

  return (
    <div className="px-8 pb-16 pt-8 overflow-x-hidden">
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="max-w-[1200px] mx-auto flex flex-col gap-8">
        {/* Header */}
        <motion.div variants={itemVariants} className="flex items-start justify-between">
          <div>
            <h1 className="text-[26px] font-semibold text-white tracking-tight mb-1">Communities</h1>
            <p className="text-[13px] text-[#a1a1aa]">Connect with professionals, students, recruiters, and builders around {firstSkill} and your career goals.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-[#121212] border border-[#262626] text-white text-[13px] font-medium rounded-lg hover:bg-[#1A1A1A] transition-colors">
              <Search size={16} /> Explore Communities
            </button>
            <button
              onClick={() => setIsCreateOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#5e5ce6] hover:bg-[#4d4ad5] text-white text-[13px] font-medium rounded-lg transition-colors"
            >
              <Plus size={16} /> Create Community
            </button>
          </div>
        </motion.div>

        <ProfileContextStrip label="Community Discovery Context" />

        {/* Categories Carousel */}
        <motion.div variants={itemVariants} className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
          <CategoryCard icon={<GraduationCap size={18} className="text-[#b19cd9]" />} title="Students" desc="Connect with students building skills, projects, and future careers." count="12.4K Members" />
          <CategoryCard icon={<Briefcase size={18} className="text-[#61dafb]" />} title="Employees" desc="Learn from professionals actively working across industries." count="25.8K Members" />
          <CategoryCard icon={<Code2 size={18} className="text-[#a3e635]" />} title="Senior Developers" desc="Explore advanced engineering discussions and practical experience." count="18.7K Members" />
          <CategoryCard icon={<Users size={18} className="text-[#22c55e]" />} title="Collaborators" desc="Find people to build meaningful projects together." count="10.3K Members" />
          <CategoryCard icon={<UserCircle size={18} className="text-[#f59e0b]" />} title="Recruiters" desc="Understand hiring expectations and connect with recruiters." count="6.2K Members" />
          <CategoryCard icon={<Building2 size={18} className="text-[#3b82f6]" />} title="Companies" desc="Explore organizations actively hiring and sharing opportunities." count="4.1K Members" />
          <div className="min-w-[240px] p-5 bg-gradient-to-b from-[#1e1a2e] to-[#0A0A0A] border border-[#2a2440] rounded-xl flex flex-col shrink-0">
            <div className="w-8 h-8 rounded-full bg-[#5e5ce6]/20 flex items-center justify-center border border-[#5e5ce6]/40 mb-3">
              <Plus size={16} className="text-[#c2c1ff]" />
            </div>
            <h3 className="text-[14px] font-semibold text-white mb-2">Create Your Own Community</h3>
            <p className="text-[11px] text-[#a1a1aa] mb-4 flex-1">Build a professional space around a niche skill, technology, industry, or mission.</p>
            <button onClick={() => setIsCreateOpen(true)} className="w-full py-1.5 bg-[#5e5ce6] hover:bg-[#4d4ad5] text-white text-[12px] font-medium rounded-md transition-colors">
              Create Community
            </button>
          </div>
        </motion.div>

        {/* Discover Communities Section */}
        <motion.div variants={itemVariants} className="flex flex-col gap-6">
          <div>
            <h2 className="text-[18px] font-semibold text-white mb-1">Discover Communities</h2>
            <p className="text-[13px] text-[#a1a1aa]">Find communities that match your interests and goals.</p>
          </div>

          {/* Filters Bar */}
          <div className="flex items-center gap-3 overflow-x-auto pb-2 custom-scrollbar">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#121212] border border-[#262626] rounded-md min-w-[200px]">
              <Search size={14} className="text-[#71717a]" />
              <input type="text" placeholder="Search communities..." className="bg-transparent border-none outline-none text-[12px] text-white w-full" />
            </div>
            {["Technology", "Industry", "Role", "Skill Level", "Community Size", "Most Active"].map(filter => (
              <button key={filter} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#121212] border border-[#262626] text-[#a1a1aa] hover:text-white text-[12px] rounded-md whitespace-nowrap transition-colors">
                {filter} <ChevronDown size={14} />
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            {/* LEFT: Community List */}
            <div className="xl:col-span-7 flex flex-col gap-4">
              {/* Firestore communities */}
              {loading ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 size={20} className="text-[#71717a] animate-spin" />
                </div>
              ) : communities.length > 0 ? (
                communities.map((c) => (
                  <FirestoreCommunityListItem
                    key={c.id}
                    community={c}
                    active={selectedCommunityId === c.id}
                    isMember={membershipMap[c.id] || joinedIds.has(c.id)}
                    actionLoading={actionLoading === c.id}
                    onSelect={() => { setSelectedCommunityId(c.id); setActiveTab(membershipMap[c.id] || joinedIds.has(c.id) ? "Chat" : "Overview"); }}
                    onJoin={() => handleJoin(c.id)}
                    onLeave={() => handleLeave(c.id)}
                  />
                ))
              ) : null}

              {/* Static fallback items (always visible for discovery) */}
              {error && <p className="text-[12px] text-red-300 px-2">{error}</p>}
            </div>

            {/* RIGHT: Detail Panel */}
            <div className="xl:col-span-5 relative">
              <div className="sticky top-[88px] flex flex-col h-[calc(100vh-120px)] bg-[#0A0A0A] border border-[#1e1e1e] rounded-xl overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-[200px] bg-gradient-to-b from-[#1e1a2e]/30 to-transparent pointer-events-none" />
                <div className="absolute top-10 right-0 w-[300px] h-[100px] bg-gradient-to-r from-transparent via-[#5e5ce6]/10 to-transparent blur-3xl pointer-events-none" />

                {selectedCommunity ? (
                  <div className="flex flex-col h-full relative z-10">
                    {/* Banner */}
                    {selectedCommunity.bannerUrl && (
                      <div className="h-24 w-full overflow-hidden shrink-0">
                        <img src={selectedCommunity.bannerUrl} alt="Banner" className="w-full h-full object-cover opacity-60" />
                      </div>
                    )}
                    {/* Community header */}
                    <div className="p-5 pb-3 shrink-0">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-12 h-12 rounded-xl bg-[#121212] border border-[#262626] flex items-center justify-center shrink-0">
                          <Users size={22} className="text-[#b19cd9]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h2 className="text-[18px] font-semibold text-white truncate">{selectedCommunity.name}</h2>
                          <div className="flex items-center gap-2 text-[11px]">
                            <span className="text-[#a1a1aa]">{selectedCommunity.memberCount ?? 0} Members</span>
                            <span className="text-[#71717a]">•</span>
                            <span className="text-[#22c55e]">{selectedCommunity.category}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-[12px] text-[#a1a1aa] leading-relaxed mb-4">{selectedCommunity.description}</p>
                      <div className="flex items-center gap-2 mb-4">
                        {isMember ? (
                          <button
                            onClick={() => handleLeave(selectedCommunity.id)}
                            disabled={actionLoading === selectedCommunity.id}
                            className="flex-1 py-2 bg-[#121212] border border-[#262626] hover:border-red-500/40 hover:text-red-400 text-white text-[12px] font-medium rounded-lg transition-all flex items-center justify-center gap-1.5"
                          >
                            {actionLoading === selectedCommunity.id ? <Loader2 size={13} className="animate-spin" /> : <LogOut size={13} />} Leave
                          </button>
                        ) : (
                          <button
                            onClick={() => handleJoin(selectedCommunity.id)}
                            disabled={actionLoading === selectedCommunity.id}
                            className="flex-1 py-2 bg-[#5e5ce6] hover:bg-[#4d4ad5] text-white text-[12px] font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5"
                          >
                            {actionLoading === selectedCommunity.id ? <Loader2 size={13} className="animate-spin" /> : <UserPlus size={13} />} Join Community
                          </button>
                        )}
                        <button className="w-9 h-9 flex items-center justify-center bg-[#121212] border border-[#262626] hover:bg-[#1A1A1A] text-white rounded-lg transition-colors shrink-0">
                          <MoreHorizontal size={14} />
                        </button>
                      </div>

                      {/* Tabs */}
                      <div className="flex gap-4 border-b border-[#1e1e1e] overflow-x-auto custom-scrollbar">
                        {TABS.map(tab => (
                          <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-3 text-[11px] font-medium transition-colors relative whitespace-nowrap flex items-center gap-1.5 ${activeTab === tab ? "text-[#b19cd9]" : "text-[#a1a1aa] hover:text-white"}`}
                          >
                            {tab === "Chat" && <MessageCircle size={11} />}
                            {tab}
                            {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#b19cd9] rounded-t-full" />}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Tab content */}
                    <div className="flex-1 min-h-0 overflow-hidden">
                      {activeTab === "Chat" && isMember && (
                        <CommunityChat communityId={selectedCommunity.id} />
                      )}
                      {activeTab === "Overview" && (
                        <div className="p-5 overflow-y-auto h-full custom-scrollbar flex flex-col gap-4">
                          <div className="bg-[#121212] border border-[#1e1e1e] rounded-xl p-4">
                            <h3 className="text-[12px] font-semibold text-white mb-2">About This Community</h3>
                            <p className="text-[11px] text-[#a1a1aa] leading-relaxed">{selectedCommunity.description}</p>
                          </div>
                          <div className="bg-[#121212] border border-[#1e1e1e] rounded-xl p-4">
                            <h3 className="text-[12px] font-semibold text-white mb-2">Community Info</h3>
                            <ul className="flex flex-col gap-1.5 text-[11px] text-[#a1a1aa]">
                              <li className="flex items-center gap-1.5"><span className="w-1 h-1 bg-[#71717a] rounded-full" />{selectedCommunity.memberCount ?? 0} members</li>
                              <li className="flex items-center gap-1.5"><span className="w-1 h-1 bg-[#71717a] rounded-full" />Category: {selectedCommunity.category}</li>
                              <li className="flex items-center gap-1.5"><span className="w-1 h-1 bg-[#71717a] rounded-full" />Privacy: {selectedCommunity.privacy}</li>
                            </ul>
                          </div>
                          {!isMember && (
                            <button
                              onClick={() => handleJoin(selectedCommunity.id)}
                              disabled={actionLoading === selectedCommunity.id}
                              className="w-full py-2.5 bg-[#5e5ce6] hover:bg-[#4d4ad5] text-white text-[13px] font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                              {actionLoading === selectedCommunity.id ? <Loader2 size={14} className="animate-spin" /> : <UserPlus size={14} />}
                              Join to access chat
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  /* Default static preview when nothing is selected */
                  <div className="flex-1 overflow-y-auto custom-scrollbar p-6 relative z-10 flex flex-col items-center justify-center text-center">
                    <Users size={40} className="text-[#71717a] mb-4" />
                    <h3 className="text-[16px] font-semibold text-white mb-2">Select a Community</h3>
                    <p className="text-[12px] text-[#a1a1aa]">Click any community on the left to view details and join the chat.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <CreateCommunityModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
    </div>
  );
}

/* ─── Helpers ────────────────────────────────────────────── */

function CategoryCard({ icon, title, desc, count }: { icon: React.ReactNode; title: string; desc: string; count: string }) {
  return (
    <div className="min-w-[240px] p-5 bg-[#121212] border border-[#1e1e1e] hover:border-[#3f3f46] transition-colors rounded-xl flex flex-col shrink-0 cursor-pointer">
      <div className="w-8 h-8 rounded-full bg-[#1A1A1A] flex items-center justify-center border border-[#262626] mb-3">{icon}</div>
      <h3 className="text-[14px] font-semibold text-white mb-2">{title}</h3>
      <p className="text-[11px] text-[#a1a1aa] mb-4 flex-1 leading-relaxed">{desc}</p>
      <span className="text-[11px] text-[#71717a]">{count}</span>
    </div>
  );
}

interface FirestoreCommunityListItemProps {
  community: Community;
  active: boolean;
  isMember: boolean;
  actionLoading: boolean;
  onSelect: () => void;
  onJoin: () => void;
  onLeave: () => void;
}

function FirestoreCommunityListItem({ community, active, isMember, actionLoading, onSelect, onJoin, onLeave }: FirestoreCommunityListItemProps) {
  return (
    <div
      onClick={onSelect}
      className={`flex flex-col md:flex-row md:items-start gap-4 p-5 rounded-xl transition-all border cursor-pointer ${active ? "bg-[#1e1a2e]/30 border-[#2a2440]" : "bg-[#121212] border-[#1e1e1e] hover:border-[#3f3f46]"}`}
    >
      <div className="flex-1 flex gap-4 min-w-0">
        <div className="w-12 h-12 rounded-xl bg-[#0A0A0A] border border-[#262626] flex items-center justify-center shrink-0 overflow-hidden">
          {community.bannerUrl ? (
            <img src={community.bannerUrl} alt={community.name} className="w-full h-full object-cover" />
          ) : (
            <Users size={22} className="text-[#b19cd9]" />
          )}
        </div>
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-[15px] font-semibold text-white">{community.name}</h3>
            {isMember && <span className="px-1.5 py-0.5 bg-[#22c55e]/10 text-[#22c55e] text-[9px] font-bold rounded border border-[#22c55e]/20">MEMBER</span>}
          </div>
          <p className="text-[12px] text-[#a1a1aa] mb-2 line-clamp-1">{community.description}</p>
          <div className="flex items-center gap-2 text-[11px]">
            <span className="px-2 py-0.5 bg-[#1A1A1A] border border-[#262626] text-[#71717a] text-[10px] rounded">{community.category}</span>
            <span className="text-[#71717a]">{community.memberCount ?? 0} Members</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
        {isMember ? (
          <button onClick={onLeave} disabled={actionLoading} className="flex items-center gap-1 py-1.5 px-3 bg-[#121212] border border-[#262626] hover:border-red-500/30 hover:text-red-400 text-white text-[11px] font-medium rounded-md transition-all">
            {actionLoading ? <Loader2 size={11} className="animate-spin" /> : <LogOut size={11} />} Leave
          </button>
        ) : (
          <button onClick={onJoin} disabled={actionLoading} className="flex items-center gap-1 py-1.5 px-3 bg-[#5e5ce6] hover:bg-[#4d4ad5] text-white text-[11px] font-medium rounded-md transition-colors">
            {actionLoading ? <Loader2 size={11} className="animate-spin" /> : <UserPlus size={11} />} Join
          </button>
        )}
        <button className="w-8 h-8 flex items-center justify-center bg-[#121212] border border-[#262626] hover:bg-[#1A1A1A] text-[#a1a1aa] hover:text-white rounded-md transition-colors">
          <Bookmark size={12} />
        </button>
      </div>
    </div>
  );
}
