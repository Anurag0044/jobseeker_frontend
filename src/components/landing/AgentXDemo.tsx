"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, Bot, Code, CheckCircle2, Search, BrainCircuit, 
  Globe, ArrowRight, ChevronDown, ChevronUp, Terminal, FileText, 
  Settings, Users, History, Cpu, CornerDownRight, Check
} from "lucide-react";

interface ThoughtStep {
  id: string;
  label: string;
  detail: string;
  duration: string;
  icon: React.ElementType;
}

const THOUGHT_STEPS: ThoughtStep[] = [
  { id: "read", label: "Read Profile & Context", detail: "Parsed profile markdown (420 tokens extracted)", duration: "0.6s", icon: FileText },
  { id: "search", label: "Web Search", detail: "Searched Stripe's engineering principles & RSC guidelines", duration: "1.4s", icon: Globe },
  { id: "analyze", label: "ATS Keyword Alignment", detail: "Mapped gaps: Web Vitals, API Design, React Server Components", duration: "0.9s", icon: Search },
  { id: "draft", label: "Optimizing Document Structure", detail: "Re-writing experience narrative & metric density", duration: "0.8s", icon: Sparkles }
];

// Standard Mode Hexagon Blinking Eye Avatar Component
function AgentXAvatar({ size = "sm", state = "idle" }: { size?: "sm" | "md"; state?: "idle" | "thinking" | "happy" }) {
  const d = size === "sm" 
    ? { width: 26, height: 26, eyeTop: "top-[50%]", eyeGap: "gap-[2px]", eyeWidth: "w-[2.5px]", eyeHeight: "h-[7px]" } 
    : { width: 40, height: 40, eyeTop: "top-[50%]", eyeGap: "gap-[4px]", eyeWidth: "w-[4px]", eyeHeight: "h-[11px]" };

  return (
    <div className="relative shrink-0 flex items-center justify-center font-sans" style={{ width: d.width, height: d.height }}>
      <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" className="overflow-visible filter drop-shadow-[0_2px_6px_rgba(168,85,247,0.4)]">
        <defs>
          <linearGradient id={`hexagonGrad-${size}`} x1="50" y1="2" x2="50" y2="98" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="rgba(30, 20, 48, 0.6)" />
            <stop offset="100%" stopColor="rgba(11, 9, 20, 0.9)" />
          </linearGradient>
          <linearGradient id={`glassBorder-${size}`} x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="rgba(255,255,255,0.45)" />
            <stop offset="50%" stopColor="rgba(168,85,247,0.4)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.05)" />
          </linearGradient>
        </defs>

        {/* Clean Standard Mode Hexagon Outline */}
        <polygon 
          points="50,2 93,25 93,75 50,98 7,75 7,25" 
          fill={`url(#hexagonGrad-${size})`}
          stroke="url(#glassBorder)" 
          strokeWidth="1.8" 
        />
      </svg>

      {/* Blinking Eyes Overlay */}
      <div className={`absolute ${d.eyeTop} left-[50%] -translate-x-[50%] -translate-y-[50%] flex ${d.eyeGap} z-10 pointer-events-none`}>
        {state === "happy" ? (
          <>
            <svg width={size === "sm" ? "8" : "12"} height={size === "sm" ? "6" : "9"} viewBox="0 0 18 13" fill="none" className="eye-happy-blink overflow-visible">
              <path d="M1.5 10.5 L 9 2.5 L 16.5 10.5" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0px 0px 4px rgba(255,255,255,0.95))' }} />
            </svg>
            <svg width={size === "sm" ? "8" : "12"} height={size === "sm" ? "6" : "9"} viewBox="0 0 18 13" fill="none" className="eye-happy-blink overflow-visible">
              <path d="M1.5 10.5 L 9 2.5 L 16.5 10.5" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0px 0px 4px rgba(255,255,255,0.95))' }} />
            </svg>
          </>
        ) : state === "thinking" ? (
          <>
            <div className={`${d.eyeWidth} bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.95)] eye-think-left`} style={{ height: size === "sm" ? "8px" : "12px" }} />
            <div className={`${d.eyeWidth} bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.95)] eye-think-right`} style={{ height: size === "sm" ? "8px" : "12px" }} />
          </>
        ) : (
          <>
            <div className={`${d.eyeWidth} ${d.eyeHeight} bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.9),inset_0_1px_1px_rgba(0,0,0,0.2)] eye-idle-blink`} />
            <div className={`${d.eyeWidth} ${d.eyeHeight} bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.9),inset_0_1px_1px_rgba(0,0,0,0.2)] eye-idle-blink`} />
          </>
        )}
      </div>
    </div>
  );
}

