"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Building2, Hexagon, BellRing, ArrowRight, CheckCircle2 } from "lucide-react";

export default function CompaniesPage() {
  const [notified, setNotified] = useState(false);

  return (
    <div className="relative w-full h-[calc(100vh-2rem)] flex flex-col items-center justify-center overflow-hidden bg-transparent">
      {/* Premium Ambient Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[750px] bg-gradient-to-br from-blue-600/20 via-purple-600/10 to-transparent blur-[140px] rounded-full pointer-events-none" />

      {/* Extremely faint grid for subtle depth */}
      <div 
        className="absolute inset-0 opacity-[0.012] pointer-events-none" 
        style={{ backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)', backgroundSize: '64px 64px' }} 
      />

      {/* Main Container */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex flex-col items-center text-center w-[480px] max-w-[90%] p-8 md:p-12 rounded-[32px] bg-white/[0.02] border border-white/[0.15] backdrop-blur-[80px] shadow-[inset_0_2px_3px_rgba(255,255,255,0.3),_0_32px_64px_-16px_rgba(0,0,0,0.8)] overflow-hidden"
      >
        {/* Real Frosted Glass Texture Overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1.5px)] [background-size:10px_10px] rounded-[32px]" />
        
        {/* Realistic diagonal refraction highlight */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.02] to-transparent pointer-events-none rounded-[32px]" />
        {/* Top Badge */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.05] border border-white/[0.12] backdrop-blur-xl shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.2)]"
        >
          <Hexagon size={14} className="text-blue-400 animate-pulse" />
          <span className="text-[12px] font-semibold tracking-widest text-white/70 uppercase">In Development</span>
        </motion.div>

        {/* Hero Icon */}
        <motion.div 
          initial={{ scale: 0.8, filter: "blur(10px)" }}
          animate={{ scale: 1, filter: "blur(0px)" }}
          transition={{ delay: 0.1, duration: 0.8, type: "spring", bounce: 0.4 }}
          className="relative mb-8"
        >
          <div className="absolute inset-0 bg-blue-500/20 blur-[35px] rounded-full" />
          <div className="w-20 h-20 rounded-2xl bg-white/[0.04] border border-white/[0.15] shadow-[inset_0_2px_4px_rgba(255,255,255,0.25),0_10px_20px_rgba(0,0,0,0.4)] flex items-center justify-center backdrop-blur-xl relative z-10">
            <Building2 size={36} strokeWidth={1.5} className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
          </div>
        </motion.div>

        {/* Typography */}
        <h1 className="text-[36px] font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 tracking-tight leading-[1.15] mb-4 w-full">
          The future of <br /> company discovery.
        </h1>
        
        <p className="text-[14.5px] text-[#A1A1AA] leading-relaxed w-full mb-10 font-medium">
          We are building a highly curated, deeply integrated ecosystem where you can explore company cultures, inner workings, and exclusive open roles.
        </p>

        {/* Action Button */}
        <motion.button
          onClick={() => setNotified(true)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`group relative h-12 rounded-full px-8 flex items-center justify-center gap-3 text-[14px] font-semibold transition-all duration-300 w-full ${
            notified 
            ? "bg-white/[0.05] border border-white/10 text-white shadow-none" 
            : "bg-white text-black hover:bg-white/90 shadow-[0_0_40px_rgba(255,255,255,0.2)]"
          }`}
        >
          {notified ? (
            <>
              <CheckCircle2 size={16} className="text-blue-400" />
              <span>You're on the list</span>
            </>
          ) : (
            <>
              <BellRing size={16} />
              <span>Notify me when it's live</span>
              <ArrowRight size={16} className="opacity-50 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </motion.button>
      </motion.div>
    </div>
  );
}
