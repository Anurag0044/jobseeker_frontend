"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search } from "lucide-react";

interface UserListModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

// Mock Data
const MOCK_USERS = [
  { id: 1, name: "Alex Chen", title: "Frontend Engineer at Vercel", username: "@alexc", avatar: "A", following: false },
  { id: 2, name: "Sarah Johnson", title: "Product Designer", username: "@sarahj", avatar: "S", following: true },
  { id: 3, name: "Michael Chang", title: "Senior Developer", username: "@mchang", avatar: "M", following: true },
  { id: 4, name: "Emma Wilson", title: "UI/UX Expert", username: "@emmaw", avatar: "E", following: false },
  { id: 5, name: "David Kim", title: "Full Stack Developer", username: "@dkim", avatar: "D", following: false },
  { id: 6, name: "Jessica Lee", title: "AI Researcher", username: "@jlee", avatar: "J", following: true },
];

export default function UserListModal({ isOpen, onClose, title }: UserListModalProps) {
  const [searchQuery, setSearchQuery] = React.useState("");

  if (!isOpen) return null;

  const filteredUsers = MOCK_USERS.filter((u) =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          className="relative w-[400px] max-w-[calc(100vw-2rem)] bg-[#0A0A0A] border border-[#262626] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-[#1e1e1e] shrink-0 bg-[#050505]">
            <h2 className="text-[18px] font-semibold text-white tracking-tight">{title}</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-[#121212] border border-[#262626] text-[#a1a1aa] hover:text-white hover:bg-[#1A1A1A] transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* Search */}
          <div className="p-4 border-b border-[#1e1e1e] bg-[#0A0A0A] shrink-0">
            <div className="relative group real-glass-search">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#71717a] group-focus-within:text-[#b19cd9] group-active:scale-75 group-focus-within:rotate-12 transition-all duration-300" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent pl-9 pr-4 py-2 text-[13px] text-white placeholder:text-[#71717a] outline-none"
              />
            </div>
          </div>

          {/* User List */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
            {filteredUsers.length > 0 ? (
              <div className="flex flex-col gap-1">
                {filteredUsers.map((user) => (
                  <div key={user.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#121212] transition-colors cursor-pointer group">
                    <div className="w-10 h-10 rounded-full bg-[#1A1A1A] border border-[#262626] flex items-center justify-center shrink-0">
                      <span className="text-[14px] font-bold text-[#b19cd9]">{user.avatar}</span>
                    </div>
                    <div className="flex flex-col flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[14px] font-medium text-white truncate group-hover:text-[#b19cd9] transition-colors">{user.name}</span>
                      </div>
                      <span className="text-[12px] text-[#71717a] truncate">{user.title}</span>
                    </div>
                    <button
                      className={`px-4 py-1.5 rounded-full text-[12px] font-medium transition-colors shrink-0 ${user.following
                          ? "bg-transparent border border-[#3f3f46] text-[#e5e2e1] hover:border-[#ef4444] hover:text-[#ef4444]"
                          : "bg-[#e5e2e1] text-black hover:bg-white"
                        }`}
                    >
                      {user.following ? "Following" : "Follow"}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center px-4">
                <div className="w-12 h-12 rounded-full bg-[#1A1A1A] border border-[#262626] flex items-center justify-center mb-3">
                  <Search size={20} className="text-[#71717a]" />
                </div>
                <h3 className="text-[14px] font-medium text-white mb-1">No users found</h3>
                <p className="text-[12px] text-[#71717a]">Try searching for a different name or username.</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
