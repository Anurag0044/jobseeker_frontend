"use client";

import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import AuthCard from "../../components/auth/AuthCard";
import AuthBackgroundEffects from "../../components/auth/AuthBackgroundEffects";

export default function SignInPage() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      if (video.duration && video.currentTime >= video.duration * 0.98) {
        video.pause();
      }
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    return () => video.removeEventListener("timeupdate", handleTimeUpdate);
  }, []);

  return (
    <div className="relative flex w-full h-screen overflow-hidden bg-[#050505] text-white">
      {/* Noise overlay - global */}
      <div className="absolute inset-0 z-0 opacity-[0.015] pointer-events-none mix-blend-overlay bg-[url('data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjAwIDIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJub2lzZUZpbHRlciI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuNjUiIG51bU9jdGF2ZXM9IjMiIHN0aXRjaFRpbGVzPSJzdGl0Y2giLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ0cmFuc3BhcmVudCIvPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNub2lzZUZpbHRlcikiIG9wYWNpdHk9IjEiLz48L3N2Zz4=')]"></div>

      {/* Left Side: Brand Experience (60%) */}
      <div className="relative hidden lg:flex flex-col justify-center w-[60%] h-full p-20 z-10">
        {/* Smooth Blend Gradient into Right Side */}
        <div className="absolute inset-y-0 right-0 w-64 bg-gradient-to-l from-[#050505] to-transparent z-20 pointer-events-none"></div>

        {/* Background Energy Wave — Smart Scaling to prevent tearing */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-[#050505]">
          <video 
            ref={videoRef}
            src="/purple-arc.mp4" 
            autoPlay 
            muted 
            playsInline
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000"
            style={{ willChange: "transform" }}
          />
          
          {/* Micro-noise layer: The smart way to hide video upscaling/tearing artifacts on large screens */}
          <div className="absolute inset-0 bg-noise opacity-[0.03] mix-blend-overlay" />

          {/* Edge vignette only — blends arc into the dark background */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_40%_50%,transparent_20%,#050505_75%)]"></div>
        </div>

        {/* Content Container */}
        <div className="relative z-10 max-w-2xl mt-auto pt-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          >
            <h1 className="text-5xl lg:text-[72px] font-semibold tracking-[-0.04em] leading-[1.05] mb-0">
              <span className="block bg-gradient-to-b from-white via-white/90 to-white/60 bg-clip-text text-transparent">
                Let&apos;s keep
              </span>
              <span className="block bg-gradient-to-b from-white via-white/90 to-white/60 bg-clip-text text-transparent">
                forging.
              </span>
            </h1>
          </motion.div>

          <div className="flex items-center gap-6 mt-10">
            {["Applications", "Insights", "Opportunities"].map((word, idx) => (
              <motion.span
                key={word}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.6 + idx * 0.15,
                  duration: 0.7,
                  ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
                }}
                className="text-[17px] tracking-[0.12em] uppercase font-medium text-white/40"
              >
                {word}{idx < 2 && <span className="ml-6 text-violet-500/50">·</span>}
              </motion.span>
            ))}
          </div>
        </div>


      </div>

      {/* Right Side: Authentication Card (40%) */}
      <div className="relative flex-1 lg:w-[40%] h-full flex items-center justify-center p-6 sm:p-12 z-10 bg-[#050505] overflow-y-auto">
        {/* Right side background effects */}
        <AuthBackgroundEffects />

        <div className="w-full relative z-10 pt-10 pb-10">
          <AuthCard />
        </div>
      </div>
    </div>
  );
}
