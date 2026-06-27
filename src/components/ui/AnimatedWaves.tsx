"use client";

import React from "react";
import { motion } from "framer-motion";

export default function AnimatedWaves() {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0 mix-blend-screen opacity-[0.4]">
      <div className="absolute inset-0 flex flex-col justify-center gap-10 opacity-70 mix-blend-screen">
        {/* Layer 1: Fast small wave */}
        <motion.div
          className="w-[200%] h-[30vh] shrink-0"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ ease: "linear", duration: 15, repeat: Infinity }}
          style={{
            background: "url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 1200 120%22 preserveAspectRatio=%22none%22%3E%3Cpath d=%22M0,60 C300,120 300,0 600,60 C900,120 900,0 1200,60%22 fill=%22none%22 stroke=%22rgba(255, 255, 255, 0.4)%22 stroke-width=%221%22/%3E%3C/svg%3E') repeat-x",
            backgroundSize: "50% 100%",
            filter: "blur(2px)",
          }}
        />
        {/* Layer 2: Slow large wave */}
        <motion.div
          className="w-[200%] h-[40vh] shrink-0 -mt-[15vh]"
          animate={{ x: ["-50%", "0%"] }}
          transition={{ ease: "linear", duration: 25, repeat: Infinity }}
          style={{
            background: "url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 1200 120%22 preserveAspectRatio=%22none%22%3E%3Cpath d=%22M0,60 C300,0 300,120 600,60 C900,0 900,120 1200,60%22 fill=%22none%22 stroke=%22rgba(255, 255, 255, 0.3)%22 stroke-width=%221%22/%3E%3C/svg%3E') repeat-x",
            backgroundSize: "50% 100%",
            filter: "blur(4px)",
          }}
        />
        {/* Layer 3: Very slow ambient wave */}
        <motion.div
          className="w-[200%] h-[50vh] shrink-0 -mt-[25vh]"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ ease: "linear", duration: 40, repeat: Infinity }}
          style={{
            background: "url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 1200 120%22 preserveAspectRatio=%22none%22%3E%3Cpath d=%22M0,60 C300,120 300,0 600,60 C900,120 900,0 1200,60%22 fill=%22none%22 stroke=%22rgba(255, 255, 255, 0.2)%22 stroke-width=%222%22/%3E%3C/svg%3E') repeat-x",
            backgroundSize: "50% 100%",
            filter: "blur(8px)",
          }}
        />
      </div>

      {/* Deep colored solid waves at the bottom to ground the layout */}
      <motion.div
        className="absolute bottom-0 left-0 w-[200%] h-[30vh] opacity-20 mix-blend-screen"
        animate={{ x: ["-50%", "0%"] }}
        transition={{ ease: "linear", duration: 20, repeat: Infinity }}
        style={{
          background: "url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 1200 120%22 preserveAspectRatio=%22none%22%3E%3Cpath d=%22M0,60 C300,120 300,0 600,60 C900,120 900,0 1200,60 L1200,120 L0,120 Z%22 fill=%22rgba(255, 255, 255, 0.05)%22/%3E%3C/svg%3E') repeat-x",
          backgroundSize: "50% 100%",
        }}
      />
      <motion.div
        className="absolute bottom-0 left-0 w-[200%] h-[25vh] opacity-30 mix-blend-screen"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ ease: "linear", duration: 15, repeat: Infinity }}
        style={{
          background: "url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 1200 120%22 preserveAspectRatio=%22none%22%3E%3Cpath d=%22M0,60 C300,0 300,120 600,60 C900,0 900,120 1200,60 L1200,120 L0,120 Z%22 fill=%22rgba(255, 255, 255, 0.03)%22/%3E%3C/svg%3E') repeat-x",
          backgroundSize: "50% 100%",
        }}
      />
    </div>
  );
}
