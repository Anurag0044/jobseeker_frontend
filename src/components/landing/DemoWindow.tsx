"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link2 } from "lucide-react";

export default function DemoWindow() {
  const [atsScore, setAtsScore] = useState(0);

  useEffect(() => {
    // Animate ATS score
    let score = 0;
    const interval = setInterval(() => {
      if (score < 92) {
        score += Math.floor(Math.random() * 5) + 1;
        if (score > 92) score = 92;
        setAtsScore(score);
      } else {
        clearInterval(interval);
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
      className="py-xl px-md md:px-xl max-w-[1440px] mx-auto w-full relative z-10"
    >
      <div className="w-full max-w-[64rem] glass-panel rounded-xl overflow-hidden relative shadow-[0_24px_80px_rgba(0,0,0,0.4)] mx-auto border border-white/10 group">

        {/* Glow effect */}
        <div className="absolute -top-[100px] left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-primary/20 rounded-full blur-[80px] pointer-events-none opacity-50 group-hover:opacity-80 transition-opacity duration-700" />

        {/* Window Header */}
        <div className="h-12 bg-[#1A1A1A]/80 backdrop-blur-md flex items-center px-md border-b border-white/5 gap-2 sticky top-0 z-20">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56] hover:bg-[#ff5f56]/80 cursor-pointer"></div>
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e] hover:bg-[#ffbd2e]/80 cursor-pointer"></div>
            <div className="w-3 h-3 rounded-full bg-[#27c93f] hover:bg-[#27c93f]/80 cursor-pointer"></div>
          </div>
          <div className="mx-auto flex items-center gap-sm bg-[#050505] px-4 py-1.5 rounded-md border border-white/5 shadow-inner">
            <Link2 className="w-3.5 h-3.5 text-secondary" />
            <span className="font-mono-label text-[12px] text-secondary">workspace.forge</span>
          </div>
        </div>

        {/* Window Content */}
        <div className="p-0 grid grid-cols-1 md:grid-cols-4 gap-0 bg-[#0A0A0A]/90 min-h-[450px]">

          {/* Sidebar */}
          <div className="col-span-1 hidden md:flex flex-col gap-sm border-r border-white/5 p-lg">
            <div className="font-label-caps text-[11px] text-secondary mb-sm tracking-widest">Active Agents</div>
            <motion.div
              whileHover={{ x: 4 }}
              className="flex items-center gap-sm p-sm rounded-md bg-[#1A1A1A] border border-primary/20 cursor-pointer"
            >
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="font-mono-label text-[13px] text-on-surface">Job Analyzer</span>
            </motion.div>
            <motion.div
              whileHover={{ x: 4 }}
              className="flex items-center gap-sm p-sm rounded-md hover:bg-[#1A1A1A]/50 border border-transparent cursor-pointer opacity-60"
            >
              <div className="w-2 h-2 rounded-full bg-secondary" />
              <span className="font-mono-label text-[13px] text-secondary">Resume Opt</span>
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="col-span-1 md:col-span-3 flex flex-col p-lg relative overflow-hidden">
            <div className="flex justify-between items-center mb-xl">
              <div className="font-title-md text-[18px] text-on-surface font-medium">Apple - Senior UX Engineer</div>
              <div className="flex items-center gap-sm border border-primary/30 bg-primary/10 px-sm py-xs rounded-md">
                <span className="font-mono-label text-[13px] text-primary">ATS Score: {atsScore}%</span>
              </div>
            </div>

            {/* Terminal Area */}
            <div className="flex-1 bg-[#050505] border border-white/5 rounded-lg p-md relative overflow-hidden font-mono-label text-[13px]">
              <div className="flex flex-col gap-sm text-secondary">
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <span className="text-primary">{">"}</span> Initializing ForgeX Engine v2.1.0...
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2 }}
                >
                  <span className="text-primary">{">"}</span> Parsing target description (jobs.apple.com/...)
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 2.0 }}
                >
                  <span className="text-primary">{">"}</span> Extracted 42 key entities. Analyzing gap...
                </motion.div>

                {/* Animated Progress Bars */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.5 }}
                  className="mt-4 flex flex-col gap-3"
                >
                  <div className="flex gap-md items-center">
                    <div className="w-24 text-right text-on-surface-variant">Keywords</div>
                    <div className="h-1 bg-[#1A1A1A] flex-1 rounded overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "85%" }}
                        transition={{ delay: 2.8, duration: 1 }}
                        className="h-full bg-primary"
                      />
                    </div>
                  </div>
                  <div className="flex gap-md items-center">
                    <div className="w-24 text-right text-on-surface-variant">Structure</div>
                    <div className="h-1 bg-[#1A1A1A] flex-1 rounded overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "94%" }}
                        transition={{ delay: 3.2, duration: 1 }}
                        className="h-full bg-primary"
                      />
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Scanline Effect */}
              <div className="absolute left-0 top-0 w-full h-[2px] bg-primary/30 shadow-[0_0_10px_rgba(124,58,237,0.5)] animate-scan blur-[1px]"></div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
