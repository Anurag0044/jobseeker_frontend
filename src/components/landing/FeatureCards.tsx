"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Search, FileEdit, Mail, Box } from "lucide-react";

const features = [
  {
    title: "Job Analysis",
    desc: "Deconstructs requirements from any URL or description.",
    icon: Search,
  },
  {
    title: "Resume Opt",
    desc: "Rebuilds structural match against ATS filters.",
    icon: FileEdit,
  },
  {
    title: "Cover Letter",
    desc: "Generates narrative alignment with personalized tone.",
    icon: Mail,
  },
  {
    title: "Assembly",
    desc: "Packages final artifacts into production-ready PDFs.",
    icon: Box,
  },
];

function FeatureCard({ feature, index }: { feature: any; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.02, rotateX: 2, rotateY: -2 }}
      className="relative glass-panel p-lg rounded-xl flex flex-col group overflow-hidden"
      style={{ perspective: 1000 }}
    >
      {/* Animated Glowing Border (Mouse follow) */}
      <motion.div
        className="absolute -inset-[1px] rounded-xl z-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(139, 92, 246, 0.4), transparent 40%)`,
        }}
      />
      <div className="absolute inset-[1px] bg-[#121212] rounded-xl z-0 pointer-events-none" />

      <div className="relative z-10">
        <div className="w-12 h-12 rounded-lg bg-[#2A2A2A] border border-white/5 flex items-center justify-center mb-md group-hover:border-primary/50 transition-colors duration-300 group-hover:shadow-[0_0_20px_rgba(124,58,237,0.3)]">
          <feature.icon className="w-5 h-5 text-primary" />
        </div>
        <h3 className="font-mono-label text-[14px] text-on-surface uppercase tracking-widest mb-xs">
          {feature.title}
        </h3>
        <p className="font-body-sm text-[15px] text-secondary">
          {feature.desc}
        </p>
      </div>
    </motion.div>
  );
}

export default function FeatureCards() {
  return (
    <section className="py-xxl px-md md:px-xl max-w-[1440px] mx-auto relative z-10">
      <div className="text-left mb-xl">
        <h2 className="font-title-md text-[32px] md:text-[40px] text-on-surface mb-sm tracking-tight font-semibold">
          Orchestrated Intelligence
        </h2>
        <p className="font-body-lg text-[18px] text-secondary">
          Four specialized agents working in absolute unison.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-lg relative">
        {/* Subtle connector line */}
        <div className="hidden lg:block absolute top-24 left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent -z-10" />
        
        {features.map((f, i) => (
          <FeatureCard key={i} feature={f} index={i} />
        ))}
      </div>
    </section>
  );
}
