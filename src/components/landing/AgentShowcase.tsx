"use client";

import { motion } from "framer-motion";

export default function AgentShowcase() {
  return (
    <section className="py-xxl px-md md:px-xl max-w-[1440px] mx-auto w-full relative z-10 my-xl">
      <div className="text-center mb-xl">
        <h2 className="font-title-md text-[32px] md:text-[40px] text-on-surface mb-sm tracking-tight font-semibold">
          Data Flow Orchestration
        </h2>
        <p className="font-body-lg text-[18px] text-secondary">
          Watch as raw inputs transform into optimized artifacts.
        </p>
      </div>

      <div className="relative max-w-[800px] mx-auto h-[400px] flex items-center justify-between">
        {/* Animated Connecting Lines SVG */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none -z-10" style={{ overflow: "visible" }}>
          <motion.path
            d="M 150 200 C 300 200, 300 100, 400 100"
            fill="transparent"
            stroke="rgba(124, 58, 237, 0.2)"
            strokeWidth="2"
          />
          <motion.path
            d="M 150 200 C 300 200, 300 300, 400 300"
            fill="transparent"
            stroke="rgba(124, 58, 237, 0.2)"
            strokeWidth="2"
          />
          <motion.path
            d="M 400 100 C 500 100, 500 200, 650 200"
            fill="transparent"
            stroke="rgba(124, 58, 237, 0.2)"
            strokeWidth="2"
          />
          <motion.path
            d="M 400 300 C 500 300, 500 200, 650 200"
            fill="transparent"
            stroke="rgba(124, 58, 237, 0.2)"
            strokeWidth="2"
          />

          {/* Particles running along paths */}
          <motion.circle r="4" fill="#8b5cf6" filter="blur(2px)">
            <animateMotion dur="2s" repeatCount="indefinite" path="M 150 200 C 300 200, 300 100, 400 100" />
          </motion.circle>
          <motion.circle r="4" fill="#8b5cf6" filter="blur(2px)">
            <animateMotion dur="2.5s" repeatCount="indefinite" path="M 150 200 C 300 200, 300 300, 400 300" />
          </motion.circle>
          <motion.circle r="4" fill="#8b5cf6" filter="blur(2px)">
            <animateMotion dur="1.8s" repeatCount="indefinite" path="M 400 100 C 500 100, 500 200, 650 200" />
          </motion.circle>
          <motion.circle r="4" fill="#8b5cf6" filter="blur(2px)">
            <animateMotion dur="2.2s" repeatCount="indefinite" path="M 400 300 C 500 300, 500 200, 650 200" />
          </motion.circle>
        </svg>

        {/* Nodes */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="w-[150px] h-[100px] glass-panel rounded-xl flex flex-col items-center justify-center border border-white/10"
        >
          <div className="font-mono-label text-[12px] text-secondary uppercase tracking-widest mb-1">Input</div>
          <div className="font-title-md text-[16px] text-on-surface">Raw Resume</div>
        </motion.div>

        <div className="flex flex-col gap-[100px]">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="w-[150px] h-[100px] bg-[#121212] rounded-xl flex flex-col items-center justify-center border border-primary/40 shadow-[0_0_30px_rgba(124,58,237,0.15)]"
          >
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse mb-2"></div>
            <div className="font-mono-label text-[12px] text-primary uppercase tracking-widest">Agent 01</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="w-[150px] h-[100px] bg-[#121212] rounded-xl flex flex-col items-center justify-center border border-primary/40 shadow-[0_0_30px_rgba(124,58,237,0.15)]"
          >
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse mb-2" style={{ animationDelay: "0.5s" }}></div>
            <div className="font-mono-label text-[12px] text-primary uppercase tracking-widest">Agent 02</div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="w-[150px] h-[100px] glass-panel rounded-xl flex flex-col items-center justify-center border border-white/10"
        >
          <div className="font-mono-label text-[12px] text-[#a3e635] uppercase tracking-widest mb-1">Output</div>
          <div className="font-title-md text-[16px] text-on-surface text-center">Optimized<br />Artifacts</div>
        </motion.div>

      </div>
    </section>
  );
}
