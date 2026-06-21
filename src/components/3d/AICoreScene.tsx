"use client";

import React, { useEffect, useRef, useState } from "react";

export default function AICoreScene() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoSrc, setVideoSrc] = useState("/hero-bg-loop.mp4");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Desktop (≥1024px) → load true 4K source (3840×2160)
    // Mobile → keep optimized 800×450 to save bandwidth
    const mq = window.matchMedia("(min-width: 1024px)");

    const pick = (e: MediaQueryListEvent | MediaQueryList) => {
      setVideoSrc(e.matches ? "/hero-bg-loop-4k.mp4" : "/hero-bg-loop.mp4");
      setIsReady(false); // reset fade while new source loads
    };

    pick(mq);
    mq.addEventListener("change", pick);
    return () => mq.removeEventListener("change", pick);
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.load();
    v.play().catch(() => { });
  }, [videoSrc]);

  return (
    <div className="absolute inset-0 w-full h-full z-0 pointer-events-none overflow-hidden bg-[#050505]">
      {/* Video — NO filters, NO blend modes, NO scale.
          The 4K source downscales on 1080p screens = razor-sharp.
          Colors, glow, and background are 100 % identical to the original asset. */}
      <video
        key={videoSrc}
        ref={videoRef}
        src={videoSrc}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        onCanPlay={() => setIsReady(true)}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-out ${isReady ? "opacity-100" : "opacity-0"
          }`}
        style={{
          willChange: "transform",
          transform: "translateZ(0)",          /* GPU-composited layer   */
          backfaceVisibility: "hidden",        /* prevent sub-pixel jitter */
        }}
      />

      {/* Subtle grid texture */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.08] mix-blend-overlay pointer-events-none" />

      {/* Edge vignette — gentle fade into the #050505 background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 30%, rgba(5,5,5,0.45) 70%, #050505 100%)",
        }}
      />
    </div>
  );
}

