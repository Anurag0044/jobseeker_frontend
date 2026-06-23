"use client";

import React from "react";
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
        <h1 className="text-[28px] font-semibold text-white tracking-tight mb-1">Skills</h1>
        <p className="text-[14px] text-[#a1a1aa]">Showcase your expertise and track your growth.</p>
      </div>
      <div className="flex items-center gap-3">
        <button className="px-4 py-2.5 bg-[#6366f1] text-white text-[13px] font-medium rounded-lg hover:bg-[#4f46e5] transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(99,102,241,0.3)]">
          <Plus size={16} /> Add Skill
        </button>
        <button className="px-4 py-2.5 bg-[#121212] border border-[#262626] text-white text-[13px] font-medium rounded-lg hover:bg-[#1A1A1A] transition-colors flex items-center gap-2">
          <Settings size={16} /> Manage Skills
        </button>
      </div>
    </motion.div>
  );
}

/* ─── Tabs ──────────────────────────────────────────────── */

function NavigationTabs() {
  const tabs = ["Overview", "Technical Skills", "Soft Skills", "Certifications", "Learning Path", "Skill Assessment"];
  return (
    <motion.div variants={itemVariants} className="w-full border-b border-[#1e1e1e] flex gap-8 overflow-x-auto no-scrollbar">
      {tabs.map((tab, i) => (
        <button key={i} className={`pb-3 text-[14px] font-medium transition-colors relative whitespace-nowrap ${tab === "Overview" ? "text-[#b19cd9]" : "text-[#a1a1aa] hover:text-white"}`}>
          {tab}
          {tab === "Overview" && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#b19cd9] rounded-t-full"></div>}
        </button>
      ))}
    </motion.div>
  );
}

/* ─── Skills Overview ───────────────────────────────────── */

function SkillsOverview() {
  return (
    <motion.div variants={itemVariants} className="bg-[#121212] border border-[#1e1e1e] rounded-xl p-6">
      <div className="mb-6">
        <h3 className="text-[16px] font-semibold text-white mb-1">Skills Overview</h3>
        <p className="text-[13px] text-[#a1a1aa]">Your professional skills summary</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex flex-col gap-2">
          <span className="text-[12px] text-[#71717a]">Total Skills</span>
          <div className="flex items-center justify-between">
            <span className="text-[32px] font-semibold text-white leading-none">32</span>
            <div className="w-10 h-10 rounded-lg bg-[#1e1a2e] border border-[#2a2440] flex items-center justify-center">
              <Award size={18} className="text-[#b19cd9]" />
            </div>
          </div>
          <span className="text-[12px] text-[#71717a] mt-1">Across all categories</span>
        </div>
        
        <div className="flex flex-col gap-2 relative">
          <div className="hidden md:block absolute left-[-12px] top-[10%] bottom-[10%] w-[1px] bg-[#1e1e1e]"></div>
          <span className="text-[12px] text-[#71717a]">Strength Areas</span>
          <div className="flex items-center justify-between">
            <span className="text-[15px] font-medium text-white max-w-[130px] leading-tight">Frontend, System Design, AI</span>
            <div className="w-10 h-10 rounded-lg bg-[#0f291e] border border-[#163d2d] flex items-center justify-center shrink-0">
              <TrendingUp size={18} className="text-[#22c55e]" />
            </div>
          </div>
          <span className="text-[12px] text-[#71717a] mt-1">Top performing categories</span>
        </div>
        
        <div className="flex flex-col gap-2 relative">
          <div className="hidden md:block absolute left-[-12px] top-[10%] bottom-[10%] w-[1px] bg-[#1e1e1e]"></div>
          <span className="text-[12px] text-[#71717a]">Growth Areas</span>
          <div className="flex items-center justify-between">
            <span className="text-[15px] font-medium text-white max-w-[130px] leading-tight">DevOps, Cloud, Testing</span>
            <div className="w-10 h-10 rounded-lg bg-[#331c11] border border-[#4d2a19] flex items-center justify-center shrink-0">
              <Box size={18} className="text-[#f97316]" />
            </div>
          </div>
          <span className="text-[12px] text-[#71717a] mt-1">Focus for improvement</span>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Technical Skills ──────────────────────────────────── */

function TechnicalSkills() {
  const tabs = ["Frontend", "Backend", "Database", "DevOps", "Tools & Others", "AI & ML"];
  
  const skills = [
    { name: "React", level: "Expert", progress: 95, icon: <Code size={20} className="text-[#61DAFB]" />, bg: "bg-[#0f172a]", border: "border-[#1e293b]" },
    { name: "TypeScript", level: "Expert", progress: 90, icon: <span className="font-bold text-[14px] text-[#3178C6] tracking-tighter">TS</span>, bg: "bg-[#0f172a]", border: "border-[#1e293b]" },
    { name: "Next.js", level: "Advanced", progress: 85, icon: <span className="font-bold text-[14px] text-white leading-none">N</span>, bg: "bg-[#18181b]", border: "border-[#27272a]" },
    { name: "Tailwind CSS", level: "Advanced", progress: 85, icon: <Monitor size={20} className="text-[#38BDF8]" />, bg: "bg-[#0f172a]", border: "border-[#1e293b]" },
    { name: "JavaScript", level: "Expert", progress: 95, icon: <span className="font-bold text-[14px] text-black bg-[#F7DF1E] px-1 rounded-sm leading-tight">JS</span>, bg: "bg-[#18181b]", border: "border-[#27272a]" },
    { name: "HTML", level: "Advanced", progress: 80, icon: <span className="font-bold text-[14px] text-[#E34F26]">5</span>, bg: "bg-[#18181b]", border: "border-[#27272a]" },
    { name: "CSS", level: "Advanced", progress: 80, icon: <span className="font-bold text-[14px] text-[#1572B6]">3</span>, bg: "bg-[#18181b]", border: "border-[#27272a]" },
    { name: "Redux Toolkit", level: "Intermediate", progress: 65, icon: <Code size={20} className="text-[#764ABC]" />, bg: "bg-[#18181b]", border: "border-[#27272a]" },
  ];

  return (
    <motion.div variants={itemVariants} className="bg-[#121212] border border-[#1e1e1e] rounded-xl p-6">
      <div className="mb-5">
        <h3 className="text-[16px] font-semibold text-white mb-1">Technical Skills</h3>
        <p className="text-[13px] text-[#a1a1aa]">Your technical expertise across different categories</p>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map((tab, i) => (
          <button key={i} className={`px-4 py-1.5 rounded-md text-[13px] transition-colors ${tab === "Frontend" ? "bg-[#6366f1] text-white font-medium" : "bg-[#1a1a1a] text-[#a1a1aa] hover:text-white border border-[#262626]"}`}>
            {tab}
          </button>
        ))}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {skills.map((skill, i) => (
          <div key={i} className={`flex flex-col p-4 rounded-xl border ${skill.bg} ${skill.border}`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#121212] border border-[#262626] flex items-center justify-center shrink-0">
                {skill.icon}
              </div>
              <div className="flex flex-col">
                <span className="text-[14px] font-medium text-white">{skill.name}</span>
                <span className="text-[12px] text-[#71717a]">{skill.level}</span>
              </div>
            </div>
            <div className="mt-auto w-full h-1 bg-[#262626] rounded-full overflow-hidden">
              <div className="h-full bg-[#8b5cf6] rounded-full" style={{ width: `${skill.progress}%` }}></div>
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
    { label: "Expert", count: 12, percentage: 37.5, color: "bg-[#8b5cf6]" },
    { label: "Advanced", count: 11, percentage: 34.4, color: "bg-[#8b5cf6]" },
    { label: "Intermediate", count: 6, percentage: 18.8, color: "bg-[#8b5cf6]" },
    { label: "Beginner", count: 3, percentage: 9.3, color: "bg-[#8b5cf6]" },
  ];

  return (
    <motion.div variants={itemVariants} className="bg-[#121212] border border-[#1e1e1e] rounded-xl p-6">
      <div className="mb-6">
        <h3 className="text-[16px] font-semibold text-white mb-1">Skills by Proficiency</h3>
        <p className="text-[13px] text-[#a1a1aa]">Distribution of your skills by level</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {levels.map((level, i) => (
          <div key={i} className="flex flex-col bg-[#1a1a1a] border border-[#262626] p-4 rounded-xl">
            <span className="text-[13px] text-[#a1a1aa] mb-2">{level.label}</span>
            <div className="flex items-end justify-between mb-3">
              <span className="text-[24px] font-semibold text-white leading-none">{level.count}</span>
              <span className="text-[12px] text-[#71717a] mb-0.5">{level.percentage}%</span>
            </div>
            <div className="w-full h-1 bg-[#262626] rounded-full overflow-hidden">
              <div className={`h-full ${level.color} rounded-full`} style={{ width: `${level.percentage}%` }}></div>
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
    { icon: <Box size={20} className="text-[#38BDF8]" />, title: "Learn Kubernetes", desc: "High demand in your field", bg: "bg-[#0f172a]", border: "border-[#1e293b]" },
    { icon: <Server size={20} className="text-[#8b5cf6]" />, title: "Improve System Design", desc: "Strengthen your architecture skills", bg: "bg-[#1e1a2e]", border: "border-[#2a2440]" },
    { icon: <TrendingUp size={20} className="text-[#0ea5e9]" />, title: "Explore CI/CD", desc: "Boost your DevOps knowledge", bg: "bg-[#0f172a]", border: "border-[#1e293b]" },
    { icon: <span className="font-bold text-[14px] text-[#3178C6]">TS</span>, title: "Advanced TypeScript", desc: "Take your TS skills to expert level", bg: "bg-[#0f172a]", border: "border-[#1e293b]" },
  ];

  return (
    <motion.div variants={itemVariants} className="bg-[#121212] border border-[#1e1e1e] rounded-xl p-6">
      <div className="mb-6">
        <h3 className="text-[16px] font-semibold text-white mb-1">Recommended Next Steps</h3>
        <p className="text-[13px] text-[#a1a1aa]">Skills to help you grow in your career</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {steps.map((step, i) => (
          <div key={i} className="flex flex-col bg-[#1a1a1a] border border-[#262626] p-4 rounded-xl group cursor-pointer hover:border-[#3f3f46] transition-colors relative">
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${step.bg} ${step.border}`}>
                {step.icon}
              </div>
              <h4 className="text-[13px] font-medium text-white truncate pr-4">{step.title}</h4>
            </div>
            <p className="text-[12px] text-[#71717a] line-clamp-2">{step.desc}</p>
            <ArrowRight size={14} className="text-[#71717a] absolute right-4 top-5 opacity-0 group-hover:opacity-100 transition-opacity" />
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
  const firstLetter = displayName.charAt(0).toUpperCase();

  return (
    <motion.div variants={itemVariants} className="bg-[#121212] border border-[#1e1e1e] rounded-2xl overflow-hidden relative shadow-lg">
      <div className="absolute inset-0 bg-gradient-to-br from-[#1e1a2e]/40 to-[#0A0A0A] z-0 pointer-events-none"></div>
      
      {/* Background decoration */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#6366f1] rounded-full blur-[100px] opacity-20 pointer-events-none"></div>
      
      {/* 3D Avatar Area placeholder */}
      <div className="w-full h-[240px] relative z-10 flex items-center justify-center p-4">
        <div className="w-full h-full rounded-xl overflow-hidden border border-[#2a2440] bg-[#1a1a1a] relative flex flex-col items-center justify-end pb-0">
           {/* Placeholder for the 3D character */}
           <div className="w-48 h-56 bg-gradient-to-t from-[#6366f1]/20 to-transparent rounded-t-full relative flex items-end justify-center">
             <div className="w-32 h-40 bg-[#2a2440] rounded-t-[40px] opacity-80 backdrop-blur-sm border-t border-l border-r border-[#3f3f46]"></div>
             <div className="absolute top-4 w-16 h-16 bg-[#b19cd9] rounded-full blur-xl opacity-30"></div>
           </div>
           
           <div className="absolute top-4 left-4 w-12 h-12 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl transform rotate-12 flex items-center justify-center">
             <span className="text-white/40 text-xs">AI</span>
           </div>
           
           <div className="absolute bottom-12 right-6 w-10 h-10 bg-white/5 backdrop-blur-md border border-white/10 rounded-lg transform -rotate-12 flex items-center justify-center">
             <span className="text-white/40 text-xs">Code</span>
           </div>
        </div>
      </div>
      
      <div className="p-6 relative z-10">
        <h2 className="text-[20px] font-semibold text-white tracking-tight mb-1">{displayName}</h2>
        <p className="text-[14px] text-[#a1a1aa] mb-4">Full Stack Engineer</p>
        
        <div className="flex flex-col gap-2 mb-6">
          <div className="flex items-center gap-2 text-[12px] text-[#71717a]">
            <MapPin size={14} />
            <span>Worldwide</span>
          </div>
          <div className="flex items-center gap-2 text-[12px] text-[#71717a]">
            <Mail size={14} />
            <span>{email}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-[#1e1e1e]">
          <div className="flex flex-col items-center">
            <span className="text-[16px] font-semibold text-white leading-none mb-1">5+</span>
            <span className="text-[11px] text-[#71717a]">Years Experience</span>
          </div>
          <div className="w-[1px] h-8 bg-[#1e1e1e]"></div>
          <div className="flex flex-col items-center">
            <span className="text-[16px] font-semibold text-white leading-none mb-1">18</span>
            <span className="text-[11px] text-[#71717a]">Projects</span>
          </div>
          <div className="w-[1px] h-8 bg-[#1e1e1e]"></div>
          <div className="flex flex-col items-center">
            <span className="text-[16px] font-semibold text-white leading-none mb-1">32</span>
            <span className="text-[11px] text-[#71717a]">Skills</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Skills Progress (Radar Placeholder) ───────────────── */

function SkillsProgress() {
  return (
    <motion.div variants={itemVariants} className="bg-[#121212] border border-[#1e1e1e] rounded-xl p-6">
      <div className="mb-4">
        <h3 className="text-[15px] font-semibold text-white mb-1">Skills Progress</h3>
        <p className="text-[12px] text-[#a1a1aa]">Visual overview of your skills</p>
      </div>
      
      <div className="w-full aspect-square max-h-[250px] mx-auto relative flex items-center justify-center mt-4">
        {/* Radar Chart Visual Approximation */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-full relative">
            <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
              {/* Grid Lines */}
              <polygon points="50,10 90,30 90,70 50,90 10,70 10,30" fill="none" stroke="#262626" strokeWidth="0.5" />
              <polygon points="50,25 75,38 75,62 50,75 25,62 25,38" fill="none" stroke="#262626" strokeWidth="0.5" />
              <polygon points="50,40 60,45 60,55 50,60 40,55 40,45" fill="none" stroke="#262626" strokeWidth="0.5" />
              
              {/* Axes */}
              <line x1="50" y1="50" x2="50" y2="10" stroke="#262626" strokeWidth="0.5" />
              <line x1="50" y1="50" x2="90" y2="30" stroke="#262626" strokeWidth="0.5" />
              <line x1="50" y1="50" x2="90" y2="70" stroke="#262626" strokeWidth="0.5" />
              <line x1="50" y1="50" x2="50" y2="90" stroke="#262626" strokeWidth="0.5" />
              <line x1="50" y1="50" x2="10" y2="70" stroke="#262626" strokeWidth="0.5" />
              <line x1="50" y1="50" x2="10" y2="30" stroke="#262626" strokeWidth="0.5" />
              
              {/* Data Area */}
              <polygon points="50,15 80,35 70,65 50,80 30,60 20,40" fill="rgba(124, 58, 237, 0.2)" stroke="#7c3aed" strokeWidth="1.5" />
              
              {/* Data Points */}
              <circle cx="50" cy="15" r="1.5" fill="#b19cd9" />
              <circle cx="80" cy="35" r="1.5" fill="#b19cd9" />
              <circle cx="70" cy="65" r="1.5" fill="#b19cd9" />
              <circle cx="50" cy="80" r="1.5" fill="#b19cd9" />
              <circle cx="30" cy="60" r="1.5" fill="#b19cd9" />
              <circle cx="20" cy="40" r="1.5" fill="#b19cd9" />
            </svg>
            
            {/* Labels */}
            <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] text-[#a1a1aa]">Frontend</span>
            <span className="absolute top-[25%] -right-4 -translate-y-1/2 text-[10px] text-[#a1a1aa]">Backend</span>
            <span className="absolute bottom-[25%] -right-4 translate-y-1/2 text-[10px] text-[#a1a1aa]">Database</span>
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 text-[10px] text-[#a1a1aa]">DevOps</span>
            <span className="absolute bottom-[25%] -left-2 translate-y-1/2 text-[10px] text-[#a1a1aa]">Tools</span>
            <span className="absolute top-[25%] -left-4 -translate-y-1/2 text-[10px] text-[#a1a1aa]">AI & ML</span>
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
    { name: "Docker", level: "Intermediate", time: "Added 1 week ago", icon: <Box size={14} className="text-[#38BDF8]" />, bg: "bg-[#0f172a]" },
    { name: "AWS", level: "Beginner", time: "Added 2 weeks ago", icon: <Globe size={14} className="text-[#f97316]" />, bg: "bg-[#331c11]" },
  ];

  return (
    <motion.div variants={itemVariants} className="bg-[#121212] border border-[#1e1e1e] rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-[15px] font-semibold text-white mb-1">Recent Skill Additions</h3>
          <p className="text-[12px] text-[#a1a1aa]">Your latest added skills</p>
        </div>
        <button className="text-[12px] text-[#b19cd9] flex items-center gap-1 hover:text-[#c2c1ff] transition-colors">
          View All <ArrowRight size={12} />
        </button>
      </div>
      
      <div className="flex flex-col gap-4">
        {additions.map((item, i) => (
          <div key={i} className="flex items-center gap-4">
            <div className={`w-8 h-8 rounded-md flex items-center justify-center shrink-0 ${item.bg}`}>
              {item.icon}
            </div>
            <div className="flex flex-col flex-1">
              <span className="text-[13px] font-medium text-white">{item.name}</span>
              <span className="text-[11px] text-[#71717a]">{item.time}</span>
            </div>
            <span className="text-[11px] text-[#a1a1aa] px-2 py-0.5 bg-[#1a1a1a] rounded-sm border border-[#262626]">
              {item.level}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
