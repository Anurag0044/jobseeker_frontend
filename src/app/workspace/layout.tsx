"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Bell, ChevronDown, Sun, Crown, ArrowRight,
  UserCircle, Grid2X2, Zap, Send, MessageCircle, Link2,
  Bookmark, Sparkles, Briefcase, Layers, Users, Settings2, ShieldCheck, Bot, Hexagon, Cpu, Atom, Command, Aperture
} from "lucide-react";
import { useConnections } from "../../hooks/useConnections";
import ForgeXLogo from "../../components/ui/ForgeXLogo";
import AuthGuard from "../../components/auth/AuthGuard";
import ProfileOnboardingModal from "../../components/profile/ProfileOnboardingModal";
import { useForgeProfile } from "../../hooks/useForgeProfile";
import SeamlessVideoBackground from "../../components/ui/SeamlessVideoBackground";

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="h-screen w-full flex overflow-hidden font-body-sm text-body-sm antialiased text-[#e2e8f0] p-4 gap-4 relative bg-[#010108]">
        {/* Premium AI Particle Wave Video Background (Seamless Crossfade) */}
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <SeamlessVideoBackground
            src="/videos/particle-wave.mp4"
            className="absolute top-1/2 left-1/2 min-w-full min-h-full -translate-x-1/2 -translate-y-1/2 opacity-[0.85] mix-blend-screen"
          />
          {/* Subtle gradient overlay to integrate video seamlessly and maintain readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#010108]/70 via-[#010108]/20 to-[#010108]/70" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#010108]/70 via-transparent to-[#010108]/70" />
        </div>

        {/* Ambient glowing cosmic orbs - toned down slightly to blend with video */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/10 blur-[140px] pointer-events-none mix-blend-screen z-0" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/10 blur-[140px] pointer-events-none mix-blend-screen z-0" />
        <div className="absolute top-[40%] left-[50%] w-[40%] h-[40%] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none -translate-x-1/2 -translate-y-1/2 mix-blend-screen z-0" />

        {/* Subtle noise overlay for texture */}
        <div className="absolute inset-0 opacity-[0.015] pointer-events-none mix-blend-overlay z-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

        <Sidebar />
        <main
          className="flex-1 flex flex-col h-full relative overflow-hidden rounded-[24px] z-10"
          style={{
            background: 'linear-gradient(135deg, rgba(10, 15, 30, 0.5) 0%, rgba(2, 4, 15, 0.7) 100%)',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            borderLeft: '1px solid rgba(255, 255, 255, 0.05)',
            borderRight: '1px solid rgba(255, 255, 255, 0.02)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.02)',
            boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.15), inset 0 0 30px rgba(255,255,255,0.02)',
          }}
        >
          <TopBar />
          <div className="flex-1 overflow-y-auto custom-scrollbar relative z-0 min-h-0 flex flex-col">
            {children}
          </div>
        </main>
        <ProfileOnboardingModal />
      </div>
    </AuthGuard>
  );
}

/* ─── Sidebar ──────────────────────────────────────────────── */

const navItemsBase = [
  { href: "/workspace/profile", icon: UserCircle, label: "Profile", iconVariants: { clicked: { scale: [1, 0.8, 1.05, 1], transition: { duration: 0.5, ease: "easeInOut" } } } },
  { href: "/workspace/projects", icon: Grid2X2, label: "Projects", iconVariants: { clicked: { rotate: [0, 90], scale: [1, 0.9, 1], transition: { duration: 0.5, ease: "easeInOut" } } } },
  { href: "/workspace/messages", icon: MessageCircle, label: "Messages", badge: "", iconVariants: { clicked: { scale: [1, 1.1, 0.9, 1.05, 1], rotate: [0, -8, 8, -8, 0], transition: { duration: 0.5, ease: "easeInOut" } } } },
  { href: "/workspace/connections", icon: Link2, label: "Connections", badge: "", iconVariants: { clicked: { scaleX: [1, 0.6, 1.1, 1], scaleY: [1, 1.2, 0.9, 1], rotate: [0, -15, 10, 0], transition: { duration: 0.5, ease: "easeInOut" } } } },
  { href: "/workspace/ai-agents", icon: Hexagon, label: "AgentX", iconVariants: { clicked: { rotate: [0, 180, 360], scale: [1, 1.4, 1], transition: { duration: 0.6 } } } },
  { href: "/workspace/companies", icon: Layers, label: "Companies", iconVariants: { clicked: { x: [0, -5, 5, -5, 0], y: [0, 5, -5, 5, 0], transition: { duration: 0.4 } } } },
  { href: "/workspace/communities", icon: Users, label: "Communities", iconVariants: { clicked: { scaleX: [1, 1.3, 0.9, 1], scaleY: [1, 0.8, 1.1, 1], transition: { duration: 0.4 } } } },
  { href: "/workspace/settings", icon: Settings2, label: "Settings", iconVariants: { clicked: { rotate: [0, 180], transition: { duration: 0.5 } } } },
  { href: "/admin/users", icon: ShieldCheck, label: "Admin Panel", iconVariants: { clicked: { scale: [1, 1.2, 1], rotate: [0, -15, 15, 0], transition: { duration: 0.4 } } } },
];

