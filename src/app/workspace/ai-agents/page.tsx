"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Sparkles, Search, FileText, Target, Send, Check, Rocket,
  Briefcase, Box, TrendingUp, MapPin, ArrowRight, BrainCircuit,
  Wrench, GitCompare, Radio, Clock, CheckCircle2, Loader2, Globe,
  Code, Layers, UserCircle, Hexagon, Cpu, MessageSquare, Plus, Trash2, X, History, Zap, ArrowUp, SquarePen
} from "lucide-react";
import ResumePreview, { ResumeData } from "@/components/resume/ResumePreview";


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

export interface ChatMessage {
  id: string;
  role: "user" | "agent";
  content: string;
  mode?: "instant" | "expert" | "corporate";
}

interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
}

const STORAGE_KEY = "agentx_chat_sessions";
const ACTIVE_SESSION_KEY = "agentx_active_session";

function loadSessions(): ChatSession[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveSessions(sessions: ChatSession[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

function saveActiveId(id: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(ACTIVE_SESSION_KEY, id);
}

function loadActiveId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACTIVE_SESSION_KEY);
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

const CORPORATE_STAGES: PipelineStage[] = [
  { id: "thought_process", title: "Thought process", description: "Analyzing the prompt for optimal document layout.", icon: BrainCircuit, status: "pending" },
  { id: "agent_generating", title: "Agent is generating hold tight", description: "Drafting the professional document with precision.", icon: Rocket, status: "pending" }
];

const SplitText = ({ text, delayOffset = 0, className = "" }: { text: string, delayOffset?: number, className?: string }) => {
  return (
    <span className={className}>
      {text.split("").map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, filter: "blur(3px)", y: 4 }}
          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          transition={{
            duration: 0.5,
            delay: delayOffset + index * 0.02,
            ease: [0.2, 0.65, 0.3, 0.9],
          }}
          className="inline-block whitespace-pre"
        >
          {char}
        </motion.span>
      ))}
    </span>
  );
};

