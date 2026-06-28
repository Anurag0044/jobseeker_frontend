"use client";

import React, { useMemo, useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, Variants, AnimatePresence } from "framer-motion";
import {
  Search, Send, Paperclip, Calendar, Link as LinkIcon,
  MoreHorizontal, FileText, Users, FolderGit2,
  Star, ChevronRight, Sparkles, Pin, Edit, UserPlus
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

  const glassPanelClass = "bg-white/[0.02] backdrop-blur-[40px] saturate-[150%] border border-white/[0.05] rounded-[24px] shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden relative";

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex-1 w-full min-h-0 p-4 flex gap-4 overflow-hidden"
    >
      {/* ─── LEFT SIDEBAR (CONVERSATIONS) ─── */}
      <motion.div variants={itemVariants} className={`w-[340px] shrink-0 flex flex-col ${glassPanelClass}`}>
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/[0.03] to-transparent pointer-events-none" />
        
        <div className="p-6 pb-4 flex items-center justify-between relative z-10">
          <h2 className="text-[20px] font-semibold text-white tracking-tight drop-shadow-sm">Messages</h2>
          <button className="w-9 h-9 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.05] flex items-center justify-center text-slate-300 hover:text-white hover:scale-105 transition-all shadow-sm">
            <Edit size={15} />
          </button>
        </div>

        <div className="px-6 pb-4 relative z-10">
          <div className="h-10 bg-[#0F172A]/50 border border-white/[0.05] hover:border-indigo-500/30 focus-within:border-indigo-500/50 focus-within:bg-[#0F172A]/80 focus-within:shadow-[0_0_15px_rgba(99,102,241,0.15)] rounded-xl flex items-center px-3.5 transition-all">
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
              className={`px-4 py-1.5 rounded-full text-[12px] font-semibold transition-all duration-300 flex items-center gap-2 ${
                activeTab === tab 
                ? "bg-indigo-500/20 text-indigo-200 border border-indigo-500/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_0_15px_rgba(99,102,241,0.2)]" 
                : "bg-white/[0.03] text-slate-400 border border-white/[0.05] hover:bg-white/[0.08] hover:text-white"
              }`}
            >
              {tab}
              {tab === "Unread" && unreadCount > 0 && (
                <span className="flex items-center justify-center min-w-[18px] h-[18px] px-1 bg-indigo-500 text-white text-[10px] rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]">
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10 px-3 pb-3">
          {filteredConversations.some((conversation) => conversation.chat) && (
            <div className="px-4 py-2 flex items-center gap-1.5 text-[11px] font-medium text-indigo-300/70 uppercase tracking-wider">
              <Pin size={12} className="text-indigo-400" /> Realtime Active
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
                  className={`w-full flex items-start gap-3.5 px-4 py-3.5 rounded-2xl text-left transition-all duration-300 group ${
                    isSelected 
                    ? "bg-gradient-to-r from-indigo-500/10 to-transparent border border-indigo-500/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]" 
                    : "hover:bg-white/[0.04] border border-transparent"
                  }`}
                >
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 text-[13px] font-bold overflow-hidden transition-all duration-300 ${
                    isSelected ? "ring-2 ring-indigo-500/50 ring-offset-2 ring-offset-[#0A0F1E]" : "ring-1 ring-white/10 group-hover:ring-white/20"
                  }`}>
                    {conversation.profile.photoURL ? (
                      <img src={conversation.profile.photoURL} alt={conversation.profile.displayName} className="h-full w-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white">
                        {conversation.initials}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-center pt-0.5">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-[14px] font-semibold truncate ${isSelected ? "text-white" : "text-slate-200"}`}>
                        {conversation.profile.displayName}
                      </span>
                      <span className={`text-[10px] shrink-0 ml-2 font-medium ${conversation.unread ? "text-indigo-400" : "text-slate-500"}`}>
                        {formatRelative(lastUpdated)}
                      </span>
                    </div>
                    <span className="text-[12px] text-slate-400 block truncate mb-1">{conversation.profile.title}</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-[12px] block truncate ${conversation.unread ? "text-white font-medium" : "text-slate-500"}`}>
                        {conversation.chat?.lastMessageText || "Start a conversation..."}
                      </span>
                      {conversation.unread && (
                        <div className="w-2 h-2 bg-indigo-500 rounded-full shrink-0 shadow-[0_0_8px_rgba(99,102,241,0.8)] ml-auto" />
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
                <Users size={24} className="text-indigo-400/70" />
              </div>
              <div>
                <p className="text-[15px] font-semibold text-white mb-1">No Messages Yet</p>
                <p className="text-[13px] text-slate-400 leading-relaxed px-4">
                  Connect with professionals in the ForgeX network to start collaborating.
                </p>
              </div>
              <Link
                href="/workspace/connections"
                className="mt-2 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white text-[13px] font-bold rounded-xl transition-all shadow-[0_4px_15px_rgba(99,102,241,0.4)] hover:shadow-[0_6px_20px_rgba(99,102,241,0.6)] hover:scale-105 active:scale-95"
              >
                Find Connections
              </Link>
            </div>
          )}
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="flex-1 flex flex-col bg-[#0A0A0A]">
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="h-[72px] flex items-center justify-between px-6 bg-white/[0.02] border-b border-white/[0.05] shrink-0 z-10 backdrop-blur-md">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-full flex items-center justify-center text-[13px] font-bold overflow-hidden ring-1 ring-white/10 shadow-sm relative">
                  {selectedUser.photoURL ? (
                    <img src={selectedUser.photoURL} alt={selectedUser.displayName} className="h-full w-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white">
                      {selectedUser.displayName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  {/* Online Indicator */}
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0F172A] shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[15px] font-semibold text-white tracking-tight leading-tight mb-0.5">{selectedUser.displayName}</span>
                  <span className="text-[12px] text-slate-400 leading-tight">{selectedUser.title}</span>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <button className="px-4 py-2 bg-white/[0.03] border border-white/[0.05] text-white text-[13px] font-medium rounded-xl hover:bg-white/[0.08] transition-all flex items-center gap-2 hover:shadow-[0_0_15px_rgba(255,255,255,0.05)] active:scale-95">
                  <UserPlus size={14} className="text-indigo-300" /> View Profile
                </button>
                <button className="px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-100 text-[13px] font-medium rounded-xl hover:bg-indigo-500/20 transition-all flex items-center gap-2 hover:shadow-[0_0_15px_rgba(99,102,241,0.2)] active:scale-95">
                  <Calendar size={14} className="text-indigo-400" /> Meet
                </button>
                <button className="w-9 h-9 rounded-xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/[0.08] transition-all active:scale-95">
                  <MoreHorizontal size={16} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar flex flex-col gap-4">
              {messages.length === 0 ? (
                <div className="m-auto max-w-sm text-center">
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
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold overflow-hidden ring-1 ring-white/10 shrink-0 mb-5">
                          {selectedUser.photoURL ? (
                            <img src={selectedUser.photoURL} alt={selectedUser.displayName} className="h-full w-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white">
                              {selectedUser.displayName.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div className={`flex flex-col ${outgoing ? "items-end" : "items-start"}`}>
                        <div 
                          className={`px-4 py-3 text-[14px] leading-relaxed whitespace-pre-wrap shadow-sm backdrop-blur-md ${
                            outgoing 
                            ? "bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-2xl rounded-tr-sm border border-indigo-400/20 shadow-[0_4px_15px_rgba(99,102,241,0.25)]" 
                            : "bg-[#1E293B]/80 text-slate-100 rounded-2xl rounded-tl-sm border border-white/[0.08]"
                          }`}
                        >
                          {message.text}
                        </div>
                        <span className="text-[11px] font-medium text-slate-500 mt-1.5 px-1 flex items-center gap-1">
                          {formatTime(message)} {outgoing && isLast && <span className="w-1 h-1 bg-green-500 rounded-full" />}
                        </span>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* AI Suggestion Area */}
            <div className="px-6 mb-2 z-10">
              <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-xl p-3.5 flex items-start gap-3.5 backdrop-blur-md shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_4px_10px_rgba(0,0,0,0.2)]">
                <div className="w-7 h-7 rounded-lg bg-indigo-500/20 flex items-center justify-center shrink-0 border border-indigo-500/30">
                  <Sparkles size={14} className="text-indigo-300" />
                </div>
                <div className="flex-1 pt-0.5">
                  <span className="text-[12px] font-semibold text-indigo-200 block mb-1 flex items-center gap-2">
                    Forge AI Suggestion
                    <span className="px-1.5 py-0.5 bg-indigo-500/20 text-indigo-300 text-[9px] rounded uppercase tracking-wider font-bold">Smart</span>
                  </span>
                  <span className="text-[13px] text-slate-300 leading-relaxed">
                    {lastMessageBySelectedUser
                      ? "Reply with context from your portfolio and keep the next step clear."
                      : "Start with a short intro and mention what you are currently building."}
                  </span>
                </div>
              </div>
            </div>

            {/* Input Area */}
            <div className="px-6 pb-6 pt-2 z-10">
              {error && (
                <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-[13px] text-red-200 flex items-center gap-2 shadow-lg shadow-red-500/10">
                  <span className="w-2 h-2 rounded-full bg-red-500 shrink-0 animate-pulse" /> {error}
                </motion.p>
              )}
              <div className="bg-[#0F172A]/60 border border-white/[0.08] focus-within:border-indigo-500/40 focus-within:shadow-[0_0_20px_rgba(99,102,241,0.15)] rounded-2xl p-4 backdrop-blur-xl transition-all">
                <textarea
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Type your message..."
                  className="bg-transparent border-none outline-none w-full text-[14px] text-white placeholder-slate-500 mb-3 resize-none h-[44px] custom-scrollbar"
                  rows={2}
                />
                <div className="flex items-center justify-between border-t border-white/[0.05] pt-3">
                  <div className="flex items-center gap-1.5">
                    <button className="px-3 py-1.5 rounded-lg flex items-center gap-2 text-[12px] font-medium text-slate-400 hover:text-white hover:bg-white/[0.05] transition-all active:scale-95">
                      <Paperclip size={15} /> Attach
                    </button>
                    <button className="px-3 py-1.5 rounded-lg flex items-center gap-2 text-[12px] font-medium text-slate-400 hover:text-white hover:bg-white/[0.05] transition-all active:scale-95">
                      <LinkIcon size={15} /> Portfolio
                    </button>
                  </div>
                  <button
                    onClick={handleSend}
                    disabled={isSending || !draft.trim()}
                    className="w-10 h-10 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 flex items-center justify-center text-white transition-all disabled:opacity-50 disabled:grayscale shadow-[0_4px_15px_rgba(99,102,241,0.3)] hover:shadow-[0_6px_20px_rgba(99,102,241,0.5)] hover:scale-105 active:scale-95"
                  >
                    <Send size={16} className={draft.trim() ? "translate-x-[1px] -translate-y-[1px]" : ""} />
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="m-auto flex flex-col items-center justify-center max-w-sm text-center px-6">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-indigo-500/20 blur-[30px] rounded-full" />
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-white/[0.1] flex items-center justify-center backdrop-blur-md relative z-10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]">
                <Users size={32} className="text-indigo-300" />
              </div>
            </div>
            <h3 className="text-[22px] font-bold text-white mb-2 tracking-tight drop-shadow-md">Select a Conversation</h3>
            <p className="text-[14px] text-slate-400 leading-relaxed mb-8">
              Choose an existing connection from the sidebar or find new professionals to collaborate with in the ForgeX network.
            </p>
            <Link
              href="/workspace/connections"
              className="group flex items-center gap-2.5 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white text-[14px] font-bold rounded-xl transition-all shadow-[0_4px_20px_rgba(99,102,241,0.4)] hover:shadow-[0_8px_30px_rgba(99,102,241,0.6)] hover:scale-105 active:scale-95"
            >
              <UserPlus size={16} className="group-hover:rotate-12 transition-transform" /> Browse Connections
            </Link>
          </div>
        )}
      </motion.div>

      {/* ─── RIGHT SIDEBAR (CONTEXT) ─── */}
      <motion.div variants={itemVariants} className={`w-[300px] shrink-0 flex flex-col ${glassPanelClass} overflow-y-auto custom-scrollbar`}>
        <div className="p-6 flex flex-col gap-6 relative z-10">
          <div>
            <h4 className="text-[11px] font-bold text-indigo-400/80 uppercase tracking-widest mb-4">
              Context
            </h4>
            {selectedUser ? (
              <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-4 shadow-sm">
                <div className="flex items-center gap-3.5 mb-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-[14px] font-bold overflow-hidden ring-2 ring-white/10 shadow-md bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                    {selectedUser.photoURL ? (
                      <img src={selectedUser.photoURL} alt={selectedUser.displayName} className="h-full w-full object-cover" />
                    ) : (
                      selectedUser.displayName.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[15px] font-bold text-white tracking-tight">{selectedUser.displayName}</span>
                    <span className="text-[12px] text-indigo-300">@{selectedUser.username}</span>
                  </div>
                </div>
                <div className="px-1">
                  <span className="text-[12px] text-slate-300 leading-relaxed line-clamp-2">{selectedUser.title}</span>
                </div>
                <button className="w-full mt-4 py-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.05] rounded-lg text-[12px] font-semibold text-white transition-all active:scale-95">
                  View Full Profile
                </button>
              </div>
            ) : (
              <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-5 text-center">
                <span className="text-[12px] text-slate-400 leading-relaxed inline-block">Select a user to view their live context and shared history.</span>
              </div>
            )}
          </div>

          <div className="w-full h-px bg-white/[0.05]"></div>

          <div>
            <h4 className="text-[11px] font-bold text-indigo-400/80 uppercase tracking-widest mb-4">Shared History</h4>
            <div className="flex flex-col gap-1.5">
              {[
                { icon: <FileText size={14} />, label: "Applications", detail: "2 Active" },
                { icon: <Calendar size={14} />, label: "Interviews", detail: "1 Scheduled" },
                { icon: <FolderGit2 size={14} />, label: "Projects", detail: "3 Shared" },
                { icon: <Star size={14} />, label: "Reviews", detail: "Pending" },
                { icon: <Users size={14} />, label: "Mutuals", detail: "12 Connections" },
              ].map((item, i) => (
                <div key={item.label} className="group flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-white/[0.04] transition-all cursor-pointer">
                  <div className="flex items-center gap-3 text-[12px] font-medium text-slate-300 group-hover:text-white transition-colors">
                    <div className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.05] flex items-center justify-center text-indigo-300 group-hover:bg-indigo-500/20 group-hover:text-indigo-200 transition-all">
                      {item.icon}
                    </div>
                    {item.label}
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 group-hover:text-slate-400">
                    {item.detail} <ChevronRight size={12} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full h-px bg-white/[0.05]"></div>

          <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-2xl p-4">
            <h4 className="text-[11px] font-bold text-indigo-400 mb-2 flex items-center gap-1.5"><Sparkles size={12} /> Sync Status</h4>
            <p className="text-[12px] text-slate-400 leading-relaxed">
              Messages are synced instantly via Firestore. End-to-end secure connection active.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
