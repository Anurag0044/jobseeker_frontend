"use client";

import React, { useState } from "react";
import { motion, Variants } from "framer-motion";
import {
  Search, SlidersHorizontal, Bookmark, ArrowLeft,
  Share, MoreHorizontal, DollarSign, Calendar,
  ChevronRight, Check
} from "lucide-react";
import ProfileContextStrip from "../../../components/profile/ProfileContextStrip";
import { useForgeProfile } from "../../../hooks/useForgeProfile";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.04, delayChildren: 0.05 } },
};

const itemVariants: Variants = {
  hidden: { y: 15, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring" as const, stiffness: 300, damping: 24 } },
};

export default function JobsPage() {
  const [activeTab, setActiveTab] = useState("Overview");
  const { displayProfile } = useForgeProfile();
  const profileStack = displayProfile?.techStack?.length ? displayProfile.techStack.slice(0, 4) : ["React", "TypeScript", "Next.js", "Tailwind CSS"];
  const firstName = displayProfile?.displayName?.split(" ")[0] || "your";
  
  return (
    <div className="px-8 pb-16 pt-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-[1200px] mx-auto grid grid-cols-1 xl:grid-cols-12 gap-8"
      >
        {/* LEFT COLUMN: Job Listings */}
        <div className="xl:col-span-7 flex flex-col gap-6">
          
          {/* Header */}
          <motion.div variants={itemVariants} className="flex items-start justify-between">
            <div>
              <h1 className="text-[26px] font-semibold text-white tracking-tight mb-1">Opportunities</h1>
              <p className="text-[13px] text-[#a1a1aa]">Discover roles aligned with {firstName === "your" ? "your" : `${firstName}'s`} projects, skills, and career goals.</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-3 py-1.5 bg-[#121212] border border-[#262626] text-white text-[12px] font-medium rounded-lg hover:bg-[#1A1A1A] transition-colors">
                <Search size={14} /> Search Opportunities
              </button>
              <button className="flex items-center gap-2 px-3 py-1.5 bg-[#121212] border border-[#262626] text-white text-[12px] font-medium rounded-lg hover:bg-[#1A1A1A] transition-colors">
                <SlidersHorizontal size={14} /> Filters
              </button>
              <button className="flex items-center gap-2 px-3 py-1.5 bg-[#121212] border border-[#262626] text-white text-[12px] font-medium rounded-lg hover:bg-[#1A1A1A] transition-colors">
                <Bookmark size={14} /> Saved Jobs
              </button>
            </div>
          </motion.div>

          <ProfileContextStrip label="Job Recommendation Context" />

          {/* Featured Opportunity */}
          <motion.div variants={itemVariants} className="bg-[#0A0A0A] border border-[#1e1e1e] rounded-xl p-6 relative overflow-hidden">
            {/* Subtle glow background */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#5e5ce6]/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
            
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-[#635BFF] flex items-center justify-center text-white font-bold text-[24px] shadow-lg shadow-[#635BFF]/20">
                    S
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <h2 className="text-[18px] font-semibold text-white">Stripe</h2>
                      <ShieldCheckIcon />
                    </div>
                    <span className="text-[15px] text-[#e5e2e1] mb-1">Frontend Engineer</span>
                    <div className="flex items-center gap-3 text-[12px] text-[#71717a]">
                      <span>Remote • Full-Time • San Francisco, CA</span>
                      <span className="flex items-center gap-1 px-1.5 py-0.5 bg-[#1e1a2e] text-[#b19cd9] rounded"><DollarSign size={10} /> $140K – $180K</span>
                      <span className="flex items-center gap-1"><Calendar size={12} /> Apply by Jun 15, 2024</span>
                    </div>
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-[#1e1a2e] border border-[#2a2440] text-[#b19cd9] rounded-md text-[11px] font-medium">
                  Featured Opportunity
                </span>
              </div>

              <div className="flex gap-6 mb-6">
                <p className="flex-1 text-[13px] text-[#a1a1aa] leading-relaxed">
                  Join Stripe&apos;s Payments team building the next generation of financial infrastructure used by millions of businesses worldwide.
                </p>
                <div className="w-[300px] bg-[#121212] border border-[#1e1e1e] rounded-lg p-4 shrink-0">
                  <span className="text-[12px] font-semibold text-white block mb-2">Why this opportunity matters</span>
                  <p className="text-[11px] text-[#71717a] mb-3 leading-relaxed">
                    This role aligns strongly with your frontend projects and recent portfolio activity.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {profileStack.map(tag => (
                      <span key={tag} className="px-2 py-0.5 bg-[#1A1A1A] border border-[#262626] text-[#a1a1aa] text-[10px] rounded">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button className="px-5 py-2 bg-[#5e5ce6] hover:bg-[#4d4ad5] text-white text-[13px] font-medium rounded-lg transition-colors shadow-lg shadow-[#5e5ce6]/20">
                  View Opportunity
                </button>
                <button className="flex items-center gap-2 px-5 py-2 bg-[#1A1A1A] border border-[#262626] hover:bg-[#262626] text-white text-[13px] font-medium rounded-lg transition-colors">
                  <Bookmark size={14} /> Save
                </button>
              </div>
            </div>
          </motion.div>

          {/* Recommended For You */}
          <Section title="Recommended For You">
            <JobCard company="Vercel" logo="▲" bg="bg-black border border-[#262626]" role="Frontend Engineer" loc="Remote • Full-Time" tags={["Next.js", "TypeScript", "Tailwind CSS"]} date="Apply by Jun 10, 2024" />
            <JobCard company="Linear" logo="L" bg="bg-gradient-to-br from-[#5E6AD2] to-[#3B428A]" role="Product Engineer" loc="Remote • Full-Time" tags={["React", "TypeScript", "GraphQL"]} date="Apply by Jun 12, 2024" />
            <JobCard company="Notion" logo="N" bg="bg-white text-black" role="Frontend Engineer" loc="San Francisco, CA • Hybrid" tags={["React", "TypeScript", "Node.js"]} date="Apply by Jun 18, 2024" />
          </Section>

          {/* Recently Posted */}
          <Section title="Recently Posted">
            <JobCard company="Resend" logo="R" bg="bg-black border border-[#262626]" role="Full Stack Engineer" loc="Remote • Full-Time" tags={["React", "TypeScript", "Node.js"]} date="Posted 1 day ago" />
            <JobCard company="PlanetScale" logo="◱" bg="bg-white text-black" role="Software Engineer" loc="Remote • Full-Time" tags={["Go", "TypeScript", "AWS"]} date="Posted 2 days ago" />
            <JobCard company="Figma" logo="F" bg="bg-gradient-to-br from-[#F24E1E] via-[#A259FF] to-[#1ABCFE]" role="Frontend Engineer" loc="San Francisco, CA • Hybrid" tags={["React", "TypeScript", "Figma API"]} date="Posted 2 days ago" />
          </Section>

          {/* Project-Based Opportunities */}
          <Section title="Project-Based Opportunities">
            <JobCard company="Supabase" logo="S" bg="bg-[#3ECF8E]" role="Frontend Engineer (Contract)" loc="Remote • Contract" tags={["React", "TypeScript", "PostgreSQL"]} date="Apply by Jun 20, 2024" />
            <JobCard company="Turborepo" logo="T" bg="bg-black border border-[#262626]" role="Developer Advocate" loc="Remote • Part-Time" tags={["Next.js", "TypeScript", "Docs"]} date="Apply by Jun 22, 2024" />
            <JobCard company="OpenAI" logo="O" bg="bg-[#10A37F]" role="Developer Tools Engineer" loc="San Francisco, CA • Full-Time" tags={["Python", "TypeScript", "APIs"]} date="Apply by Jun 25, 2024" />
          </Section>

        </div>

        {/* RIGHT COLUMN: Detail Panel */}
        <motion.div variants={itemVariants} className="xl:col-span-5 relative">
          <div className="sticky top-[88px] flex flex-col h-[calc(100vh-120px)] bg-[#0A0A0A] border border-[#1e1e1e] rounded-xl overflow-hidden">
            
            {/* Top Bar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e1e1e] bg-[#0A0A0A] shrink-0">
              <button className="flex items-center gap-2 text-[12px] text-[#a1a1aa] hover:text-white transition-colors">
                <ArrowLeft size={14} /> Back to Opportunities
              </button>
              <div className="flex items-center gap-4 text-[#a1a1aa]">
                <button className="hover:text-white transition-colors"><Share size={14} /></button>
                <button className="hover:text-white transition-colors"><MoreHorizontal size={16} /></button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 rounded-xl bg-[#635BFF] flex items-center justify-center text-white font-bold text-[28px] shrink-0 shadow-lg shadow-[#635BFF]/20">
                  S
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <h2 className="text-[20px] font-semibold text-white">Stripe</h2>
                    <ShieldCheckIcon />
                  </div>
                  <span className="text-[16px] text-[#e5e2e1] mb-2">Frontend Engineer</span>
                  <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-[12px] text-[#71717a]">
                    <span>Remote • Full-Time • San Francisco, CA</span>
                    <span className="flex items-center gap-1 px-1.5 py-0.5 bg-[#1e1a2e] text-[#b19cd9] rounded"><DollarSign size={10} /> $140K – $180K</span>
                    <span className="flex items-center gap-1"><Calendar size={12} /> Apply by Jun 15, 2024</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 mb-8">
                <button className="flex-1 py-2.5 bg-[#5e5ce6] hover:bg-[#4d4ad5] text-white text-[13px] font-medium rounded-lg transition-colors shadow-lg shadow-[#5e5ce6]/20">
                  Apply Now
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#121212] border border-[#262626] hover:bg-[#1A1A1A] text-white text-[13px] font-medium rounded-lg transition-colors">
                  <Bookmark size={14} /> Save
                </button>
                <button className="flex items-center justify-center w-11 h-11 bg-[#121212] border border-[#262626] hover:bg-[#1A1A1A] text-white rounded-lg transition-colors shrink-0">
                  <Share size={14} />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex gap-6 border-b border-[#1e1e1e] mb-6">
                {["Overview", "Why Suggested", "Projects", "Company", "Insights"].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-3 text-[12px] font-medium transition-colors relative ${activeTab === tab ? "text-[#b19cd9]" : "text-[#a1a1aa] hover:text-white"}`}
                  >
                    {tab}
                    {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#b19cd9] rounded-t-full"></div>}
                  </button>
                ))}
              </div>

              {/* Content */}
              <div className="flex flex-col gap-8">
                <div>
                  <h3 className="text-[14px] font-semibold text-white mb-3">About the Role</h3>
                  <p className="text-[13px] text-[#a1a1aa] leading-relaxed">
                    You&apos;ll build beautiful, high-performance user experiences that power Stripe&apos;s core dashboard and developer tools used by millions of businesses worldwide.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-[13px] font-semibold text-white mb-3">Responsibilities</h3>
                    <ul className="flex flex-col gap-2.5">
                      <li className="flex items-start gap-2 text-[12px] text-[#a1a1aa] leading-relaxed">
                        <span className="w-1 h-1 bg-[#71717a] rounded-full mt-1.5 shrink-0"></span>
                        Build and maintain core dashboard experiences
                      </li>
                      <li className="flex items-start gap-2 text-[12px] text-[#a1a1aa] leading-relaxed">
                        <span className="w-1 h-1 bg-[#71717a] rounded-full mt-1.5 shrink-0"></span>
                        Collaborate with designers and engineers
                      </li>
                      <li className="flex items-start gap-2 text-[12px] text-[#a1a1aa] leading-relaxed">
                        <span className="w-1 h-1 bg-[#71717a] rounded-full mt-1.5 shrink-0"></span>
                        Write clean, scalable, and testable code
                      </li>
                      <li className="flex items-start gap-2 text-[12px] text-[#a1a1aa] leading-relaxed">
                        <span className="w-1 h-1 bg-[#71717a] rounded-full mt-1.5 shrink-0"></span>
                        Improve performance and accessibility
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-[13px] font-semibold text-white mb-3">Requirements</h3>
                    <ul className="flex flex-col gap-2.5">
                      <li className="flex items-start gap-2 text-[12px] text-[#a1a1aa] leading-relaxed">
                        <span className="w-1 h-1 bg-[#71717a] rounded-full mt-1.5 shrink-0"></span>
                        3+ years of experience with React and TypeScript
                      </li>
                      <li className="flex items-start gap-2 text-[12px] text-[#a1a1aa] leading-relaxed">
                        <span className="w-1 h-1 bg-[#71717a] rounded-full mt-1.5 shrink-0"></span>
                        Strong understanding of modern CSS
                      </li>
                      <li className="flex items-start gap-2 text-[12px] text-[#a1a1aa] leading-relaxed">
                        <span className="w-1 h-1 bg-[#71717a] rounded-full mt-1.5 shrink-0"></span>
                        Experience with Next.js
                      </li>
                      <li className="flex items-start gap-2 text-[12px] text-[#a1a1aa] leading-relaxed">
                        <span className="w-1 h-1 bg-[#71717a] rounded-full mt-1.5 shrink-0"></span>
                        You care about great user experiences
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-4 py-6 border-y border-[#1e1e1e]">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-[#71717a] uppercase tracking-wider">Employment Type</span>
                    <span className="text-[12px] font-medium text-white">Full-Time</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-[#71717a] uppercase tracking-wider">Work Location</span>
                    <span className="text-[12px] font-medium text-white">Remote</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-[#71717a] uppercase tracking-wider">Experience</span>
                    <span className="text-[12px] font-medium text-white">3+ Years</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-[#71717a] uppercase tracking-wider">Industry</span>
                    <span className="text-[12px] font-medium text-white">Fintech</span>
                  </div>
                </div>

                {/* Suggestion Box */}
                <div className="bg-[#121212] border border-[#1e1e1e] rounded-xl p-5">
                  <h3 className="text-[13px] font-semibold text-white mb-4">Why this opportunity was suggested</h3>
                  <div className="flex items-end justify-between">
                    <ul className="flex flex-col gap-2.5">
                      <li className="flex items-center gap-2 text-[12px] text-[#a1a1aa]">
                        <Check size={14} className="text-[#a3e635]" /> Relevant frontend experience
                      </li>
                      <li className="flex items-center gap-2 text-[12px] text-[#a1a1aa]">
                        <Check size={14} className="text-[#a3e635]" /> Similar project stack
                      </li>
                      <li className="flex items-center gap-2 text-[12px] text-[#a1a1aa]">
                        <Check size={14} className="text-[#a3e635]" /> Active interest in design-focused roles
                      </li>
                    </ul>
                    <button className="px-4 py-1.5 bg-[#1A1A1A] border border-[#262626] hover:bg-[#262626] text-white text-[11px] font-medium rounded-lg transition-colors">
                      View Details
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
}

/* ─── Helpers ────────────────────────────────────────────── */

function ShieldCheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="#b19cd9" stroke="#0a0a0a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" stroke="#0a0a0a" strokeWidth="3" />
    </svg>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <motion.div variants={itemVariants} className="flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[15px] font-semibold text-white">{title}</h3>
        <button className="text-[12px] text-[#b19cd9] hover:text-[#c2c1ff] transition-colors flex items-center gap-1">
          View All <ChevronRight size={12} />
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {children}
      </div>
    </motion.div>
  );
}

interface JobCardProps {
  company: string;
  logo: React.ReactNode;
  bg: string;
  role: string;
  loc: string;
  tags: string[];
  date: string;
}

function JobCard({ company, logo, bg, role, loc, tags, date }: JobCardProps) {
  return (
    <div className="bg-[#121212] border border-[#1e1e1e] hover:border-[#3f3f46] transition-colors rounded-xl p-4 flex flex-col group cursor-pointer">
      <div className="flex items-start gap-3 mb-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-[18px] shrink-0 ${bg}`}>
          {logo}
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-[14px] font-semibold text-white truncate">{company}</span>
          <span className="text-[12px] text-[#a1a1aa] truncate">{role}</span>
          <span className="text-[10px] text-[#71717a] mt-0.5 truncate">{loc}</span>
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5 mb-4">
        {tags.map((tag: string) => (
          <span key={tag} className="px-1.5 py-0.5 bg-[#1A1A1A] border border-[#262626] text-[#71717a] text-[10px] rounded">{tag}</span>
        ))}
      </div>
      <div className="flex items-center justify-between mt-auto pt-3 border-t border-[#1e1e1e]">
        <span className="text-[10px] text-[#71717a]">{date}</span>
        <Bookmark size={14} className="text-[#71717a] group-hover:text-white transition-colors" />
      </div>
    </div>
  );
}
