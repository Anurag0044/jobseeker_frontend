"use client";

import React, { useState } from "react";
import { motion, Variants } from "framer-motion";
import { useUser } from "../../../hooks/useUser";
import {
  Plus, Settings, MapPin, Mail, ArrowRight,
  TrendingUp, Monitor, Server, Box,
  Code, Award, Globe
} from "lucide-react";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring" as const, stiffness: 300, damping: 24 } },
};

export default function SkillsPage() {
  return (
    <div className="px-8 pb-16 pt-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-[1200px] mx-auto flex flex-col gap-6"
      >
        <SkillsHeader />
        <NavigationTabs />
        
        {/* 
          - [x] Global Header & Add/Manage Buttons
          - [x] Liquid Glass Navigation Tabs
          - [x] Premium Glass Metric Panels (Skills Overview & Proficiency)
          - [x] Technical Skills Grid (Glass tiles, glowing bars)
          - [x] Recommended Next Steps (Glass tiles)
          - [/] Right Column: Profile Card & Radar Charts
        */}

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mt-2">
          <div className="xl:col-span-8 flex flex-col gap-6">
            <SkillsOverview />
            <TechnicalSkills />
            <SkillsByProficiency />
            <RecommendedNextSteps />
          </div>
          <div className="xl:col-span-4 flex flex-col gap-6">
            <ProfileCard />
            <SkillsProgress />
            <RecentSkillAdditions />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── Header ────────────────────────────────────────────── */

function SkillsHeader() {
  return (
    <motion.div variants={itemVariants} className="flex flex-wrap justify-between items-start gap-4 w-full">
      <div className="flex flex-col">
        <h1 className="text-[28px] font-bold text-white tracking-tight mb-1 drop-shadow-sm">Skills</h1>
        <p className="text-[14px] text-[#a1a1aa]">Showcase your expertise and track your growth.</p>
      </div>
      <div className="flex items-center gap-3">
        <button className="px-5 py-2.5 bg-white text-black hover:bg-white/90 text-[13px] font-bold rounded-xl transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.3)]">
          <Plus size={16} /> Add Skill
        </button>
        <button className="px-5 py-2.5 bg-white/[0.05] hover:bg-white/[0.1] backdrop-blur-md border border-white/10 hover:border-white/20 text-white text-[13px] font-semibold rounded-xl transition-all flex items-center gap-2 shadow-sm">
          <Settings size={16} /> Manage Skills
        </button>
      </div>
    </motion.div>
  );
}

/* ─── Tabs ──────────────────────────────────────────────── */

function NavigationTabs() {
  const tabs = ["Overview", "Technical Skills", "Soft Skills", "Certifications", "Learning Path", "Skill Assessment"];
  const [activeTab, setActiveTab] = useState("Overview");
  
  return (
    <motion.div variants={itemVariants} className="w-full flex gap-2 overflow-x-auto no-scrollbar pb-2">
      <div className="flex p-1 bg-black/40 backdrop-blur-xl border border-white/[0.08] rounded-2xl w-max shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
        {tabs.map((tab, i) => (
          <button 
            key={i} 
            onClick={() => setActiveTab(tab)}
            className={`relative px-5 py-2.5 text-[13px] font-semibold rounded-xl transition-colors whitespace-nowrap z-10 ${activeTab === tab ? "text-white drop-shadow-md" : "text-[#a1a1aa] hover:text-white"}`}
          >
            {activeTab === tab && (
              <motion.div layoutId="activeSkillSegment" className="absolute inset-0 bg-white/[0.08] backdrop-blur-md border border-white/20 rounded-xl -z-10 shadow-[0_8px_20px_rgba(255,255,255,0.05),inset_0_1px_1px_rgba(255,255,255,0.4)]" transition={{ type: "spring", stiffness: 400, damping: 30 }} />
            )}
            {tab}
          </button>
        ))}
      </div>
    </motion.div>
  );
}

/* ─── Skills Overview ───────────────────────────────────── */

function SkillsOverview() {
  return (
    <motion.div variants={itemVariants} className="bg-gradient-to-br from-white/[0.06] to-white/[0.01] backdrop-blur-xl border border-white/10 rounded-[24px] p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-[18px] font-bold text-white mb-1 drop-shadow-sm">Skills Overview</h3>
        <p className="text-[13px] text-[#a1a1aa]">Your professional skills summary</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex flex-col gap-2 bg-white/[0.02] border border-white/[0.05] p-5 rounded-2xl">
          <span className="text-[12px] font-medium text-[#71717a] uppercase tracking-wider">Total Skills</span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-[36px] font-bold text-white leading-none drop-shadow-md">32</span>
            <div className="w-12 h-12 rounded-[14px] bg-[#b19cd9]/10 border border-[#b19cd9]/20 flex items-center justify-center shadow-[0_0_15px_rgba(177,156,217,0.15)]">
              <Award size={20} className="text-[#b19cd9]" />
            </div>
          </div>
          <span className="text-[12px] text-[#a1a1aa] mt-2">Across all categories</span>
        </div>
        
        <div className="flex flex-col gap-2 bg-white/[0.02] border border-white/[0.05] p-5 rounded-2xl relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#22c55e] rounded-full blur-[40px] opacity-10"></div>
          <span className="text-[12px] font-medium text-[#71717a] uppercase tracking-wider">Strength Areas</span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-[15px] font-semibold text-white max-w-[130px] leading-snug drop-shadow-sm">Frontend, System Design, AI</span>
            <div className="w-12 h-12 rounded-[14px] bg-[#22c55e]/10 border border-[#22c55e]/20 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(34,197,94,0.15)]">
              <TrendingUp size={20} className="text-[#22c55e]" />
            </div>
          </div>
          <span className="text-[12px] text-[#a1a1aa] mt-2">Top performing categories</span>
        </div>
        
        <div className="flex flex-col gap-2 bg-white/[0.02] border border-white/[0.05] p-5 rounded-2xl relative overflow-hidden">
          <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-[#f97316] rounded-full blur-[40px] opacity-10"></div>
          <span className="text-[12px] font-medium text-[#71717a] uppercase tracking-wider">Growth Areas</span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-[15px] font-semibold text-white max-w-[130px] leading-snug drop-shadow-sm">DevOps, Cloud, Testing</span>
            <div className="w-12 h-12 rounded-[14px] bg-[#f97316]/10 border border-[#f97316]/20 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(249,115,22,0.15)]">
              <Box size={20} className="text-[#f97316]" />
            </div>
          </div>
          <span className="text-[12px] text-[#a1a1aa] mt-2">Focus for improvement</span>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Technical Skills ──────────────────────────────────── */

function TechnicalSkills() {
  const tabs = ["Frontend", "Backend", "Database", "DevOps", "Tools & Others", "AI & ML"];
  const [activeTech, setActiveTech] = useState("Frontend");
  
  const skills = [
    { name: "React", level: "Expert", progress: 95, icon: <Code size={20} className="text-[#61DAFB]" />, color: "from-[#61DAFB] to-[#38bdf8]", shadow: "rgba(97,218,251,0.5)" },
    { name: "TypeScript", level: "Expert", progress: 90, icon: <span className="font-bold text-[14px] text-[#3178C6] tracking-tighter">TS</span>, color: "from-[#3178C6] to-[#60a5fa]", shadow: "rgba(49,120,198,0.5)" },
    { name: "Next.js", level: "Advanced", progress: 85, icon: <span className="font-bold text-[14px] text-white leading-none">N</span>, color: "from-white to-gray-400", shadow: "rgba(255,255,255,0.5)" },
    { name: "Tailwind CSS", level: "Advanced", progress: 85, icon: <Monitor size={20} className="text-[#38BDF8]" />, color: "from-[#38BDF8] to-[#7dd3fc]", shadow: "rgba(56,189,248,0.5)" },
    { name: "JavaScript", level: "Expert", progress: 95, icon: <span className="font-bold text-[14px] text-black bg-[#F7DF1E] px-1 rounded-sm leading-tight">JS</span>, color: "from-[#F7DF1E] to-[#fde047]", shadow: "rgba(247,223,30,0.5)" },
    { name: "HTML", level: "Advanced", progress: 80, icon: <span className="font-bold text-[14px] text-[#E34F26]">5</span>, color: "from-[#E34F26] to-[#fb923c]", shadow: "rgba(227,79,38,0.5)" },
    { name: "CSS", level: "Advanced", progress: 80, icon: <span className="font-bold text-[14px] text-[#1572B6]">3</span>, color: "from-[#1572B6] to-[#60a5fa]", shadow: "rgba(21,114,182,0.5)" },
    { name: "Redux Toolkit", level: "Intermediate", progress: 65, icon: <Code size={20} className="text-[#764ABC]" />, color: "from-[#764ABC] to-[#a78bfa]", shadow: "rgba(118,74,188,0.5)" },
  ];

  return (
    <motion.div variants={itemVariants} className="bg-gradient-to-br from-white/[0.06] to-white/[0.01] backdrop-blur-xl border border-white/10 rounded-[24px] p-6 shadow-sm">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h3 className="text-[18px] font-bold text-white mb-1 drop-shadow-sm">Technical Skills</h3>
          <p className="text-[13px] text-[#a1a1aa]">Your technical expertise across different categories</p>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-6 p-1 bg-white/[0.02] border border-white/[0.05] rounded-xl w-max shadow-inner">
        {tabs.map((tab, i) => (
          <button 
            key={i} 
            onClick={() => setActiveTech(tab)}
            className={`relative px-4 py-1.5 rounded-lg text-[13px] font-medium transition-colors z-10 ${activeTech === tab ? "text-white drop-shadow-sm" : "text-[#a1a1aa] hover:text-white"}`}
          >
            {activeTech === tab && (
              <motion.div layoutId="activeTechTab" className="absolute inset-0 bg-white/10 backdrop-blur-md rounded-lg -z-10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] border border-white/20" transition={{ type: "spring", stiffness: 400, damping: 30 }} />
            )}
            {tab}
          </button>
        ))}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {skills.map((skill, i) => (
          <div key={i} className={`flex flex-col p-4 rounded-xl border bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.06] hover:border-white/20 transition-colors shadow-sm`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-black/40 border border-white/10 flex items-center justify-center shrink-0 shadow-inner">
                {skill.icon}
              </div>
              <div className="flex flex-col">
                <span className="text-[14px] font-medium text-white">{skill.name}</span>
                <span className="text-[12px] text-[#71717a]">{skill.level}</span>
              </div>
            </div>
            <div className="mt-auto w-full h-1.5 bg-black/50 rounded-full overflow-hidden shadow-inner">
              <div className={`h-full bg-gradient-to-r ${skill.color} rounded-full`} style={{ width: `${skill.progress}%`, boxShadow: `0 0 8px ${skill.shadow}` }}></div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* ─── Skills by Proficiency ─────────────────────────────── */

function SkillsByProficiency() {
  const levels = [
    { label: "Expert", count: 12, percentage: 37.5, color: "from-[#b19cd9] to-[#c2c1ff]", shadow: "rgba(177,156,217,0.5)" },
    { label: "Advanced", count: 11, percentage: 34.4, color: "from-[#6366f1] to-[#818cf8]", shadow: "rgba(99,102,241,0.5)" },
    { label: "Intermediate", count: 6, percentage: 18.8, color: "from-[#0ea5e9] to-[#38bdf8]", shadow: "rgba(14,165,233,0.5)" },
    { label: "Beginner", count: 3, percentage: 9.3, color: "from-[#f59e0b] to-[#fbbf24]", shadow: "rgba(245,158,11,0.5)" },
  ];

  return (
    <motion.div variants={itemVariants} className="bg-gradient-to-br from-white/[0.06] to-white/[0.01] backdrop-blur-xl border border-white/10 rounded-[24px] p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-[18px] font-bold text-white mb-1 drop-shadow-sm">Skills by Proficiency</h3>
        <p className="text-[13px] text-[#a1a1aa]">Distribution of your skills by level</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {levels.map((level, i) => (
          <div key={i} className="flex flex-col bg-white/[0.02] border border-white/[0.05] p-5 rounded-2xl hover:bg-white/[0.04] transition-colors">
            <span className="text-[13px] font-medium text-[#a1a1aa] mb-2">{level.label}</span>
            <div className="flex items-end justify-between mb-3">
              <span className="text-[28px] font-bold text-white leading-none drop-shadow-md">{level.count}</span>
              <span className="text-[12px] font-medium text-[#71717a] mb-0.5">{level.percentage}%</span>
            </div>
            <div className="w-full h-1.5 bg-black/50 rounded-full overflow-hidden shadow-inner">
              <div className={`h-full bg-gradient-to-r ${level.color} rounded-full`} style={{ width: `${level.percentage}%`, boxShadow: `0 0 10px ${level.shadow}` }}></div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* ─── Recommended Next Steps ────────────────────────────── */

function RecommendedNextSteps() {
  const steps = [
    { icon: <Box size={20} className="text-[#38BDF8]" />, title: "Learn Kubernetes", desc: "High demand in your field", color: "from-[#38BDF8] to-[#7dd3fc]" },
    { icon: <Server size={20} className="text-[#8b5cf6]" />, title: "Improve System Design", desc: "Strengthen your architecture skills", color: "from-[#8b5cf6] to-[#a78bfa]" },
    { icon: <TrendingUp size={20} className="text-[#0ea5e9]" />, title: "Explore CI/CD", desc: "Boost your DevOps knowledge", color: "from-[#0ea5e9] to-[#38bdf8]" },
    { icon: <span className="font-bold text-[14px] text-[#3178C6]">TS</span>, title: "Advanced TypeScript", desc: "Take your TS skills to expert level", color: "from-[#3178C6] to-[#60a5fa]" },
  ];

  return (
    <motion.div variants={itemVariants} className="bg-gradient-to-br from-white/[0.06] to-white/[0.01] backdrop-blur-xl border border-white/10 rounded-[24px] p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-[18px] font-bold text-white mb-1 drop-shadow-sm">Recommended Next Steps</h3>
        <p className="text-[13px] text-[#a1a1aa]">Skills to help you grow in your career</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {steps.map((step, i) => (
          <div key={i} className="flex flex-col bg-white/[0.02] border border-white/[0.05] p-5 rounded-2xl group cursor-pointer hover:bg-white/[0.04] hover:border-white/10 transition-colors relative overflow-hidden shadow-sm">
            <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${step.color} rounded-full blur-[40px] opacity-10 group-hover:opacity-20 transition-opacity`}></div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border border-white/10 bg-black/40 shadow-inner z-10">
                {step.icon}
              </div>
              <h4 className="text-[14px] font-semibold text-white truncate pr-4 z-10">{step.title}</h4>
            </div>
            <p className="text-[12px] text-[#a1a1aa] line-clamp-2 z-10">{step.desc}</p>
            <ArrowRight size={14} className="text-[#a1a1aa] absolute right-5 top-7 opacity-0 group-hover:opacity-100 transition-opacity z-10" />
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* ─── Right Column Components ───────────────────────────── */

function ProfileCard() {
  const { user } = useUser();
  const displayName = user?.displayName || "Forge User";
  const email = user?.email || "user@example.com";

  return (
    <motion.div variants={itemVariants} className="bg-gradient-to-br from-white/[0.06] to-white/[0.01] backdrop-blur-xl border border-white/10 rounded-[24px] overflow-hidden relative shadow-sm">
      <div className="absolute inset-0 bg-gradient-to-br from-[#1e1a2e]/60 to-[#0A0A0A] z-0 pointer-events-none"></div>
      
      {/* Background decoration */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#b19cd9] rounded-full blur-[100px] opacity-20 pointer-events-none"></div>
      
      {/* 3D Avatar Area placeholder */}
      <div className="w-full h-[240px] relative z-10 flex items-center justify-center p-4">
        <div className="w-full h-full rounded-[20px] overflow-hidden border border-white/[0.05] bg-white/[0.02] backdrop-blur-sm relative flex flex-col items-center justify-end pb-0 shadow-inner">
           {/* Placeholder for the 3D character */}
           <div className="w-48 h-56 bg-gradient-to-t from-[#b19cd9]/20 to-transparent rounded-t-full relative flex items-end justify-center">
             <div className="w-32 h-40 bg-[#1e1a2e] rounded-t-[40px] opacity-80 backdrop-blur-sm border-t border-l border-r border-white/10 shadow-[0_-10px_20px_rgba(177,156,217,0.1)]"></div>
             <div className="absolute top-4 w-16 h-16 bg-[#b19cd9] rounded-full blur-2xl opacity-40"></div>
           </div>
           
           <div className="absolute top-4 left-4 w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl transform rotate-12 flex items-center justify-center shadow-lg">
             <span className="text-white font-medium text-xs drop-shadow-md">AI</span>
           </div>
           
           <div className="absolute bottom-12 right-6 w-10 h-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg transform -rotate-12 flex items-center justify-center shadow-lg">
             <span className="text-white font-medium text-xs drop-shadow-md">Code</span>
           </div>
        </div>
      </div>
      
      <div className="p-6 relative z-10 bg-gradient-to-t from-black/80 to-transparent">
        <h2 className="text-[22px] font-bold text-white tracking-tight mb-1 drop-shadow-md">{displayName}</h2>
        <p className="text-[14px] text-[#b19cd9] font-medium mb-4">Full Stack Engineer</p>
        
        <div className="flex flex-col gap-2 mb-6">
          <div className="flex items-center gap-3 text-[13px] text-[#a1a1aa]">
            <div className="w-6 h-6 rounded-md bg-white/5 flex items-center justify-center border border-white/10"><MapPin size={12} /></div>
            <span>Worldwide</span>
          </div>
          <div className="flex items-center gap-3 text-[13px] text-[#a1a1aa]">
            <div className="w-6 h-6 rounded-md bg-white/5 flex items-center justify-center border border-white/10"><Mail size={12} /></div>
            <span>{email}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-5 border-t border-white/[0.08]">
          <div className="flex flex-col items-center">
            <span className="text-[18px] font-bold text-white leading-none mb-1 drop-shadow-sm">5+</span>
            <span className="text-[11px] font-medium text-[#71717a] uppercase tracking-wider">Years Exp</span>
          </div>
          <div className="w-[1px] h-8 bg-white/[0.08]"></div>
          <div className="flex flex-col items-center">
            <span className="text-[18px] font-bold text-white leading-none mb-1 drop-shadow-sm">18</span>
            <span className="text-[11px] font-medium text-[#71717a] uppercase tracking-wider">Projects</span>
          </div>
          <div className="w-[1px] h-8 bg-white/[0.08]"></div>
          <div className="flex flex-col items-center">
            <span className="text-[18px] font-bold text-white leading-none mb-1 drop-shadow-sm">32</span>
            <span className="text-[11px] font-medium text-[#71717a] uppercase tracking-wider">Skills</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Skills Progress (Radar Placeholder) ───────────────── */

function SkillsProgress() {
  return (
    <motion.div variants={itemVariants} className="bg-gradient-to-br from-white/[0.06] to-white/[0.01] backdrop-blur-xl border border-white/10 rounded-[24px] p-6 shadow-sm">
      <div className="mb-4">
        <h3 className="text-[16px] font-bold text-white mb-1 drop-shadow-sm">Skills Progress</h3>
        <p className="text-[12px] text-[#a1a1aa]">Visual overview of your skills</p>
      </div>
      
      <div className="w-full aspect-square max-h-[250px] mx-auto relative flex items-center justify-center mt-4">
        {/* Glass backing for Radar */}
        <div className="absolute inset-4 bg-white/[0.02] border border-white/[0.05] rounded-full blur-sm"></div>
        
        {/* Radar Chart Visual Approximation */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-full relative z-10">
            <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible drop-shadow-lg">
              {/* Grid Lines */}
              <polygon points="50,10 90,30 90,70 50,90 10,70 10,30" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
              <polygon points="50,25 75,38 75,62 50,75 25,62 25,38" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
              <polygon points="50,40 60,45 60,55 50,60 40,55 40,45" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
              
              {/* Axes */}
              <line x1="50" y1="50" x2="50" y2="10" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
              <line x1="50" y1="50" x2="90" y2="30" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
              <line x1="50" y1="50" x2="90" y2="70" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
              <line x1="50" y1="50" x2="50" y2="90" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
              <line x1="50" y1="50" x2="10" y2="70" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
              <line x1="50" y1="50" x2="10" y2="30" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
              
              {/* Data Area */}
              <polygon points="50,15 80,35 70,65 50,80 30,60 20,40" fill="rgba(177, 156, 217, 0.3)" stroke="#b19cd9" strokeWidth="1.5" />
              
              {/* Data Points */}
              <circle cx="50" cy="15" r="2" fill="#fff" stroke="#b19cd9" strokeWidth="1" />
              <circle cx="80" cy="35" r="2" fill="#fff" stroke="#b19cd9" strokeWidth="1" />
              <circle cx="70" cy="65" r="2" fill="#fff" stroke="#b19cd9" strokeWidth="1" />
              <circle cx="50" cy="80" r="2" fill="#fff" stroke="#b19cd9" strokeWidth="1" />
              <circle cx="30" cy="60" r="2" fill="#fff" stroke="#b19cd9" strokeWidth="1" />
              <circle cx="20" cy="40" r="2" fill="#fff" stroke="#b19cd9" strokeWidth="1" />
            </svg>
            
            {/* Labels */}
            <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[11px] font-medium text-white drop-shadow-md">Frontend</span>
            <span className="absolute top-[25%] -right-4 -translate-y-1/2 text-[11px] font-medium text-[#a1a1aa]">Backend</span>
            <span className="absolute bottom-[25%] -right-4 translate-y-1/2 text-[11px] font-medium text-[#a1a1aa]">Database</span>
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 text-[11px] font-medium text-white drop-shadow-md">DevOps</span>
            <span className="absolute bottom-[25%] -left-2 translate-y-1/2 text-[11px] font-medium text-[#a1a1aa]">Tools</span>
            <span className="absolute top-[25%] -left-4 -translate-y-1/2 text-[11px] font-medium text-[#a1a1aa]">AI & ML</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Recent Skill Additions ────────────────────────────── */

function RecentSkillAdditions() {
  const additions = [
    { name: "System Design", level: "Advanced", time: "Added 5 days ago", icon: <Server size={14} className="text-[#b19cd9]" />, bg: "bg-[#1e1a2e]" },
    { name: "Docker", level: "Intermediate", time: "Added 1 week ago", icon: <Box size={14} className="text-[#38BDF8]" />, bg: "bg-black/60" },
    { name: "AWS", level: "Beginner", time: "Added 2 weeks ago", icon: <Globe size={14} className="text-[#f97316]" />, bg: "bg-black/60" },
  ];

  return (
    <motion.div variants={itemVariants} className="bg-gradient-to-br from-white/[0.06] to-white/[0.01] backdrop-blur-xl border border-white/10 rounded-[24px] p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-[16px] font-bold text-white mb-1 drop-shadow-sm">Recent Skill Additions</h3>
          <p className="text-[12px] text-[#a1a1aa]">Your latest added skills</p>
        </div>
        <button className="text-[12px] font-medium text-[#b19cd9] flex items-center gap-1 hover:text-white transition-colors bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
          View All <ArrowRight size={12} />
        </button>
      </div>
      
      <div className="flex flex-col gap-3">
        {additions.map((item, i) => (
          <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-colors shadow-sm">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border border-white/10 ${item.bg} shadow-inner`}>
              {item.icon}
            </div>
            <div className="flex flex-col flex-1">
              <span className="text-[14px] font-semibold text-white drop-shadow-sm">{item.name}</span>
              <span className="text-[11px] text-[#71717a]">{item.time}</span>
            </div>
            <span className="text-[11px] font-medium text-white px-2.5 py-1 bg-black/60 backdrop-blur-md rounded-md border border-white/10 shadow-inner">
              {item.level}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
