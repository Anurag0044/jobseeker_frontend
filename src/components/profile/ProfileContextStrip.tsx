"use client";

import { Mail, Sparkles } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { useForgeProfile } from "../../hooks/useForgeProfile";

export default function ProfileContextStrip({ label = "Realtime Profile Context" }: { label?: string }) {
  const { displayProfile, loading } = useForgeProfile();

  if (loading || !displayProfile) {
    return (
      <div className="h-[92px] rounded-xl border border-[#1e1e1e] bg-[#121212] animate-pulse" />
    );
  }

  const name = displayProfile.displayName || "Forge User";
  const initial = name.charAt(0).toUpperCase();
  const stack = displayProfile.techStack.length ? displayProfile.techStack : ["Add tech stack"];
  const skills = displayProfile.skills.length ? displayProfile.skills : ["Add skills"];

  return (
    <section className="rounded-xl border border-[#1e1e1e] bg-[#121212] p-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-14 h-14 rounded-full overflow-hidden border border-[#262626] bg-[#0A0A0A] flex items-center justify-center shrink-0">
            {displayProfile.photoURL ? (
              <img src={displayProfile.photoURL} alt={name} className="h-full w-full object-cover" />
            ) : (
              <span className="text-[20px] font-semibold text-[#b19cd9]">{initial}</span>
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={14} className="text-[#b19cd9] shrink-0" />
              <span className="text-[11px] uppercase tracking-widest text-[#71717a]">{label}</span>
            </div>
            <h2 className="text-[16px] font-semibold text-white truncate">{name}</h2>
            <p className="text-[12px] text-[#a1a1aa] truncate">
              @{displayProfile.username || "forge_user"} • {displayProfile.title || "Developer"} • {displayProfile.location || "Worldwide"}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 lg:justify-end">
          {[...stack, ...skills].slice(0, 7).map((item) => (
            <span key={item} className="rounded-md border border-[#262626] bg-[#1A1A1A] px-2 py-1 text-[11px] text-[#a1a1aa]">
              {item}
            </span>
          ))}
          {displayProfile.github && <SocialPill icon={<FaGithub size={12} />} text="GitHub" />}
          {displayProfile.linkedin && <SocialPill icon={<FaLinkedin size={12} />} text="LinkedIn" />}
          {displayProfile.email && <SocialPill icon={<Mail size={12} />} text={displayProfile.email} />}
        </div>
      </div>
    </section>
  );
}

function SocialPill({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <span className="flex items-center gap-1.5 rounded-md border border-[#2a2440] bg-[#1e1a2e] px-2 py-1 text-[11px] text-[#c2c1ff]">
      {icon}
      {text}
    </span>
  );
}
