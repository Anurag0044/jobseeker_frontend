"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import {
  Search, Send, Paperclip, Calendar, Link as LinkIcon,
  MoreHorizontal, FileText, Users, FolderGit2,
  Star, ChevronRight, Sparkles, Pin, Edit, UserPlus
} from "lucide-react";
import { useRealtimeChat, type ChatMessage } from "../../../hooks/useRealtimeChat";
import { useConnections } from "../../../hooks/useConnections";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.04, delayChildren: 0.05 } },
};

const itemVariants: Variants = {
  hidden: { y: 10, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring" as const, stiffness: 300, damping: 24 } },
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
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  return `${days}d ago`;
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

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex h-full"
    >
      <motion.div variants={itemVariants} className="w-[320px] shrink-0 border-r border-[#1e1e1e] flex flex-col bg-[#0A0A0A]">
        <div className="p-5 pb-3 flex items-center justify-between">
          <h2 className="text-[18px] font-semibold text-white">Messages</h2>
          <button className="w-8 h-8 rounded-md bg-[#121212] border border-[#262626] flex items-center justify-center text-[#a1a1aa] hover:text-white transition-colors">
            <Edit size={14} />
          </button>
        </div>

        <div className="px-5 pb-3">
          <div className="h-9 bg-[#121212] border border-[#1e1e1e] rounded-md flex items-center px-3">
            <Search size={14} className="text-[#71717a] mr-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search real users..."
              className="bg-transparent border-none outline-none flex-1 text-[12px] text-white placeholder-[#71717a]"
            />
          </div>
        </div>

        <div className="px-5 pb-3 flex gap-2">
          {["All", "Unread"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 rounded-md text-[11px] font-medium transition-colors ${
                activeTab === tab ? "bg-[#1e1a2e] text-[#b19cd9] border border-[#2a2440]" : "bg-[#121212] text-[#a1a1aa] border border-[#262626] hover:text-white"
              }`}
            >
              {tab}
              {tab === "Unread" && unreadCount > 0 && <span className="ml-1.5 px-1.5 py-0.5 bg-[#5e5ce6] text-white text-[9px] rounded-full">{unreadCount}</span>}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {filteredConversations.some((conversation) => conversation.chat) && (
            <div className="px-5 py-1.5 flex items-center gap-1.5 text-[10px] text-[#71717a]">
              <Pin size={10} /> Realtime
            </div>
          )}

          {filteredConversations.map((conversation) => {
            const lastUpdated = conversation.chat?.updatedAt?.toMillis?.() || 0;

            return (
              <button
                key={conversation.profile.uid}
                onClick={() => setSelectedUserId(conversation.profile.uid)}
                className={`w-full flex items-start gap-3 px-5 py-3 text-left transition-all ${
                  selectedUserId === conversation.profile.uid ? "bg-[#1e1a2e]" : "hover:bg-[#121212]"
                }`}
              >
                <div className="w-9 h-9 rounded-full bg-[#1A1A1A] border border-[#262626] flex items-center justify-center shrink-0 text-[11px] font-semibold text-[#b19cd9] overflow-hidden">
                  {conversation.profile.photoURL ? (
                    <img src={conversation.profile.photoURL} alt={conversation.profile.displayName} className="h-full w-full object-cover" />
                  ) : (
                    conversation.initials
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[13px] font-medium text-white truncate">{conversation.profile.displayName}</span>
                    <span className="text-[10px] text-[#71717a] shrink-0 ml-2">{formatRelative(lastUpdated)}</span>
                  </div>
                  <span className="text-[11px] text-[#71717a] block truncate">{conversation.profile.title}</span>
                  <span className="text-[11px] text-[#a1a1aa] block truncate mt-0.5">
                    {conversation.chat?.lastMessageText || "Start a realtime conversation"}
                  </span>
                </div>
                {conversation.unread && <div className="w-2 h-2 bg-[#5e5ce6] rounded-full shrink-0 mt-2"></div>}
              </button>
            );
          })}

          {!loading && !connectionsLoading && filteredConversations.length === 0 && (
            <div className="px-5 py-10 text-center flex flex-col items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#121212] border border-[#1e1e1e] flex items-center justify-center">
                <UserPlus size={16} className="text-[#71717a]" />
              </div>
              <p className="text-[13px] text-white mb-0">No connections yet</p>
              <p className="text-[11px] text-[#71717a] leading-relaxed">
                Connect with people first to start messaging them.
              </p>
              <Link
                href="/workspace/connections"
                className="mt-1 px-3 py-1.5 bg-[#5e5ce6] hover:bg-[#4d4ad5] text-white text-[11px] font-medium rounded-lg transition-colors"
              >
                Find Connections
              </Link>
            </div>
          )}
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="flex-1 flex flex-col bg-[#0A0A0A] min-w-0">
        {selectedUser ? (
          <>
            <div className="h-16 flex items-center justify-between px-6 border-b border-[#1e1e1e] shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#1A1A1A] border border-[#262626] flex items-center justify-center text-[11px] font-semibold text-[#b19cd9] overflow-hidden">
                  {selectedUser.photoURL ? (
                    <img src={selectedUser.photoURL} alt={selectedUser.displayName} className="h-full w-full object-cover" />
                  ) : (
                    selectedUser.displayName.charAt(0).toUpperCase()
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-medium text-white">{selectedUser.displayName}</span>
                    <span className="w-2 h-2 bg-[#22c55e] rounded-full"></span>
                  </div>
                  <span className="text-[11px] text-[#a1a1aa]">{selectedUser.title}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 bg-[#121212] border border-[#262626] text-white text-[12px] rounded-md hover:bg-[#1A1A1A] transition-colors">View Profile</button>
                <button className="px-3 py-1.5 bg-[#121212] border border-[#262626] text-white text-[12px] rounded-md hover:bg-[#1A1A1A] transition-colors">Schedule Meeting</button>
                <button className="w-8 h-8 flex items-center justify-center text-[#a1a1aa] hover:text-white transition-colors"><MoreHorizontal size={16} /></button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar flex flex-col gap-4 relative min-w-0">
              {messages.length === 0 ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                  <p className="text-[14px] font-medium text-white mb-1">No messages yet</p>
                  <p className="text-[12px] text-[#71717a] max-w-[200px]">Send the first message to create a realtime Firestore chat.</p>
                </div>
              ) : (
                messages.map((message) => {
                  const outgoing = message.senderId === user?.uid;

                  return (
                    <div key={message.id} className={outgoing ? "flex flex-col items-end gap-1 max-w-[500px] self-end" : "flex gap-3 max-w-[500px]"}>
                      {!outgoing && (
                        <div className="w-8 h-8 rounded-full bg-[#1A1A1A] border border-[#262626] flex items-center justify-center text-[10px] font-semibold text-[#b19cd9] shrink-0 mt-1 overflow-hidden">
                          {selectedUser.photoURL ? (
                            <img src={selectedUser.photoURL} alt={selectedUser.displayName} className="h-full w-full object-cover" />
                          ) : (
                            selectedUser.displayName.charAt(0).toUpperCase()
                          )}
                        </div>
                      )}
                      <div className="flex flex-col gap-1">
                        <div className={`${outgoing ? "bg-[#1e1a2e] border-[#2a2440] rounded-tr-sm" : "bg-[#121212] border-[#1e1e1e] rounded-tl-sm"} border rounded-xl p-4 text-[13px] text-[#e5e2e1] leading-relaxed whitespace-pre-wrap`}>
                          {message.text}
                        </div>
                        <span className={`text-[10px] text-[#71717a] px-1 ${outgoing ? "self-end" : ""}`}>{formatTime(message)}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="mx-6 mb-3 bg-[#1e1a2e] border border-[#2a2440] rounded-lg p-3 flex items-start gap-3">
              <Sparkles size={14} className="text-[#b19cd9] shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="text-[11px] font-medium text-white block mb-0.5">Forge AI Suggestion</span>
                <span className="text-[11px] text-[#a1a1aa]">
                  {lastMessageBySelectedUser
                    ? "Reply with context from your profile and keep the next step clear."
                    : "Start with a short intro and mention what you are looking to build next."}
                </span>
              </div>
            </div>

            <div className="px-6 pb-5">
              {error && (
                <p className="mb-3 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-[12px] text-red-200">
                  {error}
                </p>
              )}
              <div className="bg-[#121212] border border-[#1e1e1e] rounded-xl p-4">
                <input
                  type="text"
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Write a realtime message..."
                  className="bg-transparent border-none outline-none w-full text-[13px] text-white placeholder-[#71717a] mb-3"
                />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button className="flex items-center gap-1.5 text-[11px] text-[#a1a1aa] hover:text-white transition-colors"><Paperclip size={14} /> Attach</button>
                    <button className="flex items-center gap-1.5 text-[11px] text-[#a1a1aa] hover:text-white transition-colors"><LinkIcon size={14} /> Portfolio Link</button>
                    <button className="flex items-center gap-1.5 text-[11px] text-[#a1a1aa] hover:text-white transition-colors"><Calendar size={14} /> Schedule Meeting</button>
                  </div>
                  <button
                    onClick={handleSend}
                    disabled={isSending || !draft.trim()}
                    className="w-8 h-8 rounded-lg bg-[#5e5ce6] hover:bg-[#4d4ad5] flex items-center justify-center text-white transition-colors disabled:opacity-50"
                  >
                    <Send size={14} />
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="m-auto max-w-sm text-center px-6 flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#121212] border border-[#1e1e1e] flex items-center justify-center">
              <UserPlus size={20} className="text-[#71717a]" />
            </div>
            <p className="text-[15px] font-medium text-white">No connections yet</p>
            <p className="text-[12px] text-[#71717a] leading-relaxed">
              Connect with other Forge X members first, then you can start a realtime chat with them here.
            </p>
            <Link
              href="/workspace/connections"
              className="mt-1 flex items-center gap-2 px-4 py-2 bg-[#5e5ce6] hover:bg-[#4d4ad5] text-white text-[13px] font-medium rounded-lg transition-colors shadow-lg shadow-[#5e5ce6]/20"
            >
              <UserPlus size={14} /> Find Connections
            </Link>
            {error && <p className="mt-2 text-[12px] text-red-200">{error}</p>}
          </div>
        )}
      </motion.div>

      <motion.div variants={itemVariants} className="w-[280px] shrink-0 border-l border-[#1e1e1e] flex flex-col bg-[#0A0A0A] overflow-y-auto custom-scrollbar">
        <div className="p-5 flex flex-col gap-5">
          <div>
            <h4 className="text-[12px] font-semibold text-white mb-3">
              {selectedUser ? `About ${selectedUser.displayName.split(" ")[0]}` : "About"}
            </h4>
            {selectedUser ? (
              <>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-[#1A1A1A] border border-[#262626] flex items-center justify-center text-[12px] font-semibold text-[#b19cd9] overflow-hidden">
                    {selectedUser.photoURL ? (
                      <img src={selectedUser.photoURL} alt={selectedUser.displayName} className="h-full w-full object-cover" />
                    ) : (
                      selectedUser.displayName.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[13px] font-medium text-white">{selectedUser.displayName}</span>
                    <span className="text-[11px] text-[#71717a]">@{selectedUser.username}</span>
                  </div>
                </div>
                <span className="text-[11px] text-[#a1a1aa]">{selectedUser.title}</span>
              </>
            ) : (
              <span className="text-[11px] text-[#71717a]">Select a user to view live profile context.</span>
            )}
          </div>

          <div className="w-full h-px bg-[#1e1e1e]"></div>

          <div>
            <h4 className="text-[12px] font-semibold text-white mb-3">Shared Context</h4>
            <div className="flex flex-col gap-2">
              {[
                { icon: <FileText size={12} />, label: "Applications", detail: "Firestore" },
                { icon: <Calendar size={12} />, label: "Interviews", detail: "Firestore" },
                { icon: <FolderGit2 size={12} />, label: "Projects", detail: "Firestore" },
                { icon: <Star size={12} />, label: "Portfolio Reviews", detail: "Firestore" },
                { icon: <Users size={12} />, label: "Mutual Connections", detail: "Firestore" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between py-1.5 text-[11px]">
                  <div className="flex items-center gap-2 text-[#a1a1aa]">
                    {item.icon} {item.label}
                  </div>
                  <div className="flex items-center gap-1 text-[#71717a]">
                    {item.detail} <ChevronRight size={10} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full h-px bg-[#1e1e1e]"></div>

          <div>
            <h4 className="text-[12px] font-semibold text-white mb-3">Realtime Status</h4>
            <p className="text-[11px] text-[#a1a1aa] leading-relaxed">
              Messages sync from Firestore as soon as either participant sends them.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
