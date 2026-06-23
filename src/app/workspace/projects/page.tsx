"use client";

import React, { useState } from "react";
import { motion, Variants } from "framer-motion";
import {
  Plus, Settings, Eye, Star, ExternalLink,
  MoreHorizontal, Bookmark, LayoutGrid, List, ChevronDown, Play
} from "lucide-react";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring" as const, stiffness: 300, damping: 24 } },
};

const projects = [
  {
    title: "Orion AI Agent",
    featured: true,
    desc: "Multi-agent AI system that automates complex workflows and boosts developer productivity.",
    tags: ["Next.js", "TypeScript", "OpenAI", "Tailwind CSS"],
    views: "1.2K",
    stars: "128",
    status: "Published",
    date: "May 10, 2024",
    color: "from-[#5e5ce6]/20 to-[#1A1A1A]",
  },
  {
    title: "DevFlow",
    featured: false,
    desc: "Developer collaboration platform with real-time features, team workspaces, and integrated tools.",
    tags: ["React", "Node.js", "Socket.io", "MongoDB"],
    views: "892",
    stars: "96",
    status: "Published",
    date: "Apr 28, 2024",
    color: "from-[#b19cd9]/10 to-[#1A1A1A]",
  },
  {
    title: "TaskPilot",
    featured: false,
    desc: "AI-powered task management and productivity tool with smart suggestions.",
    tags: ["Next.js", "Tailwind CSS", "Prisma", "PostgreSQL"],
    views: "645",
    stars: "72",
    status: "Published",
    date: "Apr 12, 2024",
    color: "from-[#06B6D4]/10 to-[#1A1A1A]",
  },
  {
    title: "Vercel Clone",
    featured: false,
    desc: "Fullstack clone of Vercel dashboard with team management, projects, and deployments.",
    tags: ["Next.js", "TypeScript", "PostgreSQL", "Tailwind CSS"],
    views: "532",
    stars: "48",
    status: "Published",
    date: "Mar 20, 2024",
    color: "from-[#3f3f46]/20 to-[#1A1A1A]",
  },
];

export default function ProjectsPage() {
  const [activeTab, setActiveTab] = useState("All Projects");
  const tabs = ["All Projects", "Published", "Drafts", "Private"];

  return (
    <div className="px-8 pb-16 pt-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-[1100px] mx-auto flex flex-col gap-6"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex items-start justify-between">
          <div>
            <h1 className="text-[28px] font-semibold text-white tracking-tight mb-1">Projects</h1>
            <p className="text-[14px] text-[#a1a1aa]">Showcase your work. Build your reputation.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-[#121212] border border-[#262626] text-white text-[13px] font-medium rounded-lg hover:bg-[#1A1A1A] transition-colors">
              <Settings size={16} /> Manage
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#5e5ce6] hover:bg-[#4d4ad5] text-white text-[13px] font-medium rounded-lg transition-colors">
              <Plus size={16} /> New Project
            </button>
          </div>
        </motion.div>

        {/* Tabs + Sort */}
        <motion.div variants={itemVariants} className="flex items-center justify-between border-b border-[#1e1e1e]">
          <div className="flex gap-6">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-[13px] font-medium transition-colors relative ${
                  activeTab === tab ? "text-[#b19cd9]" : "text-[#a1a1aa] hover:text-white"
                }`}
              >
                {tab}
                {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#b19cd9] rounded-t-full"></div>}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3 pb-3">
            <button className="flex items-center gap-1.5 text-[12px] text-[#a1a1aa] hover:text-white transition-colors">
              Sort by: Latest <ChevronDown size={14} />
            </button>
            <div className="flex items-center gap-1 bg-[#121212] border border-[#262626] rounded-md p-0.5">
              <button className="p-1.5 rounded bg-[#1A1A1A] text-white"><LayoutGrid size={14} /></button>
              <button className="p-1.5 rounded text-[#71717a] hover:text-white transition-colors"><List size={14} /></button>
            </div>
          </div>
        </motion.div>

        {/* Project Cards */}
        <div className="flex flex-col gap-4">
          {projects.map((proj, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className="flex gap-6 p-5 bg-[#121212] border border-[#1e1e1e] rounded-xl hover:border-[#3f3f46] transition-all group"
            >
              {/* Thumbnail */}
              <div className={`w-[280px] h-[140px] rounded-lg bg-gradient-to-br ${proj.color} border border-[#262626] flex items-center justify-center shrink-0 relative overflow-hidden`}>
                <span className="text-[18px] font-bold text-white/60 tracking-wide uppercase">{proj.title}</span>
                {proj.featured && (
                  <div className="absolute top-3 left-3 w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                    <Play size={14} className="text-white ml-0.5" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex flex-col flex-1 justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-[16px] font-semibold text-white">{proj.title}</h3>
                    {proj.featured && (
                      <span className="px-2 py-0.5 bg-[#5e5ce6]/20 border border-[#5e5ce6]/40 text-[#c2c1ff] rounded text-[10px] font-medium">Featured</span>
                    )}
                  </div>
                  <p className="text-[13px] text-[#a1a1aa] mb-3 leading-relaxed max-w-lg">{proj.desc}</p>
                  <div className="flex items-center gap-2">
                    {proj.tags.map((tag, j) => (
                      <span key={j} className="text-[11px] text-[#a1a1aa] bg-[#1A1A1A] border border-[#262626] px-2.5 py-1 rounded-md">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right side stats */}
              <div className="flex flex-col items-end justify-between shrink-0 min-w-[180px]">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-[12px] text-[#a3e635]">
                    <span className="w-1.5 h-1.5 bg-[#a3e635] rounded-full"></span>
                    {proj.status}
                  </span>
                  <span className="text-[12px] text-[#71717a]">{proj.date}</span>
                  <Bookmark size={16} className="text-[#71717a] hover:text-white cursor-pointer transition-colors" />
                </div>
                <div className="flex items-center gap-4 text-[12px] text-[#a1a1aa]">
                  <span className="flex items-center gap-1"><Eye size={14} /> {proj.views}</span>
                  <span className="flex items-center gap-1"><Star size={14} /> {proj.stars}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1A1A1A] border border-[#262626] text-white text-[12px] font-medium rounded-md hover:bg-[#262626] transition-colors">
                    View <ExternalLink size={12} />
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center bg-[#1A1A1A] border border-[#262626] text-[#a1a1aa] rounded-md hover:bg-[#262626] hover:text-white transition-colors">
                    <MoreHorizontal size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
