"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
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

  return (
    <section
      ref={containerRef}
      className="relative min-h-[90vh] overflow-hidden"
    >
      {/* 3D Background */}
      <AICoreScene />


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
          className="font-body-lg text-[16px] md:text-[18px] text-[#F3F4F6] font-medium max-w-[540px] mb-xl leading-[1.6] tracking-[-0.01em] drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]"
        >
          Multi-agent AI that crafts ATS-optimized resumes, tailored CVs, personalized cover letters, and interview-ready applications in seconds.
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
