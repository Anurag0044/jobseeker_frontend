"use client";

import React, { useEffect, useRef, useState } from "react";
import { Send, Image as ImageIcon, Loader2, AlertCircle } from "lucide-react";
import { useCommunityChat, type CommunityMessage } from "../../hooks/useCommunityChat";

interface CommunityChatProps {
  communityId: string;
}

function formatTime(msg: CommunityMessage) {
  const date = msg.createdAt?.toDate?.();
  if (!date) return "";
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function Avatar({ name, photoURL, size = 8 }: { name: string; photoURL?: string; size?: number }) {
  const sizeClass = `w-${size} h-${size}`;
  return (
    <div
      className={`${sizeClass} rounded-full bg-[#1A1A1A] border border-[#262626] flex items-center justify-center text-[11px] font-semibold text-[#b19cd9] overflow-hidden shrink-0`}
    >
      {photoURL ? (
        <img src={photoURL} alt={name} className="w-full h-full object-cover" />
      ) : (
        name.charAt(0).toUpperCase()
      )}
    </div>
  );
}

export default function CommunityChat({ communityId }: CommunityChatProps) {
  const { user, messages, loading, error, sendMessage, sendImage } =
    useCommunityChat(communityId);

  const [draft, setDraft] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!draft.trim() || isSending) return;
    setIsSending(true);
    try {
      await sendMessage(draft);
      setDraft("");
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

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 custom-scrollbar flex flex-col gap-3 min-h-0">
        {loading && (
          <div className="flex items-center justify-center py-10">
            <Loader2 size={20} className="text-[#71717a] animate-spin" />
          </div>
        )}

        {!loading && messages.length === 0 && (
          <div className="m-auto text-center flex flex-col items-center gap-2 py-8">
            <p className="text-[13px] font-medium text-white">No messages yet</p>
            <p className="text-[11px] text-[#71717a]">
              Be the first to start the conversation!
            </p>
          </div>
        )}

        {messages.map((msg) => {
          const isMe = msg.senderId === user?.uid;
          return (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${isMe ? "flex-row-reverse" : "flex-row"}`}
            >
              {!isMe && (
                <Avatar name={msg.senderName} photoURL={msg.senderPhotoURL} size={8} />
              )}
              <div
                className={`flex flex-col gap-1 max-w-[75%] ${isMe ? "items-end" : "items-start"}`}
              >
                {!isMe && (
                  <span className="text-[10px] text-[#71717a] px-1">{msg.senderName}</span>
                )}
                {msg.text && (
                  <div
                    className={`rounded-xl px-3.5 py-2.5 text-[12px] leading-relaxed ${
                      isMe
                        ? "bg-[#1e1a2e] border border-[#2a2440] text-[#e5e2e1] rounded-tr-sm"
                        : "bg-[#121212] border border-[#1e1e1e] text-[#e5e2e1] rounded-tl-sm"
                    }`}
                  >
                    {msg.text}
                  </div>
                )}
                {msg.imageUrl && (
                  <div className="rounded-xl overflow-hidden border border-[#1e1e1e] max-w-[220px]">
                    <img
                      src={msg.imageUrl}
                      alt="Shared image"
                      className="w-full object-cover"
                    />
                  </div>
                )}
                <span className="text-[9px] text-[#71717a] px-1">{formatTime(msg)}</span>
              </div>
            </div>
          );
        })}

        <div ref={bottomRef} />
      </div>

      {/* Error */}
      {error && (
        <div className="mx-4 mb-2 flex items-center gap-2 text-[11px] text-red-200 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
          <AlertCircle size={13} className="shrink-0" />
          {error}
        </div>
      )}

      {/* Input */}
      <div className="px-4 pb-4 shrink-0">
        <div className="bg-[#121212] border border-[#1e1e1e] rounded-xl p-3 flex items-center gap-2">
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageSelect}
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={imageUploading}
            className="text-[#71717a] hover:text-white transition-colors disabled:opacity-40 shrink-0"
            title="Send image"
          >
            {imageUploading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <ImageIcon size={16} />
            )}
          </button>

          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Write a message..."
            className="flex-1 bg-transparent border-none outline-none text-[12px] text-white placeholder-[#71717a]"
          />

          <button
            onClick={handleSend}
            disabled={isSending || !draft.trim()}
            className="w-7 h-7 rounded-lg bg-[#5e5ce6] hover:bg-[#4d4ad5] flex items-center justify-center text-white transition-colors disabled:opacity-50 shrink-0"
          >
            {isSending ? (
              <Loader2 size={12} className="animate-spin" />
            ) : (
              <Send size={12} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