export default function AgentXPage() {
  const [stages, setStages] = useState<PipelineStage[]>(INITIAL_STAGES);
  const [activeStageIndex, setActiveStageIndex] = useState<number>(0);
  const [showResults, setShowResults] = useState(false);
  const [isDeployingAgents, setIsDeployingAgents] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Session management
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string>("");
  const [showRecentChats, setShowRecentChats] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState<"instant" | "expert" | "corporate">("expert");

  const handleModeSwitch = (newMode: "instant" | "expert" | "corporate") => {
    setMode(newMode);
    setShowResults(false);
    setStages(INITIAL_STAGES.map(s => ({ ...s, status: "pending" })));
    setActiveStageIndex(0);
  };

  // Load sessions from localStorage on mount
  useEffect(() => {
    setMounted(true);
    const loaded = loadSessions();
    if (loaded.length > 0) {
      setSessions(loaded);
      const savedActiveId = loadActiveId();
      const activeSession = savedActiveId ? loaded.find(s => s.id === savedActiveId) : loaded[0];
      if (activeSession) {
        setActiveSessionId(activeSession.id);
        setChatHistory(activeSession.messages);
      }
    } else {
      const newSession = createNewSession();
      setSessions([newSession]);
      setActiveSessionId(newSession.id);
    }
  }, []);

  // Persist sessions whenever chatHistory changes
  useEffect(() => {
    if (!activeSessionId || chatHistory.length === 0) return;
    setSessions(prev => {
      const updated = prev.map(s => {
        if (s.id !== activeSessionId) return s;
        // Auto-generate title from first user message
        const firstUserMsg = chatHistory.find(m => m.role === "user");
        const title = firstUserMsg ? firstUserMsg.content.slice(0, 50) + (firstUserMsg.content.length > 50 ? "..." : "") : s.title;
        return { ...s, messages: chatHistory, title, updatedAt: Date.now() };
      });
      saveSessions(updated);
      return updated;
    });
  }, [chatHistory, activeSessionId]);

  function createNewSession(): ChatSession {
    return {
      id: `session_${Date.now()}`,
      title: "New Chat",
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
  }

  const handleNewChat = () => {
    const newSession = createNewSession();
    setSessions(prev => {
      const updated = [newSession, ...prev];
      saveSessions(updated);
      return updated;
    });
    setActiveSessionId(newSession.id);
    saveActiveId(newSession.id);
    setChatHistory([]);
    setStages(INITIAL_STAGES.map(s => ({ ...s, status: "pending" })));
    setShowResults(false);
    setShowRecentChats(false);
  };

  const handleSwitchSession = (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (!session) return;
    setActiveSessionId(session.id);
    saveActiveId(session.id);
    setChatHistory(session.messages);
    setStages(INITIAL_STAGES.map(s => ({ ...s, status: "pending" })));
    setShowResults(session.messages.length > 0);
    setShowRecentChats(false);
  };

  const handleDeleteSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSessions(prev => {
      const updated = prev.filter(s => s.id !== sessionId);
      saveSessions(updated);
      if (sessionId === activeSessionId) {
        if (updated.length > 0) {
          setActiveSessionId(updated[0].id);
          saveActiveId(updated[0].id);
          setChatHistory(updated[0].messages);
        } else {
          const newSession = createNewSession();
          updated.push(newSession);
          saveSessions(updated);
          setActiveSessionId(newSession.id);
          saveActiveId(newSession.id);
          setChatHistory([]);
        }
      }
      return updated;
    });
  };

  const scrollToBottom = () => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTo({
        top: chatScrollRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

<<<<<<< HEAD
  const runMission = async (query: string, missionMode: "instant" | "expert" | "corporate" = "expert") => {
=======
  // Ref to ensure one-shot state transitions during streaming
  const deployingAgentsClearedRef = useRef(false);

  const runMission = async (query: string, missionMode: "instant" | "expert" | "corporate" = "expert") => {
    // Reset the one-shot guard for each new mission
    deployingAgentsClearedRef.current = false;
>>>>>>> main
    const lowerQuery = query.toLowerCase();
    const isGenerationRequest = lowerQuery.includes("generate") || lowerQuery.includes("create") || lowerQuery.includes("build") || lowerQuery.includes("make") || lowerQuery.includes("write");
    const isDocumentRequest = lowerQuery.includes("resume") || lowerQuery.includes("cv") || lowerQuery.includes("portfolio") || lowerQuery.includes("document");

    if (missionMode !== "corporate" && isGenerationRequest && isDocumentRequest) {
      const userMsg: ChatMessage = { id: Date.now().toString(), role: "user", content: query, mode: missionMode };
      const agentMsg: ChatMessage = { 
        id: (Date.now() + 1).toString(), 
        role: "agent", 
        content: "I apologize, but document generation (such as Resumes, CVs, and Portfolios) is exclusively available in **Corporate Mode**.\n\nPlease switch to Corporate Mode to access these premium templates and generation features.", 
        mode: missionMode 
      };
      setChatHistory(prev => [...prev, userMsg, agentMsg]);
      setShowResults(true);
      return;
    }

    const targetStages = missionMode === "corporate" ? CORPORATE_STAGES : INITIAL_STAGES;
    setStages(targetStages.map(s => ({ ...s, status: "pending" })));
    setShowResults(true);
    setIsDeployingAgents(false);

    const missionStartTime = Date.now();

    const userMsg: ChatMessage = { id: Date.now().toString(), role: "user", content: query, mode: missionMode };
    const agentMsgId = (Date.now() + 1).toString();
    const agentMsg: ChatMessage = { id: agentMsgId, role: "agent", content: "", mode: missionMode };

    setChatHistory(prev => [...prev, userMsg, agentMsg]);

    let fullResponse = "";

    const activateStage = (id: string, description?: string) => {
      setStages(prev => {
        const next = [...prev];
        // Auto-complete any currently active stages EXCEPT build_context and agent_generating
        for (let i = 0; i < next.length; i++) {
          if (next[i].status === "active" && next[i].id !== id && next[i].id !== "build_context" && next[i].id !== "agent_generating") {
            next[i] = {
              ...next[i],
              status: "completed",
              completedAt: Date.now(),
              duration: Date.now() - (next[i].startedAt || Date.now())
            };
          }
        }
        const idx = next.findIndex(s => s.id === id);
        if (idx !== -1 && next[idx].id !== "build_context") {
          setActiveStageIndex(idx);
          next[idx] = {
            ...next[idx],
            status: "active",
            startedAt: Date.now(),
            description: description || next[idx].description
          };
        } else if (idx !== -1 && next[idx].id === "build_context" && next[idx].status !== "active") {
          // Only activate build_context if it isn't already active
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

    if (missionMode === "corporate") {
      activateStage("thought_process");
      setTimeout(() => {
        completeStage("thought_process");
        activateStage("agent_generating");
      }, 1500);
    } else {
      activateStage("build_context");
    }

    let hasWrappedUp = false;
    const wrapUp = () => {
      if (hasWrappedUp) return;
      hasWrappedUp = true;

      // Compute real durations for every stage using missionStartTime
      setStages(prev => prev.map(s => {
        const now = Date.now();
        if (s.status === "completed" && s.duration && s.duration > 0) {
          // Already has a valid duration, preserve it
          return s;
        }
        return {
          ...s,
          status: "completed" as const,
          completedAt: now,
          duration: (s.id === "build_context" || s.id === "agent_generating")
            ? now - missionStartTime
            : s.startedAt ? now - s.startedAt : 0
        };
      }));
      setActiveStageIndex(7);
      setShowResults(true);

      setTimeout(() => {
        const msgEl = document.getElementById(`msg-${agentMsgId}`);
        if (msgEl && chatScrollRef.current) {
          chatScrollRef.current.scrollTo({
            top: msgEl.offsetTop - 20,
            behavior: "smooth"
          });
        }
      }, 100);
    };

    try {
      const API_URL = process.env.NEXT_PUBLIC_BACK_API_URL || "https://one-forge-x.onrender.com";
      const res = await fetch(`${API_URL}/api/v1/assistant/stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query,
          history: chatHistory.map(m => ({ role: m.role, content: m.content })),
          phone_number: "test_user",
          mode: mode
        }),
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
                  setIsDeployingAgents(true);
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
<<<<<<< HEAD
                setIsDeployingAgents(false);
=======
                // Only clear the deploying state once, not on every single token
                if (!deployingAgentsClearedRef.current) {
                  deployingAgentsClearedRef.current = true;
                  setIsDeployingAgents(false);
                }
>>>>>>> main
                fullResponse += data.content;
                setChatHistory(prev => {
                  const next = [...prev];
                  const lastIdx = next.length - 1;
                  if (lastIdx >= 0 && next[lastIdx].role === "agent") {
                    next[lastIdx] = { ...next[lastIdx], content: next[lastIdx].content + data.content };
                  }
                  return next;
                });
<<<<<<< HEAD
=======
                // Compute whether prepare_recs needs to be activated BEFORE calling setStages
                // so we avoid calling setActiveStageIndex() inside a setStages updater (causes infinite loops)
>>>>>>> main
                setStages(prev => {
                  const next = [...prev];
                  const prepIdx = next.findIndex(s => s.id === "prepare_recs");
                  if (prepIdx !== -1 && next[prepIdx].status === "pending") {
                    const now = Date.now();
<<<<<<< HEAD
                    // Complete all prior stages, build_context gets real total thinking time
=======
                    // Complete all prior stages; build_context gets real total thinking time
>>>>>>> main
                    for (let i = 0; i < prepIdx; i++) {
                      if (next[i].status !== "completed") {
                        next[i] = {
                          ...next[i],
                          status: "completed" as const,
                          completedAt: now,
                          duration: next[i].id === "build_context"
                            ? now - missionStartTime
                            : next[i]?.startedAt ? now - (next[i]?.startedAt ?? 0) : 0
                        };
                      }
                    }
<<<<<<< HEAD
                    next[prepIdx].status = "active";
                    next[prepIdx].startedAt = now;
                    setActiveStageIndex(prepIdx);
=======
                    next[prepIdx] = { ...next[prepIdx], status: "active", startedAt: Date.now() };
                    // Schedule activeStageIndex update outside this updater to avoid nested setState
                    setTimeout(() => setActiveStageIndex(prepIdx), 0);
>>>>>>> main
                  }
                  return next;
                });
              } else if (data.type === "done") {
                wrapUp();
              } else if (data.type === "error") {
                console.error("Backend error:", data.error);
                alert("The AI agent encountered an error: " + data.error);
                setStages(targetStages.map(s => ({ ...s, status: "pending" })));
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
              <button
                onClick={() => setShowRecentChats(prev => !prev)}
                className="flex items-center gap-2 px-4 py-2 bg-white/[0.04] backdrop-blur-md border border-white/[0.08] rounded-full text-[12px] font-medium text-white/70 hover:text-white hover:border-white/[0.15] transition-all shrink-0"
              >
                <MessageSquare className="w-3.5 h-3.5" /> Recent Chats
              </button>
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
                  className={`relative shrink-0 ${mode === 'corporate' ? 'w-[180px] h-[180px] md:w-[240px] md:h-[240px]' : 'w-[150px] h-[150px] md:w-[200px] md:h-[200px]'} transition-all duration-1000`}
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

                        <linearGradient id="tieCore" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#f59e0b" />
                          <stop offset="50%" stopColor="#fbbf24" />
                          <stop offset="100%" stopColor="#d97706" />
                        </linearGradient>

                        <linearGradient id="lapelGlow" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.02" />
                        </linearGradient>
                      </defs>

                      {mode === 'corporate' ? (
                        <>
                          <defs>
                            <linearGradient id="suitBase" x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" stopColor="#1e1b2e" />
                              <stop offset="100%" stopColor="#09080d" />
                            </linearGradient>
                            <linearGradient id="vestBase" x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" stopColor="#151221" />
                              <stop offset="100%" stopColor="#000000" />
                            </linearGradient>
                            <linearGradient id="tieDark" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#1e1b3a" />
                              <stop offset="50%" stopColor="#3b3269" />
                              <stop offset="100%" stopColor="#0a0914" />
                            </linearGradient>
                            <radialGradient id="headGrad" cx="40%" cy="30%" r="60%">
                              <stop offset="0%" stopColor="#352c4a" />
                              <stop offset="50%" stopColor="#13101c" />
                              <stop offset="100%" stopColor="#05040a" />
                            </radialGradient>
                            <clipPath id="hexClip">
                              <polygon points="50,2 91.5,26 91.5,74 50,98 8.5,74 8.5,26" />
                            </clipPath>
                          </defs>

                          {/* Outer Glass Hexagon */}
                          <polygon points="50,2 91.5,26 91.5,74 50,98 8.5,74 8.5,26" fill="none" stroke="#a855f7" strokeWidth="0.6" filter="drop-shadow(0 0 4px rgba(168,85,247,0.8))" opacity="0.9" />
                          <polygon points="50,3.5 89.5,26.5 89.5,73.5 50,96.5 10.5,73.5 10.5,26.5" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.3" />

                          {/* Masked Body */}
                          <g clipPath="url(#hexClip)">
                            {/* Ambient background inside frame */}
                            <polygon points="50,2 91.5,26 91.5,74 50,98 8.5,74 8.5,26" fill="rgba(10,5,20,0.4)" />

                            {/* Shoulders / Jacket Base */}
                            <path d="M 0 100 L 0 70 C 15 65, 30 55, 42 50 C 47 48, 53 48, 58 50 C 70 55, 85 65, 100 70 L 100 100 Z" fill="url(#suitBase)" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />

                            {/* Inner Vest */}
                            <path d="M 25 100 L 40 60 L 50 70 L 60 60 L 75 100 Z" fill="url(#vestBase)" />

                            {/* Shirt Background */}
                            <path d="M 40 60 L 50 85 L 60 60 Z" fill="#ffffff" />

                            {/* Collar */}
                            <polygon points="40,58 50,70 47,56" fill="#e2e8f0" filter="drop-shadow(1px 2px 2px rgba(0,0,0,0.2))" />
                            <polygon points="60,58 50,70 53,56" fill="#cbd5e1" filter="drop-shadow(-1px 2px 2px rgba(0,0,0,0.2))" />
                            <polygon points="43,56 50,62 57,56" fill="#000000" opacity="0.7" />

                            {/* Tie */}
                            <polygon points="48.5,67 51.5,67 51,71 49,71" fill="url(#tieDark)" filter="drop-shadow(0 2px 2px rgba(0,0,0,0.6))" />
                            <polygon points="49,72 51,72 53.5,95 50,100 46.5,95" fill="url(#tieDark)" filter="drop-shadow(0 2px 6px rgba(0,0,0,0.6))" />

                            {/* Lapels */}
                            <path d="M 38 56 L 25 75 L 28 80 L 44 100 L 48 100 L 42 75 Z" fill="url(#suitBase)" stroke="rgba(255,255,255,0.08)" strokeWidth="0.3" filter="drop-shadow(3px 0 6px rgba(0,0,0,0.5))" />
                            <path d="M 62 56 L 75 75 L 72 80 L 56 100 L 52 100 L 58 75 Z" fill="url(#suitBase)" stroke="rgba(255,255,255,0.08)" strokeWidth="0.3" filter="drop-shadow(-3px 0 6px rgba(0,0,0,0.5))" />

                            {/* Pocket Square */}
                            <rect x="68" y="77" width="9" height="1.5" fill="#ffffff" transform="rotate(-6 68 77)" filter="drop-shadow(0 1px 1px rgba(0,0,0,0.3))" />

                            {/* Lapel Pin */}
                            <polygon points="32,70 34,71 34,73 32,74 30,73 30,71" fill="none" stroke="#a855f7" strokeWidth="0.5" filter="drop-shadow(0 0 3px #a855f7)" />
                            <circle cx="32" cy="72" r="0.5" fill="#ffffff" />

                            {/* Neck Shadow Drop */}
                            <polygon points="50,45 58,52 50,60 42,52" fill="#000" opacity="0.8" filter="blur(3px)" />

                            {/* 3D Glossy Head Hexagon */}
                            <polygon points="50,9 71.65,21.5 71.65,46.5 50,59 28.35,46.5 28.35,21.5" fill="url(#headGrad)" stroke="url(#glassBorder)" strokeWidth="0.8" filter="drop-shadow(0 12px 15px rgba(0,0,0,0.9))" />
                          </g>
                        </>
                      ) : (
                        <>
                          {/* Standard Mode Hexagon Body */}
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
                        </>
                      )}
                    </svg>

                    {/* Futuristic Glass Capsule Eyes (Animated with Framer Motion for looking around) */}
                    <motion.div
                      className={`absolute ${mode === 'corporate' ? 'top-[34%] gap-4' : 'top-[48%] gap-3.5'} left-[50%] flex z-20 pointer-events-none transition-all duration-1000`}
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
                      ) : mode === 'instant' ? (
                        <>
                          {/* Energetic Instant Eyes: Normal capsules with a rapid lightning bolt surge effect */}
                          <div className="relative flex justify-center items-center w-2 h-6">
                            <motion.div
                              animate={{ opacity: [1, 1, 0, 1, 1] }}
                              transition={{ repeat: Infinity, duration: 3, times: [0, 0.85, 0.9, 0.95, 1], ease: "easeInOut" }}
                              className="absolute w-full h-full bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8),inset_0_1px_1px_rgba(0,0,0,0.2)]"
                            />
                            <motion.svg
                              animate={{ opacity: [0, 0, 1, 0, 0], scale: [0.5, 0.5, 1.5, 0.5, 0.5] }}
                              transition={{ repeat: Infinity, duration: 3, times: [0, 0.85, 0.9, 0.95, 1], ease: "easeInOut" }}
                              width="14" height="24" viewBox="0 0 24 40" fill="none"
                              className="absolute z-10 overflow-visible drop-shadow-[0_0_12px_rgba(255,255,255,1)]"
                            >
                              <path d="M14 0L0 22H11L9 40L24 16H13L14 0Z" fill="white" />
                            </motion.svg>
                          </div>
                          <div className="relative flex justify-center items-center w-2 h-6">
                            <motion.div
                              animate={{ opacity: [1, 1, 0, 1, 1] }}
                              transition={{ repeat: Infinity, duration: 3, times: [0, 0.85, 0.9, 0.95, 1], ease: "easeInOut" }}
                              className="absolute w-full h-full bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8),inset_0_1px_1px_rgba(0,0,0,0.2)]"
                            />
                            <motion.svg
                              animate={{ opacity: [0, 0, 1, 0, 0], scale: [0.5, 0.5, 1.5, 0.5, 0.5] }}
                              transition={{ repeat: Infinity, duration: 3, times: [0, 0.85, 0.9, 0.95, 1], ease: "easeInOut" }}
                              width="14" height="24" viewBox="0 0 24 40" fill="none"
                              className="absolute z-10 overflow-visible drop-shadow-[0_0_12px_rgba(255,255,255,1)]"
                            >
                              <path d="M14 0L0 22H11L9 40L24 16H13L14 0Z" fill="white" />
                            </motion.svg>
                          </div>
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

                <div className="flex flex-col items-center mt-8 w-full px-4">
                  <AnimatePresence mode="wait">
                    {!showResults && (
                      <motion.div
                        key={`subtitle-${mode}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.2 }}
                        className="w-full mt-2 flex overflow-x-auto custom-scrollbar py-2"
                      >
                        <div className="flex flex-col items-center justify-center mx-auto text-[10px] sm:text-[11px] md:text-[13px] lg:text-[14px] font-light tracking-[0.02em] text-white px-4 gap-1.5 md:gap-2">
                          {mode === 'instant' && (
                            <>
                              <SplitText text="INSTANT" className="font-bold text-white tracking-[0.25em] text-[9px] sm:text-[10px] md:text-[11px] lg:text-[12px] whitespace-nowrap" />
                              <SplitText text="Lightning-fast answers and quick insights" delayOffset={0.15} className="whitespace-nowrap text-white/70" />
                            </>
                          )}
                          {mode === 'expert' && (
                            <>
                              <SplitText text="EXPERT" className="font-bold text-purple-400 tracking-[0.25em] text-[9px] sm:text-[10px] md:text-[11px] lg:text-[12px] whitespace-nowrap" />
                              <SplitText text="Deep research and comprehensive analysis" delayOffset={0.15} className="whitespace-nowrap text-white/70" />
                            </>
                          )}
                          {mode === 'corporate' && (
                            <>
                              <div className="flex items-center gap-2">
                                <SplitText text="CORPORATE" className="font-bold text-amber-400 tracking-[0.25em] text-[9px] sm:text-[10px] md:text-[11px] lg:text-[12px] whitespace-nowrap" />
                                <motion.span
                                  initial={{ opacity: 0, scale: 0.9, filter: "blur(4px)" }}
                                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                                  transition={{ delay: 0.6, duration: 0.5, ease: "easeOut" }}
                                  className="px-2 py-[2px] rounded-md text-[7px] sm:text-[8px] font-medium bg-gradient-to-b from-white/20 to-white/5 border border-white/20 text-white uppercase tracking-[0.2em] shadow-[0_4px_12px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.4)] backdrop-blur-md"
                                >
                                  BETA
                                </motion.span>
                              </div>
                              <SplitText text="Premium resumes, CVs, and professional portfolios" delayOffset={0.15} className="whitespace-nowrap text-white/70" />
                            </>
                          )}
                        </div>
                      </motion.div>
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

          {/* Right Side: AI Agent Session (Chat UI) */}
          <div className="w-full xl:w-[460px] flex flex-col flex-none min-h-[500px] xl:min-h-0 xl:h-full xl:overflow-hidden">

            <div className="bg-white/[0.02] backdrop-blur-[45px] saturate-[180%] border border-white/[0.08] hover:border-white/[0.12] transition-all duration-300 rounded-[28px] p-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),0_12px_40px_rgba(0,0,0,0.6)] relative flex flex-col h-full">
              <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent pointer-events-none"></div>

              <div className="flex justify-between items-center mb-4 relative z-10 shrink-0">
                <h2 className="text-[15px] font-semibold flex items-center gap-2 text-white tracking-wide">
                  AgentX Session <Hexagon className="text-purple-400 w-4 h-4 animate-pulse" />
                </h2>
              </div>

              {/* Chat Scroll Area */}
              <div ref={chatScrollRef} className="flex-1 overflow-y-auto custom-scrollbar pr-2 relative z-10 flex flex-col gap-5 pb-4">
                {chatHistory.length > 0 ? (
                  <>
                    {chatHistory.map((msg) => (
                      <div key={msg.id} id={`msg-${msg.id}`} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                        {msg.role === 'agent' && (
                          <div className="flex items-center gap-2 mb-2 ml-1">
                            {msg.mode === 'corporate' ? (
                              <UserTieIcon className="w-3.5 h-3.5 text-white/70" />
                            ) : (
                              <Hexagon className="w-3.5 h-3.5 text-purple-400" />
                            )}
                            <span className={`text-[11px] font-bold uppercase tracking-wider ${msg.mode === 'corporate' ? 'text-white/80' : 'text-purple-300'}`}>
                              {msg.mode === 'corporate' ? 'AgentX Corporate' : 'AgentX'}
                            </span>
                          </div>
                        )}
                        <div
                          className={`max-w-[95%] px-5 py-4 ${msg.role === 'user'
                            ? 'bg-white/[0.04] backdrop-blur-[40px] border border-white/[0.08] text-white/95 rounded-[24px] rounded-br-[8px] shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),0_10px_30px_rgba(0,0,0,0.5)]'
                            : 'bg-black/20 border border-white/10 text-white/90 rounded-[24px] rounded-bl-[8px] w-full shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]'
                            }`}
                        >
                          {msg.role === 'user' ? (
                            <p className="text-[13.5px] leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                          ) : (
                            msg.content ? (
                              (() => {
                                const trimmed = msg.content.trim();
                                if (trimmed.startsWith('{')) {
                                  try {
                                    const data = JSON.parse(trimmed) as ResumeData;
                                    if (data && data.personalInfo) {
                                      return <div className="my-6 overflow-hidden rounded-xl"><ResumePreview data={data} /></div>;
                                    }
                                    } catch (e) {
                                      return <PremiumDocumentRendererLoader />;
                                    }
                                }
                                return (
                                  <div className="prose prose-invert prose-purple max-w-none text-white/90 leading-relaxed break-words">
                                    <ReactMarkdown
                                      remarkPlugins={[remarkGfm]}
                                      components={{
                                        a: ({ node, ...props }) => <a {...props} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 font-medium underline underline-offset-2 transition-colors break-all" />,
                                        h1: ({ node, ...props }) => <h1 {...props} className="text-xl font-bold mt-4 mb-2 text-white" />,
                                        h2: ({ node, ...props }) => <h2 {...props} className="text-lg font-bold mt-4 mb-2 text-white/95" />,
                                        h3: ({ node, ...props }) => <h3 {...props} className="text-md font-semibold mt-3 mb-1.5 text-white/90" />,
                                        ul: ({ node, ...props }) => <ul {...props} className="list-disc pl-4 mb-3 space-y-1 text-white/80" />,
                                        ol: ({ node, ...props }) => <ol {...props} className="list-decimal pl-4 mb-3 space-y-1 text-white/80" />,
                                        li: ({ node, ...props }) => <li {...props} className="text-[13px] leading-relaxed break-words" />,
                                        p: ({ node, ...props }) => <p {...props} className="mb-3 text-[13px] leading-relaxed text-white/80 last:mb-0 break-words" />,
                                        strong: ({ node, ...props }) => <strong {...props} className="font-semibold text-white/95" />,
                                        table: ({ node, ...props }) => <div className="overflow-x-auto my-4 rounded-xl border border-white/[0.08] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"><table {...props} className="w-full text-[12px] text-left" /></div>,
                                        thead: ({ node, ...props }) => <thead {...props} className="bg-white/[0.06] text-white/80 uppercase text-[11px] tracking-wider" />,
                                        tbody: ({ node, ...props }) => <tbody {...props} className="divide-y divide-white/[0.04]" />,
                                        tr: ({ node, ...props }) => <tr {...props} className="hover:bg-white/[0.03] transition-colors" />,
                                        th: ({ node, ...props }) => <th {...props} className="px-4 py-3 font-semibold text-white/70 border-b border-white/[0.08]" />,
                                        td: ({ node, ...props }) => <td {...props} className="px-4 py-3 text-white/70" />,
                                        hr: ({ node, ...props }) => <hr {...props} className="my-4 border-0 h-px bg-gradient-to-r from-transparent via-white/[0.1] to-transparent" />,
                                        code: ({ node, inline, className, children, ...props }: any) => {
                                          const match = /language-(\w+)/.exec(className || '');
                                          if (!inline && match && match[1] === 'json') {
                                            const codeStr = String(children).replace(/\n$/, '');
                                            try {
                                              const data = JSON.parse(codeStr) as ResumeData;
                                              if (data && data.personalInfo) {
                                                return <div className="my-6 overflow-hidden rounded-xl"><ResumePreview data={data} /></div>;
                                              }
                                            } catch (e) {
                                              return <PremiumDocumentRendererLoader />;
                                            }
                                          }
                                          return <code className={className} {...props}>{children}</code>;
                                        },
                                      }}
                                    >
                                      {msg.content}
                                    </ReactMarkdown>
                                  </div>
                                );
                              })()
                            ) : (
                              isDeployingAgents ? <DeployingAgentsAnimation /> : <PremiumAgentXLoader />
                            )
                          )}
                        </div>
                      </div>
                    ))}
                    <div className="h-2 w-full shrink-0" />
                  </>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center text-white/30 px-4 py-20 mt-10">
                    <Hexagon className="w-12 h-12 mb-3 text-white/10" />
                    <p className="text-[13px] leading-relaxed">Deploy a mission to start receiving career insights and job matches here.</p>
                  </div>
                )}
              </div>
            </div>

          </div>

        </motion.div>

        {/* Recent Chats Overlay Panel */}
        {mounted ? createPortal(
          <AnimatePresence>
            {showRecentChats && (
              <>
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowRecentChats(false)}
                  className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
                />
                {/* Premium Panel */}
                <motion.div
                  initial={{ x: '100%', opacity: 0, scale: 0.95, filter: 'blur(12px)' }}
                  animate={{ x: 0, opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  exit={{ x: '100%', opacity: 0, scale: 0.95, filter: 'blur(12px)' }}
                  transition={{ type: 'spring', stiffness: 320, damping: 32, mass: 0.8 }}
                  className="fixed right-0 top-0 h-full w-[340px] bg-[#050505]/60 backdrop-blur-[80px] saturate-[150%] border-l border-white/[0.06] z-[101] flex flex-col shadow-[-20px_0_80px_rgba(0,0,0,0.6)]"
                >
                  {/* Subtle top ambient glow */}
                  <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-purple-500/10 to-transparent pointer-events-none opacity-50" />

                  {/* Panel Header */}
                  <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.04] relative z-10">
                    <h3 className="text-[15px] font-semibold text-white/90 tracking-tight flex items-center gap-2">
                      <History className="w-4 h-4 text-purple-400" /> Recent Chats
                    </h3>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={handleNewChat}
                        className="p-2 rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.05] text-white/60 hover:text-white transition-all duration-300 hover:scale-105 active:scale-95 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
                        title="New Chat"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setShowRecentChats(false)}
                        className="p-2 rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.05] text-white/60 hover:text-white transition-all duration-300 hover:scale-105 active:scale-95 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Session List */}
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={{
                      hidden: { opacity: 0 },
                      visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.1 } }
                    }}
                    className="flex-1 overflow-y-auto custom-scrollbar px-4 py-4 flex flex-col gap-2 relative z-10"
                  >
                    {sessions.sort((a, b) => b.updatedAt - a.updatedAt).map(session => (
                      <motion.button
                        variants={{
                          hidden: { opacity: 0, x: 20, scale: 0.95 },
                          visible: { opacity: 1, x: 0, scale: 1, transition: { type: 'spring', stiffness: 400, damping: 25 } }
                        }}
                        key={session.id}
                        onClick={() => handleSwitchSession(session.id)}
                        className={`w-full text-left p-4 rounded-[20px] transition-all duration-300 group flex items-start gap-3.5 relative overflow-hidden ${session.id === activeSessionId
                          ? 'bg-white/[0.06] border border-white/[0.1] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_4px_20px_rgba(0,0,0,0.2)]'
                          : 'bg-transparent hover:bg-white/[0.04] border border-transparent'
                          }`}
                      >
                        {/* Active State Background Gradient */}
                        {session.id === activeSessionId && (
                          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-transparent opacity-100 pointer-events-none" />
                        )}

                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors duration-300 ${session.id === activeSessionId ? 'bg-purple-500/20 text-purple-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]' : 'bg-white/[0.04] text-white/40 group-hover:bg-white/[0.08] group-hover:text-white/70'
                          }`}>
                          <MessageSquare className="w-3.5 h-3.5" />
                        </div>

                        <div className="flex-1 min-w-0 pt-0.5">
                          <p className={`text-[13px] font-medium truncate tracking-wide transition-colors duration-300 ${session.id === activeSessionId ? 'text-white drop-shadow-sm' : 'text-white/70 group-hover:text-white/90'
                            }`}>
                            {session.title}
                          </p>
                          <div className="flex items-center gap-2 text-[11px] text-white/30 mt-1.5 font-medium tracking-wide">
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3 opacity-70" /> {new Date(session.updatedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                            <span className="w-1 h-1 rounded-full bg-white/10" />
                            <span>{session.messages.length} msgs</span>
                          </div>
                        </div>

                        <div
                          onClick={(e) => handleDeleteSession(session.id, e)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 border border-white/5 text-white/30 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] scale-90 hover:scale-100 z-20 cursor-pointer"
                          title="Delete Session"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </div>
                      </motion.button>
                    ))}
                  </motion.div>
                </motion.div>
              </>
            )}
          </AnimatePresence>,
          document.body
        ) : null}
      </div>

      {/* Message Bar Container (static flex item at the bottom) */}
      <div className="shrink-0 w-full p-4 md:px-6 md:pb-6 z-20 flex justify-center bg-transparent">
        <div className="w-full max-w-[1000px]">
          <MessageBar onDeploy={runMission} onNewChat={handleNewChat} mode={mode} setMode={handleModeSwitch} />
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

function DeployingAgentsAnimation() {
  return (
    <div className="flex flex-col items-center justify-center py-24 w-full relative overflow-hidden">

      {/* Ambient Deep Glow */}
      <motion.div
        animate={{ rotate: 360, scale: [1, 1.1, 1] }}
        transition={{ rotate: { duration: 20, repeat: Infinity, ease: "linear" }, scale: { duration: 6, repeat: Infinity, ease: "easeInOut" } }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-[-10px] z-0"
      >
        <div className="w-40 h-40 rounded-full bg-gradient-to-tr from-purple-600/15 via-pink-500/5 to-transparent blur-[40px]" />
      </motion.div>

      {/* The Sleek Glass AgentX Core (Rounded Diamond) */}
      <div className="relative z-10 mt-[-10px]">
        <motion.div
          animate={{ boxShadow: ["inset 0 1px 1px rgba(255,255,255,0.1), 0 10px 40px rgba(0,0,0,0.3)", "inset 0 1px 1px rgba(255,255,255,0.3), 0 10px 40px rgba(168,85,247,0.15)", "inset 0 1px 1px rgba(255,255,255,0.1), 0 10px 40px rgba(0,0,0,0.3)"] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="w-20 h-20 bg-white/[0.02] backdrop-blur-[50px] rounded-[24px] border border-white/[0.08] flex items-center justify-center relative overflow-hidden"
          style={{ transform: "rotate(45deg)" }}
        >
          {/* Inner rotating elements (counter-rotate to stay upright) */}
          <div className="absolute inset-0 flex items-center justify-center" style={{ transform: "rotate(-45deg)" }}>
            {/* Outer Hexagon */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute"
            >
              <Hexagon className="w-9 h-9 text-white/10" strokeWidth={1} />
            </motion.div>

            {/* Inner Hexagon */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute"
            >
              <Hexagon className="w-5 h-5 text-purple-400/80" strokeWidth={1.5} />
            </motion.div>

            {/* Core Dot */}
            <motion.div
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_12px_rgba(255,255,255,0.9)]"
            />
          </div>

          {/* Shimmer sweep effect across the glass */}
          <motion.div
            animate={{ x: ['-200%', '200%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", repeatDelay: 1.5 }}
            className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[45deg]"
          />
        </motion.div>
      </div>

      {/* Minimalist Typography */}
      <div className="mt-16 text-center relative z-20 flex flex-col items-center">
        <motion.div
          animate={{ opacity: [0.4, 0.9, 0.4] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="text-[11px] font-semibold tracking-[0.25em] text-white/90 uppercase"
        >
          AgentX Deployed
        </motion.div>
        <div className="text-[12px] text-white/40 mt-3 font-light tracking-wide">
          Navigating the global index
        </div>
      </div>
    </div>
  )
}

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

function PremiumDocumentRendererLoader() {
  return (
    <div className="flex flex-col md:flex-row items-center gap-5 py-6 px-2 w-full">
      {/* Refined Minimal Spinner */}
      <div className="relative w-8 h-8 flex items-center justify-center shrink-0">
        <svg className="absolute inset-0 w-full h-full text-white/10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" />
        </svg>
        <motion.svg 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="absolute inset-0 w-full h-full text-white/90 drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.47715 2 2 6.47715 2 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </motion.svg>
      </div>

      <div className="flex flex-col items-center md:items-start text-center md:text-left gap-1.5">
        <motion.div 
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="text-[14px] font-semibold tracking-wide text-white/95"
        >
          Crafting Professional Document
        </motion.div>
        <p className="text-[12px] font-medium text-white/40 tracking-wide flex items-center gap-1">
          Analyzing optimal layout and structure
          <span className="flex gap-[3px] ml-1 shrink-0">
            <motion.span animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 1.4, repeat: Infinity, delay: 0 }} className="w-1 h-1 rounded-full bg-white/50" />
            <motion.span animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 1.4, repeat: Infinity, delay: 0.2 }} className="w-1 h-1 rounded-full bg-white/50" />
            <motion.span animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 1.4, repeat: Infinity, delay: 0.4 }} className="w-1 h-1 rounded-full bg-white/50" />
          </span>
        </p>
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
    case "thought_process": return activeOrPending ? "Thought process" : "Thought process complete";
    case "agent_generating": return activeOrPending ? "Agent is generating hold tight" : "Generation complete";
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
        {isActive && (stage.id === "build_context" || stage.id === "agent_generating") ? (
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
              : stage.id === "agent_generating"
                ? (isCompleted
                  ? `Generated in ${Math.floor((stage.duration || 0) / 1000)} seconds`
                  : "Agent is generating hold tight")
                : stageText}
          </h4>

          {isActive && (stage.id === "build_context" || stage.id === "agent_generating") && stage.startedAt && (
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

function MessageBar({ onDeploy, onNewChat, mode, setMode }: { onDeploy: (q: string, mode: "instant" | "expert" | "corporate") => void, onNewChat: () => void, mode: "instant" | "expert" | "corporate", setMode: (mode: "instant" | "expert" | "corporate") => void }) {
  const [input, setInput] = useState("");

  const handleDeploy = () => {
    if (input.trim()) {
      onDeploy(input.trim(), mode);
      setInput("");
    }
  };

  const modeConfig = {
    instant: { label: 'Instant', icon: <Zap className="w-3 h-3" /> },
    expert: { label: 'Expert', icon: <Search className="w-3 h-3" /> },
    corporate: { label: <span className="flex items-center">Corporate <span className="ml-1.5 px-1.5 py-[2px] rounded-md text-[7.5px] font-medium bg-gradient-to-b from-white/20 to-white/5 border border-white/20 text-white/90 uppercase tracking-[0.15em] shadow-[0_2px_4px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.3)] backdrop-blur-md">BETA</span></span>, icon: <Briefcase className="w-3 h-3" /> },
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white/[0.02] backdrop-blur-[60px] border border-white/[0.12] rounded-[28px] p-4 shadow-[inset_0_2px_2px_rgba(255,255,255,0.25),_0_24px_50px_-12px_rgba(0,0,0,0.7)] relative group hover:border-white/[0.18] transition-all duration-300 overflow-hidden">
      {/* Micro-texture Grain Overlay to simulate matte frosted glass */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1.5px)] [background-size:12px_12px]" />
      {/* Specular gloss glow */}
      <div className="absolute -top-1/2 left-1/3 w-96 h-96 bg-white/[0.02] blur-[80px] rounded-full pointer-events-none" />
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Mode Switcher */}
        <div className="flex items-center bg-white/[0.04] backdrop-blur-[30px] border border-white/[0.08] rounded-full p-1.5 shrink-0 relative shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.15)] h-14">
          {(['instant', 'expert', 'corporate'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`relative flex items-center justify-center gap-2 px-5 h-11 rounded-full text-[13px] font-semibold tracking-wide transition-colors duration-300 z-10 ${mode === m ? "text-white drop-shadow-sm" : "text-white/40 hover:text-white/60"}`}
            >
              {mode === m && (
                <motion.div
                  layoutId="mode-switch-active"
                  className={`absolute inset-0 backdrop-blur-xl border rounded-full shadow-[inset_0_1.5px_1px_rgba(255,255,255,0.2)] -z-10 ${m === 'corporate'
                    ? 'bg-amber-500/15 border-amber-400/30'
                    : 'bg-white/[0.12] border-white/20 shadow-[0_2px_8px_rgba(255,255,255,0.08)]'
                    }`}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                />
              )}
              {modeConfig[m].icon}
              {modeConfig[m].label}
            </button>
          ))}
        </div>

        {/* Standalone Plus Button */}
        <button
          onClick={onNewChat}
          title="New Chat"
          className="w-14 h-14 rounded-full bg-white/[0.04] backdrop-blur-[30px] hover:bg-white/[0.08] border border-white/[0.08] flex items-center justify-center text-white/45 hover:text-white shrink-0 shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.15)] transition-all active:scale-95"
        >
          <SquarePen size={18} />
        </button>

        {/* Input Bar */}
        <div className="flex-1 bg-white/[0.04] backdrop-blur-[30px] border border-white/[0.08] rounded-full px-5 py-2.5 flex items-center transition-all focus-within:border-white/25 focus-within:bg-white/[0.08] shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.15)] h-14">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleDeploy()}
            placeholder="Find remote React internships"
            className="w-full bg-transparent text-white/90 text-[13.5px] outline-none placeholder:text-white/30"
          />
        </div>

        {/* Deploy Mission Button */}
        <button
          onClick={handleDeploy}
          className="relative flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-[13px] font-semibold text-white transition-all duration-300 group overflow-hidden hover:scale-[1.02] active:scale-[0.98] shrink-0 h-14"
          style={{
            background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.25) 0%, rgba(236, 72, 153, 0.1) 100%)',
            boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.2), 0 4px 15px rgba(0,0,0,0.2), 0 0 20px rgba(168,85,247,0.2)',
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

      {mode === 'corporate' ? (
        <div className="flex items-center gap-3 overflow-x-auto custom-scrollbar pb-2 mt-4 px-1">
          <span className="text-white/50 text-[11px] font-bold mr-2 shrink-0 uppercase tracking-[0.15em] flex items-center gap-1.5">
            <Briefcase className="w-3 h-3 text-white/40" />
            Corporate Mode
            <span className="ml-1.5 px-1.5 py-[1px] rounded-md text-[7px] font-medium bg-gradient-to-b from-white/20 to-white/5 border border-white/20 text-white uppercase tracking-[0.15em] shadow-[0_2px_4px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.3)] backdrop-blur-md">BETA</span>
          </span>
          <CorporateTemplateButton
            icon={<FileText className="w-3.5 h-3.5" />}
            text="Generate Resume"
            onClick={() => setInput("Generate a professional Resume")}
            active={input.includes("Resume")}
          />
          <CorporateTemplateButton
            icon={<FileText className="w-3.5 h-3.5" />}
            text="Generate CV"
            onClick={() => setInput("Generate a detailed CV")}
            active={input.includes("CV")}
            locked={true}
          />
          <CorporateTemplateButton
            icon={<Briefcase className="w-3.5 h-3.5" />}
            text="Build Portfolio"
            onClick={() => setInput("Generate a professional Portfolio")}
            active={input.includes("Portfolio")}
            locked={true}
          />
        </div>
      ) : (
        <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1 mt-3">
          <span className="text-white/40 text-[11px] font-medium mr-2 shrink-0 uppercase tracking-wider">Quick Missions</span>
          <QuickMissionButton icon={<Globe className="w-3 h-3" />} text="Remote Jobs" onClick={() => setInput("Find remote jobs")} />
          <QuickMissionButton icon={<Code className="w-3 h-3" />} text="Frontend Roles" onClick={() => setInput("Find frontend roles")} />
          <QuickMissionButton icon={<Sparkles className="w-3 h-3" />} text="AI / ML Roles" onClick={() => setInput("Find AI / ML roles")} />
          <QuickMissionButton icon={<Rocket className="w-3 h-3" />} text="Startups" onClick={() => setInput("Find roles at startups")} />
          <QuickMissionButton icon={<Layers className="w-3 h-3" />} text="Full Stack" onClick={() => setInput("Find full stack roles")} />
          <QuickMissionButton icon={<UserCircle className="w-3 h-3" />} text="Analyze My Profile" onClick={() => setInput("Analyze my profile")} />
        </div>
      )}
    </div>
  );
}

function CorporateTemplateButton({ icon, text, onClick, active, locked }: { icon: React.ReactNode, text: string, onClick?: () => void, active?: boolean, locked?: boolean }) {
  return (
    <button
      onClick={locked ? undefined : onClick}
      disabled={locked}
      className={`relative group flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-semibold transition-all duration-300 shrink-0 overflow-hidden ${locked ? 'cursor-not-allowed opacity-60' : 'active:scale-95'} ${active
        ? 'text-white border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.05)]'
        : 'text-white/50 border border-white/[0.04] hover:text-white/90 hover:border-white/10'
        }`}
    >
      <div className={`absolute inset-0 transition-opacity duration-300 -z-10 ${active ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
        style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)' }} />
      <div className={`absolute inset-0 bg-black/40 backdrop-blur-md -z-20 transition-opacity duration-300 ${active ? 'opacity-0' : 'opacity-100 group-hover:opacity-0'}`} />

      <span className={`relative z-10 transition-colors duration-300 ${active ? 'text-white' : 'text-white/40 group-hover:text-white/80'}`}>
        {icon}
      </span>
      <span className="relative z-10 tracking-wide drop-shadow-sm flex items-center gap-2">
        {text}
        {locked && (
          <span className="px-1.5 py-[2px] rounded-md text-[7px] font-bold bg-white/10 border border-white/10 text-white/70 uppercase tracking-[0.1em]">
            Coming Soon
          </span>
        )}
      </span>
    </button>
  );
}

function QuickMissionButton({ icon, text, onClick, active }: { icon: React.ReactNode, text: string, onClick?: () => void, active?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-[11px] font-medium transition-all shrink-0 active:scale-95 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] ${active
        ? 'bg-amber-500/20 border-amber-500/30 text-amber-100'
        : 'bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.06] hover:border-white/[0.12] hover:text-white text-white/60'
        }`}
    >
      {icon} {text}
    </button>
  );
}

function UserTieIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="7" r="4" />
      <path d="M5.5 21v-2a4 4 0 0 1 4-4h5a4 4 0 0 1 4 4v2" />
      <path d="M12 11l-1.5 3.5L12 21l1.5-6.5L12 11z" />
    </svg>
  );
}
