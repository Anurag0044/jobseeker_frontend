"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Search, FileEdit, Mail, Box, ArrowUpRight, Zap, Target } from "lucide-react";

type BentoFeature = {
  title: string;
  desc: string;
  icon: React.ElementType;
  colSpan: number;
  rowSpan: number;
  color: string;
};

const features: BentoFeature[] = [
  {
    title: "Deep Job Analysis",
    desc: "AgentX deconstructs any job URL or description, instantly extracting latent requirements, keywords, and core competencies.",
    icon: Search,
    colSpan: 2,
    rowSpan: 1,
    color: "from-blue-500/20 to-indigo-500/5",
  },
  {
    title: "Smart Targeting",
    desc: "Match score optimization.",
    icon: Target,
    colSpan: 1,
    rowSpan: 1,
    color: "from-purple-500/20 to-pink-500/5",
  },
  {
    title: "Dynamic Resume Rebuild",
    desc: "We don't just tweak words. The engine structurally rebuilds your resume to perfectly align with ATS parsers and hiring manager expectations.",
    icon: FileEdit,
    colSpan: 1,
    rowSpan: 2,
    color: "from-indigo-500/20 to-purple-500/5",
  },
  {
    title: "Narrative Cover Letters",
    desc: "Generate highly personalized, narrative-driven cover letters that sound like you, not a robot.",
    icon: Mail,
    colSpan: 2,
    rowSpan: 1,
    color: "from-emerald-500/20 to-teal-500/5",
  },
  {
    title: "Instant Assembly",
    desc: "Export to production-ready PDFs.",
    icon: Box,
    colSpan: 1,
    rowSpan: 1,
    color: "from-orange-500/20 to-red-500/5",
  },
  {
    title: "Lightning Fast",
    desc: "Zero to applied in under 60 seconds.",
    icon: Zap,
    colSpan: 1,
    rowSpan: 1,
    color: "from-yellow-500/20 to-orange-500/5",
  }
];

function BentoCard({ feature }: { feature: BentoFeature }) {
  const ref = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -5, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className={`relative rounded-3xl border border-white/[0.08] bg-[#0a0a0c] overflow-hidden group p-8 flex flex-col justify-between ${
        feature.colSpan === 2 ? "md:col-span-2" : "md:col-span-1"
      } ${feature.rowSpan === 2 ? "md:row-span-2" : "md:row-span-1"}`}
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Interactive Glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255,255,255,0.06), transparent 40%)`,
        }}
      />

      {/* Static Gradient Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-20 group-hover:opacity-40 transition-opacity duration-500`} />

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex justify-between items-start mb-6">
          <div className="w-12 h-12 rounded-2xl bg-white/[0.05] border border-white/[0.05] flex items-center justify-center backdrop-blur-md">
            <feature.icon className="w-6 h-6 text-white" />
          </div>
          <ArrowUpRight className="w-5 h-5 text-white/20 group-hover:text-white/80 transition-colors" />
        </div>

        <div className={feature.rowSpan === 2 ? "mt-auto" : ""}>
          <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
          <p className="text-slate-400 text-sm leading-relaxed font-medium">
            {feature.desc}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default function PremiumBentoGrid() {
  return (
    <section className="py-32 px-6 relative max-w-[1200px] mx-auto w-full z-10">
      <div className="text-center mb-20">
        <h2 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 mb-4">
          Everything you need. <br className="hidden md:block" />
          Nothing you don&apos;t.
        </h2>
        <p className="text-slate-400 font-medium text-lg">
          A powerful suite of tools designed to get you hired.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px]">
        {features.map((feature, idx) => (
          <BentoCard key={idx} feature={feature} />
        ))}
      </div>
    </section>
  );
}
