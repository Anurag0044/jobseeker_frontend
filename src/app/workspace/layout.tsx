"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Bell, ChevronDown, Sun, Crown, ArrowRight,
  UserCircle, Grid2X2, Zap, Send, MessageCircle, Link2,
  Bookmark, Sparkles, Briefcase, Layers, Users, Settings, Settings2, ShieldCheck, Bot, Hexagon, Cpu, Atom, Command, Aperture, Menu, X, Building2
} from "lucide-react";
import { useConnections } from "../../hooks/useConnections";
import ForgeXLogo from "../../components/ui/ForgeXLogo";
import AuthGuard from "../../components/auth/AuthGuard";
import ProfileOnboardingModal from "../../components/profile/ProfileOnboardingModal";
import { useForgeProfile } from "../../hooks/useForgeProfile";
import SeamlessVideoBackground from "../../components/ui/SeamlessVideoBackground";
import PremiumLoader from "../../components/ui/PremiumLoader";

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  // Apply customizations globally on mount/storage change
  React.useEffect(() => {
    const applyConfig = () => {
      const fontSize = localStorage.getItem("forge-font-size") || "default";
      const accentColor = localStorage.getItem("forge-accent") || "blue";
      const animationsEnabled = localStorage.getItem("forge-animations") !== "false";

      // 1. Font Zoom
      let fontStyle = document.getElementById("forge-font-overrides");
      if (!fontStyle) {
        fontStyle = document.createElement("style");
        fontStyle.id = "forge-font-overrides";
        document.head.appendChild(fontStyle);
      }
      const zooms = {
        compact: "0.94",
        default: "1.0",
        comfortable: "1.06",
        large: "1.12"
      };
      fontStyle.innerHTML = `
        main {
          zoom: ${zooms[fontSize as keyof typeof zooms]} !important;
        }
      `;

      // 2. Accent Color
      let accentStyle = document.getElementById("forge-accent-overrides");
      if (!accentStyle) {
        accentStyle = document.createElement("style");
        accentStyle.id = "forge-accent-overrides";
        document.head.appendChild(accentStyle);
      }
      if (accentColor === "blue") {
        accentStyle.innerHTML = "";
      } else {
        const colors = {
          purple: {
            base: '#a855f7',
            hover: '#c084fc',
            dark: '#9333ea',
            light: '#d8b4fe',
            glow: 'rgba(168, 85, 247, 0.4)',
            border: 'rgba(168, 85, 247, 0.2)',
            borderFocus: 'rgba(168, 85, 247, 0.5)',
          },
          emerald: {
            base: '#10b981',
            hover: '#34d399',
            dark: '#059669',
            light: '#6ee7b7',
            glow: 'rgba(16, 185, 129, 0.4)',
            border: 'rgba(16, 185, 129, 0.2)',
            borderFocus: 'rgba(16, 185, 129, 0.5)',
          },
          amber: {
            base: '#f59e0b',
            hover: '#fbbf24',
            dark: '#d97706',
            light: '#fde047',
            glow: 'rgba(245, 158, 11, 0.4)',
            border: 'rgba(245, 158, 11, 0.2)',
            borderFocus: 'rgba(245, 158, 11, 0.5)',
          }
        };
        const c = colors[accentColor as keyof typeof colors];
        if (c) {
          accentStyle.innerHTML = `
            .text-blue-400 { color: ${c.base} !important; }
            .text-blue-300 { color: ${c.hover} !important; }
            .text-blue-205 { color: ${c.light} !important; }
            .text-blue-200 { color: ${c.light} !important; }
            .text-indigo-400 { color: ${c.base} !important; }
            .text-indigo-300 { color: ${c.hover} !important; }
            .bg-blue-500 { background-color: ${c.base} !important; }
            .bg-blue-600 { background-color: ${c.dark} !important; }
            .bg-indigo-500 { background-color: ${c.base} !important; }
            .bg-indigo-650 { background-color: ${c.dark} !important; }
            .border-blue-500 { border-color: ${c.base} !important; }
            .border-blue-500\\/20 { border-color: ${c.border} !important; }
            .border-blue-500\\/30 { border-color: ${c.border} !important; }
            .hover\\:border-blue-500\\/30:hover { border-color: ${c.border} !important; }
            .focus-within\\:border-blue-500\\/50:focus-within { border-color: ${c.borderFocus} !important; }
            .border-indigo-500 { border-color: ${c.base} !important; }
            .border-indigo-500\\/20 { border-color: ${c.border} !important; }
            .shadow-\\[0_4px_15px_rgba\\(59\\,130\\,246\\,0\\.4\\)\\] { box-shadow: 0 4px 15px ${c.glow} !important; }
            .hover\\:shadow-\\[0_6px_20px_rgba\\(59\\,130\\,246\\,0\\.6\\)\\]:hover { box-shadow: 0 6px 20px ${c.glow} !important; }
            .focus-within\\:shadow-\\[0_0_15px_rgba\\(59\\,130\\,246\\,0\\.15\\)\\]:focus-within { box-shadow: 0 0 15px ${c.glow} !important; }
          `;
        }
      }

      // 3. Animations
      let animStyle = document.getElementById("forge-animation-overrides");
      if (!animStyle) {
        animStyle = document.createElement("style");
        animStyle.id = "forge-animation-overrides";
        document.head.appendChild(animStyle);
      }
      if (animationsEnabled) {
        animStyle.innerHTML = "";
      } else {
        animStyle.innerHTML = `
          *, *::before, *::after {
            animation-duration: 0.001s !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.001s !important;
            scroll-behavior: auto !important;
          }
        `;
      }
    };

    applyConfig();

    // Listen for custom settings storage events (so tab switching applies instantly)
    window.addEventListener("storage", applyConfig);
    
    // Custom trigger for same-page updates (we will dispatch this event from the Settings page)
    window.addEventListener("forge-settings-updated", applyConfig);

    return () => {
      window.removeEventListener("storage", applyConfig);
      window.removeEventListener("forge-settings-updated", applyConfig);
    };
  }, []);
  return (
    <AuthGuard>
      <PremiumLoader>
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

          {/* Mobile Sidebar Overlay */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
              />
            )}
          </AnimatePresence>

          <Sidebar isOpen={isMobileMenuOpen} setIsOpen={setIsMobileMenuOpen} />
          <main
            className="flex-1 flex flex-col h-full relative overflow-hidden rounded-xl lg:rounded-[24px] z-10 w-full"
            style={{
              background: 'linear-gradient(135deg, rgba(10, 15, 30, 0.5) 0%, rgba(2, 4, 15, 0.7) 100%)',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              borderLeft: '1px solid rgba(255, 255, 255, 0.05)',
              borderRight: '1px solid rgba(255, 255, 255, 0.02)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.02)',
              boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.15), inset 0 0 30px rgba(255,255,255,0.02)',
            }}
          >
            <TopBar onMenuClick={() => setIsMobileMenuOpen(true)} />
            <div className="flex-1 overflow-y-auto custom-scrollbar relative z-0 min-h-0 flex flex-col">
              {children}
            </div>
          </main>
          <ProfileOnboardingModal />
        </div>
      </PremiumLoader>
    </AuthGuard>
  );
}

