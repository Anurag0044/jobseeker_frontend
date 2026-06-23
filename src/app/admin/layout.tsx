"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, Building2, Users2, BarChart2, ShieldCheck,
  ShieldAlert, ToggleLeft, Activity, Bot, FileText, Settings, Lock, Blocks,
  Search, Sun, Bell, MessageSquare, ChevronLeft, ChevronRight, ActivitySquare
} from "lucide-react";
import ForgeXLogo from "@/components/ui/ForgeXLogo";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-full bg-[#050505] overflow-hidden">
      {/* SIDEBAR */}
      <AdminSidebar />

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopBar />
        <main className="flex-1 overflow-y-auto custom-scrollbar relative">
          {children}
        </main>
      </div>
    </div>
  );
}

function AdminSidebar() {
  const pathname = usePathname();

  const isCurrent = (path: string) => pathname?.includes(path);

  const sections = [
    {
      title: "CONTROL CENTER",
      items: [
        { href: "/admin/overview", icon: LayoutDashboard, label: "Overview" },
        { href: "/admin/users", icon: Users, label: "Users" },
        { href: "/admin/companies", icon: Building2, label: "Companies" },
        { href: "/admin/communities", icon: Users2, label: "Communities" },
        { href: "/admin/reports", icon: BarChart2, label: "Reports" },
        { href: "/admin/verification", icon: ShieldCheck, label: "Verification" },
      ]
    },
    {
      title: "SYSTEM",
      items: [
        { href: "/admin/moderation", icon: ShieldAlert, label: "Moderation" },
        { href: "/admin/feature-flags", icon: ToggleLeft, label: "Feature Flags" },
        { href: "/admin/system-health", icon: Activity, label: "System Health" },
        { href: "/admin/ai-monitoring", icon: Bot, label: "AI Monitoring" },
        { href: "/admin/audit-logs", icon: FileText, label: "Audit Logs" },
      ]
    },
    {
      title: "CONFIGURATION",
      items: [
        { href: "/admin/settings", icon: Settings, label: "Settings" },
        { href: "/admin/roles", icon: Lock, label: "Roles & Permissions" },
        { href: "/admin/integrations", icon: Blocks, label: "Integrations" },
      ]
    }
  ];

  return (
    <aside className="w-[280px] h-full border-r border-[#1e1e1e] bg-[#050505] flex flex-col shrink-0">
      <div className="h-[72px] flex items-center px-6 shrink-0">
        <ForgeXLogo />
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar px-4 py-4 flex flex-col gap-8">
        {sections.map((sec, i) => (
          <div key={i} className="flex flex-col gap-2">
            <span className="text-[10px] font-semibold text-[#71717a] uppercase tracking-wider px-3 mb-1">
              {sec.title}
            </span>
            <div className="flex flex-col gap-1">
              {sec.items.map((item, j) => {
                const active = isCurrent(item.href);
                return (
                  <Link 
                    key={j} 
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors ${
                      active 
                        ? "bg-[#1e1a2e]/60 text-[#b19cd9]" 
                        : "text-[#a1a1aa] hover:text-[#e5e2e1] hover:bg-[#121212]"
                    }`}
                  >
                    <item.icon size={16} className={active ? "text-[#b19cd9]" : "text-[#71717a]"} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* System Status Widget */}
      <div className="p-4 shrink-0 mt-auto">
        <div className="bg-[#121212] border border-[#1e1e1e] rounded-xl p-4 relative overflow-hidden">
          <div className="absolute bottom-0 left-0 w-full h-[40px] opacity-20 pointer-events-none">
            <svg viewBox="0 0 100 20" preserveAspectRatio="none" className="w-full h-full stroke-[#5e5ce6] fill-none" strokeWidth="0.5">
              <path d="M0 10 Q 25 20, 50 10 T 100 10" />
              <path d="M0 15 Q 25 5, 50 15 T 100 15" opacity="0.5" />
            </svg>
          </div>
          <h4 className="text-[12px] font-semibold text-white mb-1">Forge X Control Center</h4>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-[#a1a1aa]">System status is healthy</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse"></span>
          </div>
        </div>
      </div>

      <div className="h-[60px] border-t border-[#1e1e1e] px-4 flex items-center shrink-0">
        <button className="flex items-center gap-2 text-[12px] text-[#71717a] hover:text-white transition-colors w-full px-2">
          <ChevronLeft size={16} /> Collapse
        </button>
      </div>
    </aside>
  );
}

function AdminTopBar() {
  return (
    <header className="h-[72px] shrink-0 border-b border-[#1e1e1e] bg-[#0A0A0A] flex items-center justify-between px-8 z-10 sticky top-0">
      
      {/* Search */}
      <div className="w-[400px]">
        <div className="relative group">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#71717a] group-focus-within:text-[#b19cd9] transition-colors" />
          <input 
            type="text" 
            placeholder="Search users, companies, communities..." 
            className="w-full bg-[#121212] border border-[#262626] rounded-xl pl-9 pr-12 py-2 text-[13px] text-white placeholder:text-[#71717a] outline-none focus:border-[#3f3f46] focus:bg-[#1A1A1A] transition-all"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <span className="text-[10px] text-[#71717a] font-mono border border-[#262626] bg-[#0A0A0A] rounded px-1.5 py-0.5">⌘</span>
            <span className="text-[10px] text-[#71717a] font-mono border border-[#262626] bg-[#0A0A0A] rounded px-1.5 py-0.5">K</span>
          </div>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-5">
        <button className="text-[#a1a1aa] hover:text-white transition-colors"><Sun size={18} /></button>
        <button className="text-[#a1a1aa] hover:text-white transition-colors relative">
          <Bell size={18} />
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#5e5ce6] border-2 border-[#0A0A0A]"></span>
        </button>
        <button className="text-[#a1a1aa] hover:text-white transition-colors relative">
          <MessageSquare size={18} />
          <span className="absolute -top-2 -right-2 w-[14px] h-[14px] rounded-full bg-[#b19cd9] text-black text-[9px] font-bold flex items-center justify-center border-2 border-[#0A0A0A]">2</span>
        </button>
        
        <div className="w-px h-6 bg-[#262626] mx-1"></div>

        <button className="flex items-center gap-3 group cursor-pointer hover:bg-[#121212] p-1.5 rounded-lg transition-colors border border-transparent hover:border-[#262626]">
          <div className="flex flex-col items-end">
            <span className="text-[13px] font-medium text-white group-hover:text-[#b19cd9] transition-colors leading-tight">Admin User</span>
            <span className="text-[10px] text-[#71717a] leading-tight">Super Administrator</span>
          </div>
          <div className="w-9 h-9 rounded-full bg-[#1e1a2e] border border-[#2a2440] overflow-hidden">
            {/* Placeholder avatar image style */}
            <img src="https://i.pravatar.cc/100?img=11" alt="Admin" className="w-full h-full object-cover" />
          </div>
          <ChevronRight size={14} className="text-[#71717a] ml-1 opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-5px] group-hover:translate-x-0" />
        </button>
      </div>

    </header>
  );
}
