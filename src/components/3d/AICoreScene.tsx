"use client";

import React, { useRef, useEffect } from "react";

export default function AICoreScene() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Ensure the video plays immediately
    video.play().catch((err) => {
      console.warn("Autoplay was blocked or failed, retrying on interaction:", err);
    });
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full z-0 overflow-hidden bg-[#050505]">
      {/* Just the raw video, no illusions or blending layers */}
      <video
        ref={videoRef}
        src="/particle-wave-seamless.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      />

      {/* Massive seamless bottom fade to blend into the #050505 page background */}
      <div className="absolute inset-x-0 bottom-0 h-[400px] bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent pointer-events-none" />
    </div>
  );
}