function useSidebarBadges() {
  const { pendingReceivedCount } = useConnections();
  return { pendingReceivedCount };
}

/* ─── Sidebar ──────────────────────────────────────────────── */

const navItemsBase = [
  { href: "/workspace/profile", icon: UserCircle, label: "Profile", iconVariants: { clicked: { scale: [1, 0.8, 1.05, 1], transition: { duration: 0.5, ease: "easeInOut" } } } },
  { href: "/workspace/projects", icon: Grid2X2, label: "Projects", iconVariants: { clicked: { rotate: [0, 90], scale: [1, 0.9, 1], transition: { duration: 0.5, ease: "easeInOut" } } } },
  { href: "/workspace/messages", icon: MessageCircle, label: "Messages", badge: "", iconVariants: { clicked: { scale: [1, 1.1, 0.9, 1.05, 1], rotate: [0, -8, 8, -8, 0], transition: { duration: 0.5, ease: "easeInOut" } } } },
  { href: "/workspace/connections", icon: Link2, label: "Connections", badge: "", iconVariants: { clicked: { scaleX: [1, 0.6, 1.1, 1], scaleY: [1, 1.2, 0.9, 1], rotate: [0, -15, 10, 0], transition: { duration: 0.5, ease: "easeInOut" } } } },
  { href: "/workspace/ai-agents", icon: Hexagon, label: "AgentX", iconVariants: { clicked: { rotate: [0, 180, 360], scale: [1, 1.4, 1], transition: { duration: 0.6 } } } },
  { href: "/workspace/companies", icon: Building2, label: "Companies", iconVariants: { clicked: { scale: [1, 1.15, 0.95, 1], transition: { duration: 0.4, ease: "easeInOut" } } } },
  { href: "/workspace/communities", icon: Users, label: "Communities", iconVariants: { clicked: { scaleX: [1, 1.3, 0.9, 1], scaleY: [1, 0.8, 1.1, 1], transition: { duration: 0.4 } } } },
  { href: "/workspace/settings", icon: Settings, label: "Settings", iconVariants: { clicked: { rotate: [0, 360], transition: { duration: 0.6, ease: "easeInOut" } } } },
  { href: "/admin/users", icon: ShieldCheck, label: "Admin Panel", iconVariants: { clicked: { scale: [1, 1.2, 1], rotate: [0, -15, 15, 0], transition: { duration: 0.4 } } } },
];

