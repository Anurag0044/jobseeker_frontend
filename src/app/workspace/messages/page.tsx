"use client";

import React, { useMemo, useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, Variants, AnimatePresence } from "framer-motion";
import {
  Search, Send, Paperclip, Calendar, Link as LinkIcon,
  MoreHorizontal, FileText, Users, FolderGit2,
  Star, ChevronRight, Sparkles, Pin, Edit, UserPlus, ArrowUp
} from "lucide-react";
import { useRealtimeChat, type ChatMessage } from "../../../hooks/useRealtimeChat";
import { useConnections } from "../../../hooks/useConnections";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0, scale: 0.98 },
  visible: { y: 0, opacity: 1, scale: 1, transition: { type: "spring" as const, stiffness: 400, damping: 30 } },
};

const messageVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 10 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 500, damping: 30 } },
};

function formatTime(message?: ChatMessage) {
  const date = message?.createdAt?.toDate?.();
  if (!date) return "";
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function formatRelative(ms: number) {
  if (!ms) return "";
  const diff = Date.now() - ms;
  const minutes = Math.max(1, Math.floor(diff / 60000));
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}

export default function MessagesPage() {
  const {
    user,
    conversations,
    selectedUser,
    selectedUserId,
    setSelectedUserId,
    messages,
    sendMessage,
    unreadCount,
    loading,
    error,
  } = useRealtimeChat();
  const { connectedUsers, loading: connectionsLoading } = useConnections();
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [draft, setDraft] = useState("");
  const [isSending, setIsSending] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom without causing page layout shifts
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [messages]);

  // Only show conversations with connected users
  const connectedUidSet = useMemo(
    () => new Set(connectedUsers.map((u) => u.uid)),
    [connectedUsers]
  );

  const filteredConversations = useMemo(() => {
    return conversations
      .filter((conversation) => connectedUidSet.has(conversation.profile.uid))
      .filter((conversation) => {
        const searchable = [
          conversation.profile.displayName,
          conversation.profile.username,
          conversation.profile.title,
          conversation.profile.email,
          conversation.chat?.lastMessageText || "",
        ].join(" ").toLowerCase();

        const matchesSearch = searchable.includes(searchQuery.toLowerCase());
        const matchesTab = activeTab === "Unread" ? conversation.unread : true;

        return matchesSearch && matchesTab;
      });
  }, [activeTab, conversations, searchQuery, connectedUidSet]);

  const lastMessageBySelectedUser = [...messages]
    .reverse()
    .find((message) => message.senderId === selectedUser?.uid);

  const handleSend = async () => {
    if (!draft.trim()) return;

    setIsSending(true);
    try {
      await sendMessage(draft);
      setDraft("");
    } finally {
      setIsSending(false);
    }
  };

  const glassPanelClass = "bg-[#0A0A0A]/40 backdrop-blur-[40px] rounded-[24px] lg:rounded-[32px] border border-white/[0.05] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden relative";

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex-1 w-full min-h-0 p-4 flex flex-col md:flex-row gap-4 overflow-hidden"
    >
      {/* ─── LEFT SIDEBAR (CONVERSATIONS) ─── */}
      <motion.div variants={itemVariants} className={`w-full md:w-[280px] lg:w-[320px] shrink-0 flex-col h-full ${glassPanelClass} ${selectedUser ? "hidden md:flex" : "flex"}`}>

        <div className="p-6 pb-4 flex items-center justify-between relative z-10">
          <h2 className="text-[20px] font-semibold text-white tracking-tight drop-shadow-sm">Messages</h2>
          <button className="w-9 h-9 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.05] flex items-center justify-center text-slate-300 hover:text-white hover:scale-105 transition-all shadow-sm">
            <Edit size={15} />
          </button>
        </div>

        <div className="px-6 pb-4 relative z-10">
          <div className="h-10 bg-[#0F172A]/50 border border-white/[0.05] hover:border-blue-500/30 focus-within:border-blue-500/50 focus-within:bg-[#0F172A]/80 focus-within:shadow-[0_0_15px_rgba(59,130,246,0.15)] rounded-xl flex items-center px-3.5 transition-all">
            <Search size={15} className="text-slate-400 mr-2.5 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search conversations..."
              className="bg-transparent border-none outline-none flex-1 text-[13px] text-white placeholder-slate-500 w-full"
            />
          </div>
        </div>

        <div className="px-6 pb-4 flex gap-2 relative z-10">
          {["All", "Unread"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-full text-[12px] font-semibold transition-all duration-300 flex items-center gap-2 ${activeTab === tab
                  ? "bg-blue-500/20 text-blue-200 border border-blue-500/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_0_15px_rgba(59,130,246,0.2)]"
                  : "bg-white/[0.03] text-slate-400 border border-white/[0.05] hover:bg-white/[0.08] hover:text-white"
                }`}
            >
              {tab}
              {tab === "Unread" && unreadCount > 0 && (
                <span className="flex items-center justify-center min-w-[18px] h-[18px] px-1 bg-blue-500 text-white text-[10px] rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]">
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] relative z-10 px-3 pb-3">
          {filteredConversations.some((conversation) => conversation.chat) && (
            <div className="px-4 py-2 flex items-center gap-1.5 text-[11px] font-medium text-blue-300/70 uppercase tracking-wider">
              <Pin size={12} className="text-blue-400" /> Realtime Active
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            {filteredConversations.map((conversation) => {
              const lastUpdated = conversation.chat?.updatedAt?.toMillis?.() || 0;
              const isSelected = selectedUserId === conversation.profile.uid;

              return (
                <button
                  key={conversation.profile.uid}
                  onClick={() => setSelectedUserId(conversation.profile.uid)}
                  className={`w-full flex items-start gap-3.5 px-4 py-3.5 rounded-2xl text-left transition-all duration-300 group ${isSelected
                      ? "bg-gradient-to-r from-blue-500/10 to-transparent border border-blue-500/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
                      : "hover:bg-white/[0.04] border border-transparent"
                    }`}
                >
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 text-[13px] font-bold overflow-hidden transition-all duration-300 ${isSelected ? "ring-2 ring-blue-500/50 ring-offset-2 ring-offset-[#0A0F1E]" : "ring-1 ring-white/10 group-hover:ring-white/20"
                    }`}>
                    {conversation.profile.photoURL ? (
                      <img src={conversation.profile.photoURL} alt={conversation.profile.displayName} className="h-full w-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white">
                        {conversation.initials}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-center pt-0.5">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-[14px] font-semibold truncate ${isSelected ? "text-white" : "text-slate-200"}`}>
                        {conversation.profile.displayName}
                      </span>
                      <span className={`text-[10px] shrink-0 ml-2 font-medium ${conversation.unread ? "text-blue-400" : "text-slate-500"}`}>
                        {formatRelative(lastUpdated)}
                      </span>
                    </div>
                    <span className="text-[12px] text-slate-400 block truncate mb-1">{conversation.profile.title}</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-[12px] block truncate ${conversation.unread ? "text-white font-medium" : "text-slate-500"}`}>
                        {conversation.chat?.lastMessageText || "Start a conversation..."}
                      </span>
                      {conversation.unread && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full shrink-0 shadow-[0_0_8px_rgba(59,130,246,0.8)] ml-auto" />
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {!loading && !connectionsLoading && filteredConversations.length === 0 && (
            <div className="px-5 py-12 text-center flex flex-col items-center gap-4 mt-4">
              <div className="w-14 h-14 rounded-full bg-white/[0.03] border border-white/[0.05] flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
                <Users size={24} className="text-blue-400/70" />
              </div>
              <div>
                <p className="text-[15px] font-semibold text-white mb-1">No Messages Yet</p>
                <p className="text-[13px] text-slate-400 leading-relaxed px-4">
                  Connect with professionals in the ForgeX network to start collaborating.
                </p>
              </div>
              <Link
                href="/workspace/connections"
                className="mt-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white text-[13px] font-bold rounded-xl transition-all shadow-[0_4px_15px_rgba(59,130,246,0.4)] hover:shadow-[0_6px_20px_rgba(59,130,246,0.6)] hover:scale-105 active:scale-95"
              >
                Find Connections
              </Link>
            </div>
          )}
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className={`flex-1 flex-col min-w-0 md:min-w-[300px] h-full ${glassPanelClass} ${!selectedUser ? "hidden md:flex" : "flex"}`}>
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="h-[76px] flex items-center justify-between px-6 bg-transparent border-b border-white/[0.05] shrink-0 z-10 backdrop-blur-md relative">
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
              <div className="flex items-center gap-4 relative z-10">
                <button onClick={() => setSelectedUserId("")} className="md:hidden w-8 h-8 rounded-full bg-white/[0.05] flex items-center justify-center text-slate-300 hover:text-white mr-2">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                </button>
                <div className="w-11 h-11 rounded-full flex items-center justify-center text-[13px] font-bold overflow-hidden border border-white/10 shadow-sm relative shrink-0 bg-[#121212]">
                  {selectedUser.photoURL ? (
                    <img src={selectedUser.photoURL} alt={selectedUser.displayName} className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-white/80">{selectedUser.displayName.charAt(0).toUpperCase()}</span>
                  )}
                  {/* Online Indicator */}
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#0A0A0A]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[15px] font-semibold text-white tracking-tight leading-tight mb-0.5">{selectedUser.displayName}</span>
                  <span className="text-[12px] text-white/50 leading-tight">{selectedUser.title}</span>
                </div>
              </div>
              <div className="flex items-center gap-2.5 relative z-10">
                <Link href="/workspace/connections" className="hidden sm:flex px-4 py-2 bg-[#121212] border border-[#262626] text-white text-[12px] font-medium rounded-lg hover:bg-[#1A1A1A] transition-colors items-center gap-2">
                  <UserPlus size={14} className="text-white/40" /> View Profile
                </Link>
                <Link href="/workspace/connections" className="hidden sm:flex px-4 py-2 bg-[#121212] border border-[#262626] text-white text-[12px] font-medium rounded-lg hover:bg-[#1A1A1A] transition-colors items-center gap-2">
                  <Calendar size={14} className="text-white/40" /> Meet
                </Link>
                <button className="w-9 h-9 shrink-0 rounded-lg bg-[#121212] border border-[#262626] flex items-center justify-center text-[#a1a1aa] hover:text-white hover:bg-[#1A1A1A] transition-colors">
                  <MoreHorizontal size={16} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] flex flex-col gap-4">
              {messages.length === 0 ? (
                <div className="m-auto w-full max-w-[384px] text-center">
                  <p className="text-[14px] font-medium text-white mb-1">No messages yet</p>
                  <p className="text-[12px] text-[#71717a]">Send the first message to create a realtime Firestore chat.</p>
                </div>
              ) : (
                messages.map((message, index) => {
                  const outgoing = message.senderId === user?.uid;
                  const isLast = index === messages.length - 1;

                  return (
                    <motion.div
                      key={message.id}
                      variants={messageVariants}
                      initial="hidden"
                      animate="visible"
                      layout
                      className={outgoing ? "flex flex-col items-end gap-1.5 max-w-[65%] self-end" : "flex items-end gap-3 max-w-[65%]"}
                    >
                      {!outgoing && (
                        <div className="hidden sm:flex w-8 h-8 rounded-full items-center justify-center text-[10px] font-bold overflow-hidden border border-white/10 shrink-0 mb-5 bg-[#121212]">
                          {selectedUser.photoURL ? (
                            <img src={selectedUser.photoURL} alt={selectedUser.displayName} className="h-full w-full object-cover" />
                          ) : (
                            <span className="text-white/80">{selectedUser.displayName.charAt(0).toUpperCase()}</span>
                          )}
                        </div>
                      )}

                      <div className={`flex flex-col max-w-full ${outgoing ? "items-end" : "items-start"}`}>
                        <div
                          className={`px-5 py-3.5 text-[14px] leading-relaxed whitespace-pre-wrap shadow-sm backdrop-blur-md ${outgoing
                              ? "bg-[#007AFF] text-white rounded-[20px] rounded-br-sm border border-[#006DE6] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_4px_15px_rgba(0,122,255,0.3)]"
                              : "bg-white/[0.02] text-white/90 rounded-[20px] rounded-bl-sm border border-white/[0.04]"
                            }`}
                        >
                          {message.text}
                        </div>
                        <span className="text-[11px] font-medium text-white/40 mt-1.5 px-1 flex items-center gap-1">
                          {formatTime(message)} {outgoing && isLast && <span className="w-1 h-1 bg-white/40 rounded-full ml-1" />}
                        </span>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* AI Suggestion Area */}
            <div className="px-6 mb-3 z-10 flex justify-center">
              <div className="bg-white/[0.02] hover:bg-white/[0.04] cursor-pointer transition-all border border-white/[0.06] rounded-full px-4 py-2 flex items-center gap-3 backdrop-blur-md shadow-sm">
                <Sparkles size={14} className="text-white/40" />
                <span className="text-[12px] text-white/60 font-medium">
                  {lastMessageBySelectedUser
                    ? "Reply with context from your portfolio"
                    : "Start with a short intro and mention what you're building"}
                </span>
              </div>
            </div>

            {/* Input Area */}
            <div className="px-6 pb-6 pt-1 z-10">
              {error && (
                <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-[13px] text-red-200 flex items-center gap-2 shadow-lg shadow-red-500/10">
                  <span className="w-2 h-2 rounded-full bg-red-500 shrink-0 animate-pulse" /> {error}
                </motion.p>
              )}
              <div className="bg-[#121212]/80 border border-white/[0.08] focus-within:border-white/20 focus-within:bg-[#1A1A1A]/90 rounded-full p-1.5 pl-5 flex items-center backdrop-blur-xl transition-all shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
                <input
                  type="text"
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Type your message..."
                  className="bg-transparent border-none outline-none w-full text-[14px] text-white placeholder-white/40 h-10 py-2 leading-relaxed"
                />
                <div className="flex items-center gap-1 shrink-0 ml-2">
                  <button className="w-10 h-10 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all">
                    <Paperclip size={18} strokeWidth={2} />
                  </button>
                  <button className="w-10 h-10 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all">
                    <FolderGit2 size={18} strokeWidth={2} />
                  </button>
                  <button
                    onClick={handleSend}
                    disabled={isSending || !draft.trim()}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${draft.trim() ? 'bg-white text-black shadow-md hover:scale-105 active:scale-95' : 'bg-white/[0.05] text-white/20'}`}
                  >
                    <ArrowUp size={20} strokeWidth={2.5} className={draft.trim() ? "translate-y-[-1px]" : ""} />
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="m-auto flex flex-col items-center justify-center max-w-[384px] text-center px-6">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-blue-500/20 blur-[30px] rounded-full" />
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500/10 to-blue-500/10 border border-white/[0.1] flex items-center justify-center backdrop-blur-md relative z-10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]">
                <Users size={32} className="text-blue-300" />
              </div>
            </div>
            <h3 className="text-[22px] font-bold text-white mb-2 tracking-tight drop-shadow-md">Select a Conversation</h3>
            <p className="text-[14px] text-slate-400 leading-relaxed mb-8">
              Choose an existing connection from the sidebar or find new professionals to collaborate with in the ForgeX network.
            </p>
            <Link
              href="/workspace/connections"
              className="group flex items-center gap-2.5 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white text-[14px] font-bold rounded-xl transition-all shadow-[0_4px_20px_rgba(59,130,246,0.4)] hover:shadow-[0_8px_30px_rgba(59,130,246,0.6)] hover:scale-105 active:scale-95"
            >
              <UserPlus size={16} className="group-hover:rotate-12 transition-transform" /> Browse Connections
            </Link>
          </div>
        )}
      </motion.div>

          </motion.div>
  );
}
