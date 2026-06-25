"use client";

import React from "react";
import { motion } from "framer-motion";
import { Shield, Sparkles } from "lucide-react";
import LogoutButton from "../../../components/auth/LogoutButton";
import ProfileContextStrip from "../../../components/profile/ProfileContextStrip";

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

        <ProfileContextStrip label="Signed In Profile" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="flex flex-col justify-between gap-6 bg-[#121212] border border-[#1e1e1e] rounded-xl p-6">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#1e1a2e] border border-[#2a2440] flex items-center justify-center mb-4">
                <Shield size={22} className="text-[#b19cd9]" />
              </div>
              <h2 className="text-[18px] font-semibold text-white mb-2">Account Session</h2>
              <p className="text-[13px] text-[#a1a1aa] leading-relaxed">
                Sign out of this browser and return to the authentication screen.
              </p>
            </div>
            <div>
              <LogoutButton />
            </div>
          </div>

          <div className="flex flex-col items-center justify-center py-16 bg-[#121212] border border-[#1e1e1e] rounded-xl">
            <div className="w-16 h-16 rounded-2xl bg-[#1e1a2e] border border-[#2a2440] flex items-center justify-center mb-6">
              <Sparkles size={28} className="text-[#b19cd9]" />
            </div>
            <h2 className="text-[18px] font-semibold text-white mb-2">More Settings Soon</h2>
            <p className="text-[13px] text-[#a1a1aa] text-center max-w-sm">
              Profile preferences, notification controls, and assistant memory settings are on the way.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
