"use client";

import React, { useState } from "react";
import { motion, Variants } from "framer-motion";
import {
  GraduationCap, Briefcase, Code2, Users, UserCircle, Building2, Plus,
  Search, ChevronDown, Bookmark, MoreHorizontal, Calendar, 
  LayoutTemplate, Activity, ArrowRight
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

export default function CommunitiesPage() {
  const [activeTab, setActiveTab] = useState("Overview");
  const { displayProfile } = useForgeProfile();
  const techStack = displayProfile?.techStack?.length ? displayProfile.techStack : ["React", "TypeScript", "Next.js", "Tailwind CSS"];
  const firstSkill = displayProfile?.skills?.[0] || techStack[0] || "technology";

  return (
    <div className="px-8 pb-16 pt-8 overflow-x-hidden">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-[1200px] mx-auto flex flex-col gap-8"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex items-start justify-between">
          <div>
            <h1 className="text-[26px] font-semibold text-white tracking-tight mb-1">Communities</h1>
            <p className="text-[13px] text-[#a1a1aa]">Connect with professionals, students, recruiters, and builders around {firstSkill} and your career goals.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-[#121212] border border-[#262626] text-white text-[13px] font-medium rounded-lg hover:bg-[#1A1A1A] transition-colors">
              <Search size={16} /> Explore Communities
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#5e5ce6] hover:bg-[#4d4ad5] text-white text-[13px] font-medium rounded-lg transition-colors">
              <Plus size={16} /> Create Community
            </button>
          </div>
        </motion.div>

        <ProfileContextStrip label="Community Discovery Context" />

        {/* Categories Carousel */}
        <motion.div variants={itemVariants} className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
          <CategoryCard icon={<GraduationCap size={18} className="text-[#b19cd9]" />} title="Students" desc="Connect with students building skills, projects, and future careers." count="12.4K Members" />
          <CategoryCard icon={<Briefcase size={18} className="text-[#61dafb]" />} title="Employees" desc="Learn from professionals actively working across industries." count="25.8K Members" />
          <CategoryCard icon={<Code2 size={18} className="text-[#a3e635]" />} title="Senior Developers" desc="Explore advanced engineering discussions and practical experience." count="18.7K Members" />
          <CategoryCard icon={<Users size={18} className="text-[#22c55e]" />} title="Collaborators" desc="Find people to build meaningful projects together." count="10.3K Members" />
          <CategoryCard icon={<UserCircle size={18} className="text-[#f59e0b]" />} title="Recruiters" desc="Understand hiring expectations and connect with recruiters." count="6.2K Members" />
          <CategoryCard icon={<Building2 size={18} className="text-[#3b82f6]" />} title="Companies" desc="Explore organizations actively hiring and sharing opportunities." count="4.1K Members" />
          
          <div className="min-w-[240px] p-5 bg-gradient-to-b from-[#1e1a2e] to-[#0A0A0A] border border-[#2a2440] rounded-xl flex flex-col shrink-0">
            <div className="w-8 h-8 rounded-full bg-[#5e5ce6]/20 flex items-center justify-center border border-[#5e5ce6]/40 mb-3">
              <Plus size={16} className="text-[#c2c1ff]" />
            </div>
            <h3 className="text-[14px] font-semibold text-white mb-2">Create Your Own Community</h3>
            <p className="text-[11px] text-[#a1a1aa] mb-4 flex-1">Build a professional space around a niche skill, technology, industry, or mission.</p>
            <button className="w-full py-1.5 bg-[#5e5ce6] hover:bg-[#4d4ad5] text-white text-[12px] font-medium rounded-md transition-colors">
              Create Community
            </button>
          </div>
        </motion.div>

        {/* Discover Communities Section */}
        <motion.div variants={itemVariants} className="flex flex-col gap-6">
          <div>
            <h2 className="text-[18px] font-semibold text-white mb-1">Discover Communities</h2>
            <p className="text-[13px] text-[#a1a1aa]">Find communities that match your interests and goals.</p>
          </div>

          {/* Filters Bar */}
          <div className="flex items-center gap-3 overflow-x-auto pb-2 custom-scrollbar">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#121212] border border-[#262626] rounded-md min-w-[200px]">
              <Search size={14} className="text-[#71717a]" />
              <input type="text" placeholder="Search communities..." className="bg-transparent border-none outline-none text-[12px] text-white w-full" />
            </div>
            {["Technology", "Industry", "Role", "Skill Level", "Community Size", "Most Active"].map(filter => (
              <button key={filter} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#121212] border border-[#262626] text-[#a1a1aa] hover:text-white text-[12px] rounded-md whitespace-nowrap transition-colors">
                {filter} <ChevronDown size={14} />
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            {/* LEFT: Community List */}
            <div className="xl:col-span-7 flex flex-col gap-4">
              <CommunityListItem 
                active
                logo={<ReactLogo />}
                title="Frontend Engineers"
                desc="UI engineering discussions, career advice, and project showcases."
                tags={techStack.slice(0, 4)}
                members="12.6K Members • Active now"
                user="Sarah Chen"
                userInitials="SC"
                userAction="Shared a discussion on improving performance in React apps"
                time="2h ago"
              />
              <CommunityListItem 
                logo={<span className="text-[24px] font-bold text-white">AI</span>}
                title="AI Builders"
                desc="Machine learning, agents, and AI product development."
                tags={["Python", "ML", "LangChain", "OpenAI"]}
                members="9.8K Members • Active now"
                user="Arjun Patel"
                userInitials="AP"
                userAction="Shared project: AI Agent for code review"
                time="3h ago"
              />
              <CommunityListItem 
                logo={<CloudLogo />}
                title="Cloud Engineers"
                desc="Infrastructure, DevOps, and cloud architecture."
                tags={["AWS", "Docker", "Kubernetes", "Terraform"]}
                members="7.6K Members • Active now"
                user="Mike Johnson"
                userInitials="MJ"
                userAction="Started a discussion on multi-region deployment strategies"
                time="4h ago"
              />
              <CommunityListItem 
                logo={<Code2 size={24} className="text-[#a3e635]" />}
                title="Open Source Developers"
                desc="Open source projects, contributions, and collaboration."
                tags={["GitHub", "Contributions", "OSS", "Collaboration"]}
                members="6.3K Members • Active now"
                user="Emma Williams"
                userInitials="EW"
                userAction="Contributed to an open source project"
                time="5h ago"
              />
            </div>

            {/* RIGHT: Detail Panel */}
            <div className="xl:col-span-5 relative">
              <div className="sticky top-[88px] flex flex-col h-[calc(100vh-120px)] bg-[#0A0A0A] border border-[#1e1e1e] rounded-xl overflow-hidden relative">
                
                {/* Decorative background */}
                <div className="absolute top-0 left-0 w-full h-[200px] bg-gradient-to-b from-[#1e1a2e]/30 to-transparent pointer-events-none"></div>
                <div className="absolute top-10 right-0 w-[300px] h-[100px] bg-gradient-to-r from-transparent via-[#5e5ce6]/10 to-transparent blur-3xl pointer-events-none"></div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 relative z-10">
                  <div className="flex items-start gap-4 mb-5">
                    <div className="w-14 h-14 rounded-xl bg-[#121212] border border-[#262626] flex items-center justify-center shrink-0 shadow-lg">
                      <ReactLogo />
                    </div>
                    <div className="flex flex-col">
                      <h2 className="text-[20px] font-semibold text-white mb-1">Frontend Engineers</h2>
                      <div className="flex items-center gap-2 text-[12px]">
                        <span className="text-[#a1a1aa]">12.6K Members</span>
                        <span className="text-[#71717a]">•</span>
                        <span className="text-[#22c55e]">Active Community</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-[13px] text-[#a1a1aa] leading-relaxed mb-6">
                    A professional community for frontend engineers to discuss UI engineering, share projects, and grow together.
                  </p>

                  <div className="flex items-center gap-3 mb-6">
                    <button className="flex-1 py-2 bg-[#5e5ce6] hover:bg-[#4d4ad5] text-white text-[13px] font-medium rounded-lg transition-colors shadow-lg shadow-[#5e5ce6]/20">
                      Join Community
                    </button>
                    <button className="flex-1 py-2 bg-[#121212] border border-[#262626] hover:bg-[#1A1A1A] text-white text-[13px] font-medium rounded-lg transition-colors">
                      Invite
                    </button>
                    <button className="w-10 h-10 flex items-center justify-center bg-[#121212] border border-[#262626] hover:bg-[#1A1A1A] text-white rounded-lg transition-colors shrink-0">
                      <MoreHorizontal size={14} />
                    </button>
                  </div>

                  {/* Tabs */}
                  <div className="flex gap-4 border-b border-[#1e1e1e] mb-6 overflow-x-auto custom-scrollbar">
                    {["Overview", "Discussions", "Projects", "Opportunities", "Members", "Resources", "Events"].map(tab => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-3 text-[11px] font-medium transition-colors relative whitespace-nowrap ${activeTab === tab ? "text-[#b19cd9]" : "text-[#a1a1aa] hover:text-white"}`}
                      >
                        {tab}
                        {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#b19cd9] rounded-t-full"></div>}
                      </button>
                    ))}
                  </div>

                  {/* Content Grid */}
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div className="bg-[#121212] border border-[#1e1e1e] rounded-xl p-4">
                      <h3 className="text-[12px] font-semibold text-white mb-2">About This Community</h3>
                      <p className="text-[11px] text-[#a1a1aa] leading-relaxed">
                        We help frontend engineers learn, build, and grow by sharing knowledge, solving problems, and showcasing work.
                      </p>
                    </div>
                    <div className="bg-[#121212] border border-[#1e1e1e] rounded-xl p-4">
                      <h3 className="text-[12px] font-semibold text-white mb-2">Community Highlights</h3>
                      <ul className="flex flex-col gap-1.5 text-[11px] text-[#a1a1aa]">
                        <li className="flex items-center gap-1.5"><span className="w-1 h-1 bg-[#71717a] rounded-full"></span> Weekly discussions</li>
                        <li className="flex items-center gap-1.5"><span className="w-1 h-1 bg-[#71717a] rounded-full"></span> Project showcases</li>
                        <li className="flex items-center gap-1.5"><span className="w-1 h-1 bg-[#71717a] rounded-full"></span> Career guidance</li>
                        <li className="flex items-center gap-1.5"><span className="w-1 h-1 bg-[#71717a] rounded-full"></span> Expert AMAs</li>
                      </ul>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6 mb-6">
                    {/* Featured Discussions */}
                    <div>
                      <h3 className="text-[12px] font-semibold text-white mb-3">Featured Discussions</h3>
                      <div className="flex flex-col gap-3">
                        <DiscussionItem title="Best practices for scalable React applications" author="Sarah Chen" replies="24 replies" time="2h ago" />
                        <DiscussionItem title="Design systems that actually scale" author="Arjun Patel" replies="11 replies" time="5h ago" />
                        <DiscussionItem title="State management in large applications" author="Mike Johnson" replies="32 replies" time="1d ago" />
                      </div>
                      <button className="text-[11px] text-[#b19cd9] mt-3 hover:text-[#c2c1ff] transition-colors flex items-center gap-1">
                        View all discussions <ArrowRight size={10} />
                      </button>
                    </div>

                    {/* Highlighted Projects */}
                    <div>
                      <h3 className="text-[12px] font-semibold text-white mb-3">Highlighted Projects</h3>
                      <div className="flex flex-col gap-3">
                        <ProjectItem title="Flux UI" desc="Design system for React apps" icon={<LayoutTemplate size={14} className="text-[#61dafb]" />} />
                        <ProjectItem title="DevDash" desc="Developer analytics dashboard" icon={<Activity size={14} className="text-[#a3e635]" />} />
                        <ProjectItem title="ShipKit" desc="Production-ready component library" icon={<Code2 size={14} className="text-[#b19cd9]" />} />
                      </div>
                      <button className="text-[11px] text-[#b19cd9] mt-3 hover:text-[#c2c1ff] transition-colors flex items-center gap-1">
                        View all projects <ArrowRight size={10} />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    {/* Upcoming Events */}
                    <div>
                      <h3 className="text-[12px] font-semibold text-white mb-3">Upcoming Events</h3>
                      <div className="flex flex-col gap-3">
                        <EventItem title="Frontend Architecture Workshop" date="May 24, 2024 • 4:00 PM PST" />
                        <EventItem title="AMA with Vercel Engineers" date="May 28, 2024 • 6:00 PM PST" />
                      </div>
                      <button className="text-[11px] text-[#b19cd9] mt-3 hover:text-[#c2c1ff] transition-colors flex items-center gap-1">
                        View all events <ArrowRight size={10} />
                      </button>
                    </div>

                    {/* Popular Resources */}
                    <div>
                      <h3 className="text-[12px] font-semibold text-white mb-3">Popular Resources</h3>
                      <ul className="flex flex-col gap-2 text-[11px] text-[#a1a1aa]">
                        <li className="flex items-center gap-2 hover:text-white cursor-pointer transition-colors"><span className="w-1 h-1 bg-[#71717a] rounded-full"></span> React Performance Handbook</li>
                        <li className="flex items-center gap-2 hover:text-white cursor-pointer transition-colors"><span className="w-1 h-1 bg-[#71717a] rounded-full"></span> UI Engineer Roadmap 2024</li>
                        <li className="flex items-center gap-2 hover:text-white cursor-pointer transition-colors"><span className="w-1 h-1 bg-[#71717a] rounded-full"></span> Frontend Interview Guide</li>
                        <li className="flex items-center gap-2 hover:text-white cursor-pointer transition-colors"><span className="w-1 h-1 bg-[#71717a] rounded-full"></span> Tailwind CSS Best Practices</li>
                      </ul>
                      <button className="text-[11px] text-[#b19cd9] mt-3 hover:text-[#c2c1ff] transition-colors flex items-center gap-1">
                        View all resources <ArrowRight size={10} />
                      </button>
                    </div>
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

function CategoryCard({ icon, title, desc, count }: { icon: React.ReactNode; title: string; desc: string; count: string }) {
  return (
    <div className="min-w-[240px] p-5 bg-[#121212] border border-[#1e1e1e] hover:border-[#3f3f46] transition-colors rounded-xl flex flex-col shrink-0 cursor-pointer">
      <div className="w-8 h-8 rounded-full bg-[#1A1A1A] flex items-center justify-center border border-[#262626] mb-3">
        {icon}
      </div>
      <h3 className="text-[14px] font-semibold text-white mb-2">{title}</h3>
      <p className="text-[11px] text-[#a1a1aa] mb-4 flex-1 leading-relaxed">{desc}</p>
      <span className="text-[11px] text-[#71717a]">{count}</span>
    </div>
  );
}

interface CommunityListItemProps {
  active?: boolean;
  logo: React.ReactNode;
  title: string;
  desc: string;
  tags: string[];
  members: string;
  user: string;
  userInitials: string;
  userAction: string;
  time: string;
}

function CommunityListItem({ active, logo, title, desc, tags, members, user, userInitials, userAction, time }: CommunityListItemProps) {
  return (
    <div className={`flex flex-col md:flex-row md:items-start gap-4 p-5 rounded-xl transition-all border ${active ? "bg-[#1e1a2e]/30 border-[#2a2440]" : "bg-[#121212] border-[#1e1e1e] hover:border-[#3f3f46]"}`}>
      <div className="flex-1 flex gap-4 min-w-0">
        <div className="w-12 h-12 rounded-xl bg-[#0A0A0A] border border-[#262626] flex items-center justify-center shrink-0 shadow-inner">
          {logo}
        </div>
        <div className="flex flex-col min-w-0">
          <h3 className="text-[15px] font-semibold text-white mb-1">{title}</h3>
          <p className="text-[12px] text-[#a1a1aa] mb-3 truncate">{desc}</p>
          <div className="flex flex-wrap gap-2 mb-3">
            {tags.map((tag: string) => (
              <span key={tag} className="px-2 py-0.5 bg-[#1A1A1A] border border-[#262626] text-[#71717a] text-[10px] rounded">{tag}</span>
            ))}
          </div>
          <span className="text-[11px] text-[#71717a]">
            <span className="text-[#a1a1aa]">{members.split(" • ")[0]}</span> • <span className={members.includes("Active now") ? "text-[#22c55e]" : ""}>{members.split(" • ")[1]}</span>
          </span>
        </div>
      </div>

      <div className="md:w-[320px] flex flex-col justify-between shrink-0 pl-4 border-l border-[#1e1e1e] md:border-t-0 border-t pt-4 md:pt-0">
        <div className="flex gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-[#1A1A1A] border border-[#262626] flex items-center justify-center text-[10px] text-[#b19cd9] font-medium shrink-0">
            {userInitials}
          </div>
          <div className="flex flex-col">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-medium text-white">{user}</span>
              <span className="text-[10px] text-[#71717a]">{time}</span>
            </div>
            <p className="text-[11px] text-[#a1a1aa] mt-1 leading-relaxed line-clamp-2">{userAction}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex-1 py-1.5 bg-[#5e5ce6] hover:bg-[#4d4ad5] text-white text-[11px] font-medium rounded-md transition-colors">Join Community</button>
          <button className="flex-1 py-1.5 bg-[#121212] border border-[#262626] hover:bg-[#1A1A1A] text-white text-[11px] font-medium rounded-md transition-colors">View Community</button>
          <button className="w-8 h-8 flex items-center justify-center bg-[#121212] border border-[#262626] hover:bg-[#1A1A1A] text-[#a1a1aa] hover:text-white rounded-md transition-colors">
            <Bookmark size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}

function DiscussionItem({ title, author, replies, time }: { title: string; author: string; replies: string; time: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-[12px] font-medium text-white hover:text-[#c2c1ff] cursor-pointer transition-colors mb-0.5">{title}</span>
      <span className="text-[10px] text-[#71717a]">By {author} • {replies} • {time}</span>
    </div>
  );
}

function ProjectItem({ title, desc, icon }: { title: string; desc: string; icon: React.ReactNode }) {
  return (
    <div className="flex gap-3 items-center p-2 rounded-lg hover:bg-[#1A1A1A] transition-colors cursor-pointer border border-transparent hover:border-[#262626]">
      <div className="w-8 h-8 rounded bg-[#121212] border border-[#262626] flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="text-[12px] font-medium text-white leading-tight mb-0.5">{title}</span>
        <span className="text-[10px] text-[#71717a] leading-tight">{desc}</span>
      </div>
    </div>
  );
}

function EventItem({ title, date }: { title: string; date: string }) {
  return (
    <div className="flex gap-3 items-start p-2 rounded-lg hover:bg-[#1A1A1A] transition-colors cursor-pointer border border-transparent hover:border-[#262626]">
      <Calendar size={14} className="text-[#a1a1aa] mt-0.5 shrink-0" />
      <div className="flex flex-col">
        <span className="text-[12px] font-medium text-white leading-tight mb-1">{title}</span>
        <span className="text-[10px] text-[#71717a] leading-tight">{date}</span>
      </div>
    </div>
  );
}

function ReactLogo() {
  return (
    <svg width="24" height="24" viewBox="-11.5 -10.23174 23 20.46348" xmlns="http://www.w3.org/2000/svg">
      <circle cx="0" cy="0" r="2.05" fill="#61dafb"/>
      <g stroke="#61dafb" strokeWidth="1" fill="none">
        <ellipse rx="11" ry="4.2"/>
        <ellipse rx="11" ry="4.2" transform="rotate(60)"/>
        <ellipse rx="11" ry="4.2" transform="rotate(120)"/>
      </g>
    </svg>
  );
}

function CloudLogo() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>
    </svg>
  );
}
