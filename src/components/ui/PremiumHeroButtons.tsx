"use client";

import React from "react";
import Link from "next/link";

// A perfectly glassy pill button with a continuous 1px glowing edge
// Using Tailwind's built-in animate-spin to avoid custom keyframe caching bugs.
function GlassPillButton({
  href,
  children,
  dim = false,
  spinDuration = "3s",
  spinColor = "rgba(255,255,255,0.6)",
}: {
  href: string;
  children: React.ReactNode;
  dim?: boolean;
  spinDuration?: string;
  spinColor?: string;
}) {
  return (
    <div className="relative flex items-center bg-white/[0.02] backdrop-blur-md rounded-full p-[6px] shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)] group">
      
      {/* 1. Static border to perfectly match the Nav items (border-white/[0.04]) */}
      <div className="absolute inset-0 rounded-full border border-white/[0.04] pointer-events-none" />

      {/* 2. Animated Edge Glow */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          padding: "1px", // Border thickness
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "exclude",
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
        }}
      >
        {/* The rotating gradient - using standard Tailwind animate-spin */}
        <div 
          className="absolute top-1/2 left-1/2 w-[200%] aspect-square -translate-x-1/2 -translate-y-1/2"
        >
          <div
            className="w-full h-full animate-spin"
            style={{
              animationDuration: spinDuration,
              background: `conic-gradient(from 0deg, transparent 0%, ${spinColor} 15%, transparent 30%)`,
            }}
          />
        </div>
      </div>

      {/* 3. Button Content */}
      <Link
        href={href}
        className={`relative flex items-center justify-center gap-1.5 px-5 py-2 text-[14px] font-medium transition-colors duration-300 rounded-full z-10 ${
          dim ? "text-[#999999] hover:text-white" : "text-white/90 hover:text-white"
        }`}
      >
        {/* Hover glass highlight - identical to Nav */}
        <span className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 realistic-glass-pill -z-10" />
        {children}
      </Link>
    </div>
  );
}

export default function PremiumHeroButtons() {
  return (
    <div className="flex flex-row items-center gap-3 mt-8">
      {/* Primary — Start Forging */}
      <GlassPillButton
        href="/workspace"
        spinColor="rgba(255,255,255,0.7)"
        spinDuration="3s"
      >
        <span className="relative z-20">Start Forging</span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          className="relative z-20 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-300"
        >
          <path
            d="M5 12H19M19 12L12 5M19 12L12 19"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </GlassPillButton>

      {/* Secondary — View Demo */}
      <GlassPillButton
        href="#"
        spinColor="rgba(255,255,255,0.7)"
        spinDuration="4s"
      >
        <svg
          width="11"
          height="11"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="relative z-20 opacity-60 group-hover:opacity-100 transition-opacity duration-300"
        >
          <path d="M8 5V19L19 12L8 5Z" />
        </svg>
        <span className="relative z-20">View Demo</span>
      </GlassPillButton>
    </div>
  );
}
