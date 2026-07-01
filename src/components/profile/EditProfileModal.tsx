"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Camera, MapPin, Link as LinkIcon, User, Briefcase, Box,
  Search, Check, Trash2, Globe, Info, Sparkles
} from "lucide-react";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import { uploadImageToCloudinary } from "../../lib/cloudinary";
import { skillsData } from "../../data/skillsData";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: EditProfileFormData;
  onSave: (data: EditProfileFormData) => void | Promise<void>;
}

export interface EditProfileFormData {
  displayName: string;
  userId: string;
  title: string;
  bio: string;
  location: string;
  portfolioUrl: string;
  github: string;
  linkedin: string;
  twitter: string;
  photoURL: string;
  techStack: string[];
  skills: string[];
  availability?: string;
  workMode?: string;
  jobType?: string;
  expectedSalary?: string;
}

type TabType = "General" | "Socials" | "Skills" | "Preferences";

export default function EditProfileModal({ isOpen, onClose, initialData, onSave }: EditProfileModalProps) {
  if (!isOpen) return null;

  return (
    <EditProfileModalContent
      key={`${initialData.userId}-${initialData.photoURL}`}
      onClose={onClose}
      initialData={initialData}
      onSave={onSave}
    />
  );
}

function EditProfileModalContent({ onClose, initialData, onSave }: Omit<EditProfileModalProps, "isOpen">) {
  const [activeTab, setActiveTab] = useState<TabType>("General");
  const [isSaving, setIsSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [error, setError] = useState("");
  const [skillSearchQuery, setSkillSearchQuery] = useState("");

  // Form State
  const [formData, setFormData] = useState<EditProfileFormData>({
    ...initialData,
    techStack: initialData.techStack || [],
    skills: initialData.skills || [],
    availability: initialData.availability || "Open to work",
    workMode: initialData.workMode || "Remote",
    jobType: initialData.jobType || "Full-time",
    expectedSalary: initialData.expectedSalary || "",
  });

  const allSelectedSkills = useMemo(() => {
    return Array.from(new Set([...formData.skills, ...formData.techStack]));
  }, [formData.skills, formData.techStack]);

  const handleSave = async () => {
    setIsSaving(true);
    setError("");

    try {
      let photoURL = formData.photoURL || "";
      if (imageFile) {
        const upload = await uploadImageToCloudinary(imageFile);
        photoURL = upload.secure_url;
      }

      await onSave({ ...formData, photoURL });
      setIsSaving(false);
      onClose();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to save your profile.");
      setIsSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectPreference = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && activeTab !== "Skills") {
      e.preventDefault();
      handleSave();
    }
  };

  const handleToggleSkill = (skillName: string) => {
    const isCurrentlySelected = allSelectedSkills.includes(skillName);
    let nextSkillsList: string[];

    if (isCurrentlySelected) {
      nextSkillsList = allSelectedSkills.filter((s) => s !== skillName);
    } else {
      nextSkillsList = [...allSelectedSkills, skillName];
    }

    // Keep both synced for compatibility
    setFormData({
      ...formData,
      skills: nextSkillsList,
      techStack: nextSkillsList.filter((name) =>
        skillsData.some((item) => item.name === name)
      ),
    });
  };

  const filteredSkills = useMemo(() => {
    if (!skillSearchQuery) return skillsData.slice(0, 9); // Show top skills by default
    return skillsData.filter((s) => s.name.toLowerCase().includes(skillSearchQuery.toLowerCase()));
  }, [skillSearchQuery]);

  const tabs = [
    { id: "General", label: "General", icon: User },
    { id: "Socials", label: "Socials", icon: LinkIcon },
    { id: "Skills", label: "Skills", icon: Box },
    { id: "Preferences", label: "Preferences", icon: Briefcase },
  ] as const;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop - High-fidelity Apple style blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-[8px]"
        />

        {/* Modal Container - Matches the Profile Page's Frosted Glassmorphism Theme */}
        <motion.div
          initial={{ scale: 0.96, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.96, opacity: 0, y: 10 }}
          transition={{ type: "spring", damping: 25, stiffness: 320 }}
          className="relative w-full max-w-[480px] border rounded-[20px] overflow-hidden flex flex-col max-h-[85vh] z-10"
          style={{
            background: 'linear-gradient(135deg, rgba(22, 28, 45, 0.75) 0%, rgba(10, 14, 26, 0.6) 100%)',
            backdropFilter: 'blur(30px) saturate(150%)',
            WebkitBackdropFilter: 'blur(30px) saturate(150%)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: `
              inset 0 1px 1px rgba(255, 255, 255, 0.12),
              inset 0 -1px 1px rgba(0, 0, 0, 0.5),
              0 24px 60px rgba(0, 0, 0, 0.7)
            `,
          }}
        >
          {/* Header - Sleek Minimalist */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06] shrink-0">
            <div>
              <h2 className="text-[16px] font-bold text-white tracking-tight flex items-center gap-1.5">
                Edit Profile
                <span className="text-[#b19cd9]">
                  <Sparkles size={13} className="animate-pulse" />
                </span>
              </h2>
              <p className="text-[10px] text-slate-400 mt-0.5">Customize your digital identity and preferences.</p>
            </div>
            <button
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all active:scale-95"
            >
              <X size={13} />
            </button>
          </div>

          {/* Horizontal Segmented Control Tab List (iOS Style) */}
          <div className="px-5 py-2 border-b border-white/[0.06] bg-black/15 shrink-0">
            <div className="bg-black/30 p-0.5 rounded-xl border border-white/5 flex gap-0.5 w-full relative">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 relative flex items-center justify-center gap-1 py-1 px-2 rounded-lg text-[11.5px] font-medium transition-all ${
                      isActive ? "text-white" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeTabPill"
                        className="absolute inset-0 bg-[#1e1a2e]/90 border border-[#b19cd9]/25 rounded-lg shadow-sm"
                        transition={{ type: "spring", stiffness: 450, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-1">
                      <Icon size={12} className={isActive ? "text-[#b19cd9]" : "text-slate-550"} />
                      {tab.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-5 custom-scrollbar relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.12 }}
                className="flex flex-col gap-4.5"
              >
                {activeTab === "General" && (
                  <>
                    {/* Avatar Upload (Apple iCloud Style) */}
                    <div className="flex items-center gap-4 p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                      <div className="relative group cursor-pointer w-16 h-16 rounded-full border border-white/10 bg-black/45 overflow-hidden flex items-center justify-center shadow-inner shrink-0">
                        {previewUrl || formData.photoURL ? (
                          <img src={previewUrl || formData.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-[24px] font-bold text-[#b19cd9]">
                            {formData.displayName ? formData.displayName.charAt(0).toUpperCase() : "F"}
                          </span>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="absolute inset-0 opacity-0 cursor-pointer z-20"
                        />
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                          <Camera size={15} className="text-white" />
                        </div>
                      </div>

                      <div className="flex flex-col">
                        <span className="text-[12.5px] font-semibold text-white">Profile Photo</span>
                        <span className="text-[10px] text-slate-400 mt-0.5">JPG or PNG. Max size 800KB.</span>
                        <div className="flex gap-2 mt-2.5">
                          <label className="px-3 py-1.5 text-[10.5px] font-semibold text-black bg-white rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer shadow-sm active:scale-95">
                            Upload Photo
                            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                          </label>
                          {(previewUrl || formData.photoURL) && (
                            <button
                              type="button"
                              onClick={() => {
                                setImageFile(null);
                                setPreviewUrl("");
                                setFormData({ ...formData, photoURL: "" });
                              }}
                              className="px-3 py-1.5 text-[10.5px] font-semibold text-white bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all flex items-center gap-1 active:scale-95"
                            >
                              <Trash2 size={11} className="text-red-400" />
                              Remove
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* General Fields Stack */}
                    <div className="flex flex-col gap-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <PremiumInput
                          label="Display Name"
                          name="displayName"
                          value={formData.displayName}
                          onChange={handleChange}
                          onKeyDown={handleKeyDown}
                          placeholder="Your full name"
                          icon={User}
                        />
                        <PremiumInput
                          label="Username"
                          name="userId"
                          value={formData.userId}
                          onChange={handleChange}
                          onKeyDown={handleKeyDown}
                          placeholder="username"
                          prefix="@"
                        />
                      </div>

                      <PremiumInput
                        label="Professional Title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        placeholder="e.g. Senior Frontend Engineer"
                        icon={Briefcase}
                      />

                      {/* Bio Area */}
                      <div className="flex flex-col gap-1.5">
                        <div className="flex justify-between items-center">
                          <label className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Bio</label>
                          <span className="text-[9px] text-slate-500 font-mono">
                            {240 - (formData.bio?.length || 0)} char remaining
                          </span>
                        </div>
                        <textarea
                          name="bio"
                          value={formData.bio}
                          onChange={handleChange}
                          onKeyDown={handleKeyDown}
                          maxLength={240}
                          rows={2}
                          placeholder="Write a short summary about yourself..."
                          className="w-full bg-black/25 border border-white/10 rounded-xl px-3 py-2 text-[12.5px] text-white placeholder:text-slate-600 outline-none transition-all focus:border-[#b19cd9]/45 focus:bg-black/40 focus:ring-4 focus:ring-[#b19cd9]/10 resize-none custom-scrollbar"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <PremiumInput
                          label="Location"
                          name="location"
                          value={formData.location}
                          onChange={handleChange}
                          placeholder="e.g. San Francisco, CA"
                          icon={MapPin}
                        />
                        <PremiumInput
                          label="Portfolio URL"
                          name="portfolioUrl"
                          value={formData.portfolioUrl}
                          onChange={handleChange}
                          placeholder="e.g. portfolio.dev"
                          icon={Globe}
                        />
                      </div>
                    </div>
                  </>
                )}

                {activeTab === "Socials" && (
                  <div className="flex flex-col gap-4">
                    <div className="bg-white/[0.01] p-3 rounded-xl border border-white/5 flex gap-3 items-start">
                      <div className="p-1.5 bg-[#b19cd9]/10 text-[#b19cd9] rounded-lg shrink-0">
                        <Info size={14} />
                      </div>
                      <div>
                        <h3 className="text-[12px] font-semibold text-white">Social Connections</h3>
                        <p className="text-[10.5px] text-slate-400 mt-0.5 leading-relaxed">
                          Link your profiles to showcase your presence across the developer ecosystem.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-4 bg-white/[0.01] border border-white/5 p-4 rounded-xl">
                      <PremiumInput
                        label="GitHub Profile"
                        name="github"
                        value={formData.github}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        placeholder="https://github.com/username"
                        icon={FaGithub}
                      />
                      <PremiumInput
                        label="LinkedIn Profile"
                        name="linkedin"
                        value={formData.linkedin}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        placeholder="https://linkedin.com/in/username"
                        icon={FaLinkedin}
                      />
                      <PremiumInput
                        label="Twitter / X Profile"
                        name="twitter"
                        value={formData.twitter}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        placeholder="https://x.com/username"
                        icon={FaTwitter}
                      />
                    </div>
                  </div>
                )}

                {activeTab === "Skills" && (
                  <div className="flex flex-col gap-4">
                    {/* Selected Skills Section */}
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 tracking-wider uppercase block mb-1.5">
                        Selected Skills ({allSelectedSkills.length})
                      </label>
                      <div className="flex flex-wrap gap-1.5 p-2.5 bg-black/25 border border-white/10 rounded-xl min-h-[44px]">
                        {allSelectedSkills.map((skillName) => {
                          const skillInfo = skillsData.find((s) => s.name === skillName);
                          return (
                            <button
                              key={skillName}
                              type="button"
                              onClick={() => handleToggleSkill(skillName)}
                              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold text-white bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/15 transition-all shadow-sm active:scale-95"
                            >
                              {skillInfo && (
                                <skillInfo.icon
                                  size={11}
                                  style={{ color: skillInfo.color }}
                                />
                              )}
                              <span>{skillName}</span>
                              <X size={9} className="text-slate-400 ml-0.5 hover:text-white" />
                            </button>
                          );
                        })}
                        {allSelectedSkills.length === 0 && (
                          <span className="text-[11px] text-slate-500 italic p-1">No skills selected. Use the search to add skills below.</span>
                        )}
                      </div>
                    </div>

                    {/* Skill Search & Select Grid */}
                    <div className="flex flex-col gap-2.5">
                      <div className="relative">
                        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                          type="text"
                          value={skillSearchQuery}
                          onChange={(e) => setSkillSearchQuery(e.target.value)}
                          placeholder="Search skills (e.g. React, Python)..."
                          className="w-full bg-black/25 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-[12px] text-white placeholder:text-slate-600 outline-none transition-all focus:border-[#b19cd9]/45"
                        />
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-[180px] overflow-y-auto custom-scrollbar p-0.5">
                        {filteredSkills.map((skill) => {
                          const isSelected = allSelectedSkills.includes(skill.name);
                          return (
                            <button
                              key={skill.name}
                              type="button"
                              onClick={() => handleToggleSkill(skill.name)}
                              className={`flex items-center justify-between p-2 rounded-lg border text-left transition-all ${
                                isSelected
                                  ? "bg-[#b19cd9]/10 border-[#b19cd9]/50 shadow-[0_0_10px_rgba(177,156,217,0.08)]"
                                  : "bg-black/25 border-white/5 hover:border-white/10 hover:bg-black/40"
                              }`}
                            >
                              <div className="flex items-center gap-1.5 min-w-0">
                                <skill.icon
                                  size={13}
                                  style={{ color: isSelected ? skill.color : "#71717a" }}
                                  className="shrink-0"
                                />
                                <span className={`text-[11.5px] font-medium truncate ${isSelected ? "text-white" : "text-slate-350"}`}>
                                  {skill.name}
                                </span>
                              </div>
                              {isSelected && <Check size={11} className="text-[#b19cd9] shrink-0" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "Preferences" && (
                  <div className="flex flex-col gap-4">
                    {/* Availability Selection (Cards Group) */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Availability</label>
                      <div className="grid grid-cols-3 gap-2">
                        {["Open to work", "Open to offers", "Not looking"].map((option) => {
                          const isSelected = formData.availability === option;
                          return (
                            <button
                              key={option}
                              type="button"
                              onClick={() => handleSelectPreference("availability", option)}
                              className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-0.5 ${
                                isSelected
                                  ? "bg-[#b19cd9]/10 border-[#b19cd9]/60 shadow-[0_0_10px_rgba(177,156,217,0.1)] text-white"
                                  : "bg-black/25 border-white/5 text-slate-400 hover:text-slate-200 hover:border-white/10"
                              }`}
                            >
                              <span className="text-[11.5px] font-semibold">{option}</span>
                              <span className="text-[8.5px] text-slate-500">
                                {option === "Open to work" && "Active search"}
                                {option === "Open to offers" && "Passive search"}
                                {option === "Not looking" && "Satisfied"}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Segmented control rows for Work Mode and Job Type */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Work Mode */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Work Mode</label>
                        <div className="bg-black/30 p-0.5 border border-white/5 rounded-xl flex">
                          {["Remote", "Hybrid", "On-site"].map((mode) => {
                            const isSelected = formData.workMode === mode;
                            return (
                              <button
                                key={mode}
                                type="button"
                                onClick={() => handleSelectPreference("workMode", mode)}
                                className={`flex-1 py-1.5 text-[11px] font-medium rounded-lg relative transition-all ${
                                  isSelected ? "text-white" : "text-slate-450 hover:text-slate-300"
                                }`}
                              >
                                {isSelected && (
                                  <motion.div
                                    layoutId="activeWorkMode"
                                    className="absolute inset-0 bg-[#1e1a2e]/90 border border-[#b19cd9]/25 rounded-lg shadow-sm"
                                    transition={{ type: "spring", stiffness: 450, damping: 30 }}
                                  />
                                )}
                                <span className="relative z-10">{mode}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Job Type */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Job Type</label>
                        <div className="bg-black/30 p-0.5 border border-white/5 rounded-xl flex">
                          {["Full-time", "Part-time", "Contract"].map((type) => {
                            const isSelected = formData.jobType === type;
                            return (
                              <button
                                key={type}
                                type="button"
                                onClick={() => handleSelectPreference("jobType", type)}
                                className={`flex-1 py-1.5 text-[11px] font-medium rounded-lg relative transition-all ${
                                  isSelected ? "text-white" : "text-slate-450 hover:text-slate-300"
                                }`}
                              >
                                {isSelected && (
                                  <motion.div
                                    layoutId="activeJobType"
                                    className="absolute inset-0 bg-[#1e1a2e]/90 border border-[#b19cd9]/25 rounded-lg shadow-sm"
                                    transition={{ type: "spring", stiffness: 450, damping: 30 }}
                                  />
                                )}
                                <span className="relative z-10">{type}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Salary expectations */}
                    <div className="bg-black/25 border border-white/5 p-3 rounded-xl flex items-center justify-between">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[12px] font-semibold text-white">Expected Salary</span>
                        <span className="text-[10px] text-slate-400">Target annual salary.</span>
                      </div>
                      <div className="relative w-36">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-[12px] select-none font-mono">$</span>
                        <input
                          type="text"
                          name="expectedSalary"
                          value={formData.expectedSalary}
                          onChange={handleChange}
                          placeholder="e.g. 120,000"
                          className="w-full bg-black/30 border border-white/10 rounded-xl py-1.5 pl-6 pr-3 text-[12px] text-white text-right placeholder:text-slate-700 outline-none transition-all focus:border-[#b19cd9]/50"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {error && (
                  <p className="rounded-xl border border-red-500/20 bg-red-500/5 px-3 py-2 text-[11px] text-red-200">
                    {error}
                  </p>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer - Matches background button styles */}
          <div className="flex items-center justify-end gap-2.5 px-5 py-3 border-t border-white/[0.06] bg-black/15 shrink-0">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-xl text-[12px] font-semibold text-slate-450 hover:text-white hover:bg-white/5 active:scale-95 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4.5 py-1.5 rounded-xl text-[12px] font-bold text-white transition-all disabled:opacity-75 flex items-center gap-1 active:scale-95 shadow-[0_4px_15px_rgba(139,92,246,0.3)] hover:scale-[1.02] cursor-pointer"
              style={{
                background: 'linear-gradient(90deg, #818cf8, #c084fc)'
              }}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

// Sleek Input Helper
function PremiumInput({
  label,
  name,
  value,
  onChange,
  onKeyDown,
  placeholder,
  prefix,
  icon: Icon,
}: {
  label: string;
  name: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
  placeholder?: string;
  prefix?: string;
  icon?: React.ComponentType<any>;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">{label}</label>
      <div className="relative group">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#b19cd9] transition-colors">
            <Icon size={13} />
          </div>
        )}
        {prefix && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-550 font-mono text-[12px] select-none">
            {prefix}
          </div>
        )}
        <input
          type="text"
          name={name}
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          className={`w-full bg-black/25 border border-white/10 rounded-xl py-2 text-[12.5px] text-white placeholder:text-slate-600 outline-none transition-all focus:border-[#b19cd9]/45 focus:bg-black/40 focus:ring-4 focus:ring-[#b19cd9]/10 ${
            Icon ? "pl-9" : prefix ? "pl-7" : "px-3.5"
          } pr-3.5`}
        />
      </div>
    </div>
  );
}
