"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const WORDS = [
  "Resumes.",
  "Cover Letters.",
  "Interviews.",
  "Applications.",
];

const FONT_SIZE = "clamp(40px, 6vw, 76px)";
const SHARED_CLASS =
  "font-semibold leading-none tracking-[-0.03em]";

export default function AnimatedHeadline() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const id = setTimeout(
      () => setIdx((i) => (i + 1) % WORDS.length),
      2200
    );
    return () => clearTimeout(id);
  }, [idx]);

  return (
    <h1 className="mb-10 flex flex-col items-start gap-[2px]">

      {/* Line 1 — static "Forge" */}
      <div
        className={`${SHARED_CLASS} text-white`}
        style={{ fontSize: FONT_SIZE }}
      >
        Forge
      </div>

      {/* Line 2 — animated, fixed height to prevent layout shift */}
      <div
        className="relative overflow-hidden"
        style={{
          fontSize: FONT_SIZE,
          height: "clamp(40px, 6vw, 76px)",
          // wide enough for longest word so siblings never move
          minWidth: "min(560px, 90vw)",
        }}
        aria-live="polite"
        aria-atomic="true"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={idx}
            className={`${SHARED_CLASS} absolute inset-0 flex items-center text-white`}
            style={{ fontSize: FONT_SIZE }}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={{
              hidden: { opacity: 0 },
              visible: { 
                opacity: 1, 
                transition: { staggerChildren: 0.04 } 
              },
              exit: { 
                opacity: 0, 
                transition: { staggerChildren: 0.02, staggerDirection: -1 } 
              }
            }}
          >
            {WORDS[idx].split("").map((char, i) => (
              <motion.span
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 20, filter: "blur(6px)" },
                  visible: { 
                    opacity: 1, 
                    y: 0, 
                    filter: "blur(0px)", 
                    transition: { ease: [0.22, 1, 0.36, 1], duration: 0.6 } 
                  },
                  exit: { 
                    opacity: 0, 
                    y: -15, 
                    filter: "blur(4px)", 
                    transition: { ease: [0.22, 1, 0.36, 1], duration: 0.4 } 
                  }
                }}
                style={{ display: "inline-block", whiteSpace: "pre", willChange: "transform, opacity, filter" }}
              >
                {char}
              </motion.span>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Line 3 — "Powered by AI." with 60fps CSS Magnification */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative mt-1 inline-block"
      >
        <style>{`
          @keyframes smoothClipSweep {
            0%   { clip-path: circle(0px at 50% 50%); -webkit-clip-path: circle(0px at 50% 50%); }
            15%  { clip-path: circle(80px at 0% 50%); -webkit-clip-path: circle(80px at 0% 50%); }
            65%  { clip-path: circle(80px at 100% 50%); -webkit-clip-path: circle(80px at 100% 50%); }
            85%  { clip-path: circle(80px at 50% 50%); -webkit-clip-path: circle(80px at 50% 50%); }
            100% { clip-path: circle(0px at 50% 50%); -webkit-clip-path: circle(0px at 50% 50%); }
          }
          .animate-clip-sweep {
            animation: smoothClipSweep 6s ease-in-out infinite;
          }
        `}</style>

        {/* Layer 1: Base Text (Slightly dimmed) */}
        <div
          className={`${SHARED_CLASS} relative z-0 text-white/50 py-2`}
          style={{
            fontSize: "clamp(40px, 6vw, 76px)",
          }}
        >
          Powered by AI.
        </div>

        {/* Layer 2: Magnified Text (60fps Native CSS Masking) */}
        <div className="absolute inset-0 z-10 pointer-events-none animate-clip-sweep">
          <div
            className={`${SHARED_CLASS} text-white py-2`}
            style={{
              fontSize: "clamp(40px, 6vw, 76px)",
              textShadow: "0 0 15px rgba(255,255,255,0.6), 0 0 30px rgba(168,136,255,0.4)", // Strong optical glow
            }}
          >
            Powered by AI.
          </div>
        </div>

      </motion.div>
    </h1>
  );
}