function Sidebar({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (val: boolean) => void }) {
  const pathname = usePathname();
  const [hoveredHref, setHoveredHref] = React.useState<string | null>(null);
  const { pendingReceivedCount } = useSidebarBadges();
  const { displayProfile } = useForgeProfile();
  
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  React.useEffect(() => {
    const val = localStorage.getItem("forge-sidebar-collapsed");
    if (val === "true") {
      setIsCollapsed(true);
    }
  }, []);

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("forge-sidebar-collapsed", String(next));
      return next;
    });
  };

  const navItems = navItemsBase
    .filter((item) => item.href !== "/admin/users" || displayProfile?.role === "admin")
    .map((item) => {
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
      className={`fixed lg:relative inset-y-4 left-4 lg:inset-auto lg:left-auto h-[calc(100%-2rem)] lg:h-full flex flex-col shrink-0 rounded-[24px] z-50 py-6 overflow-hidden transition-all duration-350 ease-[0.16,1,0.3,1] ${isOpen ? "translate-x-0" : "-translate-x-[150%] lg:translate-x-0"} ${isCollapsed ? "w-[84px] px-2" : "w-[280px] px-4"}`}
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

      <div className={`flex items-center relative z-10 mb-8 mt-1 transition-all duration-350 ease-[0.16,1,0.3,1] ${isCollapsed ? "flex-col gap-4 px-2" : "justify-between px-8"}`}>
        <ForgeXLogo collapsed={isCollapsed} className="scale-95 origin-left drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]" />
        <div 
          onClick={toggleCollapse}
          className="hidden lg:flex w-7 h-7 rounded-full items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 hover:bg-white/[0.05] border border-white/[0.05]" 
          style={{ background: 'rgba(15, 23, 42, 0.5)', boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.1)' }}
        >
          <ChevronDown size={14} className={`text-slate-400 transition-transform duration-350 ease-[0.16,1,0.3,1] ${isCollapsed ? "-rotate-90" : "rotate-90"}`} />
        </div>
        <div
          onClick={() => setIsOpen(false)}
          className="flex lg:hidden w-8 h-8 rounded-full items-center justify-center cursor-pointer transition-all duration-300 hover:bg-white/[0.05] border border-white/[0.05] text-slate-400"
        >
          <X size={18} />
        </div>
      </div>

      <div className="flex-1 relative z-10 px-2 overflow-y-auto custom-scrollbar min-h-0">
        <div className="flex flex-col gap-1.5 py-2">
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
              onClick={() => setIsOpen(false)}
              isCollapsed={isCollapsed}
            />
          ))}
        </div>
      </div>

      <div className={`mt-auto relative z-10 transition-all duration-350 ease-[0.16,1,0.3,1] ${isCollapsed ? "px-2" : "px-5"}`}>
        {isCollapsed ? (
          <div className="relative group/upgrade mx-auto">
            <Link 
              href="/workspace/upgrade" 
              scroll={false} 
              className="flex w-11 h-11 rounded-full items-center justify-center border border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.2)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
            >
              <Crown size={18} className="animate-pulse" />
            </Link>
            <div className="absolute left-16 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded bg-[#0A0A0A]/90 border border-white/10 text-white text-[10px] font-semibold tracking-wide whitespace-nowrap shadow-[0_4px_12px_rgba(0,0,0,0.5)] opacity-0 group-hover/upgrade:opacity-100 pointer-events-none transition-all duration-200 transform translate-x-1 group-hover/upgrade:translate-x-0 backdrop-blur-md z-30">
              Upgrade to Pro
            </div>
          </div>
        ) : (
          <Link href="/workspace/upgrade" scroll={false} className="group block p-4.5 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] backdrop-blur-xl transition-all duration-300 hover:scale-[1.01] shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.1),_0_8px_24px_rgba(0,0,0,0.4)]">
            <div className="flex items-center gap-1.5 mb-2">
              <span className="text-[9px] font-bold tracking-widest text-blue-450 uppercase">PRO PLAN</span>
            </div>
            <h3 className="text-[13px] font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">
              Expert & Corporate Mode
            </h3>
            <p className="text-[10.5px] text-slate-400 leading-relaxed mb-3">
              Deploy advanced AI agent networks and export full workspace data records.
            </p>
            <div className="text-[11px] font-bold text-blue-400 group-hover:text-blue-350 flex items-center gap-1 transition-colors">
              Upgrade Now <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>
        )}
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
  iconVariants?: any;
  isHovered: boolean;
  onHover: () => void;
  onClick?: () => void;
  isCollapsed?: boolean;
}