function useSidebarBadges() {
  const { pendingReceivedCount } = useConnections();
  return { pendingReceivedCount };
}

function Sidebar() {
  const pathname = usePathname();
  const [hoveredHref, setHoveredHref] = React.useState<string | null>(null);
  const { pendingReceivedCount } = useSidebarBadges();

  const navItems = navItemsBase.map((item) => {
    if (item.href === "/workspace/connections" && pendingReceivedCount > 0) {
      return { ...item, badge: String(pendingReceivedCount) };
    }
    return item;
  });

  const isActive = (href: string) => {
    if (href === "/workspace") return pathname === "/workspace";
    return pathname.startsWith(href);
  };

  return (
    <nav
      className="w-[280px] h-full flex flex-col shrink-0 rounded-[24px] z-10 py-6 overflow-hidden relative"
      style={{
        background: 'linear-gradient(160deg, rgba(10, 15, 30, 0.6) 0%, rgba(2, 4, 15, 0.8) 100%)',
        backdropFilter: 'blur(40px) saturate(150%)',
        WebkitBackdropFilter: 'blur(40px) saturate(150%)',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        borderLeft: '1px solid rgba(255, 255, 255, 0.05)',
        borderRight: '1px solid rgba(255, 255, 255, 0.02)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.02)',
        boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.15), 0 20px 40px rgba(0,0,0,0.6)',
      }}
      onMouseLeave={() => setHoveredHref(null)}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />

      <div className="flex items-center justify-between px-8 mb-8 mt-1 relative z-10">
        <ForgeXLogo className="scale-95 origin-left drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]" />
        <div className="w-7 h-7 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 hover:bg-white/[0.05] border border-white/[0.05]" style={{ background: 'rgba(15, 23, 42, 0.5)', boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.1)' }}>
          <ChevronDown size={14} className="rotate-90 text-slate-400" />
        </div>
      </div>

      <div className="flex-1 relative z-10 px-4 overflow-y-auto custom-scrollbar min-h-0">
        <div className="flex flex-col gap-1 py-2">
          {navItems.map((item) => (
            <NavItem
              key={item.href}
              href={item.href}
              icon={<item.icon size={20} strokeWidth={1.25} />}
              label={item.label}
              active={isActive(item.href)}
              badge={item.badge}
              iconVariants={item.iconVariants}
              isHovered={hoveredHref === item.href}
              onHover={() => setHoveredHref(item.href)}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 px-5 mt-auto relative z-10">
        {/* Upgrade Banner */}
        <Link href="/workspace/upgrade" scroll={false} className="flex items-center gap-3 p-3 rounded-2xl transition-all duration-300 group hover:scale-[1.02]"
          style={{
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.05) 100%)',
            border: '1px solid rgba(99, 102, 241, 0.2)',
            boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.1), 0 8px 20px rgba(0,0,0,0.3), 0 0 20px rgba(99,102,241,0.15)'
          }}
        >
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-[#c4b5fd] shrink-0" style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.4), rgba(139, 92, 246, 0.4))', boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.2)' }}>
            <Crown size={18} className="drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
          </div>
          <div className="flex flex-col flex-1">
            <span className="text-[14px] font-semibold text-white drop-shadow-sm">Upgrade to Pro</span>
            <span className="text-[12px] text-indigo-200/70">Unlock advanced features</span>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-300/50 group-hover:text-white group-hover:translate-x-1 transition-all shrink-0"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
        </Link>

        {/* Online Status */}
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-2xl bg-white/[0.02] border border-white/[0.03]">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#22c55e] to-[#10b981] flex items-center justify-center text-white text-[13px] font-bold shrink-0 shadow-[0_0_15px_rgba(34,197,94,0.4),inset_0_1px_1px_rgba(255,255,255,0.4)] relative">
            <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-[#0f172a]" />
            N
          </div>
          <span className="text-[14px] text-slate-300 font-medium">Online</span>
          <ArrowRight size={14} className="text-slate-500 ml-auto shrink-0" />
        </div>
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
  iconVariants?: Record<string, unknown>;
  isHovered: boolean;
  onHover: () => void;
}

function NavItem({ href, icon, label, active, badge, iconVariants, isHovered, onHover }: NavItemProps) {
  const [isClicked, setIsClicked] = React.useState(false);

  const handleClick = () => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 800); // Balanced timeout for smooth animations
  };

  return (
    <Link
      href={href}
      onMouseEnter={onHover}
      onClick={handleClick}
      scroll={false}
      className={`relative flex items-center justify-between p-2 px-3.5 rounded-full transition-all duration-300 group overflow-hidden ${active
        ? "text-white"
        : "text-slate-400 hover:text-white"
        }`}
      style={active ? {
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.25) 0%, rgba(59, 130, 246, 0.1) 100%)',
        boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.2), 0 4px 15px rgba(0,0,0,0.2), 0 0 20px rgba(99,102,241,0.2)',
      } : undefined}
    >
      {/* Animated Edge Glow for Active State (Like View Demo) */}
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
                background: `conic-gradient(from 0deg, transparent 0%, rgba(139, 92, 246, 0.9) 15%, transparent 30%)`,
              }}
            />
          </div>
        </div>
      )}

      {/* Gliding Hover Glass Pill */}
      <AnimatePresence>
        {isHovered && !active && (
          <motion.div
            layoutId="sidebar-glass-pill"
            className="absolute inset-0 rounded-full -z-10"
            style={{
              background: 'linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.01) 100%)',
              border: '1px solid rgba(255,255,255,0.05)',
              boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.1), 0 4px 16px rgba(0,0,0,0.2)',
            }}
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

      <div className="flex items-center gap-4 relative z-10 pl-1">
        <motion.span
          variants={iconVariants}
          animate={isClicked ? "clicked" : "idle"}
          initial="idle"
          className={`flex items-center justify-center transition-colors duration-300 ${active ? "text-indigo-300 drop-shadow-[0_0_8px_rgba(165,180,252,0.6)]" : "text-slate-500 group-hover:text-indigo-300"}`}>
          {icon}
        </motion.span>
        <span className={`text-[15px] tracking-wide py-1 ${active ? "font-semibold drop-shadow-md" : "font-medium"}`}>
          {label}
        </span>
      </div>

      {badge && !active && (
        <div className="bg-indigo-500/20 text-indigo-300 text-[13px] font-bold px-2.5 py-0.5 rounded-full border border-indigo-500/30 relative z-10 shadow-[0_0_10px_rgba(99,102,241,0.2)]">
          {badge}
        </div>
      )}
    </Link>
  );
}

