"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Bell, MessageSquare, ChevronDown, Sun,
  LayoutDashboard, User, FolderGit2, Briefcase,
  Lightbulb, FileText, Bookmark, Bot, Settings,
  Crown, Box, UserPlus, ChevronRight, ArrowRight, ShieldCheck
} from "lucide-react";
import ForgeXLogo from "../../components/ui/ForgeXLogo";

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen w-full flex overflow-hidden font-body-sm text-body-sm antialiased bg-[#050505] bg-aurora text-[#e5e2e1] p-4 gap-4">
      <Sidebar />
      <main className="flex-1 flex flex-col h-full relative overflow-hidden bg-[#0A0A0A]/90 backdrop-blur-3xl rounded-[32px] border border-white/5 shadow-2xl">
        <TopBar />
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </main>
    </div>
  );
}

/* ─── Sidebar ──────────────────────────────────────────────── */

const navItems = [
  { href: "/workspace/profile", icon: User, label: "Profile" },
  { href: "/workspace/projects", icon: FolderGit2, label: "Projects" },
  { href: "/workspace/skills", icon: Lightbulb, label: "Skills" },
  { href: "/workspace/applications", icon: FileText, label: "Applications" },
  { href: "/workspace/messages", icon: MessageSquare, label: "Messages", badge: "3" },
  { href: "/workspace/saved", icon: Bookmark, label: "Saved" },
  { href: "/workspace/ai-agents", icon: Bot, label: "Forge Assistant" },
  { href: "/workspace/jobs", icon: Briefcase, label: "Jobs" },
  { href: "/workspace/companies", icon: Box, label: "Companies" },
  { href: "/workspace/communities", icon: UserPlus, label: "Communities" },
  { href: "/workspace/settings", icon: Settings, label: "Settings" },
  { href: "/admin/users", icon: ShieldCheck, label: "Admin Panel" },
];

function Sidebar() {
  const pathname = usePathname();
  const [hoveredHref, setHoveredHref] = React.useState<string | null>(null);

  const isActive = (href: string) => {
    if (href === "/workspace") return pathname === "/workspace";
    return pathname.startsWith(href);
  };

  return (
    <nav
      className="w-[280px] h-full flex flex-col shrink-0 bg-[#0d0d0d]/40 backdrop-blur-3xl border border-white/5 rounded-[32px] shadow-2xl z-10 py-5 overflow-hidden relative"
      onMouseLeave={() => setHoveredHref(null)}
    >
      <div className="flex items-center justify-between px-8 mb-6 mt-1">
        <ForgeXLogo className="scale-90 origin-left" />
        <div className="w-6 h-6 rounded-full border border-white/10 flex items-center justify-center bg-white/5 text-white/50 hover:text-white transition-colors cursor-pointer">
          <ChevronDown size={12} className="rotate-90" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 custom-scrollbar">
        <div className="flex flex-col gap-0.5 mb-2">
          {navItems.map((item) => (
            <NavItem
              key={item.href}
              href={item.href}
              icon={<item.icon size={18} />}
              label={item.label}
              active={isActive(item.href)}
              badge={item.badge}
              isHovered={hoveredHref === item.href}
              onHover={() => setHoveredHref(item.href)}
            />
          ))}
        </div>


      </div>

      <div className="flex flex-col gap-1 px-4 mt-auto">
        {/* Upgrade Banner */}
        <Link href="/workspace/upgrade" className="flex items-center gap-3 p-2.5 rounded-xl bg-gradient-to-r from-[#1e1a2e] to-[#0A0A0A] border border-[#2a2440] hover:border-[#3f3f46] transition-colors group">
          <div className="w-8 h-8 rounded-lg bg-[#5e5ce6]/20 flex items-center justify-center text-[#b19cd9] shrink-0">
            <Crown size={16} />
          </div>
          <div className="flex flex-col flex-1">
            <span className="text-[14px] font-semibold text-white">Upgrade to Pro</span>
            <span className="text-[12px] text-[#71717a]">Unlock advanced features</span>
          </div>
          <ArrowRight size={14} className="text-[#71717a] group-hover:text-white transition-colors shrink-0" />
        </Link>
      </div>
    </nav>
  );
}

/* ─── NavItem ──────────────────────────────────────────────── */

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  badge?: string;
  iconAnim?: string;
  isHovered: boolean;
  onHover: () => void;
}

