"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search, Bell, MessageSquare, ChevronDown, Sun,
  LayoutDashboard, User, FolderGit2, Briefcase,
  Lightbulb, FileText, Bookmark, Bot, Settings,
  Crown, Box, UserPlus, ChevronRight, ArrowRight, ShieldCheck
} from "lucide-react";
import ForgeXLogo from "../../components/ui/ForgeXLogo";

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen w-full flex overflow-hidden font-body-sm text-body-sm antialiased bg-[#050505] text-[#e5e2e1]">
      <Sidebar />
      <main className="flex-1 flex flex-col h-full relative overflow-hidden bg-[#0A0A0A]">
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
];

const discoverItems = [
  { href: "/workspace/jobs", icon: Briefcase, label: "Jobs" },
  { href: "/workspace/companies", icon: Box, label: "Companies" },
  { href: "/workspace/communities", icon: UserPlus, label: "Communities" },
];

function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/workspace") return pathname === "/workspace";
    return pathname.startsWith(href);
  };

  return (
    <nav className="w-[260px] h-screen flex flex-col shrink-0 border-r border-[#1e1e1e] bg-[#0d0d0d] z-10 py-5">
      <div className="px-6 mb-8 flex items-center gap-3">
        <ForgeXLogo className="scale-90 origin-left" />
      </div>

      <div className="flex-1 overflow-y-auto px-3 custom-scrollbar">
        <div className="flex flex-col gap-0.5 mb-8">
          {navItems.map((item) => (
            <NavItem
              key={item.href}
              href={item.href}
              icon={<item.icon size={18} />}
              label={item.label}
              active={isActive(item.href)}
              badge={item.badge}
            />
          ))}
        </div>

        <div className="mb-3 px-3">
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#71717a]">Discover</span>
        </div>
        <div className="flex flex-col gap-0.5 mb-8">
          {discoverItems.map((item) => (
            <NavItem
              key={item.href}
              href={item.href}
              icon={<item.icon size={18} />}
              label={item.label}
              active={isActive(item.href)}
            />
          ))}
        </div>
      </div>

          <div className="flex flex-col gap-1 px-4 mt-auto">
            {/* Upgrade Banner */}
            <Link href="/workspace/upgrade" className="flex items-center gap-3 p-3 mb-2 rounded-xl bg-gradient-to-r from-[#1e1a2e] to-[#0A0A0A] border border-[#2a2440] hover:border-[#3f3f46] transition-colors group">
              <div className="w-8 h-8 rounded-lg bg-[#5e5ce6]/20 flex items-center justify-center text-[#b19cd9]">
                <Crown size={16} />
              </div>
              <div className="flex flex-col flex-1">
                <span className="text-[13px] font-semibold text-white">Upgrade to Pro</span>
                <span className="text-[10px] text-[#71717a]">Unlock advanced features</span>
              </div>
              <ArrowRight size={14} className="text-[#71717a] group-hover:text-white transition-colors" />
            </Link>

            <Link href="/workspace/settings" className="flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium text-[#a1a1aa] hover:text-[#e5e2e1] hover:bg-[#121212] transition-colors">
              <Settings size={18} className="text-[#71717a]" />
              Settings
            </Link>

            <Link href="/admin/users" className="flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium text-[#b19cd9] hover:text-[#c2c1ff] hover:bg-[#1e1a2e]/50 border border-transparent hover:border-[#2a2440] transition-colors mt-1">
              <ShieldCheck size={18} className="text-[#5e5ce6]" />
              Admin Panel
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
}

function NavItem({ href, icon, label, active, badge }: NavItemProps) {
  return (
    <Link
      href={href}
      className={`flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200 ${
        active
          ? "bg-[#1e1a2e] text-[#b19cd9] border border-[#2a2440]"
          : "text-[#a1a1aa] hover:text-white hover:bg-[#1A1A1A] border border-transparent"
      }`}
    >
      <div className="flex items-center gap-3">
        <span className={active ? "text-[#b19cd9]" : "opacity-80"}>{icon}</span>
        <span className="text-[13px] font-medium">{label}</span>
      </div>
      {badge && (
        <div className="bg-[#1e1a2e] text-[#b19cd9] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#2a2440]">
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
    <header className="h-16 flex items-center justify-between px-8 shrink-0 bg-[#0A0A0A] sticky top-0 z-20 border-b border-[#1e1e1e]">
      <div className="w-[360px] h-9 bg-[#121212] border border-[#1e1e1e] rounded-md flex items-center px-3 text-[#71717a] focus-within:border-[#3f3f46] transition-all">
        <Search size={16} className="mr-2 opacity-70" />
        <input
          type="text"
          placeholder="Search jobs, projects, skills..."
          className="bg-transparent border-none outline-none flex-1 text-[13px] text-white placeholder-[#71717a]"
        />
        <div className="flex items-center justify-center w-5 h-5 rounded bg-[#1e1e1e] text-[10px] font-mono ml-2 border border-[#262626]">
          ⌘K
        </div>
      </div>

      <div className="flex items-center gap-6">
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
            <span className="text-[13px] font-medium text-white group-hover:text-gray-200 transition-colors">
              {displayName}
            </span>
            <span className="text-[11px] text-[#a1a1aa]">View Profile</span>
          </div>
          <ChevronDown size={14} className="text-[#71717a] ml-1" />
        </div>
      </div>
    </header>
  );
}
