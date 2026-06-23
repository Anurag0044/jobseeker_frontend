"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="px-8 pb-16 pt-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-[1100px] mx-auto flex flex-col gap-6"
      >
        <div>
          <h1 className="text-[28px] font-semibold text-white tracking-tight mb-1">Settings</h1>
          <p className="text-[14px] text-[#a1a1aa]">Manage your settings and preferences.</p>
        </div>

        <div className="flex flex-col items-center justify-center py-24 bg-[#121212] border border-[#1e1e1e] rounded-xl">
          <div className="w-16 h-16 rounded-2xl bg-[#1e1a2e] border border-[#2a2440] flex items-center justify-center mb-6">
            <Sparkles size={28} className="text-[#b19cd9]" />
          </div>
          <h2 className="text-[18px] font-semibold text-white mb-2">Coming Soon</h2>
          <p className="text-[13px] text-[#a1a1aa] text-center max-w-sm">
            We&apos;re building something amazing for Settings. Stay tuned for updates.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
