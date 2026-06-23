"use client";

import React, { useState } from "react";
import { motion, Variants } from "framer-motion";
import {
  Search, Send, Paperclip, Calendar, Link as LinkIcon,
  MoreHorizontal, FileText, Users, FolderGit2,
  Star, ChevronRight, Sparkles, Plus, Pin, Edit
} from "lucide-react";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.04, delayChildren: 0.05 } },
};

const itemVariants: Variants = {
  hidden: { y: 10, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring" as const, stiffness: 300, damping: 24 } },
};

const conversations = [
  { name: "Sarah Chen", role: "Senior Recruiter • Stripe", msg: "Interview details have been...", time: "2h ago", unread: true, pinned: true, avatar: "SC" },
  { name: "Alex Morgan", role: "Engineering Manager • Vercel", msg: "Thanks for sharing your project...", time: "4h ago", unread: false, pinned: false, avatar: "AM" },
  { name: "Jordan Lee", role: "Recruiter • Linear", msg: "Can we schedule a quick call...", time: "6h ago", unread: false, pinned: false, avatar: "JL" },
  { name: "Maya Patel", role: "Talent Partner • Notion", msg: "Your profile stands out for this...", time: "8h ago", unread: false, pinned: false, avatar: "MP" },
  { name: "Daniel Kim", role: "Senior Engineer • Meta", msg: "Here's the interview guide...", time: "1d ago", unread: false, pinned: false, avatar: "DK" },
  { name: "Emma Williams", role: "Recruiter • Apple", msg: "Great portfolio! Would love to...", time: "1d ago", unread: false, pinned: false, avatar: "EW" },
  { name: "Olivia Brown", role: "Design Lead • Figma", msg: "Your design approach is...", time: "2d ago", unread: false, pinned: false, avatar: "OB" },
];

export default function MessagesPage() {
  const [selected, setSelected] = useState(0);
  const [activeTab, setActiveTab] = useState("All");

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex h-full"
    >
      {/* Left - Conversation List */}
      <motion.div variants={itemVariants} className="w-[320px] shrink-0 border-r border-[#1e1e1e] flex flex-col bg-[#0A0A0A]">
        <div className="p-5 pb-3 flex items-center justify-between">
          <h2 className="text-[18px] font-semibold text-white">Messages</h2>
          <button className="w-8 h-8 rounded-md bg-[#121212] border border-[#262626] flex items-center justify-center text-[#a1a1aa] hover:text-white transition-colors">
            <Edit size={14} />
          </button>
        </div>

        <div className="px-5 pb-3">
          <div className="h-9 bg-[#121212] border border-[#1e1e1e] rounded-md flex items-center px-3">
            <Search size={14} className="text-[#71717a] mr-2" />
            <input type="text" placeholder="Search conversations..." className="bg-transparent border-none outline-none flex-1 text-[12px] text-white placeholder-[#71717a]" />
          </div>
        </div>

        <div className="px-5 pb-3 flex gap-2">
          {["All", "Unread", "Requests"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 rounded-md text-[11px] font-medium transition-colors ${
                activeTab === tab ? "bg-[#1e1a2e] text-[#b19cd9] border border-[#2a2440]" : "bg-[#121212] text-[#a1a1aa] border border-[#262626] hover:text-white"
              }`}
            >
              {tab}
              {tab === "Unread" && <span className="ml-1.5 px-1.5 py-0.5 bg-[#5e5ce6] text-white text-[9px] rounded-full">3</span>}
              {tab === "Requests" && <span className="ml-1.5 px-1.5 py-0.5 bg-[#ffb786]/20 text-[#ffb786] text-[9px] rounded-full">1</span>}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {conversations[0].pinned && (
            <div className="px-5 py-1.5 flex items-center gap-1.5 text-[10px] text-[#71717a]">
              <Pin size={10} /> Pinned
            </div>
          )}
          {conversations.map((conv, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`w-full flex items-start gap-3 px-5 py-3 text-left transition-all ${
                selected === i ? "bg-[#1e1a2e]" : "hover:bg-[#121212]"
              }`}
            >
              <div className="w-9 h-9 rounded-full bg-[#1A1A1A] border border-[#262626] flex items-center justify-center shrink-0 text-[11px] font-semibold text-[#b19cd9]">
                {conv.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[13px] font-medium text-white truncate">{conv.name}</span>
                  <span className="text-[10px] text-[#71717a] shrink-0 ml-2">{conv.time}</span>
                </div>
                <span className="text-[11px] text-[#71717a] block truncate">{conv.role}</span>
                <span className="text-[11px] text-[#a1a1aa] block truncate mt-0.5">{conv.msg}</span>
              </div>
              {conv.unread && <div className="w-2 h-2 bg-[#5e5ce6] rounded-full shrink-0 mt-2"></div>}
            </button>
          ))}
          {/* Separator for Today */}
          {conversations.findIndex((c) => !c.pinned) === 1 && (
            <div className="px-5 py-1.5 text-[10px] text-[#71717a]">Today</div>
          )}
        </div>
      </motion.div>

      {/* Center - Chat Area */}
      <motion.div variants={itemVariants} className="flex-1 flex flex-col bg-[#0A0A0A]">
        {/* Chat Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-[#1e1e1e] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#1A1A1A] border border-[#262626] flex items-center justify-center text-[11px] font-semibold text-[#b19cd9]">
              {conversations[selected].avatar}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[14px] font-medium text-white">{conversations[selected].name}</span>
                <span className="w-2 h-2 bg-[#22c55e] rounded-full"></span>
              </div>
              <span className="text-[11px] text-[#a1a1aa]">{conversations[selected].role}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 bg-[#121212] border border-[#262626] text-white text-[12px] rounded-md hover:bg-[#1A1A1A] transition-colors">View Profile</button>
            <button className="px-3 py-1.5 bg-[#121212] border border-[#262626] text-white text-[12px] rounded-md hover:bg-[#1A1A1A] transition-colors">Schedule Meeting</button>
            <button className="w-8 h-8 flex items-center justify-center text-[#a1a1aa] hover:text-white transition-colors"><MoreHorizontal size={16} /></button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar flex flex-col gap-4">
          <div className="text-center text-[11px] text-[#71717a] py-2">May 20, 2024</div>

          {/* Incoming message */}
          <div className="flex gap-3 max-w-[500px]">
            <div className="w-8 h-8 rounded-full bg-[#1A1A1A] border border-[#262626] flex items-center justify-center text-[10px] font-semibold text-[#b19cd9] shrink-0 mt-1">SC</div>
            <div className="flex flex-col gap-1">
              <div className="bg-[#121212] border border-[#1e1e1e] rounded-xl rounded-tl-sm p-4 text-[13px] text-[#e5e2e1] leading-relaxed">
                Hi Orion, thanks for applying for the Frontend Engineer position at Stripe. I reviewed your portfolio and I&apos;m impressed with your projects, especially Orion AI Agent.<br /><br />
                I&apos;d love to invite you for a technical screening this week.
              </div>
              <span className="text-[10px] text-[#71717a] px-1">10:30 AM</span>
            </div>
          </div>

          {/* Outgoing message */}
          <div className="flex flex-col items-end gap-1 max-w-[500px] self-end">
            <div className="bg-[#1e1a2e] border border-[#2a2440] rounded-xl rounded-tr-sm p-4 text-[13px] text-[#e5e2e1] leading-relaxed">
              Thank you, Sarah. I appreciate the opportunity. I&apos;m excited to discuss how my experience aligns with the role.
            </div>
            <span className="text-[10px] text-[#71717a] px-1">10:42 AM</span>
          </div>

          {/* Outgoing */}
          <div className="flex flex-col items-end gap-1 max-w-[500px] self-end">
            <div className="bg-[#1e1a2e] border border-[#2a2440] rounded-xl rounded-tr-sm p-4 text-[13px] text-[#e5e2e1] leading-relaxed">
              Great! How does Wednesday at 3:00 PM PST look for you?
            </div>
            <span className="text-[10px] text-[#71717a] px-1">10:45 AM</span>
          </div>

          {/* Meeting card */}
          <div className="flex gap-3 max-w-[400px]">
            <div className="w-8 h-8 rounded-full bg-[#1A1A1A] border border-[#262626] flex items-center justify-center text-[10px] font-semibold text-[#b19cd9] shrink-0 mt-1">SC</div>
            <div className="flex flex-col gap-1">
              <div className="bg-[#121212] border border-[#1e1e1e] rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar size={14} className="text-[#b19cd9]" />
                  <span className="text-[13px] font-medium text-white">Technical Screening — Frontend Engineer</span>
                </div>
                <span className="text-[11px] text-[#71717a] block mb-3">Wed, May 22, 2024 • 3:00 PM – 4:00 PM PST</span>
                <button className="px-3 py-1.5 bg-[#1A1A1A] border border-[#262626] text-[#b19cd9] text-[11px] font-medium rounded-md hover:bg-[#262626] transition-colors">
                  View Invitation
                </button>
              </div>
              <span className="text-[10px] text-[#71717a] px-1">10:46 AM</span>
            </div>
          </div>
        </div>

        {/* AI Suggestion */}
        <div className="mx-6 mb-3 bg-[#1e1a2e] border border-[#2a2440] rounded-lg p-3 flex items-start gap-3">
          <Sparkles size={14} className="text-[#b19cd9] shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="text-[11px] font-medium text-white block mb-0.5">Forge AI Suggestion</span>
            <span className="text-[11px] text-[#a1a1aa]">Consider mentioning your portfolio project &quot;Orion AI Agent&quot; before confirming the interview.</span>
          </div>
          <div className="flex gap-2 shrink-0">
            <button className="text-[10px] text-[#b19cd9] hover:text-[#c2c1ff] transition-colors font-medium">Use Suggestion</button>
            <button className="text-[10px] text-[#71717a] hover:text-white transition-colors">Dismiss</button>
          </div>
        </div>

        {/* Message Input */}
        <div className="px-6 pb-5">
          <div className="bg-[#121212] border border-[#1e1e1e] rounded-xl p-4">
            <input type="text" placeholder="Write a professional message..." className="bg-transparent border-none outline-none w-full text-[13px] text-white placeholder-[#71717a] mb-3" />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-1.5 text-[11px] text-[#a1a1aa] hover:text-white transition-colors"><Paperclip size={14} /> Attach</button>
                <button className="flex items-center gap-1.5 text-[11px] text-[#a1a1aa] hover:text-white transition-colors"><LinkIcon size={14} /> Portfolio Link</button>
                <button className="flex items-center gap-1.5 text-[11px] text-[#a1a1aa] hover:text-white transition-colors"><Calendar size={14} /> Schedule Meeting</button>
              </div>
              <button className="w-8 h-8 rounded-lg bg-[#5e5ce6] hover:bg-[#4d4ad5] flex items-center justify-center text-white transition-colors">
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Right - Context Panel */}
      <motion.div variants={itemVariants} className="w-[280px] shrink-0 border-l border-[#1e1e1e] flex flex-col bg-[#0A0A0A] overflow-y-auto custom-scrollbar">
        <div className="p-5 flex flex-col gap-5">
          {/* About */}
          <div>
            <h4 className="text-[12px] font-semibold text-white mb-3">About {conversations[selected].name.split(" ")[0]}</h4>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-[#1A1A1A] border border-[#262626] flex items-center justify-center text-[12px] font-semibold text-[#b19cd9]">{conversations[selected].avatar}</div>
              <div className="flex flex-col">
                <span className="text-[13px] font-medium text-white">{conversations[selected].name}</span>
                <span className="text-[11px] text-[#71717a]">{conversations[selected].role.split(" • ")[0]}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] text-[#a1a1aa]">🏢 {conversations[selected].role.split(" • ")[1]}</span>
            </div>
            <div className="flex gap-2 mb-3">
              <span className="px-2 py-0.5 bg-[#1A1A1A] border border-[#262626] rounded text-[10px] text-[#a1a1aa]">Relationship</span>
              <span className="px-2 py-0.5 bg-[#5e5ce6]/10 border border-[#5e5ce6]/30 rounded text-[10px] text-[#c2c1ff]">Recruiter</span>
            </div>
            <span className="text-[10px] text-[#71717a]">• Typically replies within 24h</span>
          </div>

          <div className="w-full h-px bg-[#1e1e1e]"></div>

          {/* Shared Context */}
          <div>
            <h4 className="text-[12px] font-semibold text-white mb-3">Shared Context</h4>
            <div className="flex flex-col gap-2">
              {[
                { icon: <FileText size={12} />, label: "Applications", detail: "1 Active", action: ">" },
                { icon: <Calendar size={12} />, label: "Interviews", detail: "1 Scheduled", action: ">" },
                { icon: <FolderGit2 size={12} />, label: "Projects", detail: "2 Shared", action: ">" },
                { icon: <Star size={12} />, label: "Portfolio Reviews", detail: "1 Completed", action: ">" },
                { icon: <Users size={12} />, label: "Mutual Connections", detail: "3 Connections", action: ">" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-1.5 text-[11px]">
                  <div className="flex items-center gap-2 text-[#a1a1aa]">
                    {item.icon} {item.label}
                  </div>
                  <div className="flex items-center gap-1 text-[#71717a]">
                    {item.detail} <ChevronRight size={10} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full h-px bg-[#1e1e1e]"></div>

          {/* Active Opportunities */}
          <div>
            <h4 className="text-[12px] font-semibold text-white mb-3">Active Opportunities</h4>
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-[#635BFF] flex items-center justify-center text-white text-[9px] font-bold">S</div>
                  <div className="flex flex-col">
                    <span className="text-[11px] text-white font-medium">Frontend Engineer</span>
                    <span className="text-[9px] text-[#71717a]">Interview Scheduled</span>
                  </div>
                </div>
                <span className="text-[10px] text-[#71717a]">Jul 24</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-[#1A1A1A] border border-[#262626] flex items-center justify-center text-white text-[9px] font-bold">N</div>
                  <div className="flex flex-col">
                    <span className="text-[11px] text-white font-medium">Product Designer</span>
                    <span className="text-[9px] text-[#71717a]">Application Submitted</span>
                  </div>
                </div>
                <span className="text-[10px] text-[#71717a]">Jun 28</span>
              </div>
            </div>
            <button className="text-[11px] text-[#b19cd9] mt-2 hover:text-[#c2c1ff] transition-colors">View All Opportunities</button>
          </div>

          <div className="w-full h-px bg-[#1e1e1e]"></div>

          {/* Private Notes */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-[12px] font-semibold text-white">Private Notes</h4>
              <button className="text-[10px] text-[#b19cd9] hover:text-[#c2c1ff] transition-colors">Add Note</button>
            </div>
            <ul className="flex flex-col gap-1.5 text-[11px] text-[#a1a1aa]">
              <li>• Discussed system design.</li>
              <li>• Interested in AI projects.</li>
              <li>• Follow up next week.</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
