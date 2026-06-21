"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const NAV_ITEMS = [
  { name: "Features", href: "#" },
  { name: "Agents", href: "#" },
  { name: "Pricing", href: "#" },
  { name: "Showcase", href: "#" },
];

export default function HoverNav() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div 
      className="hidden md:flex items-center bg-white/[0.02] backdrop-blur-md rounded-full p-1.5 border border-white/[0.04] relative shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)]"
      onMouseLeave={() => setHoveredIndex(null)}
    >
      {NAV_ITEMS.map((item, index) => (
        <Link
          key={item.name}
          href={item.href}
          className="relative px-5 py-2 text-[14px] font-medium transition-colors duration-300 rounded-full z-10"
          onMouseEnter={() => setHoveredIndex(index)}
        >
          <span className={`relative z-20 transition-colors duration-300 ${hoveredIndex === index ? "text-white" : "text-[#999999] hover:text-[#cccccc]"}`}>
            {item.name}
          </span>
          
          <AnimatePresence>
            {hoveredIndex === index && (
              <motion.div
                layoutId="nav-glass-pill"
                className="absolute inset-0 rounded-full -z-10 realistic-glass-pill"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 30,
                  mass: 0.8
                }}
              />
            )}
          </AnimatePresence>
        </Link>
      ))}
    </div>
  );
}
