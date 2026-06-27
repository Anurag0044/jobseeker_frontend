"use client";

import React, { useRef, useState, useEffect } from "react";

interface SeamlessVideoBackgroundProps {
  src: string;
  className?: string;
  crossfadeDuration?: number; // in seconds
}

export default function SeamlessVideoBackground({ 
  src, 
  className = "",
  crossfadeDuration = 0.5 
}: SeamlessVideoBackgroundProps) {
  const video1Ref = useRef<HTMLVideoElement>(null);
  const video2Ref = useRef<HTMLVideoElement>(null);
  const [activeVideo, setActiveVideo] = useState<1 | 2>(1);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  useEffect(() => {
    const v1 = video1Ref.current;
    const v2 = video2Ref.current;
    if (!v1 || !v2) return;

    // Start video 1
    v1.play().catch(e => console.log("Autoplay blocked:", e));

    const handleTimeUpdate = (e: Event) => {
      const vid = e.target as HTMLVideoElement;
      
      // If video hasn't loaded duration yet, skip
      if (!vid.duration || isNaN(vid.duration)) return;

      // Check if we are near the end of the video based on crossfadeDuration
      if (vid.currentTime >= vid.duration - crossfadeDuration - 0.1) {
        if (vid === v1 && activeVideo === 1) {
          // Time to start Video 2
          v2.currentTime = 0;
          v2.play().catch(() => {});
          setActiveVideo(2);
        } else if (vid === v2 && activeVideo === 2) {
          // Time to start Video 1
          v1.currentTime = 0;
          v1.play().catch(() => {});
          setActiveVideo(1);
        }
      }
    };

    v1.addEventListener("timeupdate", handleTimeUpdate);
    v2.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      v1.removeEventListener("timeupdate", handleTimeUpdate);
      v2.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [activeVideo, crossfadeDuration]);

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      <video
        ref={video1Ref}
        src={src}
        muted
        playsInline
        onLoadedData={() => setIsVideoLoaded(true)}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
          activeVideo === 1 ? "opacity-100" : "opacity-0"
        } ${isVideoLoaded ? "" : "opacity-0"}`}
      />
      <video
        ref={video2Ref}
        src={src}
        muted
        playsInline
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
          activeVideo === 2 ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}
