"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import AgentXDemo from "./AgentXDemo";

export default function ScrollShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track scroll progress through this container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // 3D rotation transforms: Starts tilted back, flattens out
  const rotateX = useTransform(scrollYProgress, [0, 0.4, 0.8], [30, 0, -10]);
  
  // Scale transforms: Starts small, scales up to normal size
  const scale = useTransform(scrollYProgress, [0, 0.4, 1], [0.8, 1, 0.95]);

  // Opacity transforms
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.6, 0.9], [0, 1, 1, 0]);

  // Y-axis translation for parallax
  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  return (
    <div 
      ref={containerRef} 
      className="relative min-h-[150vh] w-full flex justify-center pt-32 pb-48"
      style={{ perspective: "1500px" }}
    >
      {/* Background glowing lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none flex justify-center">
        <div className="w-[1px] h-full bg-gradient-to-b from-transparent via-indigo-500/20 to-transparent" />
      </div>

      <motion.div
        className="sticky top-32 w-full max-w-[1200px] px-6 mx-auto flex flex-col items-center z-10"
        style={{
          rotateX,
          scale,
          opacity,
          y,
          transformStyle: "preserve-3d",
        }}
      >
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
            <span className="text-[12px] font-medium text-indigo-300 tracking-widest uppercase font-mono">AgentX Engine</span>
          </motion.div>
          <h2 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 mb-6 drop-shadow-sm">
            AI that works for you.
          </h2>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-medium">
            Watch AgentX instantly analyze, rebuild, and optimize your career artifacts to bypass modern ATS filters.
          </p>
        </div>

        {/* The 3D Mockup Container */}
        <div className="w-full relative group">
          {/* Ambient Glow */}
          <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-indigo-500/20 blur-3xl opacity-50 group-hover:opacity-80 transition-opacity duration-1000 -z-20" />
          
          {/* Glass Wrapper around the AgentX Demo */}
          <div className="w-full rounded-[32px] p-2 bg-white/[0.02] border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.8)] backdrop-blur-3xl relative overflow-hidden">
            {/* Glossy highlight line */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            
            {/* The actual demo content */}
            <div className="w-full rounded-[24px] overflow-hidden bg-black/80 relative">
              <AgentXDemo />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
