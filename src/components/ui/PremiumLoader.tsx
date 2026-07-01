"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function PremiumLoader({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Elegant timing: 2.3 seconds to play animations, then start the exit fade
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ 
              opacity: 0,
              transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
            }}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#010105] select-none"
            style={{ pointerEvents: "all" }}
          >
            {/* Ambient Background Radial Glow (Cinematic breath) */}
            <motion.div 
              initial={{ opacity: 0.3, scale: 0.9 }}
              animate={{ 
                opacity: [0.3, 0.6, 0.3],
                scale: [0.9, 1.05, 0.9]
              }}
              transition={{
                duration: 3,
                ease: "easeInOut",
                repeat: Infinity
              }}
              className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.06)_0%,transparent_60%)] pointer-events-none" 
            />

            <div className="relative flex items-center justify-center gap-0">
              {/* Logo SVG (F) */}
              <div className="relative w-16 h-16 md:w-20 md:h-20 shrink-0">
                
                {/* Soft ambient back-glow behind logo */}
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ 
                    scale: [0.85, 1.05, 0.85], 
                    opacity: [0.05, 0.2, 0.05],
                  }}
                  transition={{ 
                    duration: 2.2, 
                    ease: "easeInOut",
                    repeat: Infinity
                  }}
                  className="absolute inset-[-20%] rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 blur-xl"
                />

                <svg
                  viewBox="0 0 100 100"
                  className="relative z-10 w-full h-full drop-shadow-[0_0_25px_rgba(99,102,241,0.35)]"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient id="loader-top-arm" x1="38" y1="10" x2="82" y2="30" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#d8cbf5" />
                      <stop offset="100%" stopColor="#9b7ee0" />
                    </linearGradient>
                    <linearGradient id="loader-mid-arm" x1="38" y1="42" x2="66" y2="62" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#c5b2ef" />
                      <stop offset="100%" stopColor="#8762d6" />
                    </linearGradient>
                    <linearGradient id="loader-top-spine" x1="18" y1="10" x2="38" y2="42" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#e8defa" />
                      <stop offset="100%" stopColor="#a388e6" />
                    </linearGradient>
                    <linearGradient id="loader-bot-spine" x1="18" y1="42" x2="38" y2="90" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#b49be8" />
                      <stop offset="100%" stopColor="#7c53cc" />
                    </linearGradient>
                  </defs>

                  {/* Top Spine (Animated draw path) */}
                  <motion.path
                    d="M 18 10 L 38 10 L 38 42 L 18 42 Z"
                    fill="url(#loader-top-spine)"
                    stroke="#ffffff"
                    strokeWidth="0.5"
                    strokeOpacity="0.4"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
                  />

                  {/* Bottom Spine (Animated draw path) */}
                  <motion.path
                    d="M 18 42 L 38 42 L 38 70 L 18 90 Z"
                    fill="url(#loader-bot-spine)"
                    stroke="#ffffff"
                    strokeWidth="0.5"
                    strokeOpacity="0.4"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1.3, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                  />

                  {/* Top Arm (Animated draw path) */}
                  <motion.path
                    d="M 38 10 L 82 10 L 62 30 L 38 30 Z"
                    fill="url(#loader-top-arm)"
                    stroke="#ffffff"
                    strokeWidth="0.5"
                    strokeOpacity="0.4"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1.3, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  />

                  {/* Middle Arm (Animated draw path) */}
                  <motion.path
                    d="M 38 42 L 66 42 L 46 62 L 38 62 Z"
                    fill="url(#loader-mid-arm)"
                    stroke="#ffffff"
                    strokeWidth="0.5"
                    strokeOpacity="0.4"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1.1, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
                  />
                </svg>
              </div>

              {/* Text wordmark reveal (Slide horizontally next to F icon) */}
              <div className="overflow-hidden h-12 md:h-16 flex items-center relative -ml-2.5 md:-ml-3.5 pr-2 pt-1 md:pt-2">
                <motion.div
                  initial={{ x: "-30px", opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.9, delay: 0.75, ease: [0.16, 1, 0.3, 1] }}
                  className="font-display-xl text-[34px] md:text-[42px] tracking-tight flex items-center leading-none"
                >
                  <span className="text-white font-medium">orge</span>
                  <span className="text-[#e2d5c5] font-semibold relative transition-all duration-300 ml-[1px]">
                    X
                    <span className="absolute inset-0 bg-[#e2d5c5] blur-md opacity-25"></span>
                  </span>
                </motion.div>
              </div>
            </div>


            {/* Micro loading progress line at the bottom */}
            <div className="absolute bottom-16 w-32 h-[1px] bg-white/[0.06] rounded-full overflow-hidden">
              <motion.div
                initial={{ left: "-100%" }}
                animate={{ left: "100%" }}
                transition={{ duration: 1.6, ease: "easeInOut", repeat: Infinity }}
                className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-indigo-400 to-transparent"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main app content entrance animation (Scale & Fade reveal like Apple) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.985 }}
        animate={loading ? {} : { 
          opacity: 1, 
          scale: 1,
          transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1] }
        }}
        className="flex-1 flex flex-col w-full h-full min-h-screen"
      >
        {children}
      </motion.div>
    </>
  );
}
