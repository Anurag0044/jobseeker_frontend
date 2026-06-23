"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import {
  Bookmark, Briefcase, Box, FolderGit2, Users, User,
  List, Filter, ChevronDown, ArrowRight, ChevronRight,
  Star, Eye, BookOpen, UserPlus, Code
} from "lucide-react";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring" as const, stiffness: 300, damping: 24 } },
};

export default function SavedPage() {
  return (
    <div className="px-8 pb-16 pt-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-[1200px] mx-auto flex flex-col gap-6"
      >
        <SavedHeader />
        <NavigationTabs />
        
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mt-2">
          <div className="xl:col-span-9 flex flex-col gap-6">
            <SavedJobsSection />
            <SavedCompaniesSection />
            <SavedProjectsSection />
            <SavedCommunitiesSection />
            <SavedPeopleSection />
          </div>
          <div className="xl:col-span-3 flex flex-col gap-6">
            <FiltersSidebar />
            <SummarySidebar />
            <YourListsSidebar />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── Header ────────────────────────────────────────────── */

function SavedHeader() {
  return (
    <motion.div variants={itemVariants} className="flex flex-wrap justify-between items-start gap-4 w-full">
      <div className="flex flex-col">
        <h1 className="text-[28px] font-semibold text-white tracking-tight mb-1">Saved</h1>
        <p className="text-[14px] text-[#a1a1aa]">All the opportunities, companies, people and more you&apos;ve saved.</p>
      </div>
      <div className="flex items-center gap-3">
        <button className="px-4 py-2.5 bg-[#121212] border border-[#262626] text-white text-[13px] font-medium rounded-lg hover:bg-[#1A1A1A] transition-colors flex items-center gap-2">
          <List size={16} /> Manage Lists
        </button>
      </div>
    </motion.div>
  );
}

/* ─── Tabs ──────────────────────────────────────────────── */

function NavigationTabs() {
  const tabs = [
    { label: "All", icon: <Bookmark size={14} className="text-[#b19cd9]" /> },
    { label: "Jobs", icon: <Briefcase size={14} /> },
    { label: "Companies", icon: <Box size={14} /> },
    { label: "Projects", icon: <FolderGit2 size={14} /> },
    { label: "Communities", icon: <Users size={14} /> },
    { label: "People", icon: <User size={14} /> },
  ];
  
  return (
    <motion.div variants={itemVariants} className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
      {tabs.map((tab, i) => (
        <button 
          key={i} 
          className={`px-4 py-2 rounded-lg text-[13px] font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${
            tab.label === "All" 
              ? "bg-[#1e1a2e] text-[#b19cd9] border border-[#2a2440]" 
              : "bg-transparent text-[#a1a1aa] hover:text-white hover:bg-[#121212] border border-transparent"
          }`}
        >
          {tab.icon} {tab.label}
        </button>
      ))}
    </motion.div>
  );
}

/* ─── Main Content Sections ─────────────────────────────── */

function SectionHeader({ icon, title, count }: { icon: React.ReactNode, title: string, count: number }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <div className="text-[#b19cd9]">{icon}</div>
        <h3 className="text-[15px] font-semibold text-white">{title}</h3>
        <span className="text-[12px] text-[#7c3aed] ml-2">{count} saved</span>
      </div>
      <button className="text-[12px] text-[#a1a1aa] flex items-center gap-1 hover:text-white transition-colors group">
        View all <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
      </button>
    </div>
  );
}

function ArrowButton() {
  return (
    <button className="w-8 h-8 rounded-full bg-[#121212] border border-[#262626] flex items-center justify-center text-[#a1a1aa] hover:text-white hover:bg-[#1A1A1A] transition-colors shrink-0 my-auto ml-2">
      <ChevronRight size={16} />
    </button>
  );
}

function SavedJobsSection() {
  const jobs = [
    { title: "Frontend Engineer", company: "Vercel", location: "San Francisco, CA • Remote", salary: "$160k - $220k", bg: "bg-[#0A0A0A]", logo: <div className="w-8 h-8 bg-white flex items-center justify-center rounded clip-triangle"><div className="w-0 h-0 border-l-[10px] border-r-[10px] border-b-[16px] border-l-transparent border-r-transparent border-b-black"></div></div> },
    { title: "Product Engineer", company: "Linear", location: "San Francisco, CA • Hybrid", salary: "$140k - $180k", bg: "bg-[#0A0A0A]", logo: <div className="w-8 h-8 bg-[#5e6ad2] rounded-full flex items-center justify-center text-white font-bold italic text-xs">L</div> },
    { title: "Software Engineer", company: "Notion", location: "New York, NY • Remote", salary: "$150k - $200k", bg: "bg-[#0A0A0A]", logo: <div className="w-8 h-8 bg-white rounded flex items-center justify-center text-black font-serif font-bold text-sm">N</div> },
    { title: "Full Stack Engineer", company: "OpenAI", location: "San Francisco, CA • Remote", salary: "$200k - $300k", bg: "bg-[#0A0A0A]", logo: <div className="w-8 h-8 bg-[#10a37f] rounded flex items-center justify-center"><SparkleIcon /></div> },
  ];

  return (
    <motion.div variants={itemVariants} className="bg-[#121212] border border-[#1e1e1e] rounded-xl p-6">
      <SectionHeader icon={<Briefcase size={16} />} title="Saved Jobs" count={12} />
      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
        {jobs.map((job, i) => (
          <div key={i} className={`min-w-[240px] flex-1 p-4 rounded-xl border border-[#262626] ${job.bg} flex flex-col relative group hover:border-[#3f3f46] transition-colors`}>
            <button className="absolute top-4 right-4 text-[#7c3aed]">
              <Bookmark size={16} className="fill-[#7c3aed]" />
            </button>
            <div className="w-12 h-12 rounded-lg bg-[#1A1A1A] border border-[#262626] flex items-center justify-center mb-4 shrink-0">
              {job.logo}
            </div>
            <h4 className="text-[14px] font-medium text-white mb-0.5">{job.title}</h4>
            <span className="text-[13px] text-[#a1a1aa] mb-3">{job.company}</span>
            <div className="text-[11px] text-[#71717a] mb-3">{job.location}</div>
            <div className="mt-auto px-2.5 py-1 bg-[#1A1A1A] border border-[#262626] rounded-md text-[11px] text-[#a1a1aa] self-start font-medium">
              {job.salary}
            </div>
          </div>
        ))}
        <ArrowButton />
      </div>
    </motion.div>
  );
}

function SavedCompaniesSection() {
  const companies = [
    { name: "Vercel", desc: "Developer Tools", bg: "bg-[#0A0A0A]", logo: <div className="w-6 h-6 bg-white flex items-center justify-center rounded clip-triangle"><div className="w-0 h-0 border-l-[6px] border-r-[6px] border-b-[10px] border-l-transparent border-r-transparent border-b-black"></div></div> },
    { name: "Stripe", desc: "Financial Services", bg: "bg-[#0A0A0A]", logo: <div className="w-6 h-6 bg-[#635BFF] rounded flex items-center justify-center text-white font-bold text-[10px]">S</div> },
    { name: "OpenAI", desc: "AI Research", bg: "bg-[#0A0A0A]", logo: <div className="w-6 h-6 bg-[#10a37f] rounded flex items-center justify-center"><SparkleIcon size={12} /></div> },
    { name: "Figma", desc: "Design Software", bg: "bg-[#0A0A0A]", logo: <div className="w-6 h-6 bg-black rounded flex items-center justify-center"><FigmaIcon /></div> },
  ];

  return (
    <motion.div variants={itemVariants} className="bg-[#121212] border border-[#1e1e1e] rounded-xl p-6">
      <SectionHeader icon={<Box size={16} />} title="Saved Companies" count={8} />
      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
        {companies.map((company, i) => (
          <div key={i} className={`min-w-[220px] flex-1 p-4 rounded-xl border border-[#262626] ${company.bg} flex items-center gap-3 relative group hover:border-[#3f3f46] transition-colors`}>
            <div className="w-10 h-10 rounded-lg bg-[#1A1A1A] border border-[#262626] flex items-center justify-center shrink-0">
              {company.logo}
            </div>
            <div className="flex flex-col flex-1 pr-6">
              <h4 className="text-[14px] font-medium text-white">{company.name}</h4>
              <span className="text-[12px] text-[#71717a] truncate">{company.desc}</span>
            </div>
            <button className="absolute right-4 text-[#7c3aed]">
              <Bookmark size={16} className="fill-transparent" />
            </button>
          </div>
        ))}
        <ArrowButton />
      </div>
    </motion.div>
  );
}

function SavedProjectsSection() {
  const projects = [
    { title: "Orion", desc: "Multi-agent career platform", tags: ["Next.js", "TypeScript"], img: "bg-gradient-to-br from-indigo-900 to-purple-900" },
    { title: "Portfolio Website", desc: "Personal portfolio built with Next.js and Tailwind CSS", tags: ["Next.js", "Tailwind"], img: "bg-[#1A1A1A]" },
    { title: "AI Resume Builder", desc: "AI-powered resume optimization tool", tags: ["Python", "OpenAI"], img: "bg-[#1A1A1A]" },
    { title: "DevOps Dashboard", desc: "Infrastructure monitoring and analytics dashboard", tags: ["React", "Node.js"], img: "bg-[#0f172a]" },
  ];

  return (
    <motion.div variants={itemVariants} className="bg-[#121212] border border-[#1e1e1e] rounded-xl p-6">
      <SectionHeader icon={<FolderGit2 size={16} />} title="Saved Projects" count={6} />
      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
        {projects.map((project, i) => (
          <div key={i} className="min-w-[260px] flex-1 p-3 rounded-xl border border-[#262626] bg-[#0A0A0A] flex gap-3 group hover:border-[#3f3f46] transition-colors">
            <div className={`w-[72px] h-[72px] rounded-lg border border-[#262626] shrink-0 ${project.img}`}></div>
            <div className="flex flex-col flex-1 py-1">
              <h4 className="text-[13px] font-medium text-white leading-tight mb-1">{project.title}</h4>
              <p className="text-[11px] text-[#71717a] leading-tight mb-2 line-clamp-2">{project.desc}</p>
              <div className="flex flex-wrap gap-1.5 mt-auto">
                {project.tags.map((tag, j) => (
                  <span key={j} className="text-[9px] text-[#a1a1aa] bg-[#1A1A1A] border border-[#262626] px-1.5 py-0.5 rounded">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
        <ArrowButton />
      </div>
    </motion.div>
  );
}

function SavedCommunitiesSection() {
  const communities = [
    { title: "Frontend Engineers", members: "12.6K members", icon: <Code size={20} className="text-[#38BDF8]" />, bg: "bg-[#1e1a2e]", border: "border-[#2a2440]", glow: "shadow-[0_0_15px_rgba(124,58,237,0.15)]" },
    { title: "AI Builders", members: "8.9K members", icon: <span className="text-[#c084fc] font-bold text-lg">AI</span>, bg: "bg-[#1A1A1A]", border: "border-[#262626]" },
    { title: "Product Designers", members: "6.3K members", icon: <div className="flex gap-0.5"><div className="w-2 h-2 rounded-full bg-orange-500"></div><div className="w-2 h-2 rounded-full bg-purple-500"></div></div>, bg: "bg-[#1A1A1A]", border: "border-[#262626]" },
    { title: "Open Source Hub", members: "7.4K members", icon: <FolderGit2 size={20} className="text-[#22c55e]" />, bg: "bg-[#1A1A1A]", border: "border-[#262626]" },
  ];

  return (
    <motion.div variants={itemVariants} className="bg-[#121212] border border-[#1e1e1e] rounded-xl p-6">
      <SectionHeader icon={<Users size={16} />} title="Saved Communities" count={5} />
      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
        {communities.map((comm, i) => (
          <div key={i} className={`min-w-[220px] flex-1 p-4 rounded-xl border ${comm.border} ${comm.bg} ${comm.glow || ''} flex items-center gap-3 relative group hover:border-[#3f3f46] transition-colors`}>
            <div className="w-10 h-10 rounded-lg bg-[#0A0A0A] border border-[#262626] flex items-center justify-center shrink-0">
              {comm.icon}
            </div>
            <div className="flex flex-col flex-1 pr-6">
              <h4 className="text-[13px] font-medium text-white">{comm.title}</h4>
              <span className="text-[11px] text-[#71717a]">{comm.members}</span>
            </div>
            {i === 0 && (
              <button className="absolute right-4 text-[#7c3aed]">
                <Bookmark size={16} className="fill-[#7c3aed]" />
              </button>
            )}
          </div>
        ))}
        <ArrowButton />
      </div>
    </motion.div>
  );
}

function SavedPeopleSection() {
  const people = [
    { name: "Sarah Chen", role: "Senior Recruiter", company: "Stripe", initials: "SC" },
    { name: "Alex Morgan", role: "Engineering Manager", company: "Vercel", initials: "AM" },
    { name: "Priya Patel", role: "Product Designer", company: "Figma", initials: "PP" },
    { name: "Michael Rodriguez", role: "Tech Lead", company: "Linear", initials: "MR" },
  ];

  return (
    <motion.div variants={itemVariants} className="bg-[#121212] border border-[#1e1e1e] rounded-xl p-6">
      <SectionHeader icon={<User size={16} />} title="Saved People" count={10} />
      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
        {people.map((person, i) => (
          <div key={i} className="min-w-[220px] flex-1 p-4 rounded-xl border border-[#262626] bg-[#0A0A0A] flex items-center gap-3 relative group hover:border-[#3f3f46] transition-colors">
            <div className="w-10 h-10 rounded-full bg-[#1A1A1A] border border-[#262626] flex items-center justify-center shrink-0 text-[#a1a1aa] text-[12px] font-medium">
              {person.initials}
            </div>
            <div className="flex flex-col flex-1 pr-6">
              <h4 className="text-[13px] font-medium text-white">{person.name}</h4>
              <div className="flex items-center text-[11px] text-[#71717a] truncate">
                <span>{person.role}</span>
              </div>
              <div className="text-[11px] text-[#71717a] truncate">{person.company}</div>
            </div>
            <button className="absolute right-4 text-[#7c3aed]">
              <Bookmark size={16} className="fill-transparent" />
            </button>
          </div>
        ))}
        <ArrowButton />
      </div>
    </motion.div>
  );
}

/* ─── Sidebar Components ────────────────────────────────── */

function FiltersSidebar() {
  return (
    <motion.div variants={itemVariants} className="bg-[#121212] border border-[#1e1e1e] rounded-xl p-6">
      <div className="flex items-center gap-2 mb-6">
        <Filter size={16} className="text-[#a1a1aa]" />
        <h3 className="text-[15px] font-semibold text-white">Filters</h3>
      </div>
      
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-[12px] text-[#a1a1aa]">Category</label>
          <div className="flex items-center justify-between p-2.5 bg-[#0A0A0A] border border-[#262626] rounded-lg cursor-pointer hover:border-[#3f3f46] transition-colors">
            <span className="text-[13px] text-white">All Categories</span>
            <ChevronDown size={14} className="text-[#71717a]" />
          </div>
        </div>
        
        <div className="flex flex-col gap-2">
          <label className="text-[12px] text-[#a1a1aa]">Date Saved</label>
          <div className="flex items-center justify-between p-2.5 bg-[#0A0A0A] border border-[#262626] rounded-lg cursor-pointer hover:border-[#3f3f46] transition-colors">
            <span className="text-[13px] text-white">Any Time</span>
            <ChevronDown size={14} className="text-[#71717a]" />
          </div>
        </div>
        
        <div className="flex flex-col gap-2">
          <label className="text-[12px] text-[#a1a1aa]">Lists</label>
          <div className="flex items-center justify-between p-2.5 bg-[#0A0A0A] border border-[#262626] rounded-lg cursor-pointer hover:border-[#3f3f46] transition-colors">
            <span className="text-[13px] text-white">All Lists</span>
            <ChevronDown size={14} className="text-[#71717a]" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function SummarySidebar() {
  const summaries = [
    { label: "Jobs", icon: <Briefcase size={14} />, count: 12 },
    { label: "Companies", icon: <Box size={14} />, count: 8 },
    { label: "Projects", icon: <FolderGit2 size={14} />, count: 6 },
    { label: "Communities", icon: <Users size={14} />, count: 5 },
    { label: "People", icon: <User size={14} />, count: 10 },
  ];

  return (
    <motion.div variants={itemVariants} className="bg-[#121212] border border-[#1e1e1e] rounded-xl p-6">
      <h3 className="text-[15px] font-semibold text-white mb-5">Summary</h3>
      
      <div className="flex flex-col gap-3.5 mb-5">
        {summaries.map((item, i) => (
          <div key={i} className="flex items-center justify-between text-[#a1a1aa] hover:text-white transition-colors cursor-pointer group">
            <div className="flex items-center gap-2.5">
              <span className="opacity-70 group-hover:opacity-100">{item.icon}</span>
              <span className="text-[13px]">{item.label}</span>
            </div>
            <span className="text-[13px] text-white">{item.count}</span>
          </div>
        ))}
      </div>
      
      <div className="pt-4 border-t border-[#1e1e1e] flex items-center justify-between">
        <span className="text-[13px] font-medium text-[#b19cd9]">Total Saved</span>
        <span className="text-[14px] font-semibold text-[#b19cd9]">41</span>
      </div>
    </motion.div>
  );
}

function YourListsSidebar() {
  const lists = [
    { name: "Dream Opportunities", items: 6, icon: <Star size={14} className="text-[#f59e0b]" /> },
    { name: "Companies to Watch", items: 8, icon: <Eye size={14} className="text-[#a1a1aa]" /> },
    { name: "Learning & Growth", items: 5, icon: <BookOpen size={14} className="text-[#22c55e]" /> },
    { name: "Potential Collaborators", items: 7, icon: <UserPlus size={14} className="text-[#b19cd9]" /> },
  ];

  return (
    <motion.div variants={itemVariants} className="bg-[#121212] border border-[#1e1e1e] rounded-xl p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-[15px] font-semibold text-white">Your Lists</h3>
        <button className="px-2 py-1 bg-[#1A1A1A] border border-[#262626] text-white text-[11px] font-medium rounded hover:bg-[#262626] transition-colors flex items-center gap-1">
          <span className="text-[14px] leading-none">+</span> New List
        </button>
      </div>
      
      <div className="flex flex-col gap-4 mb-5">
        {lists.map((list, i) => (
          <div key={i} className="flex items-start gap-3 cursor-pointer group">
            <div className="mt-0.5">{list.icon}</div>
            <div className="flex flex-col">
              <span className="text-[13px] text-white group-hover:text-[#b19cd9] transition-colors">{list.name}</span>
              <span className="text-[11px] text-[#71717a]">{list.items} items</span>
            </div>
          </div>
        ))}
      </div>
      
      <button className="text-[12px] text-[#b19cd9] flex items-center gap-1 hover:text-[#c2c1ff] transition-colors group">
        View all lists <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
      </button>
    </motion.div>
  );
}

/* ─── Mock Icons ────────────────────────────────────────── */

function SparkleIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 1L12.5 7.5L19 10L12.5 12.5L10 19L7.5 12.5L1 10L7.5 7.5L10 1Z" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function FigmaIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 38 57" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19 28.5C24.2467 28.5 28.5 24.2467 28.5 19C28.5 13.7533 24.2467 9.5 19 9.5H9.5V28.5H19Z" fill="#F24E1E"/>
      <path d="M9.5 28.5H19V47.5C19 52.7467 14.7467 57 9.5 57C4.25329 57 0 52.7467 0 47.5C0 42.2533 4.25329 38 9.5 38V28.5Z" fill="#0ACF83"/>
      <path d="M19 0H9.5C4.25329 0 0 4.25329 0 9.5C0 14.7467 4.25329 19 9.5 19H19V0Z" fill="#FF7262"/>
      <path d="M9.5 19H19C24.2467 19 28.5 23.2467 28.5 28.5C28.5 33.7533 24.2467 38 19 38H9.5V19Z" fill="#A259FF"/>
      <path d="M0 28.5C0 23.2533 4.25329 19 9.5 19V38C4.25329 38 0 33.7467 0 28.5Z" fill="#1ABCFE"/>
    </svg>
  );
}
