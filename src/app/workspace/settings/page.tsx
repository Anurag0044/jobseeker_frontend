"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, Settings, Sliders, ShieldAlert, FileText, 
  LogOut, Sparkles, Layout, Database, Check, Type,
  AlertTriangle, Trash2, Download, ShieldCheck,
  Volume2, ChevronRight, Eye
} from "lucide-react";
import LogoutButton from "../../../components/auth/LogoutButton";

type SettingTab = "customize" | "account" | "data" | "legal";

const colors = {
  purple: {
    base: '#a855f7',
    hover: '#c084fc',
    dark: '#9333ea',
    light: '#d8b4fe',
    glow: 'rgba(168, 85, 247, 0.4)',
    border: 'rgba(168, 85, 247, 0.2)',
    borderFocus: 'rgba(168, 85, 247, 0.5)',
  },
  emerald: {
    base: '#10b981',
    hover: '#34d399',
    dark: '#059669',
    light: '#6ee7b7',
    glow: 'rgba(16, 185, 129, 0.4)',
    border: 'rgba(16, 185, 129, 0.2)',
    borderFocus: 'rgba(16, 185, 129, 0.5)',
  },
  amber: {
    base: '#f59e0b',
    hover: '#fbbf24',
    dark: '#d97706',
    light: '#fde047',
    glow: 'rgba(245, 158, 11, 0.4)',
    border: 'rgba(245, 158, 11, 0.2)',
    borderFocus: 'rgba(245, 158, 11, 0.5)',
  }
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingTab>("customize");
  
  // Customization States with localStorage hydration
  const [fontSize, setFontSize] = useState<"compact" | "default" | "comfortable" | "large">("default");
  const [accentColor, setAccentColor] = useState<"blue" | "purple" | "emerald" | "amber">("blue");
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);

  // Data Control State
  const [deleteStep, setDeleteStep] = useState(0);

  // Hydrate states from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedSize = localStorage.getItem("forge-font-size");
      const storedAccent = localStorage.getItem("forge-accent");
      const storedAnim = localStorage.getItem("forge-animations");
      const storedSound = localStorage.getItem("forge-sound");

      if (storedSize) setFontSize(storedSize as any);
      if (storedAccent) setAccentColor(storedAccent as any);
      if (storedAnim) setAnimationsEnabled(storedAnim === "true");
      if (storedSound) setSoundEnabled(storedSound === "true");
    }
  }, []);

  // Make customization real: Font Size
  useEffect(() => {
    const styleId = "forge-font-overrides";
    let styleElement = document.getElementById(styleId);
    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }

    const zooms = {
      compact: "0.94",
      default: "1.0",
      comfortable: "1.06",
      large: "1.12"
    };

    styleElement.innerHTML = `
      main {
        zoom: ${zooms[fontSize]} !important;
      }
    `;
    localStorage.setItem("forge-font-size", fontSize);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("forge-settings-updated"));
    }
  }, [fontSize]);

  // Make customization real: Accent Color
  useEffect(() => {
    const styleId = "forge-accent-overrides";
    let styleElement = document.getElementById(styleId);
    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }

    if (accentColor === "blue") {
      styleElement.innerHTML = "";
      localStorage.setItem("forge-accent", "blue");
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("forge-settings-updated"));
      }
      return;
    }

    const c = colors[accentColor];
    styleElement.innerHTML = `
      .text-blue-400 { color: ${c.base} !important; }
      .text-blue-350 { color: ${c.hover} !important; }
      .text-blue-300 { color: ${c.hover} !important; }
      .text-blue-205 { color: ${c.light} !important; }
      .text-blue-200 { color: ${c.light} !important; }
      .text-indigo-400 { color: ${c.base} !important; }
      .text-indigo-300 { color: ${c.hover} !important; }

      .bg-blue-500 { background-color: ${c.base} !important; }
      .bg-blue-600 { background-color: ${c.dark} !important; }
      .bg-indigo-500 { background-color: ${c.base} !important; }
      .bg-indigo-650 { background-color: ${c.dark} !important; }

      .border-blue-500 { border-color: ${c.base} !important; }
      .border-blue-500\\/20 { border-color: ${c.border} !important; }
      .border-blue-500\\/30 { border-color: ${c.border} !important; }
      .hover\\:border-blue-500\\/30:hover { border-color: ${c.border} !important; }
      .focus-within\\:border-blue-500\\/50:focus-within { border-color: ${c.borderFocus} !important; }

      .border-indigo-500 { border-color: ${c.base} !important; }
      .border-indigo-500\\/20 { border-color: ${c.border} !important; }

      .shadow-\\[0_4px_15px_rgba\\(59\\,130\\,246\\,0\\.4\\)\\] { box-shadow: 0 4px 15px ${c.glow} !important; }
      .hover\\:shadow-\\[0_6px_20px_rgba\\(59\\,130\\,246\\,0\\.6\\)\\]:hover { box-shadow: 0 6px 20px ${c.glow} !important; }
      .focus-within\\:shadow-\\[0_0_15px_rgba\\(59\\,130\\,246\\,0\\.15\\)\\]:focus-within { box-shadow: 0 0 15px ${c.glow} !important; }
    `;
    localStorage.setItem("forge-accent", accentColor);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("forge-settings-updated"));
    }
  }, [accentColor]);

  // Make customization real: Animations
  useEffect(() => {
    const styleId = "forge-animation-overrides";
    let styleElement = document.getElementById(styleId);
    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }

    if (animationsEnabled) {
      styleElement.innerHTML = "";
    } else {
      styleElement.innerHTML = `
        *, *::before, *::after {
          animation-duration: 0.001s !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.001s !important;
          scroll-behavior: auto !important;
        }
      `;
    }
    localStorage.setItem("forge-animations", animationsEnabled ? "true" : "false");
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("forge-settings-updated"));
    }
  }, [animationsEnabled]);

  // Save sound setting
  useEffect(() => {
    localStorage.setItem("forge-sound", soundEnabled ? "true" : "false");
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("forge-settings-updated"));
    }
  }, [soundEnabled]);

  const tabs = [
    { id: "customize", label: "Customization", icon: Sliders, desc: "Theme, fonts, and animation effects" },
    { id: "account", label: "Account & Session", icon: User, desc: "Manage your active profile session" },
    { id: "data", label: "Privacy & Data", icon: Database, desc: "Export, clear, or delete your data" },
    { id: "legal", label: "Terms & Legal", icon: FileText, desc: "Terms of Use and Privacy Policy" }
  ] as const;

  const fontSizes = {
    compact: { label: "Compact", size: "12px", desc: "Fits more content on screen" },
    default: { label: "Default", size: "14px", desc: "Standard text size recommendation" },
    comfortable: { label: "Comfortable", size: "16px", desc: "Easier reading for documents" },
    large: { label: "Large", size: "18px", desc: "Maximizes text visibility" }
  };

  const accentColors = {
    blue: { label: "Apple Blue", class: "bg-[#007AFF] border-[#006DE6]" },
    purple: { label: "Cyber Purple", class: "bg-[#a855f7] border-[#9333ea]" },
    emerald: { label: "Emerald Green", class: "bg-[#10b981] border-[#059669]" },
    amber: { label: "Amber Gold", class: "bg-[#f59e0b] border-[#d97706]" }
  };

  const glassPanelClass = "bg-[#0A0A0A]/40 backdrop-blur-[40px] rounded-[24px] lg:rounded-[32px] border border-white/[0.05] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden relative flex flex-col h-full";

  return (
    <div className="flex-1 w-full min-h-0 p-4 flex flex-col md:flex-row gap-4 overflow-hidden">
      {/* ── Left Sidebar (Options Navbar) ── */}
      <div className={`${glassPanelClass} w-full md:w-[280px] lg:w-[320px] shrink-0 p-6 flex flex-col gap-6`}>
        <div className="relative z-10">
          <h2 className="text-[20px] font-semibold text-white tracking-tight drop-shadow-sm">Settings</h2>
          <p className="text-[12px] text-slate-400 mt-1">Manage preferences & sync options</p>
        </div>

        {/* Sidebar Nav Items */}
        <div className="flex flex-col gap-1.5 flex-1 relative z-10">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setDeleteStep(0);
                }}
                className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-2xl transition-all text-left group relative ${
                  isActive
                    ? "bg-white/[0.04] text-white border border-white/[0.06] shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.15)]"
                    : "text-slate-400 hover:bg-white/[0.02] hover:text-white border border-transparent"
                }`}
              >
                <div className={`p-2 rounded-xl border shrink-0 transition-all ${
                  isActive 
                    ? "bg-blue-500/10 border-blue-500/20 text-blue-400" 
                    : "bg-white/[0.02] border-white/[0.04] text-slate-400 group-hover:text-white"
                }`}>
                  <Icon size={16} />
                </div>
                <div className="flex-1 min-w-0 pr-4">
                  <p className="text-[13px] font-bold tracking-tight">{tab.label}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5 truncate">{tab.desc}</p>
                </div>
                {isActive ? (
                  <ChevronRight size={13} className="text-blue-400 shrink-0" />
                ) : (
                  <ChevronRight size={13} className="text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                )}
              </button>
            );
          })}
        </div>
        
        {/* Sidebar Info Footer */}
        <div className="relative z-10 pt-4 border-t border-white/[0.04] flex items-center justify-between text-slate-500 text-[10.5px]">
          <span>ForgeX Settings v1.0.8</span>
          <span className="flex items-center gap-0.5"><ShieldCheck className="w-3.5 h-3.5 text-blue-400" /> Sec</span>
        </div>
      </div>

      {/* ── Right Content Window ── */}
      <div className={`${glassPanelClass} flex-1 p-6 md:p-8 flex flex-col justify-between`}>
        {/* Real Frosted Glass Texture Overlay */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1.5px)] [background-size:12px_12px] rounded-[24px] lg:rounded-[32px]" />

        <div className="relative z-10 flex-1 flex flex-col">
          <AnimatePresence mode="wait">
            {activeTab === "customize" && (
              <motion.div
                key="customize"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                className="flex flex-col gap-6 md:gap-8 flex-1"
              >
                <div>
                  <h2 className="text-[20px] font-bold text-white tracking-tight flex items-center gap-2.5">
                    <Sliders className="w-5 h-5 text-blue-450" /> Customization Options
                  </h2>
                  <p className="text-[12.5px] text-slate-400 mt-1">Configure layout sizing scale, visual palette, and haptics.</p>
                </div>

                {/* Font Sizing */}
                <div className="flex flex-col gap-3">
                  <label className="text-[13px] font-bold text-white flex items-center gap-2">
                    <Type className="w-4 h-4 text-slate-400" /> Font Sizing
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                    {(Object.keys(fontSizes) as Array<keyof typeof fontSizes>).map((sizeKey) => {
                      const item = fontSizes[sizeKey];
                      const isSel = fontSize === sizeKey;
                      return (
                        <button
                          key={sizeKey}
                          onClick={() => setFontSize(sizeKey)}
                          className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all active:scale-95 ${
                            isSel
                              ? "bg-white/[0.04] border-blue-500/50 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),_0_0_15px_rgba(59,130,246,0.15)] text-white"
                              : "bg-white/[0.01] border-white/[0.04] text-slate-400 hover:border-white/10"
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className="text-[12.5px] font-bold">{item.label}</span>
                            {isSel && <Check className="w-3.5 h-3.5 text-blue-400" />}
                          </div>
                          <span className="text-[10px] text-slate-500 mt-1 leading-normal">{item.size} — {item.desc}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Accent Colors */}
                <div className="flex flex-col gap-3">
                  <label className="text-[13px] font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-slate-400" /> Accent Palette
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                    {(Object.keys(accentColors) as Array<keyof typeof accentColors>).map((colorKey) => {
                      const item = accentColors[colorKey];
                      const isSel = accentColor === colorKey;
                      return (
                        <button
                          key={colorKey}
                          onClick={() => setAccentColor(colorKey)}
                          className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all active:scale-95 ${
                            isSel
                              ? "bg-white/[0.04] border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.05)] text-white"
                              : "bg-white/[0.01] border-white/[0.04] text-slate-400 hover:border-white/10"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className={`w-3.5 h-3.5 rounded-full border shadow-inner ${item.class}`} />
                            <span className="text-[12.5px] font-bold">{item.label}</span>
                          </div>
                          {isSel && <Check className="w-3.5 h-3.5 text-blue-400" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Toggles */}
                <div className="flex flex-col gap-3">
                  <label className="text-[13px] font-bold text-white flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-slate-400" /> Interface Controls
                  </label>
                  <div className="flex flex-col gap-3 bg-white/[0.01] border border-white/[0.04] rounded-2xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[13px] font-bold text-white">Micro-Animations</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">Enable smooth transitions and physical spring physics</p>
                      </div>
                      <button
                        onClick={() => setAnimationsEnabled(!animationsEnabled)}
                        className={`w-11 h-6 rounded-full transition-colors flex items-center p-0.5 relative z-10 ${
                          animationsEnabled ? "bg-blue-500" : "bg-white/10"
                        }`}
                      >
                        <motion.div
                          layout
                          className="w-5 h-5 rounded-full bg-white shadow-md"
                          animate={{ x: animationsEnabled ? 20 : 0 }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      </button>
                    </div>
                    <div className="h-[1px] bg-white/[0.04] w-full" />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[13px] font-bold text-white">Haptic & Interface Sounds</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">Subtle clicks when clicking buttons and toggles</p>
                      </div>
                      <button
                        onClick={() => setSoundEnabled(!soundEnabled)}
                        className={`w-11 h-6 rounded-full transition-colors flex items-center p-0.5 relative z-10 ${
                          soundEnabled ? "bg-blue-500" : "bg-white/10"
                        }`}
                      >
                        <motion.div
                          layout
                          className="w-5 h-5 rounded-full bg-white shadow-md"
                          animate={{ x: soundEnabled ? 20 : 0 }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "account" && (
              <motion.div
                key="account"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                className="flex flex-col gap-6 flex-1"
              >
                <div>
                  <h2 className="text-[20px] font-bold text-white tracking-tight flex items-center gap-2.5">
                    <User className="w-5 h-5 text-blue-400" /> Account Session
                  </h2>
                  <p className="text-[12.5px] text-slate-400 mt-1">Manage active logins and sign out of the current profile.</p>
                </div>

                <div className="bg-white/[0.01] border border-white/[0.06] rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
                  <div>
                    <h3 className="text-[13.5px] font-bold text-white flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-blue-400" /> Secure Encryption Active
                    </h3>
                    <p className="text-[11.5px] text-slate-500 mt-1 leading-relaxed">
                      Your profile session is active, protected, and fully synced in real-time with Firestore databases.
                    </p>
                  </div>
                  <div className="w-fit relative z-10 shrink-0">
                    <LogoutButton />
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "data" && (
              <motion.div
                key="data"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                className="flex flex-col gap-6 flex-1"
              >
                <div>
                  <h2 className="text-[20px] font-bold text-white tracking-tight flex items-center gap-2.5">
                    <Database className="w-5 h-5 text-blue-400" /> Privacy & Data
                  </h2>
                  <p className="text-[12.5px] text-slate-400 mt-1">Export profile logs, wipe history, or terminate account details.</p>
                </div>

                <div className="flex flex-col gap-4">
                  {/* Export Option */}
                  <div className="bg-white/[0.01] border border-white/[0.04] rounded-2xl p-4 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="text-[13px] font-bold text-white flex items-center gap-2">
                        <Download className="w-4 h-4 text-blue-400" /> Export Profile Data
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-normal">
                        Download a full JSON archive containing resume logs.
                      </p>
                    </div>
                    <button className="h-9 px-4 rounded-xl border border-white/10 hover:bg-white/[0.05] text-[12px] font-bold text-white flex items-center gap-1.5 transition-all shrink-0 active:scale-95">
                      Export
                    </button>
                  </div>

                  {/* Delete History */}
                  <div className="bg-white/[0.01] border border-white/[0.04] rounded-2xl p-4 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="text-[13px] font-bold text-white flex items-center gap-2">
                        <Trash2 className="w-4 h-4 text-orange-400" /> Clear Chat Logs
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-normal">
                        Permanently wipe messages across active connections.
                      </p>
                    </div>
                    <button className="h-9 px-4 rounded-xl border border-orange-500/20 bg-orange-500/5 hover:bg-orange-500/10 text-[12px] font-bold text-orange-400 flex items-center gap-1.5 transition-all shrink-0 active:scale-95">
                      Clear
                    </button>
                  </div>

                  {/* Nuclear Delete Account */}
                  <div className="bg-red-500/[0.01] border border-red-500/10 rounded-2xl p-4">
                    <h3 className="text-[13px] font-bold text-red-400 flex items-center gap-2 mb-1">
                      <AlertTriangle className="w-4 h-4" /> Terminate Profile
                    </h3>
                    <p className="text-[11px] text-slate-500 leading-normal mb-3">
                      Permanently delete your profile from ForgeX databases. This is irreversible.
                    </p>
                    {deleteStep === 0 ? (
                      <button
                        onClick={() => setDeleteStep(1)}
                        className="h-9 px-4 rounded-xl bg-red-650 hover:bg-red-700 text-[12px] font-bold text-white flex items-center gap-1.5 transition-all w-fit active:scale-95"
                      >
                        <Trash2 size={13} /> Delete Account
                      </button>
                    ) : (
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setDeleteStep(0)}
                          className="h-9 px-4 rounded-xl border border-white/10 text-[12px] text-white hover:bg-white/5 transition-all active:scale-95"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => {}}
                          className="h-9 px-4 rounded-xl bg-red-650 hover:bg-red-750 text-[12px] font-bold text-white flex items-center gap-1.5 transition-all shadow-[0_4px_15px_rgba(239,68,68,0.4)] active:scale-95"
                        >
                          Confirm Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "legal" && (
              <motion.div
                key="legal"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                className="flex flex-col gap-6 flex-1"
              >
                <div>
                  <h2 className="text-[20px] font-bold text-white tracking-tight flex items-center gap-2.5">
                    <FileText className="w-5 h-5 text-blue-400" /> Terms & Legal
                  </h2>
                  <p className="text-[12.5px] text-slate-400 mt-1">Review legal structures, privacy policies, and security outlines.</p>
                </div>

                <div className="bg-white/[0.01] border border-white/[0.06] rounded-2xl p-5 relative overflow-hidden flex flex-col h-[260px]">
                  <div className="overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] flex-1 flex flex-col gap-4 text-slate-400 text-[12.5px] leading-relaxed">
                    <div>
                      <h4 className="text-white font-bold mb-1">1. User Workspace & License Agreement</h4>
                      <p>
                        By utilizing the ForgeX AI Agent platform, you are granted a non-transferable, revocable license to deploy missions, analyze personal resume profiles, and communicate within connected workspace nodes.
                      </p>
                    </div>
                    <div>
                      <h4 className="text-white font-bold mb-1">2. Data Security & Storage Policies</h4>
                      <p>
                        All user profiles, chat messages, and connected sync databases are securely stored and synced utilizing Firebase Firestore instances. End-to-end securely isolated connections prevent cross-contamination.
                      </p>
                    </div>
                    <div>
                      <h4 className="text-white font-bold mb-1">3. Automated AI Agent Limits</h4>
                      <p>
                        Forge AI Agent capabilities (including Instant, Expert, and Corporate modes) are powered by advanced large language models. The platform maintains limits on concurrent requests to ensure smooth processing times across the nodes.
                      </p>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-[#0A0A0A] to-transparent pointer-events-none" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Specular glass reflection footer decoration */}
        <div className="h-[1px] bg-white/[0.04] w-full my-6 relative z-10" />
        <div className="relative z-10 flex items-center justify-between text-slate-550 text-[11px]">
          <span>ForgeX Cloud Sync</span>
          <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-blue-400" /> End-to-End Secure connection</span>
        </div>
      </div>
    </div>
  );
}
