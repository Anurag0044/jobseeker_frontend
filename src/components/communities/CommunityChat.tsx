"use client";

import React, { useEffect, useRef, useState } from "react";
import { Send, ImageIcon, Loader2, AlertCircle } from "lucide-react";
import { useCommunityChat, type CommunityMessage } from "../../hooks/useCommunityChat";

function formatTime(msg: CommunityMessage) {
  const date = msg.createdAt?.toDate?.();
  if (!date) return "";
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function formatDate(msg: CommunityMessage) {
  const date = msg.createdAt?.toDate?.();
  if (!date) return "";
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
}

interface CommunityChatProps {
  communityId: string;
}

export default function CommunityChat({ communityId }: CommunityChatProps) {
  const { user, messages, loading, error, sendMessage, sendImage } =
    useCommunityChat(communityId);

  const [draft, setDraft] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const handleSend = async () => {
    const text = draft.trim();
    if (!text || isSending) return;
    setIsSending(true);
    try {
      await sendMessage(text);
      setDraft("");
      inputRef.current?.focus();
    } finally {
      setIsSending(false);
    }
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageUploading(true);
    try {
      await sendImage(file);
    } finally {
      setImageUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Group messages by date for date dividers
  const grouped: { date: string; msgs: CommunityMessage[] }[] = [];
  for (const msg of messages) {
    const d = formatDate(msg);
    const last = grouped[grouped.length - 1];
    if (last && last.date === d) {
      last.msgs.push(msg);
    } else {
      grouped.push({ date: d, msgs: [msg] });
    }
  }

  return (
    <div className="flex flex-col h-full bg-[#0A0A0A]">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-4 flex flex-col gap-1 min-h-0">
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 size={22} className="text-[#71717a] animate-spin" />
          </div>
        )}

        {!loading && messages.length === 0 && (
          <div className="flex flex-col items-center justify-center flex-1 gap-3 py-16 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#121212] border border-[#1e1e1e] flex items-center justify-center">
              <Send size={22} className="text-[#3f3f46]" />
            </div>
            <p className="text-[15px] font-semibold text-white">No messages yet</p>
            <p className="text-[13px] text-[#71717a]">Be the first to say something!</p>
          </div>
        )}

        {grouped.map(({ date, msgs }) => (
          <div key={date} className="flex flex-col gap-1">
            {/* Date divider */}
            {date && (
              <div className="flex items-center gap-3 my-3">
                <div className="flex-1 h-px bg-[#1e1e1e]" />
                <span className="text-[10px] font-medium text-[#71717a] whitespace-nowrap">{date}</span>
                <div className="flex-1 h-px bg-[#1e1e1e]" />
              </div>
            )}

            {msgs.map((msg, i) => {
              const isMe = msg.senderId === user?.uid;
              const prevMsg = msgs[i - 1];
              const isSameAuthor = prevMsg?.senderId === msg.senderId;

              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 group ${isMe ? "flex-row-reverse" : "flex-row"} ${isSameAuthor ? "mt-0.5" : "mt-3"}`}
                >
                  {/* Avatar — only show for first in a run */}
                  {!isSameAuthor ? (
                    <div className={`w-9 h-9 rounded-full shrink-0 overflow-hidden border border-[#262626] bg-[#1A1A1A] flex items-center justify-center text-[11px] font-bold text-[#b19cd9] ${isMe ? "hidden" : ""}`}>
                      {msg.senderPhotoURL ? (
                        <img src={msg.senderPhotoURL} alt={msg.senderName} className="w-full h-full object-cover" />
                      ) : (
                        msg.senderName.charAt(0).toUpperCase()
                      )}
                    </div>
                  ) : (
                    !isMe && <div className="w-9 shrink-0" />
                  )}

                  <div className={`flex flex-col max-w-[70%] ${isMe ? "items-end" : "items-start"}`}>
                    {/* Sender name — only for first in a run (not me) */}
                    {!isMe && !isSameAuthor && (
                      <span className="text-[11px] font-semibold text-[#b19cd9] mb-1 px-1">{msg.senderName}</span>
                    )}

                    {/* Text bubble */}
                    {msg.text && (
                      <div className={`px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed break-words ${
                        isMe
                          ? "bg-[#5e5ce6] text-white rounded-br-sm"
                          : "bg-[#1e1e1e] text-[#e5e2e1] rounded-bl-sm"
                      }`}>
                        {msg.text}
                      </div>
                    )}

                    {/* Image */}
                    {msg.imageUrl && (
                      <div className="mt-1 rounded-2xl overflow-hidden border border-[#1e1e1e] max-w-[280px]">
                        <img
                          src={msg.imageUrl}
                          alt="Shared image"
                          className="w-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    )}

                    {/* Timestamp — visible on hover */}
                    <span className="text-[9px] text-[#71717a] mt-0.5 px-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {formatTime(msg)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ))}

        <div ref={bottomRef} className="h-1" />
      </div>

      {/* Error banner */}
      {error && (
        <div className="mx-4 mb-2 flex items-center gap-2 text-[11px] text-red-300 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 shrink-0">
          <AlertCircle size={13} className="shrink-0" />
          <span className="truncate">{error}</span>
        </div>
      )}

      {/* Input bar */}
      <div className="px-4 pb-5 pt-2 shrink-0 border-t border-[#1e1e1e]">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageSelect}
        />
        <div className="flex items-center gap-2 bg-[#141414] border border-[#262626] rounded-2xl px-4 py-3 focus-within:border-[#3f3f46] transition-colors">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={imageUploading}
            className="text-[#71717a] hover:text-[#b19cd9] transition-colors disabled:opacity-40 shrink-0"
            title="Send image"
          >
            {imageUploading ? (
              <Loader2 size={17} className="animate-spin" />
            ) : (
              <ImageIcon size={17} />
            )}
          </button>

          <input
            ref={inputRef}
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Message the community..."
            className="flex-1 bg-transparent border-none outline-none text-[13px] text-white placeholder-[#3f3f46] min-w-0"
          />

          <button
            onClick={handleSend}
            disabled={isSending || !draft.trim()}
            className="w-8 h-8 rounded-xl bg-[#5e5ce6] hover:bg-[#4d4ad5] flex items-center justify-center text-white transition-colors disabled:opacity-40 shrink-0"
          >
            {isSending ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <Send size={13} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
