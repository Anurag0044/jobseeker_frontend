"use client";

import React, { useState } from "react";
import { motion, Variants, AnimatePresence } from "framer-motion";
import { useForgeProfile } from "../../../hooks/useForgeProfile";
import EditProfileModal from "../../../components/profile/EditProfileModal";
import ShareProfileModal from "../../../components/profile/ShareProfileModal";
import AddSkillModal from "../../../components/profile/AddSkillModal";
import {
  MapPin, Mail, MoreHorizontal,
  ShieldCheck, Code, Server,
  Monitor, Bot, Briefcase,
  Link as LinkIcon, Image as ImageIcon, Award, CloudUpload,
  FolderGit2, Lightbulb
} from "lucide-react";
import { skillsData } from "../../../data/skillsData";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.03, delayChildren: 0.05 } },
};

const itemVariants: Variants = {
  hidden: { y: 15, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring" as const, stiffness: 400, damping: 30 } },
};



export default function ProfilePage() {
  const { displayProfile, saveProfile } = useForgeProfile();
  const [activeTab, setActiveTab] = useState("Overview");
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [mySkills, setMySkills] = useState<string[]>([]);
  const profileSkills = displayProfile
    ? [...displayProfile.techStack, ...displayProfile.skills].filter((skill) => skillsData.some((item) => item.name === skill))
    : [];
  const displayedSkills = mySkills.length
    ? mySkills
    : profileSkills.length
      ? Array.from(new Set(profileSkills))
      : [];

  const handleToggleSkill = (skillName: string) => {
    setMySkills((prev) => {
      const base = prev.length ? prev : displayedSkills;
      const next = base.includes(skillName)
        ? base.filter((s) => s !== skillName)
        : [...base, skillName];

      saveProfile({ skills: next }, false).catch((error) => {
        console.error("Unable to sync skills", error);
      });

      return next;
    });
  };

  return (
    <div className="px-4 sm:px-8 pb-8 pt-4 lg:pt-6 relative z-10 h-full flex flex-col">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-[1200px] w-full mx-auto flex flex-col gap-5 lg:gap-6 flex-1 h-full"
      >
        <ProfileHeader />
        <NavigationTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="flex-1 overflow-hidden relative">
          <div className="absolute inset-0 overflow-y-auto custom-scrollbar pb-6 pr-1">
            <AnimatePresence mode="wait">
              {activeTab === "Overview" && (
                <motion.div
                  key="overview"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, y: -5 }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6"
                >
                  <div className="lg:col-span-7 flex flex-col gap-5 lg:gap-6">
                    <AboutMe />
                    <CareerInsight />
                  </div>
                  <div className="lg:col-span-5 flex flex-col gap-5 lg:gap-6">
                    <Skills
                      mySkills={displayedSkills}
                      onOpenModal={() => setIsSkillModalOpen(true)}
                    />
                    <RecentActivity />
                  </div>
                </motion.div>
              )}

              {activeTab === "Projects" && (
                <motion.div key="projects" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <ProjectsSection />
                </motion.div>
              )}

              {activeTab === "Portfolio" && (
                <motion.div key="portfolio" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <PortfolioSection />
                </motion.div>
              )}

              {activeTab === "Skills" && (
                <motion.div key="skills-tab" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <SkillsTabSection />
                </motion.div>
              )}

              {activeTab === "Experience" && (
                <motion.div key="experience" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <ExperienceSection />
                </motion.div>
              )}

              {activeTab === "Achievements" && (
                <motion.div key="achievements" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <AchievementsSection />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      <AddSkillModal
        isOpen={isSkillModalOpen}
        onClose={() => setIsSkillModalOpen(false)}
        selectedSkills={displayedSkills}
        onToggleSkill={handleToggleSkill}
      />
    </div>
  );
}

/* ─── Ultra Premium Glass Card Wrapper ──────────────────── */

function Card({ children, className = "", accentBorder = false }: { children: React.ReactNode, className?: string, accentBorder?: boolean }) {
  return (
    <div
      className={`relative rounded-[20px] overflow-hidden ${className} group`}
      style={{
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.45) 0%, rgba(15, 23, 42, 0.25) 100%)',
        backdropFilter: 'blur(30px) saturate(150%)',
        WebkitBackdropFilter: 'blur(30px) saturate(150%)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: `
          inset 0 1px 1px rgba(255, 255, 255, 0.15),
          inset 0 -1px 1px rgba(0, 0, 0, 0.5),
          0 8px 20px rgba(0, 0, 0, 0.4),
          0 0 15px rgba(99, 102, 241, 0.05)
        `,
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
      {accentBorder && (
        <div className="absolute left-0 top-6 bottom-6 w-[3px] rounded-r-full" style={{ background: 'linear-gradient(180deg, #818cf8 0%, #c084fc 50%, #60a5fa 100%)', boxShadow: '0 0 10px rgba(139, 92, 246, 0.6)' }}></div>
      )}
      <div className="relative z-10 h-full">
        {children}
      </div>
    </div>
  );
}

/* ─── Profile Header ────────────────────────────────────── */

function ProfileHeader() {
  const { displayProfile, saveProfile } = useForgeProfile();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const profileData = {
    displayName: displayProfile?.displayName || "Forge User",
    userId: displayProfile?.username || "forge_user",
    title: displayProfile?.title || "Full Stack Developer",
    bio:
      displayProfile?.bio ||
      "I build scalable web applications and AI-powered tools that solve real-world problems. Always learning.",
    location: displayProfile?.location || "Worldwide",
    portfolioUrl: displayProfile?.portfolioUrl || "",
    github: displayProfile?.github || "",
    linkedin: displayProfile?.linkedin || "",
    twitter: "",
    photoURL: displayProfile?.photoURL || "",
  };

  const displayName = profileData.displayName;
  const firstLetter = displayName.charAt(0).toUpperCase();
  const stats = [
    ["Projects", "0"],
    ["Followers", "0"],
    ["Profile Views", "0"],
    ["Connections", "0"],
  ];

  return (
    <motion.div variants={itemVariants} className="flex flex-col w-full relative shrink-0">
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialData={profileData}
        onSave={(data) =>
          saveProfile({
            displayName: data.displayName,
            username: data.userId,
            title: data.title,
            bio: data.bio,
            location: data.location,
            portfolioUrl: data.portfolioUrl,
            github: data.github,
            linkedin: data.linkedin,
            photoURL: data.photoURL,
          })
        }
      />
      <ShareProfileModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        profileUrl={`forgex.app/@${profileData.userId}`}
      />

      {/* Container: Flex row on lg, stacked on small */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 w-full">

        {/* Left: Avatar + Info */}
        <div className="flex flex-row items-center gap-5 lg:gap-6 flex-1 min-w-0 w-full">
          {/* Glowing Avatar */}
          <div className="relative shrink-0 group">
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 via-purple-500 to-blue-500 rounded-full blur-lg opacity-40 group-hover:opacity-70 transition-opacity duration-500" />
            <div
              className="w-[90px] h-[90px] lg:w-[110px] lg:h-[110px] rounded-full p-[2.5px] relative z-10"
              style={{
                background: 'linear-gradient(135deg, rgba(99,102,241,1) 0%, rgba(139,92,246,1) 50%, rgba(59,130,246,1) 100%)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.4)'
              }}
            >
              <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center bg-[#050b14] border-[3px] border-transparent bg-clip-padding">
                {profileData.photoURL ? (
                  <img src={profileData.photoURL} alt={displayName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[36px] font-bold text-indigo-300 drop-shadow-lg" style={{ background: 'linear-gradient(135deg, rgba(30,41,59,0.8), rgba(15,23,42,0.8))' }}>{firstLetter}</div>
                )}
              </div>
            </div>
            <div className="absolute bottom-0 right-0 lg:bottom-1 lg:right-1 w-5 h-5 lg:w-6 lg:h-6 bg-[#22c55e] border-[3px] border-[#0a0f1c] rounded-full z-20" style={{ boxShadow: '0 0 12px rgba(34,197,94,0.6), inset 0 1px 2px rgba(255,255,255,0.5)' }}></div>
          </div>

          {/* Info - compact */}
          <div className="flex flex-col flex-1 min-w-0">
            <div className="flex items-center gap-2 lg:gap-3 mb-1">
              <h1 className="text-[28px] lg:text-[32px] font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-300 tracking-tight leading-none truncate drop-shadow-sm">{displayName}</h1>
              <ShieldCheck size={24} className="shrink-0 drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]" style={{ color: '#60a5fa' }} fill="#1d4ed8" stroke="#60a5fa" />
            </div>
            <div className="text-[14px] text-slate-400 font-mono mb-2 font-medium truncate">@{profileData.userId}</div>

            <p className="text-[14px] lg:text-[15px] text-slate-300 flex flex-wrap items-center gap-2 lg:gap-3 font-medium mb-2">
              <span className="text-white drop-shadow-md truncate max-w-[200px] sm:max-w-none">{profileData.title || "Add a title"}</span>
              <span className="text-slate-600 hidden sm:inline">•</span>
              <span className="text-indigo-200 hidden sm:inline">AI Enthusiast</span>
              <span className="text-slate-600 hidden md:inline">•</span>
              <span className="text-purple-200 hidden md:inline">Problem Solver</span>
            </p>

            <div className="flex items-center gap-4 text-[13px] text-slate-400 font-medium">
              {profileData.location && (
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" style={{ boxShadow: '0 0 6px rgba(52,211,153,0.6)' }}></span>
                  {profileData.location}
                </span>
              )}
              {profileData.portfolioUrl && (
                <span className="hidden sm:flex items-center gap-1.5 text-indigo-300 hover:text-indigo-200 transition-colors cursor-pointer drop-shadow-[0_0_5px_rgba(99,102,241,0.3)]">
                  <LinkIcon size={14} className="opacity-80" /> {profileData.portfolioUrl}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Stats & Actions */}
        <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between w-full lg:w-auto gap-4 shrink-0">

          {/* Actions - horizontal on mobile, top-right on desktop */}
          <div className="flex items-center gap-2 order-2 lg:order-1">
            <div className="flex items-center gap-2 mr-2">
              {profileData.github && (
                <SocialButton icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>} />
              )}
              {profileData.linkedin && (
                <SocialButton icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>} />
              )}
            </div>

            <button
              onClick={() => setIsEditModalOpen(true)}
              className="px-4 py-1.5 text-white text-[13px] font-semibold rounded-xl hover:scale-105 transition-all shadow-[0_5px_15px_rgba(0,0,0,0.2)] active:scale-95"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.02))',
                border: '1px solid rgba(255,255,255,0.15)',
                backdropFilter: 'blur(10px)',
                boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.2)'
              }}
            >Edit</button>
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="w-8 h-8 flex items-center justify-center text-slate-300 rounded-xl hover:scale-105 hover:text-white transition-all active:scale-95"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01))',
                border: '1px solid rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.1)'
              }}
            ><MoreHorizontal size={16} /></button>
          </div>

          {/* Stats Glass Box - Horizontal & compact */}
          <div
            className="relative rounded-2xl overflow-hidden px-5 py-3 w-full lg:w-auto order-1 lg:order-2"
            style={{
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.4) 0%, rgba(30, 27, 75, 0.3) 50%, rgba(15, 23, 42, 0.4) 100%)',
              backdropFilter: 'blur(40px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.15), 0 8px 20px rgba(0,0,0,0.3)'
            }}
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/20 blur-[40px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/20 blur-[40px] rounded-full pointer-events-none" />

            <div className="flex justify-between lg:justify-end gap-x-6 gap-y-2 relative z-10 w-full overflow-x-auto no-scrollbar">
              {stats.map(([label, value], i) => (
                <div key={i} className="flex flex-col items-center lg:items-end">
                  <span className="text-[11px] font-semibold text-indigo-200/70 mb-0.5 whitespace-nowrap tracking-wider uppercase">{label}</span>
                  <span className="text-[18px] font-extrabold tracking-tight leading-none text-white drop-shadow-sm">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function SocialButton({ icon }: { icon: React.ReactNode }) {
  return (
    <button className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-300 hover:text-white hover:scale-110 transition-all active:scale-95 group"
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01))',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.1)'
      }}
    >
      <div className="drop-shadow-[0_0_5px_rgba(255,255,255,0.3)] group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-all">
        {icon}
      </div>
    </button>
  );
}

/* ─── Tabs ──────────────────────────────────────────────── */

function NavigationTabs({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (tab: string) => void }) {
  const tabs = ["Overview", "Projects", "Portfolio", "Skills", "Experience", "Achievements"];
  return (
    <motion.div variants={itemVariants} className="w-full flex gap-6 lg:gap-8 relative shrink-0 overflow-x-auto no-scrollbar" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
      {tabs.map((tab, i) => (
        <button
          key={i}
          onClick={() => setActiveTab(tab)}
          className={`pb-3 text-[14px] font-semibold transition-all relative whitespace-nowrap ${activeTab === tab ? "text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" : "text-slate-500 hover:text-slate-300"}`}
        >
          {tab}
          {activeTab === tab && (
            <motion.div
              layoutId="activeTabIndicator"
              className="absolute bottom-0 left-0 w-full h-[3px] rounded-t-full"
              style={{ background: 'linear-gradient(90deg, #818cf8, #c084fc)', boxShadow: '0 -2px 10px rgba(139,92,246,0.6)' }}
            />
          )}
        </button>
      ))}
    </motion.div>
  );
}

/* ─── About Me ──────────────────────────────────────────── */

function AboutMe() {
  const { displayProfile } = useForgeProfile();
  const tags = (displayProfile?.techStack || []).slice(0, 4);
  const icons = [Monitor, Bot, Server, Code];

  return (
    <motion.div variants={itemVariants} className="h-full">
      <Card accentBorder className="p-5 lg:p-6 h-full flex flex-col">
        <h3 className="text-[20px] font-extrabold tracking-tight text-white mb-3 pl-3 drop-shadow-sm">About Me</h3>
        <p className="text-[14px] text-slate-300 leading-relaxed mb-5 pl-3 font-medium flex-1 line-clamp-3 lg:line-clamp-none">
          {displayProfile?.bio || "No bio added yet."}
        </p>
        {tags.length > 0 ? (
          <div className="flex flex-wrap gap-2 pl-3">
            {tags.map((label, i) => {
              const Icon = icons[i] || Code;
              return (
                <span
                  key={label}
                  className="px-3 py-1.5 rounded-lg text-[13px] font-semibold text-white flex items-center gap-2 cursor-default hover:scale-105 transition-transform shadow-sm"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))',
                    border: '1px solid rgba(255,255,255,0.1)',
                    boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.15)'
                  }}
                >
                  <span className="text-indigo-300"><Icon size={14} /></span> {label}
                </span>
              );
            })}
          </div>
        ) : (
          <p className="text-[13px] text-slate-500 pl-3">Add your tech stack to show live profile context here.</p>
        )}
      </Card>
    </motion.div>
  );
}

/* ─── Skills ────────────────────────────────────────────── */

function Skills({ mySkills, onOpenModal }: { mySkills: string[], onOpenModal: () => void }) {
  const activeSkillsData = skillsData.filter((s) => mySkills.includes(s.name));

  return (
    <motion.div variants={itemVariants}>
      <Card className="p-5 lg:p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-[15px] font-bold text-white drop-shadow-sm">Skills</h3>
          <button onClick={onOpenModal} className="text-[12px] text-indigo-400 hover:text-indigo-300 transition-all font-semibold">View All</button>
        </div>

        {mySkills.length > 0 ? (
          <div className="flex flex-wrap gap-2 mb-5">
            {activeSkillsData.slice(0, 8).map((skill) => (
              <div
                key={skill.name}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full cursor-default group hover:scale-105 transition-all shadow-sm"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.01))',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <skill.icon size={14} style={{ color: skill.color }} className="group-hover:scale-110 transition-transform drop-shadow-sm" />
                <span className="text-[12px] text-white font-semibold">{skill.name}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 mb-5 rounded-xl" style={{ border: '1px dashed rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.1)' }}>
            <p className="text-[13px] font-medium text-slate-400">No skills selected yet.</p>
          </div>
        )}

        <div className="pt-4 relative" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[12px] font-semibold text-slate-400">AI Skill Score</span>
            <span className="text-[13px] font-bold text-white">{Math.min(100, 50 + mySkills.length * 5)}%</span>
          </div>
          <div className="w-full h-1.5 rounded-full overflow-hidden shadow-inner" style={{ background: 'rgba(0,0,0,0.5)' }}>
            <div
              className="h-full rounded-full transition-all duration-700 relative"
              style={{
                width: `${Math.min(100, 50 + mySkills.length * 5)}%`,
                background: 'linear-gradient(90deg, #10b981, #2dd4bf)',
                boxShadow: '0 0 10px rgba(45,212,191,0.5)',
              }}
            >
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

/* ─── Recent Activity ───────────────────────────────────── */

function RecentActivity() {
  const activities = [
    { emoji: "🔵", text: "Applied for Senior Frontend Developer at Stripe", time: "2h ago" },
    { emoji: "🏆", text: "New achievement unlocked: AI Innovator", time: "1d ago" },
  ];

  return (
    <motion.div variants={itemVariants}>
      <Card className="p-5 lg:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[15px] font-bold text-white drop-shadow-sm">Recent Activity</h3>
        </div>
        <div className="flex flex-col gap-3">
          {activities.map((activity, i) => (
            <div key={i} className="flex items-start gap-3 group p-2 -mx-2 rounded-lg hover:bg-white/[0.03] transition-colors border border-transparent hover:border-white/[0.05]">
              <span className="text-[14px] shrink-0 mt-0.5">{activity.emoji}</span>
              <p className="text-[13px] font-medium text-slate-300 flex-1 leading-snug group-hover:text-white transition-colors">{activity.text}</p>
              <span className="text-[11px] font-medium text-slate-500 whitespace-nowrap shrink-0">{activity.time}</span>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}

/* ─── AI Career Insight ─────────────────────────────────── */

function CareerInsight() {
  const { displayProfile } = useForgeProfile();
  const firstName = displayProfile?.displayName ? displayProfile.displayName.split(" ")[0] : "there";
  const leadSkill = displayProfile?.skills?.[0] || displayProfile?.techStack?.[0] || "System Design";
  const targetRole = displayProfile?.title || "Frontend";

  return (
    <motion.div variants={itemVariants}>
      <Card className="p-5 lg:p-6 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/10 blur-[40px] rounded-full pointer-events-none group-hover:bg-indigo-500/20 transition-colors duration-700" />

        <div className="flex items-center gap-3 mb-4 relative z-10">
          <h3 className="text-[15px] font-bold text-white drop-shadow-sm">AI Career Insight</h3>
          <span className="px-2 py-0.5 text-indigo-300 rounded text-[10px] font-mono font-bold tracking-widest shadow-sm" style={{ background: 'rgba(79,70,229,0.2)', border: '1px solid rgba(99,102,241,0.4)' }}>BETA</span>
        </div>

        <div className="flex items-start gap-4 p-4 rounded-xl relative z-10 shadow-sm" style={{ background: 'rgba(2, 6, 23, 0.4)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.2) 0%, rgba(139,92,246,0.2) 100%)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <Bot size={16} className="text-indigo-300" />
          </div>
          <p className="text-[13px] font-medium text-slate-300 leading-relaxed">
            Great progress, {firstName}! You&apos;re a <span className="text-white font-bold underline decoration-wavy decoration-indigo-500 underline-offset-4">good match</span> for <span className="text-white font-bold">{targetRole}</span> roles. Strengthen your <span className="text-indigo-200">{leadSkill}</span> story to increase match rate.
          </p>
        </div>
      </Card>
    </motion.div>
  );
}

/* ─── Tab Sections (Unchanged but fit nicely) ───────────── */

function ProjectsSection() {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[20px] font-extrabold text-white drop-shadow-sm">Projects</h2>
      </div>
      <div className="rounded-[20px] p-10 text-center" style={{ border: '2px dashed rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)' }}>
        <FolderGit2 size={24} className="mx-auto mb-3 text-slate-500" />
        <h3 className="text-[16px] font-bold text-white mb-1">No projects yet</h3>
        <p className="text-[13px] text-slate-400 font-medium">Your projects will appear here once added.</p>
      </div>
    </div>
  );
}

function SkillsTabSection() {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[20px] font-extrabold text-white drop-shadow-sm">All Skills</h2>
      </div>
      <div className="rounded-[20px] p-10 text-center" style={{ border: '2px dashed rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)' }}>
        <Lightbulb size={24} className="mx-auto mb-3 text-slate-500" />
        <h3 className="text-[16px] font-bold text-white mb-1">Skills overview</h3>
        <p className="text-[13px] text-slate-400 font-medium">A detailed breakdown of your skills will appear here.</p>
      </div>
    </div>
  );
}

function PortfolioSection() {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[20px] font-extrabold text-white drop-shadow-sm">Portfolio</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <button className="h-[200px] rounded-[20px] flex flex-col items-center justify-center gap-4 group relative overflow-hidden transition-all hover:border-indigo-500/50" style={{ border: '2px dashed rgba(255,255,255,0.15)', background: 'rgba(0,0,0,0.2)' }}>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-white group-hover:scale-110 transition-all shadow-sm" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))', border: '1px solid rgba(255,255,255,0.15)' }}>
            <CloudUpload size={24} strokeWidth={2} />
          </div>
          <div className="flex flex-col items-center relative z-10">
            <span className="text-[14px] font-bold text-white mb-1 tracking-tight">Upload Project</span>
            <span className="text-[12px] font-medium text-slate-400">Images, PDFs, or Links</span>
          </div>
        </button>

        <div className="h-[200px] rounded-[20px] flex flex-col items-center justify-center gap-3 text-center px-6" style={{ border: '2px dashed rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)' }}>
          <ImageIcon size={24} className="text-slate-500" />
          <div>
            <h4 className="text-[14px] font-bold text-white mb-1">No Firestore projects yet</h4>
            <p className="text-[12px] font-medium text-slate-400">Projects will appear here after they are saved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ExperienceSection() {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[20px] font-extrabold text-white drop-shadow-sm">Experience</h2>
      </div>
      <div className="rounded-[20px] p-10 text-center" style={{ border: '2px dashed rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)' }}>
        <Briefcase size={24} className="mx-auto mb-3 text-slate-500" />
        <h3 className="text-[16px] font-bold text-white mb-1">No experience added yet</h3>
        <p className="text-[13px] text-slate-400 font-medium">Experience entries will render here once saved.</p>
      </div>
    </div>
  );
}

function AchievementsSection() {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[20px] font-extrabold text-white drop-shadow-sm">Achievements</h2>
      </div>
      <div className="rounded-[20px] p-10 text-center" style={{ border: '2px dashed rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)' }}>
        <Award size={24} className="mx-auto mb-3 text-slate-500" />
        <h3 className="text-[16px] font-bold text-white mb-1">No achievements added yet</h3>
        <p className="text-[13px] text-slate-400 font-medium">Achievements will render here once saved.</p>
      </div>
    </div>
  );
}