function NavItem({ href, icon, label, active, badge, iconVariants, isHovered, onHover, onClick, isCollapsed }: NavItemProps) {
  const [isClicked, setIsClicked] = React.useState(false);

  const handleClick = () => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 800);
  };

  return (
    <Link
      href={href}
      onMouseEnter={onHover}
      onClick={(e) => {
        handleClick();
        if (onClick) onClick();
      }}
      scroll={false}
      className={`relative flex items-center transition-all duration-350 ease-[0.16,1,0.3,1] group overflow-hidden rounded-full ${active
        ? "text-white"
        : "text-slate-400 hover:text-white"
        } ${isCollapsed ? "justify-center p-2.5 w-11 h-11 mx-auto" : "justify-between p-2 px-3.5 w-full"}`}
      style={active ? {
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.25) 0%, rgba(59, 130, 246, 0.1) 100%)',
        boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.2), 0 4px 15px rgba(0,0,0,0.2), 0 0 20px rgba(99,102,241,0.2)',
      } : undefined}
    >
      {/* Animated Edge Glow for Active State */}
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

      <div className={`flex items-center relative z-10 shrink-0 transition-all duration-350 ease-[0.16,1,0.3,1] ${isCollapsed ? "gap-0 pl-0" : "gap-4 pl-1"}`}>
        <motion.span
          variants={iconVariants}
          animate={isClicked ? "clicked" : "idle"}
          initial="idle"
          className={`flex items-center justify-center transition-colors duration-300 ${active ? "text-indigo-300 drop-shadow-[0_0_8px_rgba(165,180,252,0.6)]" : "text-slate-500 group-hover:text-indigo-300"}`}>
          {icon}
        </motion.span>
        
        <span 
          className={`text-[15px] tracking-wide py-1 whitespace-nowrap transition-all duration-350 ease-[0.16,1,0.3,1] ${active ? "font-semibold drop-shadow-md" : "font-medium"} ${isCollapsed ? "opacity-0 w-0 max-w-0 translate-x-4 overflow-hidden pointer-events-none" : "opacity-100 max-w-[150px] translate-x-0"}`}
        >
          {label}
        </span>
      </div>

      {badge && !active && (
        <div 
          className={`bg-indigo-500/20 text-indigo-300 text-[13px] font-bold px-2.5 py-0.5 rounded-full border border-indigo-500/30 relative z-10 shadow-[0_0_10px_rgba(99,102,241,0.2)] transition-all duration-350 ease-[0.16,1,0.3,1] ${isCollapsed ? "opacity-0 scale-0 w-0 overflow-hidden" : "opacity-100 scale-100"}`}
        >
          {badge}
        </div>
      )}
    </Link>
  );
}

