"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useMotionTemplate,
} from "framer-motion";
import AICoreScene from "../3d/AICoreScene";
import PremiumHeroButtons from "../ui/PremiumHeroButtons";
import AnimatedHeadline from "./AnimatedHeadline";

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.96]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.92]);

  // GPU-only mouse spotlight — zero React re-renders
  const mouseX = useMotionValue(720);
  const mouseY = useMotionValue(400);
  const spotlight = useMotionTemplate`radial-gradient(600px circle at ${mouseX}px ${mouseY}px, rgba(124,58,237,0.14), transparent 40%)`;

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  }

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-[90vh] overflow-hidden"
    >
      {/* 3D Background */}
      <AICoreScene />

      {/* Gradient Spotlight — MotionValue driven, no setState */}
      <motion.div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-60"
        style={{ background: spotlight }}
      />

      {/* Content */}
      <motion.div
        style={{ scale, opacity }}
        className="relative z-10 max-w-[1440px] mx-auto px-md md:px-xl min-h-[90vh] flex flex-col justify-center items-start"
      >
        {/* ✅ AnimatedHeadline replaces static h1 */}
        <AnimatedHeadline />

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="font-body-lg text-[15px] md:text-[17px] text-secondary/80 max-w-[540px] mb-xl leading-[1.6] tracking-[-0.01em]"
        >
          Multi-agent AI that transforms resumes into tailored applications,
          ATS-optimized artifacts, personalized cover letters, and
          interview-ready insights in seconds.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <PremiumHeroButtons />
        </motion.div>
      </motion.div>
    </section>
  );
}
