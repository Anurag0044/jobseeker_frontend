"use client";

import { Camera, Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { uploadImageToCloudinary } from "../../lib/cloudinary";
import { useForgeProfile } from "../../hooks/useForgeProfile";

export default function ProfileOnboardingModal() {
  const { displayProfile, needsOnboarding, saveProfile } = useForgeProfile();
  const [displayName, setDisplayName] = useState(displayProfile?.displayName || "");
  const [username, setUsername] = useState(displayProfile?.username || "");
  const [title, setTitle] = useState(displayProfile?.title || "Full Stack Developer");
  const [techStack, setTechStack] = useState((displayProfile?.techStack || []).join(", "));
  const [skills, setSkills] = useState((displayProfile?.skills || []).join(", "));
  const [linkedin, setLinkedin] = useState(displayProfile?.linkedin || "");
  const [github, setGithub] = useState(displayProfile?.github || "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const firstLetter = useMemo(() => {
    return (displayName || displayProfile?.displayName || "F").charAt(0).toUpperCase();
  }, [displayName, displayProfile?.displayName]);

  useEffect(() => {
    if (!needsOnboarding || !displayProfile) return;

    setTimeout(() => {
      setDisplayName((current) => current || displayProfile.displayName);
      setUsername((current) => current || displayProfile.username);
      setTitle((current) => current || displayProfile.title);
      setTechStack((current) => current || displayProfile.techStack.join(", "));
      setSkills((current) => current || displayProfile.skills.join(", "));
      setLinkedin((current) => current || displayProfile.linkedin);
      setGithub((current) => current || displayProfile.github);
    }, 0);
  }, [displayProfile, needsOnboarding]);

  if (!needsOnboarding || !displayProfile) return null;

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setIsSaving(true);

    try {
      let photoURL = displayProfile.photoURL;
      if (imageFile) {
        const upload = await uploadImageToCloudinary(imageFile);
        photoURL = upload.secure_url;
      }

      await saveProfile({
        displayName,
        username,
        title,
        techStack,
        skills,
        linkedin,
        github,
        photoURL,
      });
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to save your profile.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
      <form
        onSubmit={handleSave}
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar rounded-2xl border border-[#262626] bg-[#0A0A0A] shadow-2xl"
      >
        <div className="border-b border-[#1e1e1e] px-6 py-5 bg-gradient-to-r from-[#121212] to-[#0A0A0A]">
          <h2 className="text-[20px] font-semibold text-white tracking-tight">Complete your Forge X profile</h2>
          <p className="text-[13px] text-[#a1a1aa] mt-1">
            These details power your realtime profile, recommendations, communities, and AI assistant context.
          </p>
        </div>

        <div className="p-6 flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row gap-5 sm:items-center">
            <label className="relative w-24 h-24 rounded-full border border-[#262626] bg-[#121212] flex items-center justify-center overflow-hidden cursor-pointer shrink-0 group">
              {previewUrl || displayProfile.photoURL ? (
                <img
                  src={previewUrl || displayProfile.photoURL}
                  alt="Profile preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-[32px] font-bold text-[#b19cd9]">{firstLetter}</span>
              )}
              <span className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera size={22} className="text-white" />
              </span>
              <input type="file" accept="image/*" onChange={handleImageChange} className="sr-only" />
            </label>
            <div>
              <h3 className="text-[15px] font-semibold text-white mb-1">Display picture</h3>
              <p className="text-[12px] text-[#71717a] max-w-[448px]">
                Upload a profile image. It will be stored in Cloudinary and linked to your Firestore profile.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ProfileInput label="Username" value={username} onChange={setUsername} required prefix="@" />
            <ProfileInput label="Display Name" value={displayName} onChange={setDisplayName} required />
          </div>

          <ProfileInput label="Headline" value={title} onChange={setTitle} placeholder="Full Stack Developer" />
          <ProfileInput label="Tech Stack" value={techStack} onChange={setTechStack} placeholder="React, Next.js, Firebase" />
          <ProfileInput label="Skills" value={skills} onChange={setSkills} placeholder="Frontend, AI Agents, System Design" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ProfileInput label="LinkedIn Account" value={linkedin} onChange={setLinkedin} placeholder="https://linkedin.com/in/..." />
            <ProfileInput label="GitHub Account" value={github} onChange={setGithub} placeholder="https://github.com/..." />
          </div>

          {error && (
            <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-[12px] text-red-200">
              {error}
            </p>
          )}
        </div>

        <div className="flex justify-end gap-3 border-t border-[#1e1e1e] bg-[#050505] px-6 py-4">
          <button
            type="submit"
            disabled={isSaving || !username.trim() || !displayName.trim()}
            className="min-w-[140px] rounded-lg bg-[#e5e2e1] px-5 py-2 text-[13px] font-semibold text-black hover:bg-white transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {isSaving && <Loader2 size={15} className="animate-spin" />}
            {isSaving ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </form>
    </div>
  );
}

function ProfileInput({
  label,
  value,
  onChange,
  placeholder,
  required,
  prefix,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  prefix?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[12px] font-medium text-[#a1a1aa]">{label}</span>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-[#71717a]">
            {prefix}
          </span>
        )}
        <input
          type="text"
          required={required}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className={`w-full rounded-lg border border-[#262626] bg-[#121212] py-2 text-[13px] text-white outline-none transition-all placeholder:text-[#71717a] focus:border-[#b19cd9] focus:bg-[#1A1A1A] ${
            prefix ? "pl-8 pr-3" : "px-3"
          }`}
        />
      </div>
    </label>
  );
}
