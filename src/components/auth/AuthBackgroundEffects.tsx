"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";

export default function AuthBackgroundEffects() {
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Subtle mesh gradient animation
    const ctx = gsap.context(() => {
      gsap.to(".mesh-blob-1", {
        x: "random(-50, 50)",
        y: "random(-50, 50)",
        rotation: "random(-15, 15)",
        duration: "random(10, 20)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      gsap.to(".mesh-blob-2", {
        x: "random(-50, 50)",
        y: "random(-50, 50)",
        rotation: "random(-15, 15)",
        duration: "random(12, 22)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, containerRef);

    // Particle system
    const particles: HTMLDivElement[] = [];

    if (particlesRef.current) {
      const particleCount = 12; // Reduced from 20 for low-end device perf
      
      for (let i = 0; i < particleCount; i++) {
        const p = document.createElement("div");
        p.className = "absolute rounded-full bg-violet-400/20 pointer-events-none";
        const size = Math.random() * 3 + 1;
        p.style.width = `${size}px`;
        p.style.height = `${size}px`;
        p.style.left = `${Math.random() * 100}%`;
        p.style.top = `${Math.random() * 100}%`;
        particlesRef.current.appendChild(p);
        particles.push(p);

        gsap.to(p, {
          y: `-=${Math.random() * 100 + 50}`,
          x: `+=${(Math.random() - 0.5) * 50}`,
          opacity: 0,
          duration: Math.random() * 5 + 5,
          repeat: -1,
          ease: "none",
          delay: Math.random() * -10,
        });
      }
    }

    return () => {
      ctx.revert();
      particles.forEach((p) => p.remove());
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none z-0"
    >
      {/* Mesh Gradient Blobs */}
      <div className="absolute inset-0 opacity-[0.12] mix-blend-screen filter blur-[80px]">
        <div className="mesh-blob-1 absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-[#6D5DFC] rounded-full" />
        <div className="mesh-blob-2 absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-[#8B5CF6] rounded-full" />
        <div className="mesh-blob-1 absolute top-1/2 left-1/2 w-[250px] h-[250px] bg-[#4F46E5] rounded-full -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* Floating Particles Container */}
      <div ref={particlesRef} className="absolute inset-0" />
    </div>
  );
}
