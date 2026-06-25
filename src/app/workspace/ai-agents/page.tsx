"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import {
  Briefcase, TrendingUp, FileText, Sparkles,
  ShieldCheck, FolderGit2, Target, Lightbulb,
  MessageSquare, ArrowRight, CheckCircle2, ChevronRight
} from "lucide-react";
import ProfileContextStrip from "../../../components/profile/ProfileContextStrip";
import { useForgeProfile } from "../../../hooks/useForgeProfile";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring" as const, stiffness: 300, damping: 24 },
  },
};

/* ════════════════════════════════════════════════════════════
   FORGE ASSISTANT  —  /workspace/ai-agents
   ════════════════════════════════════════════════════════════ */

export default function ForgeAssistantPage() {
  const { displayProfile } = useForgeProfile();

  return (
    <div className="px-8 pb-16 pt-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-[1100px] mx-auto flex flex-col gap-8"
      >
        {/* Hero Greeting */}
        <HeroGreeting name={displayProfile?.displayName} />

        <ProfileContextStrip label="AI Assistant Memory" />

        {/* 3 Action Cards */}
        <ActionCards stack={displayProfile?.techStack || []} />

        {/* Split: Intelligence Feed + Recommendation */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <IntelligenceFeed profileName={displayProfile?.displayName} stack={displayProfile?.techStack || []} />
          <Recommendation stack={displayProfile?.techStack || []} skills={displayProfile?.skills || []} />
        </div>

        {/* Forge Assistant Actions */}
        <AssistantActions />
      </motion.div>
    </div>
  );
}

/* ─── Hero Greeting ─────────────────────────────────────── */

function HeroGreeting({ name }: { name?: string }) {
  const firstName = name?.split(" ")[0] || "there";

  return (
    <motion.div variants={itemVariants} className="relative flex flex-col items-center text-center py-12 overflow-hidden rounded-2xl">
      {/* Aurora background effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] via-[#0A0A0A] to-[#0A0A0A]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[200px] bg-gradient-to-r from-transparent via-[#5e5ce6]/15 to-transparent blur-3xl rounded-full" />
      <div className="absolute top-10 left-1/3 w-[400px] h-[120px] bg-gradient-to-r from-[#7c3aed]/10 via-[#b19cd9]/10 to-transparent blur-2xl rounded-full" />

      {/* Wave SVG decoration */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[600px] h-[100px] opacity-30">
        <svg viewBox="0 0 600 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path d="M0 50 Q75 20 150 50 T300 50 T450 50 T600 50" stroke="url(#waveGrad)" strokeWidth="1.5" fill="none" />
          <path d="M0 55 Q75 30 150 55 T300 55 T450 55 T600 55" stroke="url(#waveGrad)" strokeWidth="1" fill="none" opacity="0.5" />
          <defs>
            <linearGradient id="waveGrad" x1="0" y1="0" x2="600" y2="0">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="30%" stopColor="#b19cd9" />
              <stop offset="50%" stopColor="#5e5ce6" />
              <stop offset="70%" stopColor="#b19cd9" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="relative z-10 flex flex-col items-center gap-3">
        <h1 className="text-[32px] font-semibold text-white tracking-tight">Good Evening, {firstName}.</h1>
        <p className="text-[14px] text-[#a1a1aa] max-w-md leading-relaxed">
          I&apos;ve reviewed your profile, projects, opportunities, and recent activity.<br />
          Three recommendations are ready.
        </p>
      </div>
    </motion.div>
  );
}

/* ─── Action Cards ──────────────────────────────────────── */

function ActionCards({ stack }: { stack: string[] }) {
  const leadStack = stack[0] || "frontend";
  const cards = [
    {
      icon: <Briefcase size={20} className="text-[#5e5ce6]" />,
      title: "Opportunity Found",
      desc: `A ${leadStack} role aligns with your recent project work and profile.`,
      primary: "Review Opportunity",
      secondary: "Save For Later",
    },
    {
      icon: <TrendingUp size={20} className="text-[#c2c1ff]" />,
      title: "Suggested Growth Area",
      desc: "Cloud deployment skills appear frequently across your saved opportunities.",
      primary: "View Learning Path",
      secondary: "Explore Projects",
    },
    {
      icon: <FileText size={20} className="text-[#a3e635]" />,
      title: "Application Update",
      desc: "A recruiter recently reviewed one of your submitted applications.",
      primary: "Open Application",
      secondary: "Prepare Follow-Up",
    },
  ];

  return (
    <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {cards.map((c, i) => (
        <div key={i} className="flex flex-col p-5 bg-[#121212] border border-[#1e1e1e] rounded-xl hover:border-[#3f3f46] transition-colors">
          <div className="w-10 h-10 rounded-lg bg-[#1A1A1A] border border-[#262626] flex items-center justify-center mb-4">
            {c.icon}
          </div>
          <h3 className="text-[15px] font-semibold text-white mb-2">{c.title}</h3>
          <p className="text-[13px] text-[#a1a1aa] mb-6 flex-1 leading-relaxed">{c.desc}</p>
          <div className="flex gap-2 mt-auto">
            <button className="flex-1 py-2 px-3 bg-[#5e5ce6] hover:bg-[#4d4ad5] text-white text-[12px] font-medium rounded-lg transition-colors">
              {c.primary}
            </button>
            <button className="flex-1 py-2 px-3 bg-[#1A1A1A] hover:bg-[#262626] text-white text-[12px] font-medium rounded-lg transition-colors border border-[#262626]">
              {c.secondary}
            </button>
          </div>
        </div>
      ))}
    </motion.div>
  );
}

/* ─── Intelligence Feed ─────────────────────────────────── */

function IntelligenceFeed({ profileName, stack }: { profileName?: string; stack: string[] }) {
  const firstName = profileName?.split(" ")[0] || "Your";
  const leadStack = stack[0] || "Frontend";
  const items = [
    { icon: <ShieldCheck size={14} />, color: "text-[#5e5ce6]", text: `${firstName}'s profile shows strong ${leadStack} alignment.`, time: "Live" },
    { icon: <Briefcase size={14} />, color: "text-[#c2c1ff]", text: `A new ${leadStack} opportunity was discovered based on your portfolio.`, time: "3h ago" },
    { icon: <TrendingUp size={14} />, color: "text-[#a3e635]", text: `${leadStack} opportunities in your preferred stack increased this week.`, time: "6h ago" },
    { icon: <Sparkles size={14} />, color: "text-[#ffb786]", text: "Your recent project may strengthen future applications.", time: "12h ago" },
  ];

  return (
    <motion.div variants={itemVariants} className="flex flex-col p-6 bg-[#121212] border border-[#1e1e1e] rounded-xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[15px] font-semibold text-white">Intelligence Feed</h3>
      </div>

      <div className="flex flex-col relative">
        <div className="absolute left-[15px] top-4 bottom-4 w-px bg-gradient-to-b from-[#262626] via-[#262626] to-transparent"></div>
        {items.map((item, i) => (
          <div key={i} className="flex gap-4 mb-5 last:mb-0 relative z-10">
            <div className={`w-8 h-8 rounded-full bg-[#1A1A1A] border border-[#262626] flex items-center justify-center shrink-0 ${item.color}`}>
              {item.icon}
            </div>
            <div className="flex flex-col pt-1">
              <span className="text-[13px] text-[#e5e2e1] leading-relaxed mb-1">{item.text}</span>
              <span className="text-[11px] text-[#71717a]">{item.time}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-[#1e1e1e]">
        <button className="text-[12px] text-[#b19cd9] flex items-center gap-1 hover:text-[#c2c1ff] transition-colors">
          View All Insights <ArrowRight size={12} />
        </button>
      </div>
    </motion.div>
  );
}

/* ─── Recommendation ────────────────────────────────────── */

function Recommendation({ stack, skills }: { stack: string[]; skills: string[] }) {
  const reasons = [
    stack[0] ? `Strong ${stack[0]} experience` : "Strong React and TypeScript experience",
    stack[1] ? `Relevant ${stack[1]} project work` : "Relevant portfolio projects",
    skills[0] ? `${skills[0]} is visible in your profile` : "Similar technology stack",
    "Active hiring demand",
  ];

  return (
    <motion.div variants={itemVariants} className="flex flex-col p-6 bg-[#121212] border border-[#1e1e1e] rounded-xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#5e5ce6] to-[#c2c1ff]"></div>

      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[15px] font-semibold text-white">Recommendation</h3>
        <span className="px-2 py-0.5 bg-[#5e5ce6]/20 border border-[#5e5ce6]/40 text-[#c2c1ff] rounded-md text-[11px] font-medium flex items-center gap-1">
          High Match <ChevronRight size={12} />
        </span>
      </div>

      <div className="flex items-start gap-4 mb-5">
        <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shrink-0">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 2L2 22H22L12 2Z" fill="black" /></svg>
        </div>
        <div className="flex flex-col">
          <h4 className="text-[16px] font-semibold text-white">Frontend Engineer</h4>
          <span className="text-[13px] text-[#a1a1aa]">Vercel</span>
          <span className="text-[12px] text-[#71717a] mt-1">San Francisco, CA • Full-Time • Remote</span>
        </div>
      </div>

      <div className="mb-5">
        <span className="text-[11px] font-mono uppercase tracking-widest text-[#71717a] block mb-3">Why this was suggested</span>
        <div className="flex flex-col gap-2">
          {reasons.map((r, i) => (
            <div key={i} className="flex items-center gap-2 text-[13px] text-[#e5e2e1]">
              <CheckCircle2 size={14} className="text-[#a3e635] shrink-0" />
              {r}
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2 mt-auto">
        <button className="py-2 px-4 bg-[#5e5ce6] hover:bg-[#4d4ad5] text-white text-[12px] font-medium rounded-lg transition-colors">
          View Details
        </button>
        <button className="py-2 px-4 bg-[#1A1A1A] hover:bg-[#262626] text-white text-[12px] font-medium rounded-lg transition-colors border border-[#262626]">
          Prepare Application
        </button>
        <button className="py-2 px-4 bg-[#1A1A1A] hover:bg-[#262626] text-white text-[12px] font-medium rounded-lg transition-colors border border-[#262626]">
          Dismiss
        </button>
      </div>
    </motion.div>
  );
}

/* ─── Forge Assistant Actions ───────────────────────────── */

function AssistantActions() {
  const actions = [
    { icon: <FileText size={16} />, title: "Prepare Resume", desc: "Tailor your resume for opportunities" },
    { icon: <FolderGit2 size={16} />, title: "Improve Portfolio", desc: "Get feedback and enhance projects" },
    { icon: <Target size={16} />, title: "Find Opportunities", desc: "Discover roles that match your profile" },
    { icon: <Lightbulb size={16} />, title: "Analyze Skill Gaps", desc: "Identify skills to grow your career" },
    { icon: <MessageSquare size={16} />, title: "Prepare Interview", desc: "Get ready with AI interview prep" },
    { icon: <FileText size={16} />, title: "Generate Cover Letter", desc: "Create personalized cover letters" },
  ];

  return (
    <motion.div variants={itemVariants} className="flex flex-col gap-4">
      <h3 className="text-[15px] font-semibold text-white px-1">Forge Assistant Actions</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {actions.map((act, i) => (
          <div key={i} className="group flex flex-col p-4 bg-[#121212] border border-[#1e1e1e] rounded-xl hover:bg-[#1A1A1A] hover:border-[#3f3f46] transition-colors cursor-pointer">
            <div className="w-8 h-8 rounded-md bg-[#1A1A1A] text-[#c2c1ff] flex items-center justify-center border border-[#262626] group-hover:bg-[#5e5ce6]/20 group-hover:border-[#5e5ce6]/40 transition-colors mb-3">
              {act.icon}
            </div>
            <span className="text-[12px] font-semibold text-white mb-1">{act.title}</span>
            <p className="text-[10px] text-[#71717a] leading-tight flex-1">{act.desc}</p>
            <ArrowRight size={14} className="text-[#3f3f46] group-hover:text-white transition-colors mt-2 self-end" />
          </div>
        ))}
      </div>
    </motion.div>
  );
}
