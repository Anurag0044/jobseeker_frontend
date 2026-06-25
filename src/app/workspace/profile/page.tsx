"use client";

import React, { useState } from "react";
import { motion, Variants, AnimatePresence } from "framer-motion";
import { useForgeProfile } from "../../../hooks/useForgeProfile";
import EditProfileModal from "../../../components/profile/EditProfileModal";
import ShareProfileModal from "../../../components/profile/ShareProfileModal";
import AddSkillModal from "../../../components/profile/AddSkillModal";
import {
  MapPin, Mail, MoreHorizontal, ArrowRight,
  Eye, ShieldCheck, Code, Server,
  Monitor, Bot, Briefcase, User,
  Link as LinkIcon, Plus, Image as ImageIcon, Award, Calendar, CloudUpload
} from "lucide-react";
import { skillsData } from "../../../data/skillsData";
import { SiX } from "react-icons/si";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring" as const, stiffness: 300, damping: 24 } },
};

function formatProfileDate(value: unknown) {
  const date =
    value && typeof value === "object" && "toDate" in value && typeof value.toDate === "function"
      ? value.toDate()
      : value
        ? new Date(String(value))
        : null;

  if (!date || Number.isNaN(date.getTime())) return "Not set";

  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

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
    <div className="px-8 pb-16 pt-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-[1100px] mx-auto flex flex-col gap-8"
      >
        <ProfileHeader />
        <NavigationTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        <AnimatePresence mode="wait">
          {activeTab === "Overview" && (
            <motion.div
              key="overview"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 xl:grid-cols-12 gap-6"
            >
              <div className="xl:col-span-7 flex flex-col gap-6">
                <AboutMe />
                <CareerInsight />
              </div>
              <div className="xl:col-span-5 flex flex-col gap-6">
                <Skills
                  mySkills={displayedSkills}
                  onOpenModal={() => setIsSkillModalOpen(true)}
                />
                <RecentActivity />
              </div>
            </motion.div>
          )}

          {activeTab === "Portfolio" && (
            <motion.div key="portfolio" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <PortfolioSection />
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
      "I build scalable web applications and AI-powered tools that solve real-world problems. Always learning, always building.",
    location: displayProfile?.location || "Worldwide",
    portfolioUrl: displayProfile?.portfolioUrl || "",
    github: displayProfile?.github || "",
    linkedin: displayProfile?.linkedin || "",
    twitter: "",
    photoURL: displayProfile?.photoURL || "",
  };

  const displayName = profileData.displayName;
  const firstLetter = displayName.charAt(0).toUpperCase();
  const email = displayProfile?.email || "user@example.com";
  const stats = [
    ["Projects", "0"],
    ["Followers", "0"],
    ["Profile Views", "0"],
    ["Connections", "0"],
    ["Responses", "0%"],
    ["Member Since", formatProfileDate(displayProfile?.createdAt)],
  ];

  return (
    <motion.div variants={itemVariants} className="flex flex-col w-full relative">
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
      <div className="flex flex-wrap justify-between items-start gap-8 w-full">
        <div className="flex flex-col sm:flex-row gap-6 flex-1 min-w-[320px]">
          <div className="relative shrink-0 self-start">
            <div className="w-[120px] h-[120px] rounded-full overflow-hidden border border-[#262626] bg-[#121212] flex items-center justify-center">
              {profileData.photoURL ? (
                <img src={profileData.photoURL} alt={displayName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[40px] font-bold text-[#b19cd9]">{firstLetter}</div>
              )}
            </div>
            <div className="absolute bottom-2 right-2 w-[22px] h-[22px] bg-[#22c55e] border-[4px] border-[#0A0A0A] rounded-full shadow-sm"></div>
          </div>

          <div className="flex flex-col pt-1 flex-1 min-w-[250px] w-full">
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-[42px] font-bold text-white tracking-tight leading-none truncate">{displayName}</h1>
              <ShieldCheck size={28} className="text-[#b19cd9] shrink-0" fill="#b19cd9" stroke="#0a0a0a" />
            </div>
            <div className="text-[15px] text-[#71717a] font-mono mb-2">@{profileData.userId}</div>
            <p className="text-[17px] text-[#a1a1aa] mb-4 flex flex-wrap items-center gap-2">
              <span>{profileData.title || "Add a title"}</span><span>•</span><span>AI Enthusiast</span><span>•</span><span>Problem Solver</span>
            </p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] text-[#a1a1aa] mb-4">
              {profileData.location && (
                <span className="flex items-center gap-1.5"><MapPin size={14} className="opacity-70" /> {profileData.location}</span>
              )}
              {profileData.portfolioUrl && (
                <span className="flex items-center gap-1.5 text-[#b19cd9]"><LinkIcon size={14} className="opacity-70" /> {profileData.portfolioUrl}</span>
              )}
              <span className="flex items-center gap-1.5"><Mail size={14} className="opacity-70" /> {email}</span>
            </div>
            <p className="text-[13px] text-[#e5e2e1] mb-5 w-full leading-relaxed">
              {profileData.bio || "No bio added yet."}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              {profileData.github && (
                <button className="w-8 h-8 rounded-full bg-[#121212] border border-[#262626] flex items-center justify-center text-white hover:bg-[#1A1A1A] transition-colors shrink-0">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                </button>
              )}
              {profileData.linkedin && (
                <button className="w-8 h-8 rounded-full bg-[#121212] border border-[#262626] flex items-center justify-center text-white hover:bg-[#1A1A1A] transition-colors shrink-0">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                </button>
              )}
              {profileData.twitter && (
                <button className="w-8 h-8 rounded-full bg-[#121212] border border-[#262626] flex items-center justify-center text-white hover:bg-[#1A1A1A] transition-colors shrink-0">
                  <SiX size={14} />
                </button>
              )}
              {(!profileData.github && !profileData.linkedin && !profileData.twitter) && (
                <button className="w-8 h-8 rounded-full bg-[#121212] border border-[#262626] flex items-center justify-center text-white hover:bg-[#1A1A1A] transition-colors shrink-0">
                  <LinkIcon size={14} />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-start xl:items-end gap-6 pt-1 shrink-0 w-full xl:w-auto">
          <div className="flex flex-wrap items-center gap-2">
            <button onClick={() => setIsEditModalOpen(true)} className="px-4 py-1.5 bg-[#121212] border border-[#262626] text-white text-[12px] font-medium rounded-full hover:bg-[#1A1A1A] transition-colors">Edit Profile</button>
            <button onClick={() => setIsShareModalOpen(true)} className="w-8 h-8 flex items-center justify-center bg-[#121212] border border-[#262626] text-white rounded-full hover:bg-[#1A1A1A] transition-colors"><MoreHorizontal size={14} /></button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-6 text-left xl:text-right w-full xl:w-auto">
            {stats.map(([label, value], i) => {
              return (
                <div
                  key={i}
                  className="flex flex-col"
                >
                  <span className="text-[12px] font-medium text-[#a1a1aa] mb-1 whitespace-nowrap">{label}</span>
                  <span className="text-[16px] font-semibold tracking-tight leading-none text-white">{value}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Tabs ──────────────────────────────────────────────── */

function NavigationTabs({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (tab: string) => void }) {
  const tabs = ["Overview", "Portfolio", "Experience", "Achievements"];
  return (
    <motion.div variants={itemVariants} className="w-full border-b border-[#1e1e1e] flex gap-8">
      {tabs.map((tab, i) => (
        <button
          key={i}
          onClick={() => setActiveTab(tab)}
          className={`pb-3 text-[13px] font-medium transition-colors relative ${activeTab === tab ? "text-[#b19cd9]" : "text-[#a1a1aa] hover:text-white"}`}
        >
          {tab}
          {activeTab === tab && (
            <motion.div
              layoutId="activeTabIndicator"
              className="absolute bottom-0 left-0 w-full h-[2px] bg-[#b19cd9] rounded-t-full"
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
    <motion.div variants={itemVariants} className="bg-[#121212] border border-[#1e1e1e] rounded-xl p-6">
      <h3 className="text-[24px] font-bold tracking-tight text-white mb-5">About Me</h3>
      <p className="text-[17px] text-[#e5e2e1] leading-[1.8] mb-8">
        {displayProfile?.bio || "No bio added yet."}
      </p>
      {tags.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {tags.map((label, i) => {
            const Icon = icons[i] || Code;

            return (
              <span key={label} className="px-3 py-1.5 bg-[#1A1A1A] border border-[#262626] rounded-md text-[12px] text-[#e5e2e1] flex items-center gap-2">
                <span className="text-[#a1a1aa]"><Icon size={14} /></span> {label}
              </span>
            );
          })}
        </div>
      ) : (
        <p className="text-[13px] text-[#71717a]">Add your tech stack to show live profile context here.</p>
      )}
    </motion.div>
  );
}

/* ─── Skills ────────────────────────────────────────────── */

function Skills({ mySkills, onOpenModal }: { mySkills: string[], onOpenModal: () => void }) {
  const activeSkillsData = skillsData.filter((s) => mySkills.includes(s.name));

  // Helper to ensure each row has enough items to loop seamlessly
  const fillRow = (items: typeof skillsData) => {
    if (items.length === 0) return [];
    let filled = [...items];
    while (filled.length < 15) {
      filled = [...filled, ...items];
    }
    return filled;
  };

  const chunk1 = activeSkillsData.filter((_, i) => i % 3 === 0);
  const chunk2 = activeSkillsData.filter((_, i) => i % 3 === 1);
  const chunk3 = activeSkillsData.filter((_, i) => i % 3 === 2);

  // If a chunk is empty (because the user picked very few skills), fallback to the full active array
  const row1 = fillRow(chunk1.length ? chunk1 : activeSkillsData);
  const row2 = fillRow(chunk2.length ? chunk2 : activeSkillsData);
  const row3 = fillRow(chunk3.length ? chunk3 : activeSkillsData);

  return (
    <motion.div variants={itemVariants} className="bg-[#121212] border border-[#1e1e1e] rounded-xl p-6 overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[15px] font-semibold text-white">Skills <span className="text-[12px] font-normal text-[#71717a] ml-2">{mySkills.length} Technologies</span></h3>
        <button onClick={onOpenModal} className="text-[12px] flex items-center gap-1.5 px-3 py-1.5 bg-[#b19cd9]/10 text-[#b19cd9] hover:bg-[#b19cd9]/20 rounded-full transition-colors font-medium">
          <Plus size={12} /> Add Skill
        </button>
      </div>

      {mySkills.length > 0 ? (
        <div className="flex flex-col gap-3 mb-6 relative">
          <MarqueeRow items={row1} />
          <MarqueeRow items={row2} reverse={true} />
          <MarqueeRow items={row3} />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 mb-6 border border-dashed border-[#262626] rounded-xl bg-[#0A0A0A]">
          <div className="w-12 h-12 rounded-full bg-[#1A1A1A] flex items-center justify-center text-[#71717a] mb-3">
            <Plus size={20} />
          </div>
          <p className="text-[14px] text-[#a1a1aa]">No skills selected yet.</p>
        </div>
      )}

      <div className="pt-4 border-t border-[#1e1e1e]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[12px] text-[#a1a1aa]">AI Skill Match</span>
          <span className="text-[13px] font-medium text-white">{Math.min(100, 50 + mySkills.length * 5)}%</span>
        </div>
        <div className="w-full h-1.5 bg-[#1e1e1e] rounded-full overflow-hidden">
          <div className="h-full bg-[#b19cd9] rounded-full shadow-[0_0_10px_rgba(177,156,217,0.5)] transition-all duration-500" style={{ width: `${Math.min(100, 50 + mySkills.length * 5)}%` }}></div>
        </div>
      </div>
    </motion.div>
  );
}

function MarqueeRow({ items, reverse = false }: { items: typeof skillsData, reverse?: boolean }) {
  return (
    <div className="flex overflow-hidden w-full relative group/row">
      <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-[#121212] to-transparent z-10 pointer-events-none"></div>
      <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-[#121212] to-transparent z-10 pointer-events-none"></div>

      <div className={`flex gap-3 w-max px-1.5 ${reverse ? "animate-marquee-reverse" : "animate-marquee"} group-hover/row:[animation-play-state:paused]`}>
        {[...items, ...items].map((skill, i) => (
          <div key={`${skill.name}-${i}`} className="flex items-center justify-center p-2.5 bg-[#0A0A0A] border border-[#1e1e1e] rounded-xl hover:bg-[#1A1A1A] transition-colors group cursor-default relative overflow-hidden shrink-0">
            <skill.icon
              size={20}
              className="text-[#a1a1aa] transition-all duration-300 group-hover:scale-110"
              style={{ filter: "grayscale(100%) brightness(0.8)" }}
            />
            <div
              className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 backdrop-blur-sm"
              style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
            >
              <skill.icon size={20} style={{ color: skill.color }} className="scale-110 drop-shadow-lg" />
            </div>
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-[#1A1A1A] border border-[#2a2a2a] rounded text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-30 shadow-xl">
              {skill.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Recent Activity ───────────────────────────────────── */

function RecentActivity() {
  return (
    <motion.div variants={itemVariants} className="bg-[#121212] border border-[#1e1e1e] rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[15px] font-semibold text-white">Recent Activity</h3>
        <button className="text-[12px] text-[#b19cd9] hover:text-[#c2c1ff] transition-colors">View All</button>
      </div>
      <div className="flex flex-col items-center justify-center py-10 border border-dashed border-[#262626] rounded-xl bg-[#0A0A0A]">
        <div className="w-10 h-10 rounded-full bg-[#1A1A1A] border border-[#262626] flex items-center justify-center text-[#a1a1aa] mb-3">
          <Eye size={16} />
        </div>
        <p className="text-[13px] text-[#a1a1aa]">Realtime activity will appear here when Firestore events are added.</p>
      </div>
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
    <motion.div variants={itemVariants} className="bg-[#121212] border border-[#1e1e1e] rounded-xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <h3 className="text-[15px] font-semibold text-white">AI Career Insight</h3>
        <span className="px-2 py-0.5 bg-[#1e1a2e] border border-[#2a2440] text-[#b19cd9] rounded text-[10px] font-mono uppercase tracking-widest">BETA</span>
      </div>
      <div className="flex items-start gap-3 mb-6 bg-[#0A0A0A] p-4 rounded-lg border border-[#1e1e1e]">
        <Bot size={16} className="text-[#b19cd9] shrink-0 mt-0.5" />
        <p className="text-[13px] text-[#a1a1aa] leading-relaxed">
          Great progress, {firstName}! You&apos;re a <span className="text-white font-medium">good match</span> for <span className="text-white font-medium">{targetRole}</span> roles. Strengthen your {leadSkill} story to increase match rate.
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

/* ─── Portfolio Section ─────────────────────────────────── */

function PortfolioSection() {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-[20px] font-bold text-white">Portfolio</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Upload Dropzone */}
        <button className="h-[240px] rounded-xl border border-dashed border-[#3f3f46] bg-[#0A0A0A] hover:bg-[#121212] transition-all flex flex-col items-center justify-center gap-4 group relative overflow-hidden shadow-sm hover:border-[#b19cd9]/50">
          <div className="absolute inset-0 bg-gradient-to-br from-[#b19cd9]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#1e1e1e] to-[#2a2a2a] border border-[#3f3f46] flex items-center justify-center text-[#a1a1aa] group-hover:text-white group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(177,156,217,0.3)] transition-all">
            <CloudUpload size={24} strokeWidth={1.5} />
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[15px] font-semibold text-white mb-1 tracking-tight">Upload Project</span>
            <span className="text-[12px] text-[#71717a]">Images, PDFs, or Links</span>
          </div>
        </button>

        <div className="h-[240px] rounded-xl border border-dashed border-[#262626] bg-[#0A0A0A] flex flex-col items-center justify-center gap-3 text-center px-6">
          <ImageIcon size={28} className="text-[#3f3f46]" />
          <div>
            <h4 className="text-[14px] font-semibold text-white mb-1">No Firestore projects yet</h4>
            <p className="text-[12px] text-[#71717a]">Projects will appear here after they are saved for this user.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Experience Section ─────────────────────────────────── */

function ExperienceSection() {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-[20px] font-bold text-white">Experience</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#121212] border border-[#262626] rounded-full text-[13px] font-medium text-white hover:bg-[#1A1A1A] transition-colors shadow-sm">
          <Plus size={14} className="text-[#b19cd9]" /> Add Experience
        </button>
      </div>

      <div className="rounded-xl border border-dashed border-[#262626] bg-[#0A0A0A] p-10 text-center">
        <Briefcase size={24} className="mx-auto mb-3 text-[#3f3f46]" />
        <h3 className="text-[15px] font-semibold text-white mb-1">No Firestore experience yet</h3>
        <p className="text-[13px] text-[#71717a]">Experience entries will render here once saved for this user.</p>
      </div>
    </div>
  );
}

/* ─── Achievements Section ───────────────────────────────── */

function AchievementsSection() {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-[20px] font-bold text-white">Achievements & Awards</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#121212] border border-[#262626] rounded-full text-[13px] font-medium text-white hover:bg-[#1A1A1A] transition-colors shadow-sm">
          <Plus size={14} className="text-[#b19cd9]" /> Add Achievement
        </button>
      </div>

      <div className="rounded-xl border border-dashed border-[#262626] bg-[#0A0A0A] p-10 text-center">
        <Award size={24} className="mx-auto mb-3 text-[#3f3f46]" />
        <h3 className="text-[15px] font-semibold text-white mb-1">No Firestore achievements yet</h3>
        <p className="text-[13px] text-[#71717a]">Achievements will render here once saved for this user.</p>
      </div>
    </div>
  );
}
