"use client";

import React, { useState } from "react";
import { motion, Variants } from "framer-motion";
import {
  Plus, Download, ChevronRight, MapPin, DollarSign,
  FileText, Clock, Sparkles, ArrowRight, CheckCircle2
} from "lucide-react";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring" as const, stiffness: 300, damping: 24 } },
};

const applications = [
  { company: "Stripe", role: "Frontend Engineer", location: "Remote • Full-Time", status: "Interview Scheduled", statusColor: "text-[#5e5ce6] bg-[#5e5ce6]/10 border-[#5e5ce6]/30", date: "May 20, 2024", detail: "Interview in 3 days", sub: "Tech Screen • May 20, 2024", logo: "S", logoColor: "bg-[#635BFF]" },
  { company: "Apple", role: "iOS Engineer", location: "Cupertino, CA • Full-Time", status: "Under Review", statusColor: "text-[#ffb786] bg-[#ffb786]/10 border-[#ffb786]/30", date: "", detail: "Recruiter viewed profile", sub: "4 days ago", logo: "", logoColor: "bg-[#1A1A1A]" },
  { company: "Vercel", role: "Fullstack Engineer", location: "Remote • Full-Time", status: "Applied", statusColor: "text-[#a1a1aa] bg-[#1A1A1A] border-[#262626]", date: "May 10, 2024", detail: "Applied 6 days ago", sub: "May 10, 2024", logo: "▲", logoColor: "bg-[#1A1A1A]" },
  { company: "Linear", role: "Software Engineer", location: "Remote • Full-Time", status: "Interview Scheduled", statusColor: "text-[#5e5ce6] bg-[#5e5ce6]/10 border-[#5e5ce6]/30", date: "May 22, 2024", detail: "Interview in 5 days", sub: "Onsite • May 22, 2024", logo: "L", logoColor: "bg-[#5E6AD2]" },
  { company: "Notion", role: "Backend Engineer", location: "San Francisco, CA • Full-Time", status: "Applied", statusColor: "text-[#a1a1aa] bg-[#1A1A1A] border-[#262626]", date: "May 8, 2024", detail: "Applied 1 week ago", sub: "May 8, 2024", logo: "N", logoColor: "bg-[#1A1A1A] border border-[#262626]" },
  { company: "Meta", role: "Software Engineer", location: "Menlo Park, CA • Full-Time", status: "Rejected", statusColor: "text-[#ef4444] bg-[#ef4444]/10 border-[#ef4444]/30", date: "May 1, 2024", detail: "2 weeks ago", sub: "May 1, 2024", logo: "M", logoColor: "bg-[#0668E1]" },
];