export default function AgentXDemo() {
  const [phase, setPhase] = useState<"prompt" | "thinking" | "typing" | "result">("prompt");
  const [typedPrompt, setTypedPrompt] = useState("");
  const [elapsedTime, setElapsedTime] = useState(0.0);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [isThoughtExpanded, setIsThoughtExpanded] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const fullPrompt = "Please optimize my resume and portfolio summary for the Senior Front-end Engineer role at Stripe.";

  // Timing loop controller
  useEffect(() => {
    let active = true;

    const runSequence = async () => {
      while (active) {
        // Step 1: Reset & Type Prompt
        setPhase("prompt");
        setTypedPrompt("");
        setElapsedTime(0.0);
        setCurrentStepIdx(0);
        setCompletedSteps([]);
        setIsThoughtExpanded(true);

        await new Promise((resolve) => setTimeout(resolve, 800));

        // Type character-by-character
        for (let i = 1; i <= fullPrompt.length; i++) {
          if (!active) return;
          setTypedPrompt(fullPrompt.substring(0, i));
          await new Promise((resolve) => setTimeout(resolve, 20));
        }

        await new Promise((resolve) => setTimeout(resolve, 1000));
        if (!active) return;

        // Step 2: Transition to Thinking
        setPhase("thinking");
        
        // Start running digital elapsed timer
        let start = Date.now();
        timerRef.current = setInterval(() => {
          setElapsedTime(Number(((Date.now() - start) / 1000).toFixed(1)));
        }, 100);

        // Sequence through thought process steps
        // Step 1: Read
        setCurrentStepIdx(0);
        await new Promise((resolve) => setTimeout(resolve, 800));
        if (!active) return;
        setCompletedSteps((prev) => [...prev, "read"]);

        // Step 2: Search
        setCurrentStepIdx(1);
        await new Promise((resolve) => setTimeout(resolve, 1500));
        if (!active) return;
        setCompletedSteps((prev) => [...prev, "search"]);

        // Step 3: Analyze
        setCurrentStepIdx(2);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        if (!active) return;
        setCompletedSteps((prev) => [...prev, "analyze"]);

        // Step 4: Draft
        setCurrentStepIdx(3);
        await new Promise((resolve) => setTimeout(resolve, 900));
        if (!active) return;
        setCompletedSteps((prev) => [...prev, "draft"]);

        // Stop timer
        if (timerRef.current) clearInterval(timerRef.current);

        await new Promise((resolve) => setTimeout(resolve, 500));
        if (!active) return;

        // Step 3: Transition to typing response
        setPhase("typing");
        setIsThoughtExpanded(false); // collapse thought process
        await new Promise((resolve) => setTimeout(resolve, 1800));
        if (!active) return;

        // Step 4: Show Final ATS optimized result
        setPhase("result");
        await new Promise((resolve) => setTimeout(resolve, 8000));
      }
    };

    runSequence();

    return () => {
      active = false;
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <div className="w-full h-[580px] grid grid-cols-1 md:grid-cols-[220px_1fr] bg-[#030306]/98 border border-white/10 rounded-[24px] overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.9),inset_0_1px_0px_rgba(255,255,255,0.1)] relative font-sans text-white select-none">
      
      {/* Inject custom CSS keyframes for eye animations */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes eye-think-left {
            0%, 100% { height: 10px; transform: translateY(0); }
            15% { height: 12px; transform: translateY(-1.5px); }
            35% { height: 10px; transform: translateY(0); } 
            50% { height: 6px; transform: translateY(2px); }
            75% { height: 6px; transform: translateY(2px); }
            82% { height: 1.5px; transform: translateY(4.5px); }
            85% { height: 10px; transform: translateY(0); }
          }
          @keyframes eye-think-right {
            0%, 100% { height: 10px; transform: translateY(0); }
            15% { height: 6px; transform: translateY(2px); }
            35% { height: 10px; transform: translateY(0); } 
            50% { height: 12px; transform: translateY(-1.5px); }
            75% { height: 12px; transform: translateY(-1.5px); }
            82% { height: 1.5px; transform: translateY(4.5px); }
            85% { height: 10px; transform: translateY(0); }
          }
          @keyframes eye-happy-blink {
            0%, 80%, 100% { transform: scaleY(1); opacity: 1; }
            90% { transform: scaleY(0.2); opacity: 0.8; }
          }
          @keyframes blink-idle {
            0%, 75%, 83%, 100% { transform: scaleY(1); }
            79% { transform: scaleY(0.1); }
          }
          .eye-think-left {
            animation: eye-think-left 5s ease-in-out infinite;
            transform-origin: center;
          }
          .eye-think-right {
            animation: eye-think-right 5s ease-in-out infinite;
            transform-origin: center;
          }
          .eye-happy-blink {
            animation: eye-happy-blink 4s ease-in-out infinite;
            transform-origin: bottom;
          }
          .eye-idle-blink {
            animation: blink-idle 5s ease-in-out infinite;
            transform-origin: center;
          }
        `
      }} />

      {/* Ambient background blur elements */}
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[350px] h-[350px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-[200px] h-[200px] bg-purple-500/10 blur-[100px] rounded-full pointer-events-none -z-10" />

      {/* ── COLUMN 1: WORKSPACE SIDEBAR ── */}
      <div className="hidden md:flex flex-col bg-[#07070b]/60 border-r border-white/[0.06] p-4.5 justify-between">
        <div className="flex flex-col gap-6">
          {/* OS Window dots */}
          <div className="flex gap-2 mb-2">
            <span className="w-3 h-3 rounded-full bg-[#ff5f56] opacity-80" />
            <span className="w-3 h-3 rounded-full bg-[#ffbd2e] opacity-80" />
            <span className="w-3 h-3 rounded-full bg-[#27c93f] opacity-80" />
          </div>

          {/* Section: Agent Session */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase px-2">AGENTS</span>
            <div className="flex items-center gap-2.5 px-3 py-2 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white font-medium text-[13px] shadow-sm">
              <AgentXAvatar size="sm" state="idle" />
              <span>AgentX Core</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 ml-auto animate-pulse" />
            </div>
            <div className="flex items-center gap-2.5 px-3 py-2 text-slate-400 hover:text-white transition-colors duration-200 text-[13px] hover:bg-white/[0.02] rounded-xl cursor-pointer">
              <Cpu size={15} className="text-slate-500" />
              <span>Tailor Engine</span>
            </div>
          </div>

          {/* Section: History */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase px-2 mb-1.5">HISTORY</span>
            <div className="flex flex-col gap-0.5">
              {[
                { label: "Stripe SWE Summary", active: true },
                { label: "Apple UX Resumes", active: false },
                { label: "Google L6 Cover Letter", active: false },
                { label: "Netflix Portfolio Design", active: false }
              ].map((hist, idx) => (
                <div 
                  key={idx} 
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-[12.5px] transition-all duration-200 cursor-pointer ${
                    hist.active 
                      ? "text-white font-medium bg-white/[0.03]" 
                      : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.015]"
                  }`}
                >
                  <History size={13} className={hist.active ? "text-indigo-300" : "text-slate-500"} />
                  <span className="truncate">{hist.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Workspace Footer Info */}
        <div className="flex flex-col gap-2 pt-4 border-t border-white/[0.04] px-1">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>ATS Engine v2.1</span>
            <span className="text-indigo-400 font-mono">100% compliant</span>
          </div>
          <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden">
            <div className="w-4/5 h-full bg-indigo-500" />
          </div>
        </div>
      </div>

      {/* ── COLUMN 2: CHAT INTERFACE ── */}
      <div className="flex flex-col h-full min-w-0">
        {/* Header Bar */}
        <div className="h-[52px] border-b border-white/[0.06] flex items-center justify-between px-6 bg-[#07070b]/20 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-xs font-mono font-medium">Session ID:</span>
            <span className="font-mono text-xs text-indigo-300 font-semibold">agx_stripe_08f</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
              AgentX-101
            </span>
            <Settings size={14} className="text-slate-400 hover:text-white cursor-pointer transition-colors duration-200" />
          </div>
        </div>

        {/* Chat Scrolling viewport */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 scrollbar-thin">
          
          {/* User Message Bubble */}
          <div className="flex flex-col items-end gap-1.5 w-full">
            <div className="flex items-center gap-2 text-[11px] text-slate-500 font-bold uppercase tracking-wider pr-1">
              <span>Candidate</span>
            </div>
            <div className="bg-white/[0.04] border border-white/[0.08] px-5 py-3.5 rounded-[22px] rounded-tr-[4px] max-w-[90%] md:max-w-[80%] shadow-[0_8px_30px_rgba(0,0,0,0.5),inset_0_1px_0px_rgba(255,255,255,0.05)]">
              <p className="text-[13.5px] leading-relaxed text-slate-200 font-medium">
                {typedPrompt}
                {phase === "prompt" && (
                  <span className="inline-block w-1.5 h-4 ml-0.5 bg-indigo-400 animate-pulse align-middle" />
                )}
              </p>
            </div>
          </div>

          {/* Agent Response Sequence */}
          {phase !== "prompt" && (
            <div className="flex flex-col items-start gap-3 w-full">
              {/* Agent Title Header with Custom Blinking Avatar */}
              <div className="flex items-center gap-2.5 ml-1">
                <AgentXAvatar 
                  size="sm" 
                  state={phase === "result" ? "happy" : phase === "thinking" || phase === "typing" ? "thinking" : "idle"} 
                />
                <span className="text-[11px] font-bold text-indigo-300 uppercase tracking-widest">AgentX Engine</span>
              </div>

              {/* ── THOUGHT PROCESS BLOCK ── */}
              <div className="w-full flex flex-col border border-white/[0.06] bg-white/[0.02] rounded-[20px] overflow-hidden transition-all duration-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
                {/* Header of Thought Accordion */}
                <div 
                  onClick={() => setIsThoughtExpanded(!isThoughtExpanded)}
                  className="px-5 py-3 flex items-center justify-between cursor-pointer hover:bg-white/[0.02] transition-colors select-none"
                >
                  <div className="flex items-center gap-2.5">
                    <BrainCircuit size={15} className="text-indigo-400" />
                    <span className="text-[12.5px] font-medium text-slate-300">
                      {phase === "thinking" ? "Thinking Process" : "Thought Process complete"}
                    </span>
                    <span className="text-[11px] font-mono bg-white/[0.06] px-1.5 py-0.5 rounded text-slate-400">
                      {elapsedTime}s elapsed
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors">
                    {isThoughtExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                  </div>
                </div>

                {/* Body of Thought Accordion */}
                <AnimatePresence initial={false}>
                  {isThoughtExpanded && (
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-5 pt-1.5 flex flex-col gap-4 border-t border-white/[0.04] bg-[#07070b]/20 relative">
                        {/* Connecting Line */}
                        <div className="absolute left-[33px] top-6 bottom-8 w-[1px] bg-white/[0.08]" />

                        {THOUGHT_STEPS.map((step, idx) => {
                          const isCompleted = completedSteps.includes(step.id);
                          const isActive = idx === currentStepIdx && phase === "thinking";
                          const isPending = idx > currentStepIdx && phase === "thinking";

                          return (
                            <div 
                              key={step.id} 
                              className={`flex items-start gap-4 transition-opacity duration-300 ${
                                isPending ? "opacity-35" : "opacity-100"
                              }`}
                            >
                              {/* Step circle icon indicator */}
                              <div className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center z-10 transition-colors">
                                {isCompleted ? (
                                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                                    <Check size={11} strokeWidth={3} />
                                  </div>
                                ) : isActive ? (
                                  <div className="w-5 h-5 rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                                    <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
                                  </div>
                                ) : (
                                  <div className="w-5 h-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-500" />
                                )}
                              </div>

                              {/* Details */}
                              <div className="flex flex-col min-w-0 flex-1">
                                <div className="flex justify-between items-center gap-4">
                                  <span className={`text-[13px] font-semibold tracking-tight ${
                                    isActive ? "text-indigo-300" : isCompleted ? "text-slate-200" : "text-slate-400"
                                  }`}>
                                    {step.label}
                                  </span>
                                  {isCompleted && (
                                    <span className="text-[10px] font-mono text-slate-500 shrink-0">
                                      {step.duration}
                                    </span>
                                  )}
                                </div>
                                <span className="text-[11.5px] text-slate-450 leading-relaxed truncate font-medium font-sans">
                                  {isActive ? "Computing..." : step.detail}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* ── RESPONSE AND ATS DIFF VIEWER ── */}
              {phase === "typing" && (
                <div className="flex items-center gap-2 px-3 py-2 bg-white/[0.02] border border-white/[0.04] rounded-full text-slate-400 text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                  <span className="ml-1 font-medium">AgentX is drafting response...</span>
                </div>
              )}

              {phase === "result" && (
                <motion.div 
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col gap-4 w-full"
                >
                  <p className="text-[13.5px] leading-relaxed text-slate-350 font-medium font-sans">
                    I have optimized your resume summary block to elevate structural keyword matches (RSC, Web Vitals, API integration) which are strongly indexed by Stripe’s resume parsing guidelines.
                  </p>

                  {/* High-Contrast Interactive Diff Card */}
                  <div className="border border-white/[0.08] bg-[#07070b]/60 rounded-2xl p-5 shadow-2xl relative overflow-hidden flex flex-col gap-4">
                    {/* Header stats bar */}
                    <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 shrink-0">
                      <div className="flex items-center gap-2">
                        <Terminal size={14} className="text-indigo-400" />
                        <span className="text-xs font-bold text-white font-mono uppercase tracking-wider">ATS Optimization Report</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full font-bold shadow-[0_0_12px_rgba(16,185,129,0.1)]">
                          ATS Score: +38%
                        </span>
                        <span className="text-[10px] px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-full font-bold">
                          Gaps Filled: 6
                        </span>
                      </div>
                    </div>

                    {/* Diff body */}
                    <div className="flex flex-col gap-3.5 text-[13px] leading-relaxed font-mono">
                      {/* Original Block */}
                      <div className="flex flex-col gap-1.5 opacity-65 hover:opacity-100 transition-opacity">
                        <span className="text-[10.5px] font-bold text-slate-500 uppercase tracking-widest font-sans flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500/60" />
                          Original Resume Copy
                        </span>
                        <div className="bg-rose-500/5 border border-rose-500/10 rounded-xl p-3 text-rose-300 relative">
                          <span className="absolute right-3.5 top-3 text-[10px] font-sans font-medium text-rose-450/80">Vague & Generic</span>
                          <span className="line-through block">
                            Experienced frontend developer working on various websites and web apps. Skilled at building user interfaces, integrating third-party APIs, and improving web performance.
                          </span>
                        </div>
                      </div>

                      {/* Optimized block */}
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[10.5px] font-bold text-indigo-350 uppercase tracking-widest font-sans flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          ATS-Optimized Redraft (AgentX Engine)
                        </span>
                        <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl p-3.5 text-slate-200 relative shadow-inner">
                          <span className="absolute right-3.5 top-3 text-[10px] font-sans font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1 animate-pulse">
                            <Sparkles size={10} /> Optimal ATS Indexing
                          </span>
                          <span className="block pr-12">
                            High-impact <strong className="text-white bg-emerald-400/15 border-b border-emerald-400/40 px-0.5 rounded font-bold">Senior Front-End Engineer</strong> with a proven track record of designing <strong className="text-white bg-emerald-400/15 border-b border-emerald-400/40 px-0.5 rounded font-bold">scalable Web API integrations</strong> and optimizing <strong className="text-white bg-emerald-400/15 border-b border-emerald-400/40 px-0.5 rounded font-bold">Web Vitals (LCP &lt; 2.2s)</strong>. Spearheaded transition to <strong className="text-white bg-emerald-400/15 border-b border-emerald-400/40 px-0.5 rounded font-bold">React Server Components (RSC)</strong>, improving client rendering efficiency by <strong className="text-white bg-emerald-400/15 border-b border-emerald-400/40 px-0.5 rounded font-bold">24%</strong> and SEO score metrics.
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
