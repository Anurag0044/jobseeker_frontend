"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

  useEffect(() => {
    let isMounted = true;

    const runPipeline = async () => {
      // Small initial delay
      await new Promise(r => setTimeout(r, 600));

      for (let i = 0; i < STAGE_DURATIONS.length; i++) {
        if (!isMounted) return;
        
        // 1. Mark as Active
        const startTime = Date.now();
        setActiveStageIndex(i);
        setStages(prev => {
          const next = [...prev];
          next[i] = { ...next[i], status: "active", startedAt: startTime };
          return next;
        });

        // 2. Wait for simulated duration
        await new Promise(r => setTimeout(r, STAGE_DURATIONS[i]));

        // 3. Mark as Completed
        if (!isMounted) return;
        const endTime = Date.now();
        setStages(prev => {
          const next = [...prev];
          next[i] = { 
            ...next[i], 
            status: "completed", 
            completedAt: endTime,
            duration: endTime - startTime
          };
          return next;
        });
        
        // Show results when reaching "Preparing recommendations"
        if (i === 6) {
           setShowResults(true);
        }

        // 4. Brief pause before next stage
        await new Promise(r => setTimeout(r, 300));
      }

      // 5. Final Stage (Monitoring)
      if (!isMounted) return;
      setActiveStageIndex(7);
      setStages(prev => {
        const next = [...prev];
        next[7] = { ...next[7], status: "active", startedAt: Date.now() };
        return next;
      });
    };

    runPipeline();

    return () => { isMounted = false; };
  }, []);

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
               <MessageBar />
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
                {/* Top Opportunities */}
                <div className="shrink-0 flex flex-col">
                  <h2 className="text-[14px] font-medium flex items-center gap-2 mb-4 text-white/90">
                    Recommended Opportunities <Sparkles className="text-purple-500 w-4 h-4" />
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <DetailedOpportunityCard 
                      company="Google"
                      role="Frontend Engineer Intern"
                      location="Bangalore, India"
                      match="98%"
                      desc="Strongly recommended. Your React and Next.js portfolio projects directly address their core infrastructure needs."
                      logo={
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="22px" height="22px">
                           <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                           <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                           <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
                           <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
                        </svg>
                      }
                    />
                    <DetailedOpportunityCard 
                      company="Microsoft"
                      role="Software Engineer Intern"
                      location="Hyderabad, India"
                      match="96%"
                      desc="Excellent fit. Evaluated highly due to your demonstrated problem solving skills and TypeScript proficiency."
                      logo={
                         <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 21 21">
                             <path fill="#f25022" d="M1 1h9v9H1z"/>
                             <path fill="#7fba00" d="M11 1h9v9h-9z"/>
                             <path fill="#00a4ef" d="M1 11h9v9H1z"/>
                             <path fill="#ffb900" d="M11 11h9v9h-9z"/>
                         </svg>
                      }
                    />
                    <DetailedOpportunityCard 
                      company="Notion"
                      role="Frontend Developer Intern"
                      location="Remote · Worldwide"
                      match="94%"
                      desc="High potential. Their product team seeks the exact UI development experience present in your background."
                      logo={
                        <div className="w-6 h-6 bg-white rounded flex items-center justify-center text-black font-serif font-bold text-[18px] leading-none tracking-tighter">
                          N
                        </div>
                      }
                    />
                  </div>
                </div>

                {/* AI Insights Row */}
                <div className="shrink-0 flex flex-col mb-4">
                  <h2 className="text-[14px] font-medium flex items-center gap-2 mb-4 text-white/90">
                    Career Insights <BrainCircuit className="text-purple-500 w-4 h-4" />
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                     <InsightCard icon={<Rocket className="w-4 h-4 text-indigo-400" />} text="Your portfolio is attracting high-growth AI startup opportunities." />
                     <InsightCard icon={<Briefcase className="w-4 h-4 text-emerald-400" />} text="Three new frontend internships match your specific niche today." />
                     <InsightCard icon={<Box className="w-4 h-4 text-purple-400" />} text="Acquiring Docker basics could significantly unlock backend roles." />
                     <InsightCard icon={<TrendingUp className="w-4 h-4 text-blue-400" />} text="Your latest React project increased your profile's market visibility." />
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

function DetailedOpportunityCard({ company, role, location, match, desc, logo }: any) {
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
      
      <p className="text-white/50 text-[12.5px] mb-5 flex-1 leading-relaxed relative z-10 line-clamp-3">
        {desc}
      </p>
      
      <button className="w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-[12px] text-[12px] font-medium text-white/90 flex justify-center items-center gap-2 transition-all relative z-10 group-hover:border-white/20 mt-auto">
        View Full Analysis <ArrowRight className="w-3.5 h-3.5 text-white/50 group-hover:text-white transition-colors" />
      </button>
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

function MessageBar() {
  return (
    <div className="w-full max-w-4xl mx-auto mt-4 bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl relative">
      <h3 className="text-white/80 text-[14px] font-medium mb-4">What would you like Forge to help you discover?</h3>
      
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
        <div className="flex-1 bg-black/40 border border-white/10 rounded-[12px] px-4 py-3 flex items-center transition-colors focus-within:border-purple-500/50 shadow-inner">
          <input 
            type="text" 
            placeholder="Find remote React internships" 
            className="w-full bg-transparent text-white/90 text-[14px] outline-none placeholder:text-white/30"
          />
        </div>
        <button className="bg-gradient-to-r from-purple-600 to-purple-400 hover:from-purple-500 hover:to-purple-300 text-white font-medium text-[13px] px-6 py-3 rounded-[12px] flex justify-center items-center gap-2 transition-all shadow-[0_0_15px_rgba(168,85,247,0.4)]">
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