/* ─── TopBar ───────────────────────────────────────────────── */

function TopBar() {
  const { displayProfile } = useForgeProfile();

  const displayName = displayProfile?.displayName || "Forge User";
  const firstLetter = displayName.charAt(0).toUpperCase();
  const profileImage = displayProfile?.photoURL;

  return (
    <header className="h-20 flex items-center justify-between px-6 lg:px-10 shrink-0 sticky top-0 z-20 relative rounded-t-[24px]"
      style={{
        background: 'linear-gradient(180deg, rgba(5, 7, 15, 0.6) 0%, rgba(1, 2, 5, 0.3) 100%)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none rounded-t-[24px]" />

      <div className="hidden md:block flex-1" />

      <div
        className="w-full max-w-[200px] sm:max-w-[300px] lg:max-w-[400px] h-11 flex items-center px-4 transition-all group rounded-2xl mx-4"
        style={{
          background: 'rgba(2, 6, 23, 0.4)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.02), 0 4px 15px rgba(0,0,0,0.2)',
        }}
      >
        <Search size={18} className="mr-3 shrink-0 text-slate-400 group-active:scale-75 group-focus-within:rotate-12 transition-transform duration-300 group-focus-within:text-indigo-400 drop-shadow-[0_0_8px_rgba(99,102,241,0)] group-focus-within:drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent border-none outline-none flex-1 w-full min-w-0 text-[14px] text-white placeholder-slate-500 font-medium"
        />
      </div>

      <div className="flex-1 flex items-center justify-end gap-3 lg:gap-6 relative z-10">
        <div className="flex items-center gap-2">
          <button className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/[0.05] transition-all border border-transparent hover:border-white/[0.05]">
            <Sun size={20} />
          </button>
          <button className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/[0.05] transition-all relative border border-transparent hover:border-white/[0.05]">
            <Bell size={20} />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-indigo-500 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.8)] border border-[#0f172a]"></span>
          </button>
          <div className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 hover:bg-white/[0.05] border border-transparent hover:border-white/[0.05] relative group">
            <MessageCircle size={20} />
          </div>
        </div>

        <div className="h-8 w-px bg-white/[0.08]"></div>

        <div className="flex items-center gap-3 cursor-pointer group p-1.5 pr-3 rounded-2xl hover:bg-white/[0.04] border border-transparent hover:border-white/[0.05] transition-all">
          <div className="w-9 h-9 rounded-xl overflow-hidden border border-white/[0.1] flex items-center justify-center shadow-[0_4px_10px_rgba(0,0,0,0.3)]" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2))' }}>
            {profileImage ? (
              <img src={profileImage} alt={displayName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[14px] font-bold text-indigo-300 drop-shadow-md">
                {firstLetter}
              </div>
            )}
          </div>
          <span className="text-[14px] font-semibold text-slate-200 group-hover:text-white transition-colors">
            {displayName}
          </span>
          <ChevronDown size={14} className="text-slate-500 ml-1 group-hover:text-slate-300 transition-colors" />
        </div>
      </div>
    </header>
  );
}
