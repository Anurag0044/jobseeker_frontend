"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Bot, Code } from "lucide-react";

const TYPING_SPEED = 25; // ms per character

export default function AgentXDemo() {
  const [step, setStep] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const fullText = "Analyzing job requirements... Found 4 critical keywords missing from your resume. Suggesting structural edits to bypass ATS filters. Here is the optimized summary:";

  // Typing effect
  useEffect(() => {
    if (step === 1) {
      let i = 0;
      setDisplayedText("");
      const timer = setInterval(() => {
        setDisplayedText(fullText.substring(0, i));
        i++;
        if (i > fullText.length) {
          clearInterval(timer);
          setTimeout(() => setStep(2), 500); // Move to next step
        }
      }, TYPING_SPEED);
      return () => clearInterval(timer);
    }
  }, [step]);

  // Restart loop
  useEffect(() => {
    if (step === 2) {
      const timer = setTimeout(() => {
        setStep(0);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  // Trigger step 1
  useEffect(() => {
    if (step === 0) {
      const timer = setTimeout(() => {
        setStep(1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  return (
    <div className="w-full max-w-2xl mx-auto rounded-2xl overflow-hidden shadow-2xl relative border border-white/10 group">
      {/* Background */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-xl -z-10" />
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent -z-10" />
      
      {/* Glowing animated orb behind */}
      <div className="absolute -top-32 -right-32 w-64 h-64 bg-indigo-500/30 blur-[100px] rounded-full pointer-events-none group-hover:bg-indigo-500/40 transition-colors duration-1000" />
      <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-purple-500/20 blur-[100px] rounded-full pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/[0.02]">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
        </div>
        <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full border border-white/5">
          <Bot size={14} className="text-indigo-400" />
          <span className="text-xs font-medium text-slate-300">AgentX Engine</span>
        </div>
        <div className="w-12" /> {/* Spacer for centering */}
      </div>

      {/* Chat Area */}
      <div className="p-6 flex flex-col gap-6 min-h-[300px]">
        
        {/* User Prompt */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-end"
        >
          <div className="bg-white/10 border border-white/10 px-4 py-3 rounded-2xl rounded-tr-sm max-w-[85%] backdrop-blur-sm shadow-sm">
            <p className="text-[14px] text-white">Optimize my resume for the Senior UX Engineer role at Apple.</p>
          </div>
        </motion.div>

        {/* AI Response */}
        <AnimatePresence>
          {step > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start gap-4"
            >
              <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0 mt-1 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                <Sparkles size={14} className="text-indigo-300" />
              </div>
              
              <div className="flex flex-col gap-3 w-full">
                <div className="bg-transparent text-[14px] text-slate-300 leading-relaxed min-h-[60px]">
                  {displayedText}
                  {step === 1 && (
                    <motion.span
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ repeat: Infinity, duration: 0.8 }}
                      className="inline-block w-1.5 h-4 ml-1 bg-indigo-400 align-middle"
                    />
                  )}
                </div>

                {/* Simulated generated UI Component */}
                {step === 2 && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 rounded-xl border border-indigo-500/20 bg-indigo-500/5 backdrop-blur-sm mt-2 relative overflow-hidden"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Code size={16} className="text-indigo-400" />
                      <span className="text-xs font-bold text-white uppercase tracking-wider">Optimized Summary</span>
                    </div>
                    <p className="text-[13px] text-slate-300 font-medium">
                      Visionary UX Engineer with 5+ years of experience bridging the gap between design and engineering. Proven track record of delivering pixel-perfect, accessible, and performant interfaces for millions of users.
                    </p>
                    <div className="mt-4 flex gap-2">
                      <span className="text-[10px] px-2 py-1 rounded-md bg-green-500/10 text-green-400 border border-green-500/20 font-mono shadow-sm">+ Accessibility</span>
                      <span className="text-[10px] px-2 py-1 rounded-md bg-green-500/10 text-green-400 border border-green-500/20 font-mono shadow-sm">+ Performance</span>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
