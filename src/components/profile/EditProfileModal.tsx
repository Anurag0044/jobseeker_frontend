"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Camera, MapPin, Link as LinkIcon, User, Briefcase, Box } from "lucide-react";
import { uploadImageToCloudinary } from "../../lib/cloudinary";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: EditProfileFormData;
  onSave: (data: EditProfileFormData) => void | Promise<void>;
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

interface EditProfileFormData {
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
}

function EditProfileModalContent({ onClose, initialData, onSave }: Omit<EditProfileModalProps, "isOpen">) {
  const [activeTab, setActiveTab] = useState<TabType>("General");
  const [isSaving, setIsSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [error, setError] = useState("");

  // Form State
  const [formData, setFormData] = useState<EditProfileFormData>(initialData);

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-2xl bg-[#0A0A0A] border border-[#262626] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-[#1e1e1e] shrink-0 bg-gradient-to-r from-[#121212] to-[#0A0A0A]">
            <h2 className="text-[18px] font-semibold text-white tracking-tight">Edit Profile</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-[#121212] border border-[#262626] text-[#a1a1aa] hover:text-white hover:bg-[#1A1A1A] transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar Tabs */}
            <div className="w-[180px] shrink-0 border-r border-[#1e1e1e] bg-[#050505] p-4 flex flex-col gap-1 overflow-y-auto">
              {(["General", "Socials", "Skills", "Preferences"] as TabType[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-2 rounded-lg text-[13px] font-medium transition-all text-left flex items-center gap-2 ${
                    activeTab === tab
                      ? "bg-[#1e1a2e] text-[#b19cd9] border border-[#2a2440]"
                      : "text-[#a1a1aa] hover:bg-[#121212] hover:text-[#e5e2e1] border border-transparent"
                  }`}
                >
                  {tab === "General" && <User size={14} />}
                  {tab === "Socials" && <LinkIcon size={14} />}
                  {tab === "Skills" && <Box size={14} />}
                  {tab === "Preferences" && <Briefcase size={14} />}
                  {tab}
                </button>
              ))}
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6 bg-[#0A0A0A] custom-scrollbar relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col gap-6"
                >
                  {activeTab === "General" && (
                    <>
                      {/* Avatar Upload */}
                      <div className="flex items-center gap-6">
                        <div className="relative group cursor-pointer">
                          <div className="w-20 h-20 rounded-full border border-[#262626] bg-[#121212] overflow-hidden flex items-center justify-center">
                            {previewUrl || formData.photoURL ? (
                              <img src={previewUrl || formData.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-[24px] font-bold text-[#b19cd9]">{formData.displayName.charAt(0)}</span>
                            )}
                          </div>
                          <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                            <Camera size={20} className="text-white" />
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[14px] font-medium text-white mb-1">Profile Picture</span>
                          <span className="text-[12px] text-[#71717a] mb-3">JPG, GIF or PNG. Max size of 800K</span>
                          <div className="flex gap-2">
                            <label className="px-3 py-1.5 text-[12px] font-medium text-black bg-[#e5e2e1] rounded-md hover:bg-white transition-colors cursor-pointer">
                              Upload
                              <input type="file" accept="image/*" onChange={handleImageChange} className="sr-only" />
                            </label>
                            <button
                              type="button"
                              onClick={() => {
                                setImageFile(null);
                                setPreviewUrl("");
                                setFormData({ ...formData, photoURL: "" });
                              }}
                              className="px-3 py-1.5 text-[12px] font-medium text-black bg-[#e5e2e1] rounded-md hover:bg-white transition-colors"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* General Fields */}
                      <div className="grid grid-cols-1 gap-5 mt-2">
                        <div className="grid grid-cols-2 gap-4">
                          <InputField label="Display Name" name="displayName" value={formData.displayName} onChange={handleChange} onKeyDown={handleKeyDown} />
                          <InputField label="User ID (Username)" name="userId" value={formData.userId} onChange={handleChange} onKeyDown={handleKeyDown} icon={<span className="text-[#71717a] font-mono">@</span>} />
                        </div>
                        <InputField label="Professional Title" name="title" value={formData.title} onChange={handleChange} onKeyDown={handleKeyDown} />
                        
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[12px] font-medium text-[#a1a1aa]">Bio</label>
                          <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                            rows={3}
                            className="w-full bg-[#121212] border border-[#262626] rounded-lg px-3 py-2 text-[13px] text-white placeholder:text-[#71717a] outline-none focus:border-[#b19cd9] focus:bg-[#1A1A1A] transition-all resize-none custom-scrollbar"
                          />
                          <span className="text-[10px] text-[#71717a] self-end mt-1">240 characters remaining</span>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <InputField label="Location" name="location" value={formData.location} onChange={handleChange} icon={<MapPin size={14} className="text-[#71717a]" />} onKeyDown={handleKeyDown} />
                          <InputField label="Portfolio URL" name="portfolioUrl" value={formData.portfolioUrl} onChange={handleChange} icon={<LinkIcon size={14} className="text-[#71717a]" />} onKeyDown={handleKeyDown} />
                        </div>
                      </div>
                    </>
                  )}

                  {activeTab === "Socials" && (
                    <div className="flex flex-col gap-5">
                      <div className="bg-[#121212] p-4 rounded-xl border border-[#1e1e1e]">
                        <h3 className="text-[13px] font-medium text-white mb-1">Social Profiles</h3>
                        <p className="text-[12px] text-[#71717a] mb-5">Link your social profiles to increase your discoverability.</p>
                        
                        <div className="flex flex-col gap-4">
                          <InputField label="GitHub Profile" name="github" value={formData.github} onChange={handleChange} onKeyDown={handleKeyDown} />
                          <InputField label="LinkedIn Profile" name="linkedin" value={formData.linkedin} onChange={handleChange} onKeyDown={handleKeyDown} />
                          <InputField label="Twitter/X Profile" name="twitter" value={formData.twitter} onChange={handleChange} onKeyDown={handleKeyDown} />
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "Skills" && (
                    <div className="flex flex-col gap-4 items-center justify-center h-40">
                      <Box size={32} className="text-[#3f3f46] mb-2" />
                      <p className="text-[13px] text-[#a1a1aa]">Skill management interface coming soon.</p>
                      <button className="px-4 py-2 bg-[#1e1a2e] text-[#b19cd9] border border-[#2a2440] rounded-lg text-[12px] font-medium hover:bg-[#2a2440] transition-colors">
                        Auto-sync with GitHub
                      </button>
                    </div>
                  )}

                  {activeTab === "Preferences" && (
                    <div className="flex flex-col gap-4 items-center justify-center h-40">
                      <Briefcase size={32} className="text-[#3f3f46] mb-2" />
                      <p className="text-[13px] text-[#a1a1aa]">Job preferences & availability coming soon.</p>
                    </div>
                  )}

                  {error && (
                    <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-[12px] text-red-200">
                      {error}
                    </p>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#1e1e1e] bg-[#050505] shrink-0">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-[13px] font-medium text-[#a1a1aa] hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="relative px-5 py-2 rounded-lg text-[13px] font-medium text-black bg-[#e5e2e1] hover:bg-white transition-all overflow-hidden group disabled:opacity-70"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
              <span className="relative">{isSaving ? "Saving..." : "Save Changes"}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

// Helper component for sleek inputs
function InputField({
  label,
  name,
  value,
  onChange,
  onKeyDown,
  icon,
}: {
  label: string;
  name: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[12px] font-medium text-[#a1a1aa]">{label}</label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            {icon}
          </div>
        )}
        <input
          type="text"
          name={name}
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          className={`w-full bg-[#121212] border border-[#262626] rounded-lg py-2 text-[13px] text-white placeholder:text-[#71717a] outline-none focus:border-[#b19cd9] focus:bg-[#1A1A1A] transition-all ${
            icon ? "pl-9 pr-3" : "px-3"
          }`}
        />
      </div>
    </div>
  );
}
