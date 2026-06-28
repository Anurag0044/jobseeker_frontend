"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Sparkles, Search, FileText, Target, Send, Check, Rocket,
  Briefcase, Box, TrendingUp, MapPin, ArrowRight, BrainCircuit,
  Wrench, GitCompare, Radio, Clock, CheckCircle2, Loader2, Globe,
  Code, Layers, UserCircle, Hexagon, Cpu
} from "lucide-react";

type StageStatus = "pending" | "active" | "completed";

interface PipelineStage {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  status: StageStatus;
  startedAt?: number;
  completedAt?: number;
  duration?: number;
  links?: string[];
}

const INITIAL_STAGES: PipelineStage[] = [
  { id: "read_resume", title: "Reading your resume", description: "Extracting skills, experience, and core competencies from your profile.", icon: FileText, status: "pending" },
  { id: "build_context", title: "Building career context", description: "Analyzing your career trajectory and determining optimal next steps.", icon: BrainCircuit, status: "pending" },
  { id: "select_tools", title: "Selecting search tools", description: "Choosing the best platforms and parameters for your specific niche.", icon: Wrench, status: "pending" },
  { id: "find_companies", title: "Finding relevant companies", description: "Scanning global databases for companies matching your profile.", icon: Search, status: "pending" },
  { id: "understand_jobs", title: "Understanding job expectations", description: "Deeply analyzing role requirements and day-to-day responsibilities.", icon: Target, status: "pending" },
  { id: "compare_exp", title: "Comparing with your experience", description: "Calculating semantic match scores between jobs and your resume.", icon: GitCompare, status: "pending" },
  { id: "prepare_recs", title: "Preparing recommendations", description: "Finalizing the top opportunities based on fit and growth potential.", icon: Sparkles, status: "pending" },
  { id: "monitor", title: "Monitoring continuously", description: "Silently watching for new opportunities 24/7.", icon: Radio, status: "pending" }
];

