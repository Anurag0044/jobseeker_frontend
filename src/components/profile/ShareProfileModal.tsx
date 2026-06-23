"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, Check, Link as LinkIcon } from "lucide-react";
import { SiX } from "react-icons/si";

interface ShareProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profileUrl: string;
}

export default function ShareProfileModal({ isOpen, onClose, profileUrl }: ShareProfileModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-[400px] max-w-[calc(100vw-2rem)] bg-[#0A0A0A] border border-[#262626] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-[#1e1e1e] shrink-0 bg-gradient-to-r from-[#121212] to-[#0A0A0A]">
            <h2 className="text-[18px] font-semibold text-white tracking-tight">Share Profile</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-[#121212] border border-[#262626] text-[#a1a1aa] hover:text-white hover:bg-[#1A1A1A] transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          <div className="p-6 flex flex-col gap-6">
            <div className="flex flex-col items-center text-center gap-2">
              <div className="w-12 h-12 rounded-full bg-[#1e1a2e] border border-[#2a2440] flex items-center justify-center mb-2">
                <LinkIcon size={20} className="text-[#b19cd9]" />
              </div>
              <h3 className="text-[16px] font-medium text-white">Share your ForgeX Profile</h3>
              <p className="text-[13px] text-[#a1a1aa]">Anyone with this link will be able to view your public portfolio, projects, and skills.</p>
            </div>

            <div className="flex items-center gap-2 bg-[#121212] border border-[#262626] p-2 rounded-xl">
              <div className="flex-1 px-3 py-2 text-[13px] text-white truncate font-mono">
                {profileUrl}
              </div>
              <button
                onClick={handleCopy}
                className={`px-4 py-2 rounded-lg text-[13px] font-medium transition-all flex items-center gap-2 shrink-0 ${
                  copied 
                    ? "bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/20" 
                    : "bg-[#1A1A1A] text-white hover:bg-[#262626] border border-[#3f3f46]"
                }`}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>

            <div className="flex gap-3 pt-2">
              <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-colors text-[13px] font-medium">
                <SiX size={14} />
                Share on X
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#0A66C2]/10 hover:bg-[#0A66C2]/20 border border-[#0A66C2]/20 text-[#0A66C2] transition-colors text-[13px] font-medium">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                LinkedIn
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