export default function ApplicationsPage() {
  const [activeTab, setActiveTab] = useState("All Applications");
  const [selected, setSelected] = useState(0);
  const tabs = ["All Applications", "Applied", "Interview", "Offer", "Archived"];
  const app = applications[selected];

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
            <h1 className="text-[28px] font-semibold text-white tracking-tight mb-1">Applications</h1>
            <p className="text-[14px] text-[#a1a1aa]">Manage opportunities, interviews, and career progress.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-[#121212] border border-[#262626] text-white text-[13px] font-medium rounded-lg hover:bg-[#1A1A1A] transition-colors">
              <Download size={16} /> Import Job
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#5e5ce6] hover:bg-[#4d4ad5] text-white text-[13px] font-medium rounded-lg transition-colors">
              <Plus size={16} /> New Application
            </button>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div variants={itemVariants} className="border-b border-[#1e1e1e] flex gap-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-[13px] font-medium transition-colors relative ${activeTab === tab ? "text-[#b19cd9]" : "text-[#a1a1aa] hover:text-white"}`}
            >
              {tab}
              {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#b19cd9] rounded-t-full"></div>}
            </button>
          ))}
        </motion.div>

        {/* Split Panel */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Left - Application List */}
          <div className="xl:col-span-5 flex flex-col gap-2">
            {applications.map((a, i) => (
              <button
                key={i}
                onClick={() => setSelected(i)}
                className={`flex items-center gap-4 p-4 rounded-xl text-left transition-all ${
                  selected === i
                    ? "bg-[#1e1a2e] border border-[#2a2440]"
                    : "bg-[#121212] border border-[#1e1e1e] hover:border-[#3f3f46]"
                }`}
              >
                <div className={`w-10 h-10 rounded-lg ${a.logoColor} flex items-center justify-center shrink-0 text-white font-semibold text-[14px]`}>
                  {a.logo}
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="text-[14px] font-medium text-white">{a.company}</span>
                  <span className="text-[12px] text-[#a1a1aa]">{a.role}</span>
                  <span className="text-[11px] text-[#71717a] mt-0.5">{a.location}</span>
                </div>
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${a.statusColor}`}>{a.status}</span>
                  <span className="text-[10px] text-[#71717a]">{a.detail}</span>
                </div>
                <ChevronRight size={16} className="text-[#3f3f46] shrink-0" />
              </button>
            ))}
          </div>

          {/* Right - Detail Panel */}
          <div className="xl:col-span-7 flex flex-col gap-5">
            <div className="bg-[#121212] border border-[#1e1e1e] rounded-xl p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-xl ${app.logoColor} flex items-center justify-center text-white font-bold text-[20px]`}>
                    {app.logo}
                  </div>
                  <div className="flex flex-col">
                    <h2 className="text-[20px] font-semibold text-white">{app.company}</h2>
                    <span className="text-[14px] text-[#a1a1aa]">{app.role}</span>
                    <div className="flex items-center gap-3 mt-2 text-[12px] text-[#71717a]">
                      <span className="flex items-center gap-1"><MapPin size={12} /> {app.location}</span>
                      <span className="flex items-center gap-1"><DollarSign size={12} /> $140K – $200K</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${app.statusColor}`}>{app.status}</span>
                  <span className="text-[11px] text-[#71717a]">Applied on {app.sub}</span>
                </div>
              </div>

              {/* Sub Tabs */}
              <div className="flex gap-6 border-b border-[#1e1e1e] mb-6">
                {["Overview", "Documents", "Timeline", "Preparation", "Notes"].map((t, i) => (
                  <button key={t} className={`pb-3 text-[13px] font-medium relative ${i === 0 ? "text-[#b19cd9]" : "text-[#a1a1aa] hover:text-white"} transition-colors`}>
                    {t}
                    {i === 0 && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#b19cd9] rounded-t-full"></div>}
                  </button>
                ))}
              </div>

              {/* Overview Content */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="text-[13px] font-semibold text-white mb-3">About the Role</h4>
                  <p className="text-[12px] text-[#a1a1aa] leading-relaxed">
                    Build exceptional products that simplify online payments for millions of businesses worldwide. Work on the core components that power our user interface and developer experiences.
                  </p>
                </div>
                <div>
                  <h4 className="text-[13px] font-semibold text-white mb-3">Key Requirements</h4>
                  <ul className="flex flex-col gap-2">
                    {["3+ years of experience in frontend development", "Proficiency in React, TypeScript, and modern CSS", "Experience with scalable design systems", "Strong problem-solving and communication skills"].map((req, i) => (
                      <li key={i} className="flex items-start gap-2 text-[12px] text-[#a1a1aa]">
                        <CheckCircle2 size={12} className="text-[#a3e635] mt-0.5 shrink-0" /> {req}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="text-[13px] font-semibold text-white mb-3">Submitted Resume</h4>
                  <div className="flex items-center gap-3 p-3 bg-[#0A0A0A] border border-[#1e1e1e] rounded-lg">
                    <FileText size={16} className="text-[#b19cd9]" />
                    <div className="flex flex-col flex-1">
                      <span className="text-[12px] text-white font-medium">Orion_Developer_Resume.pdf</span>
                      <span className="text-[10px] text-[#71717a]">PDF • Uploaded May 10, 2024</span>
                    </div>
                    <Download size={14} className="text-[#a1a1aa] cursor-pointer hover:text-white transition-colors" />
                  </div>
                </div>
                <div>
                  <h4 className="text-[13px] font-semibold text-white mb-3">Submitted Cover Letter</h4>
                  <div className="flex items-center gap-3 p-3 bg-[#0A0A0A] border border-[#1e1e1e] rounded-lg">
                    <FileText size={16} className="text-[#b19cd9]" />
                    <div className="flex flex-col flex-1">
                      <span className="text-[12px] text-white font-medium">Cover_Letter_Stripe.pdf</span>
                      <span className="text-[10px] text-[#71717a]">PDF • Uploaded May 10, 2024</span>
                    </div>
                    <Download size={14} className="text-[#a1a1aa] cursor-pointer hover:text-white transition-colors" />
                  </div>
                </div>
              </div>
            </div>

            {/* AI Suggestion Banner */}
            <div className="bg-[#1e1a2e] border border-[#2a2440] rounded-xl p-5 flex items-start gap-4">
              <Sparkles size={18} className="text-[#b19cd9] shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-[13px] font-semibold text-white mb-1">Forge AI Suggestion</h4>
                <p className="text-[12px] text-[#a1a1aa] leading-relaxed">
                  Your portfolio aligns strongly with this role. Consider highlighting your system design projects and performance optimization work before the interview.
                </p>
              </div>
              <button className="flex items-center gap-1 px-3 py-1.5 text-[12px] text-[#b19cd9] font-medium hover:text-[#c2c1ff] transition-colors whitespace-nowrap">
                View Preparation <ArrowRight size={12} />
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
