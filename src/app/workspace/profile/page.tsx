"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { useUser } from "../../../hooks/useUser";
import {
  MapPin, Mail, MoreHorizontal, Star, ExternalLink, ArrowRight,
  Eye, ShieldCheck, Code, Server, Database,
  Terminal, Monitor, Box, Globe, Bot, Briefcase, User,
  Link as LinkIcon, FolderGit2
} from "lucide-react";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring" as const, stiffness: 300, damping: 24 } },
};

export default function ProfilePage() {
  return (
    <div className="px-8 pb-16 pt-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-[1100px] mx-auto flex flex-col gap-8"
      >
        <ProfileHeader />
        <NavigationTabs />
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-7 flex flex-col gap-6">
            <AboutMe />
            <Projects />
          </div>
          <div className="xl:col-span-5 flex flex-col gap-6">
            <Skills />
            <RecentActivity />
            <CareerInsight />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── Profile Header ────────────────────────────────────── */

function ProfileHeader() {
  const { user } = useUser();
  const displayName = user?.displayName || "Forge User";
  const firstLetter = displayName.charAt(0).toUpperCase();
  const email = user?.email || "user@example.com";

  return (
    <motion.div variants={itemVariants} className="flex flex-col w-full relative">
      <div className="flex flex-wrap justify-between items-start gap-8 w-full">
        <div className="flex flex-col sm:flex-row gap-6 flex-1 min-w-[320px]">
          <div className="relative shrink-0 self-start sm:self-auto">
            <div className="w-[120px] h-[120px] rounded-full overflow-hidden border border-[#262626] bg-[#121212] flex items-center justify-center">
              {user?.photoURL ? (
                <img src={user.photoURL} alt={displayName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[40px] font-bold text-[#b19cd9]">{firstLetter}</div>
              )}
            </div>
            <div className="absolute bottom-1 right-3 w-4 h-4 bg-[#22c55e] border-2 border-[#0A0A0A] rounded-full"></div>
          </div>

          <div className="flex flex-col pt-1 flex-1 min-w-[250px] w-full">
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-[24px] font-semibold text-white tracking-tight leading-none truncate">{displayName}</h1>
              <ShieldCheck size={20} className="text-[#b19cd9] shrink-0" fill="#b19cd9" stroke="#0a0a0a" />
            </div>
            <p className="text-[13px] text-[#a1a1aa] mb-3 flex flex-wrap items-center gap-2">
              <span>Full Stack Developer</span><span>•</span><span>AI Enthusiast</span><span>•</span><span>Problem Solver</span>
            </p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] text-[#a1a1aa] mb-4">
              <span className="flex items-center gap-1.5"><MapPin size={14} className="opacity-70" /> Worldwide</span>
              <span className="flex items-center gap-1.5 text-[#b19cd9]"><LinkIcon size={14} className="opacity-70" /> user.portfolio.dev</span>
              <span className="flex items-center gap-1.5"><Mail size={14} className="opacity-70" /> {email}</span>
            </div>
            <p className="text-[13px] text-[#e5e2e1] mb-5 w-full leading-relaxed">
              I build scalable web applications and AI-powered tools that solve real-world problems. Always learning, always building.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              {/* GitHub */}
              <button className="w-8 h-8 rounded-full bg-[#121212] border border-[#262626] flex items-center justify-center text-white hover:bg-[#1A1A1A] transition-colors shrink-0">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
              </button>
              {/* LinkedIn */}
              <button className="w-8 h-8 rounded-full bg-[#121212] border border-[#262626] flex items-center justify-center text-white hover:bg-[#1A1A1A] transition-colors shrink-0">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </button>
              {/* Twitter */}
              <button className="w-8 h-8 rounded-full bg-[#121212] border border-[#262626] flex items-center justify-center text-white hover:bg-[#1A1A1A] transition-colors shrink-0">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
              </button>
              <button className="w-8 h-8 rounded-full bg-[#121212] border border-[#262626] flex items-center justify-center text-white hover:bg-[#1A1A1A] transition-colors shrink-0">
                <LinkIcon size={14} />
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-start xl:items-end gap-6 pt-1 shrink-0 w-full xl:w-auto">
          <div className="flex flex-wrap items-center gap-2">
            <button className="px-4 py-1.5 bg-[#121212] border border-[#262626] text-white text-[12px] font-medium rounded-full hover:bg-[#1A1A1A] transition-colors">Edit Profile</button>
            <button className="w-8 h-8 flex items-center justify-center bg-[#121212] border border-[#262626] text-white rounded-full hover:bg-[#1A1A1A] transition-colors"><MoreHorizontal size={14} /></button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-6 text-left xl:text-right w-full xl:w-auto">
            {[
              ["Projects", "18"], ["Followers", "1.2K"], ["Profile Views", "4.2K"],
              ["Connections", "342"], ["Responses", "89%"], ["Member Since", "Jan 2024"],
            ].map(([label, value], i) => (
              <div key={i} className="flex flex-col">
                <span className="text-[11px] text-[#71717a] mb-1 whitespace-nowrap">{label}</span>
                <span className="text-[18px] font-semibold text-white leading-none">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Tabs ──────────────────────────────────────────────── */

function NavigationTabs() {
  const tabs = ["Overview", "Projects", "Portfolio", "Skills", "Experience", "Achievements"];
  return (
    <motion.div variants={itemVariants} className="w-full border-b border-[#1e1e1e] flex gap-8">
      {tabs.map((tab, i) => (
        <button key={i} className={`pb-3 text-[13px] font-medium transition-colors relative ${tab === "Overview" ? "text-[#b19cd9]" : "text-[#a1a1aa] hover:text-white"}`}>
          {tab}
          {tab === "Overview" && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#b19cd9] rounded-t-full"></div>}
        </button>
      ))}
    </motion.div>
  );
}

/* ─── About Me ──────────────────────────────────────────── */

function AboutMe() {
  return (
    <motion.div variants={itemVariants} className="bg-[#121212] border border-[#1e1e1e] rounded-xl p-6">
      <h3 className="text-[15px] font-semibold text-white mb-4">About Me</h3>
      <p className="text-[13px] text-[#a1a1aa] leading-relaxed mb-6">
        I&apos;m a Computer Science student and a builder. I love turning ideas into real products using modern technologies. Currently focused on scalable web apps, AI agents, and developer tools.
      </p>
      <div className="flex flex-wrap gap-2">
        {[
          { icon: <Monitor size={14} />, label: "Web Development" },
          { icon: <Bot size={14} />, label: "AI & ML" },
          { icon: <Server size={14} />, label: "System Design" },
          { icon: <Code size={14} />, label: "Open Source" },
        ].map((tag, i) => (
          <span key={i} className="px-3 py-1.5 bg-[#1A1A1A] border border-[#262626] rounded-md text-[12px] text-[#e5e2e1] flex items-center gap-2">
            <span className="text-[#a1a1aa]">{tag.icon}</span> {tag.label}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

/* ─── Projects ──────────────────────────────────────────── */

function Projects() {
  const projects = [
    { title: "Orion AI Agent", desc: "Multi-agent AI system for productivity automation.", tags: ["Next.js", "TypeScript", "OpenAI"], stars: "1.2K" },
    { title: "DevFlow", desc: "Developer collaboration platform with real-time features.", tags: ["React", "Node.js", "Socket.io"], stars: "892" },
    { title: "TaskPilot", desc: "AI-powered task management and productivity tool.", tags: ["Next.js", "Tailwind", "Prisma"], stars: "645" },
  ];

  return (
    <motion.div variants={itemVariants} className="bg-[#121212] border border-[#1e1e1e] rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[15px] font-semibold text-white">Projects</h3>
        <button className="text-[12px] text-[#b19cd9] hover:text-[#c2c1ff] transition-colors">View All</button>
      </div>
      <div className="flex flex-col gap-5">
        {projects.map((proj, i) => (
          <div key={i} className="flex gap-4">
            <div className="w-12 h-12 rounded-lg border border-[#262626] bg-[#1A1A1A] flex items-center justify-center shrink-0">
              <FolderGit2 size={18} className="text-[#b19cd9]" />
            </div>
            <div className="flex flex-col flex-1">
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-[14px] font-medium text-white">{proj.title}</h4>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-[#71717a] text-[12px]"><Star size={12} /> {proj.stars}</div>
                  <ExternalLink size={14} className="text-[#71717a] cursor-pointer hover:text-white transition-colors" />
                </div>
              </div>
              <p className="text-[12px] text-[#a1a1aa] mb-2">{proj.desc}</p>
              <div className="flex items-center gap-2">
                {proj.tags.map((tag, j) => (
                  <span key={j} className="text-[11px] text-[#71717a] bg-[#1A1A1A] px-2 py-0.5 rounded">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="w-full flex justify-center mt-6 pt-4 border-t border-[#1e1e1e]">
        <button className="text-[13px] text-[#b19cd9] flex items-center gap-1.5 hover:text-[#c2c1ff] transition-colors">
          View All Projects <ArrowRight size={14} />
        </button>
      </div>
    </motion.div>
  );
}

/* ─── Skills ────────────────────────────────────────────── */

function Skills() {
  const topSkills = [
    { name: "React", icon: <Code size={12} className="text-[#61DAFB]" /> },
    { name: "TypeScript", icon: <Box size={12} className="text-[#3178C6]" /> },
    { name: "Node.js", icon: <Server size={12} className="text-[#339933]" /> },
    { name: "Next.js", icon: <span className="font-bold text-[10px] text-white">N</span> },
    { name: "MongoDB", icon: <Database size={12} className="text-[#47A248]" /> },
    { name: "Tailwind CSS", icon: <Code size={12} className="text-[#06B6D4]" /> },
    { name: "Docker", icon: <Box size={12} className="text-[#2496ED]" /> },
    { name: "AWS", icon: <Globe size={12} className="text-[#FF9900]" /> },
    { name: "Python", icon: <Code size={12} className="text-[#3776AB]" /> },
    { name: "Git", icon: <Terminal size={12} className="text-[#F05032]" /> },
  ];

  return (
    <motion.div variants={itemVariants} className="bg-[#121212] border border-[#1e1e1e] rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[15px] font-semibold text-white">Skills</h3>
        <button className="text-[12px] text-[#b19cd9] hover:text-[#c2c1ff] transition-colors">View All</button>
      </div>
      <div className="mb-6">
        <span className="text-[11px] text-[#71717a] block mb-3">Top Skills</span>
        <div className="flex flex-wrap gap-2">
          {topSkills.map((skill, i) => (
            <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-[#0A0A0A] border border-[#1e1e1e] rounded-md">
              {skill.icon}
              <span className="text-[12px] text-[#e5e2e1]">{skill.name}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="pt-4 border-t border-[#1e1e1e]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[12px] text-[#a1a1aa]">AI Skill Score</span>
          <span className="text-[13px] font-medium text-white">84%</span>
        </div>
        <div className="w-full h-1.5 bg-[#1e1e1e] rounded-full overflow-hidden">
          <div className="h-full bg-[#b19cd9] w-[84%] rounded-full"></div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Recent Activity ───────────────────────────────────── */

function RecentActivity() {
  const activities = [
    { icon: <Briefcase size={14} />, text: "Applied for Senior Frontend Developer at Stripe", time: "2h ago" },
    { icon: <Eye size={14} />, text: "Your project Orion AI Agent got 45 views", time: "5h ago" },
    { icon: <User size={14} />, text: "New connection request from Sarah Johnson", time: "1d ago" },
  ];

  return (
    <motion.div variants={itemVariants} className="bg-[#121212] border border-[#1e1e1e] rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[15px] font-semibold text-white">Recent Activity</h3>
        <button className="text-[12px] text-[#b19cd9] hover:text-[#c2c1ff] transition-colors">View All</button>
      </div>
      <div className="flex flex-col gap-5">
        {activities.map((act, i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-[#1A1A1A] border border-[#262626] flex items-center justify-center shrink-0 text-[#a1a1aa]">{act.icon}</div>
            <span className="text-[13px] text-[#e5e2e1] flex-1">{act.text}</span>
            <span className="text-[11px] text-[#71717a]">{act.time}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* ─── AI Career Insight ─────────────────────────────────── */

function CareerInsight() {
  const { user } = useUser();
  const firstName = user?.displayName ? user.displayName.split(" ")[0] : "there";

  return (
    <motion.div variants={itemVariants} className="bg-[#121212] border border-[#1e1e1e] rounded-xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <h3 className="text-[15px] font-semibold text-white">AI Career Insight</h3>
        <span className="px-2 py-0.5 bg-[#1e1a2e] border border-[#2a2440] text-[#b19cd9] rounded text-[10px] font-mono uppercase tracking-widest">BETA</span>
      </div>
      <div className="flex items-start gap-3 mb-6 bg-[#0A0A0A] p-4 rounded-lg border border-[#1e1e1e]">
        <Bot size={16} className="text-[#b19cd9] shrink-0 mt-0.5" />
        <p className="text-[13px] text-[#a1a1aa] leading-relaxed">
          Great progress, {firstName}! You&apos;re a <span className="text-white font-medium">good match</span> for <span className="text-white font-medium">Senior Frontend</span> roles. Strengthen your System Design skills to increase match rate.
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-[12px] text-[#a1a1aa]">Match Strength</span>
          <span className="text-[13px] font-medium text-white">72%</span>
        </div>
        <div className="w-full h-1.5 bg-[#1e1e1e] rounded-full overflow-hidden mb-2">
          <div className="h-full bg-[#b19cd9] w-[72%] rounded-full"></div>
        </div>
        <div className="flex justify-end">
          <button className="text-[12px] text-[#b19cd9] flex items-center gap-1 hover:text-[#c2c1ff] transition-colors">
            View Details <ArrowRight size={12} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