function NavItem({ href, icon, label, active, badge, iconAnim, isHovered, onHover }: NavItemProps) {
  return (
    <Link
      href={href}
      onMouseEnter={onHover}
      className={`relative flex items-center justify-between p-[4px] px-3 mb-0.5 rounded-full transition-all duration-300 group overflow-hidden ${active
        ? "bg-white/[0.04] backdrop-blur-md shadow-[inset_0_1px_2px_rgba(255,255,255,0.1),0_8px_16px_rgba(0,0,0,0.2)] text-white"
        : "text-[#71717a] hover:text-[#e5e2e1]"
        }`}
    >
      {/* 1. Static border for active item */}
      {active && <div className="absolute inset-0 rounded-full border border-white/[0.04] pointer-events-none" />}

      {/* 2. Animated Edge Glow for active item */}
      {active && (
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            padding: "1px",
            mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            maskComposite: "exclude",
            WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
          }}
        >
          <div className="absolute top-1/2 left-1/2 w-[200%] aspect-square -translate-x-1/2 -translate-y-1/2">
            <div
              className="w-full h-full animate-spin"
              style={{
                animationDuration: "3s",
                background: `conic-gradient(from 0deg, transparent 0%, rgba(255,255,255,0.7) 15%, transparent 30%)`,
              }}
            />
          </div>
        </div>
      )}

      {/* 3. Gliding Hover Glass Pill */}
      <AnimatePresence>
        {isHovered && !active && (
          <motion.div
            layoutId="sidebar-glass-pill"
            className="absolute inset-0 rounded-full -z-10 realistic-glass-pill"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 30,
              mass: 0.8
            }}
          />
        )}
      </AnimatePresence>

      <div className="flex items-center gap-4 relative z-10 pl-2">
        <span className={`flex items-center justify-center transition-all duration-300 ${active ? "text-[#b19cd9]" : "text-[#71717a] group-hover:text-[#b19cd9]"} ${iconAnim || ""}`}>
          {icon}
        </span>
        <span className={`text-[15px] tracking-wide py-1.5 ${active ? "font-semibold" : "font-medium"}`}>
          {label}
        </span>
      </div>

      {badge && !active && (
        <div className="bg-[#b19cd9]/10 text-[#b19cd9] text-[13px] font-bold px-2 py-0.5 rounded-full border border-[#b19cd9]/20 relative z-10 mr-2">
          {badge}
        </div>
      )}
    </Link>
  );
}

/* ─── TopBar ───────────────────────────────────────────────── */

import { useUser } from "../../hooks/useUser";

function TopBar() {
  const { user } = useUser();

  const displayName = user?.displayName || "Forge User";
  const firstLetter = displayName.charAt(0).toUpperCase();

  return (
    <header className="h-16 flex items-center justify-between px-8 shrink-0 bg-[#0A0A0A]/70 backdrop-blur-xl sticky top-0 z-20 border-b border-white/5 relative">
      <div className="flex-1"></div>

      <div
        className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-[360px] h-9 real-glass-search flex items-center px-4 text-[#71717a] transition-all group"
        style={{ left: 'calc(50% - 130px)' }}
      >
        <Search size={16} className="mr-2 opacity-70 group-active:scale-75 group-focus-within:rotate-12 transition-transform duration-300" />
        <input
          type="text"
          placeholder="Search jobs, projects, skills..."
          className="bg-transparent border-none outline-none flex-1 text-[13px] text-white placeholder-[#71717a]"
        />
      </div>

      <div className="flex-1 flex items-center justify-end gap-6">
        <div className="flex items-center gap-4">
          <button className="text-[#a1a1aa] hover:text-white transition-colors">
            <Sun size={18} />
          </button>
          <button className="text-[#a1a1aa] hover:text-white transition-colors relative">
            <Bell size={18} />
            <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-[#b19cd9] rounded-full"></span>
          </button>
          <button className="text-[#a1a1aa] hover:text-white transition-colors">
            <MessageSquare size={18} />
          </button>
        </div>

        <div className="h-6 w-px bg-[#1e1e1e]"></div>

        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="w-8 h-8 rounded-full overflow-hidden border border-[#262626] bg-[#1A1A1A] flex items-center justify-center">
            {user?.photoURL ? (
              <img src={user.photoURL} alt={displayName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[13px] font-semibold text-[#b19cd9]">
                {firstLetter}
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-[14px] font-medium text-white group-hover:text-gray-200 transition-colors">
              {displayName}
            </span>
            <span className="text-[13px] text-[#a1a1aa]">View Profile</span>
          </div>
          <ChevronDown size={14} className="text-[#71717a] ml-1" />
        </div>
      </div>
    </header>
  );
}
