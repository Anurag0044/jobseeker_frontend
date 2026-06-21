"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const WORDS = [
  "Resumes.",
  "Cover Letters.",
  "Interviews.",
  "Applications.",
];

const FONT_SIZE = "clamp(40px, 6vw, 76px)";
const SHARED_CLASS =
  "font-semibold leading-none tracking-[-0.03em]";

function splitChars(word: string) {
  return word.split("").map((c) => (c === " " ? "\u00a0" : c));
}

export default function AnimatedHeadline() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const id = setTimeout(
      () => setIdx((i) => (i + 1) % WORDS.length),
      2200
    );
    return () => clearTimeout(id);
  }, [idx]);

  const chars = splitChars(WORDS[idx]);

  return (
    <h1 className="mb-10 flex flex-col items-start gap-[2px]">

      {/* Line 1 — static "Forge" */}
      <div
        className={`${SHARED_CLASS} text-white`}
        style={{ fontSize: FONT_SIZE }}
      >
        Forge
      </div>

      {/* Line 2 — animated, fixed height to prevent layout shift */}
      <div
        className="relative overflow-hidden"
        style={{
          fontSize: FONT_SIZE,
          height: "clamp(40px, 6vw, 76px)",
          // wide enough for longest word so siblings never move
          minWidth: "min(560px, 90vw)",
        }}
        aria-live="polite"
        aria-atomic="true"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={idx}
            className="absolute inset-0 flex items-center text-white"
            style={{ fontSize: FONT_SIZE }}
          >
            {chars.map((char, i) => (
              <motion.span
                key={i}
                className={`${SHARED_CLASS} inline-block`}
                style={{ willChange: "transform, opacity, filter" }}
                initial={{ opacity: 0, y: 22, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0,  filter: "blur(0px)" }}
                exit={{    opacity: 0, y: -20, filter: "blur(5px)" }}
                transition={{
                  delay: i * 0.03,
                  duration: 0.55,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {char}
              </motion.span>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Line 3 — static "Not Documents." */}
      <div
        className={`${SHARED_CLASS}`}
        style={{
          fontSize: FONT_SIZE,
          color: "#a888ff",
          textShadow:
            "0 0 28px rgba(168,136,255,0.4), 0 0 56px rgba(124,58,237,0.15)",
        }}
      >
        Not Documents.
      </div>
    </h1>
  );
}
