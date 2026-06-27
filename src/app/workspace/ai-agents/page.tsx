"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Sparkles,
  Search,
  FileText,
  Target,
  Send,
  Check,
  Rocket,
  Briefcase,
  Box,
  TrendingUp,
  MapPin,
  ArrowRight,
  BrainCircuit,
  Wrench,
  GitCompare,
  Radio,
  Clock,
  CheckCircle2,
  Loader2,
  Globe,
  Code,
  Layers,
  UserCircle
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

const STAGE_DURATIONS = [1200, 1500, 800, 2000, 1800, 2200, 1500]; // Durations for the first 7 stages

export default function ForgeAssistantPage() {
  const [stages, setStages] = useState<PipelineStage[]>(INITIAL_STAGES);
  const [activeStageIndex, setActiveStageIndex] = useState<number>(0);
  const [showResults, setShowResults] = useState(false);
  const [aiResponse, setAiResponse] = useState<string>("");

  const runMission = async (query: string) => {
    setStages(INITIAL_STAGES.map(s => ({ ...s, status: "pending" })));
    setShowResults(false);
    setAiResponse("");
    
    let fullResponse = "";
    
    const activateStage = (id: string) => {
      setStages(prev => {
        const next = [...prev];
        const idx = next.findIndex(s => s.id === id);
        if (idx !== -1) {
          setActiveStageIndex(idx);
          next[idx] = { ...next[idx], status: "active", startedAt: Date.now() };
        }
        return next;
      });
    };

    const completeStage = (id: string) => {
      setStages(prev => {
        const next = [...prev];
        const idx = next.findIndex(s => s.id === id);
        if (idx !== -1) {
          next[idx] = { 
            ...next[idx], 
            status: "completed", 
            completedAt: Date.now(),
            duration: Date.now() - (next[idx].startedAt || Date.now())
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
      setActiveStageIndex(-1);
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
        
      
      let isDone = false;
      while (!isDone) {
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
                  activateStage("find_companies");
                } else if (data.tool === "get_user_profile") {
                  activateStage("read_resume");
                }
              } else if (data.type === "tool_end") {
                if (data.tool === "search_web") {
                  completeStage("find_companies");
                  activateStage("compare_exp");
                } else if (data.tool === "get_user_profile") {
                  completeStage("read_resume");
                }
              } else if (data.type === "token") {
                fullResponse += data.content;
                // Try to loosely set aiResponse so user sees SOMETHING while streaming
                setAiResponse(prev => prev + data.content);
                // If we get tokens, the tools are done. Fast forward to prepare_recs if we aren't there yet.
                setStages(prev => {
                   const next = [...prev];
                   const prepIdx = next.findIndex(s => s.id === "prepare_recs");
                   if (next[prepIdx].status === "pending") {
                      // auto-complete previous stages
                      for(let i=0; i<prepIdx; i++) next[i].status = "completed";
                      next[prepIdx].status = "active";
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

  // Helper to format time HH:MM:SS
  const formatTime = (timestamp?: number) => {
    if (!timestamp) return "";
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const currentStageTitle = stages[activeStageIndex]?.title || "Working...";

  return (
    <div className="h-full w-full overflow-y-auto overflow-x-hidden text-white font-sans selection:bg-purple-500/30 p-4 md:p-6 bg-transparent custom-scrollbar">
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full min-h-full max-w-[1600px] mx-auto flex flex-col xl:flex-row gap-6 lg:gap-8"
      >
        
        {/* Left Side: Main Viewport */}
        <div className="flex-1 flex flex-col min-w-0">
          
          {/* Top Section: Header & Centered Globe */}
          <div className="relative w-full flex flex-col shrink-0 min-h-[350px] pt-2 pb-6 transition-all duration-700">
             
             {/* Header Row */}
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 w-full z-20">
               <div className="max-w-[450px]">
                 <h1 className="text-[24px] md:text-[28px] font-semibold tracking-tight text-white flex items-center gap-2 mb-1.5">
                   Forge Assistant <Sparkles className="w-5 h-5 text-purple-400" />
                 </h1>
                 <p className="text-white/50 text-[12px] md:text-[14px] leading-relaxed">
                   Your autonomous AI partner quietly discovers, analyzes, and curates the best opportunities for your career growth.
                 </p>
               </div>
               
               <div className="flex items-center gap-2.5 bg-black/40 backdrop-blur-md border border-white/10 rounded-full px-4 py-2 shrink-0 shadow-lg">
                  <div className={`w-2 h-2 rounded-full shadow-[0_0_8px_#a855f7] ${activeStageIndex === 7 ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-purple-500 animate-pulse'}`}></div>
                  <span className="text-white/80 text-[11px] md:text-[12px] font-medium tracking-wide">
                     {activeStageIndex === 7 ? "Monitoring active" : "Assistant active"}
                  </span>
               </div>
             </div>
             
             {/* Centered AI Globe */}
             <div className={`flex-1 flex flex-col items-center justify-center w-full z-10 mt-12 relative transition-all duration-1000 ${showResults ? 'mt-4 scale-[0.85]' : 'mt-12 scale-100'}`}>
               
               {/* Ambient Deep Space Glow */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[600px] h-[150px] md:h-[350px] bg-purple-600/10 blur-[100px] rounded-full pointer-events-none transition-all duration-1000"></div>
               
               {/* The Premium Globe */}
               <motion.div 
                 animate={activeStageIndex === 7 ? { y: [0, -4, 0] } : { y: [0, -12, 0] }}
                 transition={{ repeat: Infinity, duration: activeStageIndex === 7 ? 8 : 4, ease: "easeInOut" }}
                 className="relative w-[160px] h-[160px] md:w-[220px] md:h-[220px] rounded-full mb-8 shrink-0 transition-all duration-1000" 
                 style={{
                   background: activeStageIndex === 7 
                     ? 'radial-gradient(circle at 35% 35%, #38bdf8, #8b5cf6 45%, #4f46e5 85%)' 
                     : 'radial-gradient(circle at 35% 35%, #38bdf8, #a855f7 45%, #e11d48 85%)',
                   boxShadow: activeStageIndex === 7
                     ? '0 0 60px 10px rgba(139, 92, 246, 0.2), inset -15px -15px 40px rgba(0, 0, 0, 0.5), inset 15px 15px 40px rgba(255, 255, 255, 0.4)'
                     : '0 0 80px 15px rgba(168, 85, 247, 0.3), inset -15px -15px 40px rgba(0, 0, 0, 0.5), inset 15px 15px 40px rgba(255, 255, 255, 0.4)'
                 }}
               >
                  {/* Eyes / Core interface */}
                  <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-3 md:gap-4 transition-all duration-500">
                    <div className={`w-3 md:w-3.5 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,1)] transition-all duration-500 ${activeStageIndex === 7 ? 'h-4 md:h-5' : 'h-10 md:h-12'}`}></div>
                    <div className={`w-3 md:w-3.5 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,1)] transition-all duration-500 ${activeStageIndex === 7 ? 'h-4 md:h-5' : 'h-10 md:h-12'}`}></div>
                  </div>
                  
                  {/* Orbital Rings */}
                  <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] md:w-[420px] border rounded-[100%] pointer-events-none transition-all duration-1000 ${activeStageIndex === 7 ? 'h-[70px] md:h-[100px] border-white/[0.04] rotate-6' : 'h-[80px] md:h-[120px] border-white/[0.08] rotate-12'}`}></div>
                  <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] md:w-[520px] border rounded-[100%] pointer-events-none transition-all duration-1000 ${activeStageIndex === 7 ? 'h-[90px] md:h-[130px] border-white/[0.02] -rotate-3' : 'h-[100px] md:h-[150px] border-white/[0.04] -rotate-6'}`}></div>
               </motion.div>
               
               <div className="flex flex-col items-center">
                 <AnimatePresence mode="wait">
                   <motion.p 
                     key={currentStageTitle}
                     initial={{ opacity: 0, y: 5 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, y: -5 }}
                     transition={{ duration: 0.3 }}
                     className="text-white/80 text-[15px] md:text-[16px] tracking-wide font-light text-center"
                   >
                     {currentStageTitle}...
                   </motion.p>
                 </AnimatePresence>
                 
                 <div className="w-48 md:w-64 h-[2px] bg-white/10 mt-4 relative overflow-hidden rounded-full">
                   {activeStageIndex !== 7 ? (
                     <div className="absolute top-0 w-16 md:w-20 h-full bg-purple-500 rounded-full shadow-[0_0_12px_#a855f7] animate-[ping-pong_2s_ease-in-out_infinite]"></div>
                   ) : (
                     <div className="absolute top-0 left-0 w-full h-full bg-emerald-500/30 rounded-full"></div>
                   )}
                 </div>
               </div>
             </div>
             
             {/* Message Bar Section */}
             <div className="w-full px-2 pb-8 z-20">
               <MessageBar onDeploy={runMission} />
             </div>

          </div>
          
          {/* Progressive Reveal: Results Section */}
          <AnimatePresence>
            {showResults && (
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                className="flex flex-col gap-6"
              >
                {/* AI Agent Markdown Summary */}
                <div className="shrink-0 flex flex-col mb-4 w-full">
                  <h2 className="text-[14px] font-medium flex items-center gap-2 mb-4 text-white/90">
                    AI Agent Findings <BrainCircuit className="text-purple-500 w-4 h-4" />
                  </h2>
                  <div className="p-6 bg-white/[0.03] border border-white/[0.05] rounded-2xl text-white/90 leading-relaxed w-full shadow-lg">
                    {aiResponse ? (
                      <div className="prose prose-invert prose-purple max-w-none">
                        <ReactMarkdown 
                          remarkPlugins={[remarkGfm]}
                          components={{
                            a: ({node, ...props}) => <a {...props} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 font-medium underline underline-offset-2 transition-colors" />,
                            h1: ({node, ...props}) => <h1 {...props} className="text-2xl font-bold mt-6 mb-4 text-white" />,
                            h2: ({node, ...props}) => <h2 {...props} className="text-xl font-bold mt-5 mb-3 text-white/95" />,
                            h3: ({node, ...props}) => <h3 {...props} className="text-lg font-semibold mt-4 mb-2 text-white/90" />,
                            ul: ({node, ...props}) => <ul {...props} className="list-disc pl-5 mb-4 space-y-1 text-white/80" />,
                            ol: ({node, ...props}) => <ol {...props} className="list-decimal pl-5 mb-4 space-y-1 text-white/80" />,
                            li: ({node, ...props}) => <li {...props} className="text-[14.5px] leading-relaxed" />,
                            p: ({node, ...props}) => <p {...props} className="mb-4 text-[14.5px] leading-relaxed text-white/80" />,
                            strong: ({node, ...props}) => <strong {...props} className="font-semibold text-white/95" />,
                          }}
                        >
                          {aiResponse}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <span className="animate-pulse text-white/50 text-[14.5px]">Synthesizing findings...</span>
                    )}
                  </div>
                </div>

              </motion.div>
            )}
          </AnimatePresence>
          
        </div>
        
        {/* Right Side: Activity Timeline */}
        <div className="w-full xl:w-[380px] flex flex-col shrink-0">
          
          <div className="bg-black/30 backdrop-blur-2xl border border-white/5 rounded-[24px] p-6 shadow-2xl relative overflow-hidden flex flex-col h-full min-h-[500px]">
            <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent pointer-events-none"></div>
            
            <div className="flex justify-between items-center mb-6 relative z-10">
               <h2 className="text-[15px] font-medium flex items-center gap-2 text-white">
                 Activity Timeline
               </h2>
               {activeStageIndex === 7 && (
                  <span className="text-[11px] px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-medium border border-emerald-500/20 flex items-center gap-1.5">
                     <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div> Active
                  </span>
               )}
            </div>
            {/* Timeline Steps */}
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 relative z-10">
               <div className="absolute left-[23px] top-6 bottom-6 w-[1px] bg-white/[0.08]"></div>
               
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
        
      </motion.div>
      
      {/* Styles */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes ping-pong {
          0% { left: 0%; transform: translateX(0); }
          50% { left: 100%; transform: translateX(-100%); }
          100% { left: 0%; transform: translateX(0); }
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

function TimelineStep({ stage, isLast, formatTime }: { stage: PipelineStage, isLast: boolean, formatTime: (t?: number) => string }) {
  const isActive = stage.status === "active";
  const isCompleted = stage.status === "completed";
  const isPending = stage.status === "pending";
  const Icon = stage.icon;

  if (isPending) {
    return (
      <div className="flex gap-4 relative py-3 opacity-30">
         <div className="w-12 flex justify-center shrink-0 z-10">
           <div className="w-12 h-12 rounded-full bg-black/40 border border-white/5 flex items-center justify-center">
             <Icon className="w-4 h-4 text-white/50" />
           </div>
         </div>
         <div className="flex flex-col justify-center">
           <h4 className="text-[14px] font-medium text-white/50">{stage.title}</h4>
         </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={false}
      animate={{ opacity: 1, height: 'auto' }}
      className={`flex gap-4 relative py-3 ${isCompleted ? 'opacity-70 hover:opacity-100 transition-opacity' : ''}`}
    >
       <div className="w-12 flex justify-center shrink-0 z-10">
         <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 shadow-lg ${
           isActive 
             ? 'bg-purple-600/20 border border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.3)]' 
             : 'bg-white/5 border border-white/10'
         }`}>
           {isCompleted ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <Icon className={`w-5 h-5 ${isActive ? 'text-purple-400' : 'text-white/60'}`} />}
         </div>
       </div>
       
       <div className="flex flex-col justify-center min-h-[48px] pt-0.5">
         <div className="flex items-center gap-3 mb-1">
           <h4 className={`text-[14px] font-medium ${isActive ? 'text-white' : 'text-white/80'}`}>
             {stage.title}
           </h4>
           {isActive && <Loader2 className="w-3 h-3 text-purple-400 animate-spin" />}
           {isCompleted && stage.duration && (
             <span className="text-[10px] text-white/30 tracking-wider">
               {(stage.duration / 1000).toFixed(1)}s
             </span>
           )}
         </div>
         
         {/* Expand description only if active */}
         <AnimatePresence>
           {isActive && (
             <motion.div
               initial={{ opacity: 0, height: 0 }}
               animate={{ opacity: 1, height: 'auto' }}
               exit={{ opacity: 0, height: 0 }}
               className="overflow-hidden"
             >
               <p className="text-[12.5px] text-white/50 leading-relaxed mt-1 pr-4">
                 {stage.description}
               </p>
               <div className="flex items-center gap-3 mt-3">
                 <div className="flex items-center gap-1.5 text-[10px] text-white/40 uppercase tracking-widest font-semibold">
                   <Clock className="w-3 h-3" /> 
                   Started {formatTime(stage.startedAt)}
                 </div>
               </div>
             </motion.div>
           )}
         </AnimatePresence>
       </div>
    </motion.div>
  );
}

function DetailedOpportunityCard({ company, role, location, match, detailed_summary, source_url, logo }: any) {
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

function InsightCard({ icon, text }: any) {
  return (
    <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-[16px] p-4 flex gap-3.5 items-start hover:bg-white/[0.04] transition-all cursor-default shadow-md h-full">
      <div className="w-9 h-9 rounded-full bg-black/40 border border-white/5 flex items-center justify-center shrink-0 shadow-inner mt-0.5">
        {icon}
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
    <div className="w-full max-w-4xl mx-auto mt-4 bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl relative">
      <h3 className="text-white/80 text-[14px] font-medium mb-4">What would you like Forge to help you discover?</h3>
      
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
        <div className="flex-1 bg-black/40 border border-white/10 rounded-[12px] px-4 py-3 flex items-center transition-colors focus-within:border-purple-500/50 shadow-inner">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleDeploy()}
            placeholder="Find remote React internships" 
            className="w-full bg-transparent text-white/90 text-[14px] outline-none placeholder:text-white/30"
          />
        </div>
        <button 
          onClick={handleDeploy}
          className="bg-gradient-to-r from-purple-600 to-purple-400 hover:from-purple-500 hover:to-purple-300 text-white font-medium text-[13px] px-6 py-3 rounded-[12px] flex justify-center items-center gap-2 transition-all shadow-[0_0_15px_rgba(168,85,247,0.4)]"
        >
          <Send className="w-4 h-4" /> Deploy Mission
        </button>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-2">
        <span className="text-white/50 text-[12px] font-medium mr-2 shrink-0">Quick Missions</span>
        
        <QuickMissionButton icon={<Globe className="w-3.5 h-3.5" />} text="Remote Jobs" />
        <QuickMissionButton icon={<Code className="w-3.5 h-3.5" />} text="Frontend Roles" />
        <QuickMissionButton icon={<Sparkles className="w-3.5 h-3.5" />} text="AI / ML Roles" />
        <QuickMissionButton icon={<Rocket className="w-3.5 h-3.5" />} text="Startups" />
        <QuickMissionButton icon={<Layers className="w-3.5 h-3.5" />} text="Full Stack" />
        <QuickMissionButton icon={<UserCircle className="w-3.5 h-3.5" />} text="Analyze My Profile" />
      </div>
    </div>
  );
}

function QuickMissionButton({ icon, text }: { icon: React.ReactNode, text: string }) {
  return (
    <button className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-[11px] font-medium transition-colors shrink-0">
      {icon} {text}
    </button>
  );
}