/* ─── TopBar ───────────────────────────────────────────────── */

function TopBar({ onMenuClick }: { onMenuClick: () => void }) {
  const { displayProfile } = useForgeProfile();

  const displayName = displayProfile?.displayName || "Forge User";
  const firstLetter = displayName.charAt(0).toUpperCase();
  const profileImage = displayProfile?.photoURL;

  return (
    <header className="h-16 sm:h-20 flex items-center justify-between px-3 sm:px-6 lg:px-10 shrink-0 sticky top-0 z-20 relative rounded-t-[24px]"
      style={{
        background: 'linear-gradient(180deg, rgba(5, 7, 15, 0.6) 0%, rgba(1, 2, 5, 0.3) 100%)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none rounded-t-[24px]" />

      <button
        onClick={onMenuClick}
        className="lg:hidden w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/[0.05] transition-all border border-transparent hover:border-white/[0.05] mr-1 sm:mr-2 shrink-0"
      >
        <Menu size={20} />
      </button>

      <div className="hidden md:block flex-1" />

      <div
        className="flex-1 sm:flex-none w-full sm:w-auto sm:max-w-[280px] lg:max-w-[400px] h-9 sm:h-11 flex items-center px-3 sm:px-4 transition-all group rounded-2xl mx-1 sm:mx-4"
        style={{
          background: 'rgba(2, 6, 23, 0.4)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.02), 0 4px 15px rgba(0,0,0,0.2)',
        }}
      >
        <Search size={16} className="mr-2 sm:mr-3 shrink-0 text-slate-400 group-active:scale-75 group-focus-within:rotate-12 transition-transform duration-300 group-focus-within:text-indigo-400" />
        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent border-none outline-none flex-1 w-full min-w-0 text-[13px] sm:text-[14px] text-white placeholder-slate-500 font-medium"
        />
      </div>

      <div className="flex items-center justify-end gap-1 sm:gap-3 lg:gap-6 relative z-10 shrink-0 ml-1 sm:ml-0">
        <div className="hidden sm:flex items-center gap-2">
          <div className="relative group/theme">
            <button className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/[0.05] transition-all border border-transparent hover:border-white/[0.05]">
              <Sun size={18} />
            </button>
            <div className="absolute top-12 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded bg-[#0A0A0A]/90 border border-white/10 text-white text-[10px] font-semibold tracking-wide whitespace-nowrap shadow-[0_4px_12px_rgba(0,0,0,0.5)] opacity-0 group-hover/theme:opacity-100 pointer-events-none transition-all duration-200 transform translate-y-1 group-hover/theme:translate-y-0 backdrop-blur-md z-30">
              Coming Soon
            </div>
          </div>

          <button className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/[0.05] transition-all relative border border-transparent hover:border-white/[0.05]">
            <Bell size={18} />
            <span className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 w-2 h-2 bg-indigo-500 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.8)] border border-[#0f172a]"></span>
          </button>
        </div>

        <div className="hidden sm:block h-8 w-px bg-white/[0.08]"></div>

        <div className="flex items-center gap-2 sm:gap-3 cursor-pointer group p-1 sm:p-1.5 sm:pr-3 rounded-2xl hover:bg-white/[0.04] border border-transparent hover:border-white/[0.05] transition-all">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl overflow-hidden border border-white/[0.1] flex items-center justify-center shadow-[0_4px_10px_rgba(0,0,0,0.3)] shrink-0" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2))' }}>
            {profileImage ? (
              <img src={profileImage} alt={displayName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[13px] font-bold text-indigo-300 drop-shadow-md">
                {firstLetter}
              </div>
            )}
          </div>
          <span className="hidden sm:block text-[13px] sm:text-[14px] font-semibold text-slate-200 group-hover:text-white transition-colors max-w-[100px] truncate">
            {displayName}
          </span>
          <ChevronDown size={14} className="hidden sm:block text-slate-500 ml-1 group-hover:text-slate-300 transition-colors" />
        </div>
      </div>
    </header>
  );
}
