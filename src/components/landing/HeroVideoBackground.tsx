"use client";

import React, { useRef, useEffect } from "react";

export default function HeroVideoBackground() {
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
    <div className="absolute inset-0 w-full h-full z-0 overflow-hidden bg-black pointer-events-none">
      {/* Video with screen blend mode to perfectly eliminate black background artifacts */}
      <video
        ref={videoRef}
        src="/particle-wave-seamless.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none mix-blend-screen opacity-70"
      />

      {/* Massive seamless bottom fade to blend into the #000000 page background */}
      <div className="absolute inset-x-0 bottom-0 h-[400px] bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none" />
      {/* Left/Right fades to eliminate any edge cutoffs */}
      <div className="absolute inset-y-0 left-0 w-[15vw] bg-gradient-to-r from-black to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-[15vw] bg-gradient-to-l from-black to-transparent pointer-events-none" />
    </div>
  );
}
