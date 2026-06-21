"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "../../lib/utils";
import Link from "next/link";

export default function ForgeXLogo({ className }: { className?: string }) {
  const { scrollY } = useScroll();
  
  // Use exact width for "orge" (roughly 52px at 24px font size) to prevent layout jumping
  // Animating width directly instead of maxWidth gives a perfectly linear 60fps scroll translation
  // We use a longer scroll range [0, 250] so it feels slow, deliberate, and smooth as butter
  const orgeWidth = useTransform(scrollY, [0, 250], ["52px", "0px"]);
  const orgeOpacity = useTransform(scrollY, [0, 250], [1, 0]);

  return (
    <Link
      href="/"
      className={cn("relative flex items-center cursor-pointer group select-none", className)}
    >
      {/* Container for the F Icon */}
      <div className="relative w-9 h-9 flex items-center justify-center shrink-0">
        
        {/* Subtle glow behind the icon on hover */}
        <div className="absolute inset-0 bg-[#b19cd9]/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        {/* The Exact Geometric 'F' SVG */}
        <svg 
          viewBox="0 0 100 100" 
          className="relative z-10 w-full h-full drop-shadow-lg transition-transform duration-500 group-hover:scale-105"
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Gradients to simulate 3D bevel and lighting */}
            <linearGradient id="f-grad-top-arm" x1="38" y1="10" x2="82" y2="30" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#d8cbf5" />
              <stop offset="100%" stopColor="#9b7ee0" />
            </linearGradient>
            <linearGradient id="f-grad-mid-arm" x1="38" y1="42" x2="66" y2="62" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#c5b2ef" />
              <stop offset="100%" stopColor="#8762d6" />
            </linearGradient>
            <linearGradient id="f-grad-top-spine" x1="18" y1="10" x2="38" y2="42" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#e8defa" />
              <stop offset="100%" stopColor="#a388e6" />
            </linearGradient>
            <linearGradient id="f-grad-bot-spine" x1="18" y1="42" x2="38" y2="90" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#b49be8" />
              <stop offset="100%" stopColor="#7c53cc" />
            </linearGradient>

            {/* Inner shadows for bevel effect */}
            <filter id="bevel" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="1" dy="1" stdDeviation="1" floodColor="#ffffff" floodOpacity="0.4" />
              <feDropShadow dx="-1" dy="-1" stdDeviation="1" floodColor="#000000" floodOpacity="0.3" />
            </filter>
          </defs>

          {/* Top Arm */}
          <motion.path
            d="M 38 10 L 82 10 L 62 30 L 38 30 Z"
            fill="url(#f-grad-top-arm)"
            stroke="#ffffff"
            strokeWidth="0.5"
            strokeOpacity="0.3"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          />

          {/* Middle Arm */}
          <motion.path
            d="M 38 42 L 66 42 L 46 62 L 38 62 Z"
            fill="url(#f-grad-mid-arm)"
            stroke="#ffffff"
            strokeWidth="0.5"
            strokeOpacity="0.3"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          />

          {/* Top Spine */}
          <motion.path
            d="M 18 10 L 38 10 L 38 42 L 18 42 Z"
            fill="url(#f-grad-top-spine)"
            stroke="#ffffff"
            strokeWidth="0.5"
            strokeOpacity="0.3"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          />

          {/* Bottom Spine */}
          <motion.path
            d="M 18 42 L 38 42 L 38 70 L 18 90 Z"
            fill="url(#f-grad-bot-spine)"
            stroke="#ffffff"
            strokeWidth="0.5"
            strokeOpacity="0.3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          />
        </svg>
      </div>

      {/* Typography Wordmark */}
      <div className="font-display-xl text-[24px] tracking-tight flex items-center relative z-10 pt-1 -ml-2">
        <span className="text-white font-medium group-hover:text-gray-100 transition-colors flex items-center">
          <motion.span
            style={{ width: orgeWidth, opacity: orgeOpacity }}
            className="inline-flex overflow-hidden whitespace-nowrap items-center"
          >
            orge
          </motion.span>
        </span>
        <span 
          className="text-[#e2d5c5] font-semibold relative transition-all duration-500 group-hover:[text-shadow:0_0_20px_rgba(226,213,197,0.9),_0_0_10px_rgba(226,213,197,0.4)]"
        >
          X
          {/* Intense hover glow for X */}
          <div className="absolute inset-0 bg-[#e2d5c5] blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
        </span>
      </div>
    </Link>
  );
}