export default function AgentXPage() {
  const [stages, setStages] = useState<PipelineStage[]>(INITIAL_STAGES);
  const [activeStageIndex, setActiveStageIndex] = useState<number>(0);
  const [showResults, setShowResults] = useState(false);
  const [aiResponse, setAiResponse] = useState<string>("");

  const runMission = async (query: string) => {
    setStages(INITIAL_STAGES.map(s => ({ ...s, status: "pending" })));
    setShowResults(true); // Show findings immediately when starting
    setAiResponse("");

    let fullResponse = "";

    const activateStage = (id: string, description?: string) => {
      setStages(prev => {
        const next = [...prev];
        // Auto-complete any currently active stages
        for (let i = 0; i < next.length; i++) {
          if (next[i].status === "active" && next[i].id !== id) {
            next[i] = {
              ...next[i],
              status: "completed",
              completedAt: Date.now(),
              duration: Date.now() - (next[i].startedAt || Date.now())
            };
          }
        }
        const idx = next.findIndex(s => s.id === id);
        if (idx !== -1) {
          setActiveStageIndex(idx);
          next[idx] = { 
            ...next[idx], 
            status: "active", 
            startedAt: Date.now(),
            description: description || next[idx].description 
          };
        }
        return next;
      });
    };

    const completeStage = (id: string, links?: string[]) => {
      setStages(prev => {
        const next = [...prev];
        const idx = next.findIndex(s => s.id === id);
        if (idx !== -1) {
          next[idx] = {
            ...next[idx],
            status: "completed",
            completedAt: Date.now(),
            duration: Date.now() - (next[idx].startedAt || Date.now()),
            links: links || next[idx].links
          };
        }
        return next;
      });
    };

    activateStage("build_context");

    let hasWrappedUp = false;
    const wrapUp = () => {
      if (hasWrappedUp) return;
      hasWrappedUp = true;

      setStages(prev => prev.map(s => ({ ...s, status: "completed" as const, timestamp: Date.now() })));
      setActiveStageIndex(7);
      setShowResults(true);
    };

    try {
      const res = await fetch("http://localhost:8000/api/v1/assistant/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: query, phone_number: "test_user" }),
      });

      if (!res.body) throw new Error("No response body");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          wrapUp();
          break;
        }

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const dataStr = line.slice(6);
            if (!dataStr) continue;

            try {
              const data = JSON.parse(dataStr);

              if (data.type === "tool_start") {
                if (data.tool === "search_web") {
                  activateStage("find_companies", data.input?.query || "Gathering live data...");
                } else if (data.tool === "get_user_profile") {
                  activateStage("read_resume");
                }
              } else if (data.type === "tool_end") {
                if (data.tool === "search_web") {
                  let urls: string[] = [];
                  if (data.output) {
                    const urlRegex = /(https?:\/\/[^\s"']+)/g;
                    const matches = (data.output as string).match(urlRegex);
                    if (matches) {
                      urls = [...new Set(matches)].slice(0, 3);
                    }
                  }
                  completeStage("find_companies", urls);
                  activateStage("compare_exp");
                } else if (data.tool === "get_user_profile") {
                  completeStage("read_resume");
                }
              } else if (data.type === "token") {
                fullResponse += data.content;
                setAiResponse(prev => prev + data.content);
                setStages(prev => {
                  const next = [...prev];
                  const prepIdx = next.findIndex(s => s.id === "prepare_recs");
                  if (next[prepIdx].status === "pending") {
                    for (let i = 0; i < prepIdx; i++) {
                      if (next[i].status !== "completed") {
                        next[i].status = "completed";
                        next[i].completedAt = Date.now();
                        next[i].duration = Date.now() - (next[i].startedAt || Date.now() - 1000);
                      }
                    }
                    next[prepIdx].status = "active";
                    next[prepIdx].startedAt = Date.now();
                    setActiveStageIndex(prepIdx);
                  }
                  return next;
                });
              } else if (data.type === "done") {
                wrapUp();
              } else if (data.type === "error") {
                console.error("Backend error:", data.error);
                alert("The AI agent encountered an error: " + data.error);
                setStages(INITIAL_STAGES.map(s => ({ ...s, status: "pending" })));
              }
            } catch (err) {
              console.error("Parse error:", err);
            }
          }
        }
      }
    } catch (error) {
      console.error("Network or stream error:", error);
      wrapUp();
    }
  };

  const formatTime = (timestamp?: number) => {
    if (!timestamp) return "";
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const currentStageTitle = stages[activeStageIndex]?.title || "Working...";

  return (
    <div className="h-full w-full flex flex-col overflow-hidden text-white font-sans selection:bg-purple-500/30 bg-transparent relative">

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto xl:overflow-hidden overflow-x-hidden custom-scrollbar p-4 md:p-6 flex flex-col min-h-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full flex-none xl:flex-1 h-auto xl:h-full max-w-[1600px] mx-auto flex flex-col xl:flex-row gap-6 lg:gap-8 xl:overflow-hidden min-h-0"
        >

          {/* Left Side: Main Viewport (Header + Globe + Timeline split) */}
          <div className="flex-none xl:flex-1 flex flex-col min-w-0 xl:overflow-hidden min-h-0">

            {/* Header Row */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 w-full z-20 shrink-0">
              <div className="max-w-[550px]">
                <h1 className="text-[32px] md:text-[40px] font-extrabold tracking-tight bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-300 bg-clip-text text-transparent flex items-center gap-3 mb-2 font-sans select-none">
                  AgentX <Hexagon className="w-7 h-7 text-purple-400 drop-shadow-[0_0_12px_rgba(168,85,247,0.6)] shrink-0 animate-pulse" />
                </h1>
                <p className="text-slate-200/85 text-[13px] md:text-[14.5px] leading-relaxed font-normal tracking-wide mt-1 max-w-[520px]">
                  Your autonomous AI partner quietly discovers, analyzes, and curates the best opportunities for your career growth.
                </p>
              </div>
            </div>

            {/* Split row: Globe (left) and Activity Timeline (right) */}
            <div className="flex-none lg:flex-1 flex flex-col lg:flex-row items-center justify-center gap-8 w-full mt-6 xl:overflow-hidden min-h-0">

              {/* Globe Column */}
              <div className="flex-1 flex flex-col items-center justify-center min-h-[260px] relative">
                {/* Ambient Deep Space Glow - Radial Gradient to prevent GPU box rendering bugs */}
                <div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] md:w-[450px] md:h-[450px] pointer-events-none"
                  style={{
                    background: 'radial-gradient(circle, rgba(168, 85, 247, 0.12) 0%, rgba(168, 85, 247, 0) 70%)'
                  }}
                />

                {/* Holographic Pedestal base */}
                <div className="absolute bottom-6 w-36 h-2.5 bg-gradient-to-r from-purple-500/20 via-indigo-500/10 to-transparent blur-md rounded-full pointer-events-none"></div>

                {/* Drop Shadow Wrapper for the Hexagon (SVG-based to prevent browser drop-shadow boundary bugs) */}
                <motion.div
                  animate={activeStageIndex === 7 ? { y: [0, -4, 0] } : { y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: activeStageIndex === 7 ? 8 : 4, ease: "easeInOut" }}
                  className="relative w-[150px] h-[150px] md:w-[200px] md:h-[200px] shrink-0"
                  style={{ perspective: 1000 }}
                >
                  {/* Rotating 3D Crystal Core */}
                  {/* Floating 3D Crystal Core (no free spinning) */}
                  <motion.div
                    animate={
                      !showResults
                        ? { rotateY: [-8, 8, -8], rotateX: [-4, 4, -4] } // Idle: Gentle floating 3D wobble
                        : activeStageIndex === 7
                          ? { rotateY: [-15, 15, -15], rotateX: [-5, 5, -5] } // Completed: Calm sway
                          : { rotateY: [-5, 5, -5], rotateX: [-2, 2, -2] } // Active: Focused stable posture
                    }
                    transition={{
                      repeat: Infinity,
                      duration: !showResults ? 8 : activeStageIndex === 7 ? 6 : 4,
                      ease: "easeInOut"
                    }}
                    className="w-full h-full relative"
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    {/* Hexagon SVG Core */}
                    <svg
                      viewBox="0 0 100 100"
                      className="w-full h-full filter transition-all duration-1000 relative z-10"
                      style={{
                        filter: activeStageIndex === 7
                          ? 'drop-shadow(0 0 25px rgba(16, 185, 129, 0.45))'
                          : activeStageIndex > 0
                            ? 'drop-shadow(0 0 30px rgba(139, 92, 246, 0.55))'
                            : 'drop-shadow(0 0 25px rgba(168, 85, 247, 0.45))'
                      }}
                    >
                      <defs>
                        <radialGradient id="hexagonGrad" cx="30%" cy="30%" r="70%">
                          {activeStageIndex === 7 ? (
                            <>
                              <stop offset="0%" stopColor="#34d399" stopOpacity="0.25" />
                              <stop offset="45%" stopColor="#059669" stopOpacity="0.1" />
                              <stop offset="100%" stopColor="#022c22" stopOpacity="0.02" />
                            </>
                          ) : activeStageIndex > 0 ? (
                            <>
                              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.25" />
                              <stop offset="45%" stopColor="#8b5cf6" stopOpacity="0.1" />
                              <stop offset="100%" stopColor="#1e152a" stopOpacity="0.02" />
                            </>
                          ) : (
                            <>
                              <stop offset="0%" stopColor="#c084fc" stopOpacity="0.25" />
                              <stop offset="45%" stopColor="#7c3aed" stopOpacity="0.1" />
                              <stop offset="100%" stopColor="#0f0c1b" stopOpacity="0.02" />
                            </>
                          )}
                        </radialGradient>

                        <linearGradient id="glassBorder" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.75" />
                          <stop offset="35%" stopColor="#ffffff" stopOpacity="0.1" />
                          <stop offset="75%" stopColor="#a855f7" stopOpacity="0.15" />
                          <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.65" />
                        </linearGradient>

                        <linearGradient id="glassShine" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
                          <stop offset="40%" stopColor="#ffffff" stopOpacity="0.05" />
                          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                        </linearGradient>
                      </defs>

                      {/* Main Hexagon Body */}
                      <polygon
                        points="50,2 93,25 93,75 50,98 7,75 7,25"
                        fill="url(#hexagonGrad)"
                        stroke="url(#glassBorder)"
                        strokeWidth="1.2"
                      />

                      {/* Overlay Highlight/Glaze Sheet */}
                      <polygon
                        points="50,3 91,25 91,73 50,95 9,73 9,25"
                        fill="url(#glassShine)"
                        pointerEvents="none"
                      />
                    </svg>

                    {/* Futuristic Glass Capsule Eyes (Animated with Framer Motion for looking around) */}
                    <motion.div
                      className="absolute top-[48%] left-[50%] flex gap-3.5 z-20 pointer-events-none"
                      animate={
                        !showResults
                          ? {
                            x: ["-50%", "-65%", "-35%", "-50%", "-50%", "-50%"],
                            y: ["-50%", "-50%", "-50%", "-55%", "-45%", "-50%"],
                          } // Idle: looking around 360 degrees organically
                          : activeStageIndex === 7
                            ? {
                              x: ["-50%", "-50%", "-50%", "-50%", "-50%", "-50%"],
                              y: ["-50%", "-60%", "-50%", "-60%", "-50%", "-50%"],
                              rotate: [0, -3, 3, -3, 0, 0]
                            } // Happy: Proud double nod
                            : {
                              x: ["-50%", "-35%", "-35%", "-60%", "-60%", "-50%"],
                              y: ["-50%", "-65%", "-65%", "-55%", "-55%", "-50%"],
                              rotate: [0, 8, 8, -6, -6, 0]
                            } // Curious/Thinking: Look up right (tilt), pause, look up left, return
                      }
                      transition={{
                        repeat: Infinity,
                        duration: !showResults ? 8 : activeStageIndex === 7 ? 2 : 5,
                        ease: "easeInOut"
                      }}
                    >
                      {activeStageIndex === 7 ? (
                        <>
                          {/* Premium SVG ^^ eyes (Larger) */}
                          <svg width="18" height="13" viewBox="0 0 18 13" fill="none" className="eye-happy-blink overflow-visible">
                            <path d="M1.5 10.5 L 9 2.5 L 16.5 10.5" stroke="white" strokeWidth="3.25" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0px 0px 6px rgba(255,255,255,0.8))' }} />
                          </svg>
                          <svg width="18" height="13" viewBox="0 0 18 13" fill="none" className="eye-happy-blink overflow-visible">
                            <path d="M1.5 10.5 L 9 2.5 L 16.5 10.5" stroke="white" strokeWidth="3.25" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0px 0px 6px rgba(255,255,255,0.8))' }} />
                          </svg>
                        </>
                      ) : activeStageIndex > 0 ? (
                        <>
                          {/* Premium Thinking Eyes (Asymmetrical) */}
                          <div className="w-2.5 bg-white rounded-full shadow-[0_0_12px_rgba(255,255,255,1),inset_0_1px_1px_rgba(0,0,0,0.2)] eye-think-left" />
                          <div className="w-2.5 bg-white rounded-full shadow-[0_0_12px_rgba(255,255,255,1),inset_0_1px_1px_rgba(0,0,0,0.2)] eye-think-right" />
                        </>
                      ) : (
                        <>
                          {/* Idle default eyes */}
                          <div className="w-2 h-6 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8),inset_0_1px_1px_rgba(0,0,0,0.2)] eye-idle-blink" />
                          <div className="w-2 h-6 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8),inset_0_1px_1px_rgba(0,0,0,0.2)] eye-idle-blink" />
                        </>
                      )}
                    </motion.div>
                  </motion.div>
                </motion.div>

                <div className="flex flex-col items-center mt-6">
                  <AnimatePresence mode="wait">
                    {!showResults && (
                      <motion.p
                        key="default-greeting"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.3 }}
                        className="text-white/80 text-[14.5px] font-medium tracking-wide text-center"
                      >
                        How can I help you today on finding Jobs?
                      </motion.p>
                    )}
                  </AnimatePresence>

                </div>
              </div>

              {/* Activity Timeline Column (placed in the red box) */}
              <div className="w-full lg:w-[380px] shrink-0 bg-white/[0.02] backdrop-blur-[45px] saturate-[180%] border border-white/[0.08] hover:border-white/[0.12] transition-all duration-300 rounded-[28px] p-5 flex flex-col h-[380px] overflow-hidden relative shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),0_12px_40px_rgba(0,0,0,0.6)] group">
                <div className="flex justify-between items-center mb-4 shrink-0 z-10">
                  <h3 className="text-[14px] font-semibold text-white tracking-wide">
                    Activity Timeline
                  </h3>

                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 relative z-10">
                  <div className="flex flex-col gap-1 pb-4">
                    <AnimatePresence>
                      {stages.map((stage, idx) => (
                        <TimelineStep
                          key={stage.id}
                          stage={stage}
                          isLast={idx === stages.length - 1}
                          formatTime={formatTime}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* Right Side: AI Agent Findings (placed where timeline used to be) */}
          <div className="w-full xl:w-[460px] flex flex-col flex-none min-h-[500px] xl:min-h-0 xl:h-full xl:overflow-hidden">

            <div className="bg-white/[0.02] backdrop-blur-[45px] saturate-[180%] border border-white/[0.08] hover:border-white/[0.12] transition-all duration-300 rounded-[28px] p-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),0_12px_40px_rgba(0,0,0,0.6)] relative flex flex-col h-full">
              <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent pointer-events-none"></div>

              <div className="flex justify-between items-center mb-4 relative z-10 shrink-0">
                <h2 className="text-[15px] font-semibold flex items-center gap-2 text-white tracking-wide">
                  AgentX Findings <Hexagon className="text-purple-400 w-4 h-4 animate-pulse" />
                </h2>
              </div>

              {/* Findings Scroll Area */}
              <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 relative z-10">
                {aiResponse || activeStageIndex > 0 ? (
                  <div className="prose prose-invert prose-purple max-w-none text-white/90 leading-relaxed">
                    {aiResponse ? (
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          a: ({ node, ...props }) => <a {...props} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 font-medium underline underline-offset-2 transition-colors" />,
                          h1: ({ node, ...props }) => <h1 {...props} className="text-xl font-bold mt-4 mb-2 text-white" />,
                          h2: ({ node, ...props }) => <h2 {...props} className="text-lg font-bold mt-4 mb-2 text-white/95" />,
                          h3: ({ node, ...props }) => <h3 {...props} className="text-md font-semibold mt-3 mb-1.5 text-white/90" />,
                          ul: ({ node, ...props }) => <ul {...props} className="list-disc pl-4 mb-3 space-y-1 text-white/80" />,
                          ol: ({ node, ...props }) => <ol {...props} className="list-decimal pl-4 mb-3 space-y-1 text-white/80" />,
                          li: ({ node, ...props }) => <li {...props} className="text-[13px] leading-relaxed" />,
                          p: ({ node, ...props }) => <p {...props} className="mb-3 text-[13px] leading-relaxed text-white/80" />,
                          strong: ({ node, ...props }) => <strong {...props} className="font-semibold text-white/95" />,
                        }}
                      >
                        {aiResponse}
                      </ReactMarkdown>
                    ) : (
                      <PremiumAgentXLoader />
                    )}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center text-white/30 px-4 py-20">
                    <Hexagon className="w-12 h-12 mb-3 text-white/10" />
                    <p className="text-[13px] leading-relaxed">Deploy a mission to start receiving career insights and job matches here.</p>
                  </div>
                )}
              </div>
            </div>

          </div>

        </motion.div>
      </div>

      {/* Message Bar Container (static flex item at the bottom) */}
      <div className="shrink-0 w-full p-4 md:px-6 md:pb-6 z-20 flex justify-center bg-transparent">
        <div className="w-full max-w-[1000px]">
          <MessageBar onDeploy={runMission} />
        </div>
      </div>

      {/* Styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes ping-pong {
          0% { left: 0%; transform: translateX(0); }
          50% { left: 100%; transform: translateX(-100%); }
          100% { left: 0%; transform: translateX(0); }
        }
        @keyframes scan-horizontal {
          0%, 100% { margin-left: 0; }
          25% { margin-left: -3px; }
          75% { margin-left: 3px; }
        }
        @keyframes happy-bounce {
          0%, 100% { margin-top: 0; }
          50% { margin-top: -2px; }
        }
        @keyframes eye-think-left {
          0%, 100% { height: 26px; transform: translateY(0); }
          15% { height: 32px; transform: translateY(-3px); } /* Open wide */
          35% { height: 26px; transform: translateY(0); } 
          50% { height: 16px; transform: translateY(5px); } /* Squinting down */
          75% { height: 16px; transform: translateY(5px); }
          82% { height: 2px; transform: translateY(12px); } /* Blink */
          85% { height: 26px; transform: translateY(0); }
        }
        @keyframes eye-think-right {
          0%, 100% { height: 26px; transform: translateY(0); }
          15% { height: 16px; transform: translateY(5px); } /* Squinting down */
          35% { height: 26px; transform: translateY(0); } 
          50% { height: 32px; transform: translateY(-3px); } /* Open wide */
          75% { height: 32px; transform: translateY(-3px); }
          82% { height: 2px; transform: translateY(12px); } /* Blink */
          85% { height: 26px; transform: translateY(0); }
        }
        .eye-think-left {
          animation: eye-think-left 5s ease-in-out infinite;
        }
        .eye-think-right {
          animation: eye-think-right 5s ease-in-out infinite;
        }
        @keyframes eye-happy-blink {
          0%, 80%, 100% { height: 10px; transform: scaleY(1); opacity: 1; }
          90% { height: 2px; transform: scaleY(0.2); opacity: 0.8; }
        }
        .eye-happy-blink {
          animation: eye-happy-blink 4s ease-in-out infinite;
        }
        @keyframes blink-idle {
          0%, 75%, 83%, 100% { height: 24px; }
          79% { height: 1.5px; }
        }
        .eye-group-curious {
          animation: scan-horizontal 2s ease-in-out infinite;
        }
        .eye-group-happy {
          animation: happy-bounce 1.5s ease-in-out infinite;
        }
        .eye-active {
          animation: blink-breath 4s ease-in-out infinite;
        }
        .eye-idle-blink {
          animation: blink-idle 5s ease-in-out infinite;
        }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.05); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.1); }
      `}} />
    </div>
  );
}

// --------------------------------------------------------------------------------------
// Subcomponents
// --------------------------------------------------------------------------------------

function PremiumAgentXLoader() {
  const [textIndex, setTextIndex] = useState(0);
  const phrases = [
    "Thinking about your request...",
    "Searching global index...",
    "Analyzing career context...",
    "Agents deployed..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % phrases.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [phrases.length]);

  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="relative w-14 h-14 mb-8">
        <div className="absolute inset-0 rounded-full blur-[12px] animate-[spin_3s_linear_infinite] opacity-80"
          style={{ background: 'conic-gradient(from 0deg, #ff2a85, #8a2be2, #4169e1, #ff2a85)' }} />
        <div className="absolute inset-0 rounded-full blur-[16px] animate-[spin_4s_linear_infinite_reverse] opacity-80"
          style={{ background: 'conic-gradient(from 180deg, #4169e1, #8a2be2, #ff2a85, #4169e1)' }} />
        <div className="absolute inset-[3px] bg-[#0A0A0A] rounded-full z-10 flex items-center justify-center border border-white/10 shadow-[inset_0_2px_10px_rgba(255,255,255,0.1)]">
          <Hexagon className="w-5 h-5 text-white/90 animate-pulse drop-shadow-[0_0_10px_rgba(255,255,255,0.6)]" />
        </div>
      </div>
      <div className="h-6 relative overflow-hidden flex items-center justify-center min-w-[200px]">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={textIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="text-[13.5px] font-medium tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-white via-white/70 to-white"
          >
            {phrases[textIndex]}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function LiveTimer({ startedAt }: { startedAt: number }) {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed((Date.now() - startedAt) / 1000);
    }, 100);
    return () => clearInterval(interval);
  }, [startedAt]);
  return <span>{Math.floor(elapsed)}s</span>;
}

const getStageText = (id: string, status: string) => {
  const activeOrPending = status === "active" || status === "pending";
  switch (id) {
    case "read_resume": return activeOrPending ? "Reading profile..." : "Read profile";
    case "build_context": return activeOrPending ? "Thinking..." : "Built context";
    case "select_tools": return activeOrPending ? "Selecting tools..." : "Selected tools";
    case "find_companies": return activeOrPending ? "Searching web..." : "Searched web";
    case "understand_jobs": return activeOrPending ? "Analyzing jobs..." : "Analyzed jobs";
    case "compare_exp": return activeOrPending ? "Comparing experience..." : "Compared experience";
    case "prepare_recs": return activeOrPending ? "Preparing recommendations..." : "Prepared recommendations";
    case "monitor": return activeOrPending ? "Monitoring continuously..." : "Monitoring continuously";
    default: return activeOrPending ? "Thinking..." : "Completed";
  }
};

function TimelineStep({ stage, isLast, formatTime }: { stage: PipelineStage, isLast: boolean, formatTime: (t?: number) => string }) {
  const isActive = stage.status === "active";
  const isCompleted = stage.status === "completed";
  const isPending = stage.status === "pending";
  const Icon = stage.icon;

  if (isPending) return null;

  const stageText = getStageText(stage.id, stage.status);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={`flex gap-4 relative py-2.5 ${isCompleted ? 'opacity-50 hover:opacity-100 transition-opacity' : ''}`}
    >
      {/* Bare Icon container (no background) */}
      <div className="w-6 flex justify-center shrink-0 z-10 pt-[2px]">
        {isActive && stage.id === "build_context" ? (
          <Loader2 className="w-4 h-4 text-white/70 animate-spin" />
        ) : (
          <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-white/40'}`} />
        )}
      </div>

      <div className="flex flex-col justify-center min-h-[24px]">
        <div className="flex items-center gap-1.5">
          <h4 className={`text-[13.5px] font-medium tracking-tight ${isActive ? 'text-white' : 'text-white/70'}`}>
            {stage.id === "build_context" 
              ? (isCompleted 
                  ? `Thought for ${Math.floor((stage.duration || 0) / 1000)} seconds`
                  : "Thinking about your request")
              : stageText}
          </h4>

          {isActive && stage.id === "build_context" && stage.startedAt && (
            <span className="text-[13.5px] text-white/50 flex items-center gap-1.5">
              <span className="text-white/30">•</span> <LiveTimer startedAt={stage.startedAt} />
            </span>
          )}
        </div>

        {/* Monospaced Subtitle for non-thinking stages */}
        {stage.id !== "build_context" && stage.description && (
          <p className="text-[12px] font-mono text-white/50 mt-1 tracking-tight leading-relaxed">
            {stage.description}
          </p>
        )}

        {/* Extracted Links */}
        {stage.links && stage.links.length > 0 && (
          <div className="flex flex-col gap-1.5 mt-2 border-l-2 border-white/10 pl-3">
            {stage.links.map((link, i) => {
              try {
                const domain = new URL(link).hostname.replace('www.', '');
                return (
                  <a key={i} href={link} target="_blank" rel="noopener noreferrer" className="text-[11px] font-mono text-purple-400/80 hover:text-purple-300 truncate max-w-[200px] flex items-center gap-1.5 transition-colors">
                    <Globe className="w-3 h-3 shrink-0" /> {domain}
                  </a>
                );
              } catch { return null; }
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function DetailedOpportunityCard({ company, role, location, match, detailed_summary, source_url, logo }: { company: string, role: string, location: string, match: number, detailed_summary: string, source_url?: string, logo?: string }) {
  return (
    <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-[20px] p-5 flex flex-col hover:bg-white/[0.04] transition-all duration-300 relative overflow-hidden group shadow-lg h-full">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="flex gap-3 items-center">
          <div className="w-12 h-12 bg-black/40 rounded-[14px] flex items-center justify-center shrink-0 shadow-inner border border-white/5">
            {logo}
          </div>
          <div>
            <h3 className="font-semibold text-white/95 text-[14px] leading-tight mb-1">{company}</h3>
            <p className="text-white/60 text-[12px]">{role}</p>
            <p className="text-white/40 text-[10px] flex items-center gap-1 mt-1 font-medium tracking-wide uppercase">
              <MapPin className="w-2.5 h-2.5" /> {location}
            </p>
          </div>
        </div>
        <div className="bg-purple-500/10 text-purple-300 text-[10px] px-2.5 py-1 rounded-full border border-purple-500/20 font-semibold shrink-0 shadow-inner">
          {match}
        </div>
      </div>

      <div className="flex-1 mb-5 relative z-10">
        <h4 className="text-white/70 text-[11px] uppercase tracking-wider font-semibold mb-2 flex items-center gap-1.5"><BrainCircuit className="w-3.5 h-3.5 text-purple-400" /> AI Analysis</h4>
        <p className="text-white/50 text-[12.5px] leading-relaxed line-clamp-4">
          {detailed_summary}
        </p>
      </div>

      {source_url ? (
        <a href={source_url} target="_blank" rel="noopener noreferrer" className="w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-[12px] text-[12px] font-medium text-white/90 flex justify-center items-center gap-2 transition-all relative z-10 group-hover:border-white/20 mt-auto">
          View Source <Globe className="w-3.5 h-3.5 text-white/50 group-hover:text-white transition-colors" />
        </a>
      ) : (
        <button disabled className="w-full py-2.5 bg-white/5 border border-white/5 rounded-[12px] text-[12px] font-medium text-white/30 flex justify-center items-center gap-2 mt-auto cursor-not-allowed">
          No Source Available
        </button>
      )}
    </div>
  );
}

function InsightCard({ icon: Icon, text }: { icon: React.ElementType, text: string }) {
  return (
    <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-[16px] p-4 flex gap-3.5 items-start hover:bg-white/[0.04] transition-all cursor-default shadow-md h-full">
      <div className="w-9 h-9 rounded-full bg-black/40 border border-white/5 flex items-center justify-center shrink-0 shadow-inner mt-0.5">
        <Icon className="w-4 h-4 text-white/70" />
      </div>
      <p className="text-white/60 text-[12.5px] leading-relaxed pt-1.5">{text}</p>
    </div>
  );
}

function MessageBar({ onDeploy }: { onDeploy: (q: string) => void }) {
  const [input, setInput] = useState("");

  const handleDeploy = () => {
    if (input.trim()) {
      onDeploy(input.trim());
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white/[0.02] backdrop-blur-[50px] saturate-[180%] border border-white/[0.08] rounded-[24px] p-4 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),0_16px_48px_rgba(0,0,0,0.6)] relative group hover:border-white/[0.12] transition-all duration-300">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-3">
        <div className="flex-1 bg-black/40 border border-white/10 rounded-full px-5 py-2.5 flex items-center transition-all focus-within:border-purple-500/30 focus-within:bg-black/60 shadow-[inset_0_1px_1px_rgba(0,0,0,0.5)]">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleDeploy()}
            placeholder="Find remote React internships"
            className="w-full bg-transparent text-white/90 text-[13.5px] outline-none placeholder:text-white/30"
          />
        </div>
        <button
          onClick={handleDeploy}
          className="relative flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-[13px] font-semibold text-white transition-all duration-300 group overflow-hidden hover:scale-[1.02] active:scale-[0.98] shrink-0"
          style={{
            background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.25) 0%, rgba(236, 72, 153, 0.1) 100%)',
            boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.2), 0 4px 15px rgba(0,0,0,0.2), 0 0 20px rgba(168,85,247,0.2)',
          }}
        >
          {/* Glowing spinning border */}
          <div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              padding: "1px",
              mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              maskComposite: "exclude",
              WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "xor",
            }}
          >
            <div className="absolute top-1/2 left-1/2 w-[200%] aspect-square -translate-x-1/2 -translate-y-1/2">
              <div className="w-full h-full animate-[spin_4s_linear_infinite]" style={{ background: "conic-gradient(from 0deg, transparent 0 340deg, rgba(168,85,247,0.8) 360deg)" }} />
            </div>
          </div>
          <Rocket className="w-3.5 h-3.5 relative z-10 text-purple-300 group-hover:scale-110 transition-transform duration-300" />
          <span className="relative z-10">Deploy Mission</span>
        </button>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1">
        <span className="text-white/40 text-[11px] font-medium mr-2 shrink-0">Quick Missions</span>

        <QuickMissionButton icon={<Globe className="w-3 h-3" />} text="Remote Jobs" />
        <QuickMissionButton icon={<Code className="w-3 h-3" />} text="Frontend Roles" />
        <QuickMissionButton icon={<Sparkles className="w-3 h-3" />} text="AI / ML Roles" />
        <QuickMissionButton icon={<Rocket className="w-3 h-3" />} text="Startups" />
        <QuickMissionButton icon={<Layers className="w-3 h-3" />} text="Full Stack" />
        <QuickMissionButton icon={<UserCircle className="w-3 h-3" />} text="Analyze My Profile" />
      </div>
    </div>
  );
}

function QuickMissionButton({ icon, text }: { icon: React.ReactNode, text: string }) {
  return (
    <button className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-white/[0.05] bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/[0.12] hover:text-white text-white/60 text-[11px] font-medium transition-all shrink-0 active:scale-95 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
      {icon} {text}
    </button>
  );
}
