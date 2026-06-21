"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import ForgeXLogo from "../ui/ForgeXLogo";

export default function AuthCard() {
  const [showGlow, setShowGlow] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hoveredSocialIndex, setHoveredSocialIndex] = useState<number | null>(null);

  useEffect(() => {
    // The purple arc takes ~5.8s to hit the card. Trigger the edge glow exactly then!
    const timer = setTimeout(() => setShowGlow(true), 5800);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate loading
    setTimeout(() => {
      window.location.href = "/workspace";
    }, 1500);
  };

  const staggerVariants: import("framer-motion").Variants = {
    hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        delay: i * 0.05,
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      },
    }),
  };

  return (
    <div
      className="relative w-full max-w-[420px] mx-auto"
      style={{ perspective: 1000 }}
    >
      {/* Premium Clean Animated 1px Edge Glow - Triggered after arc ends */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showGlow ? 1 : 0 }}
        transition={{ duration: 2, ease: "easeInOut" }}
        className="absolute inset-0 rounded-[32px] pointer-events-none z-20 overflow-hidden"
        style={{
          padding: "1px", // Border thickness
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "exclude",
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
        }}
      >
        {/* The rotating gradient - using standard Tailwind animate-spin */}
        <div className="absolute top-1/2 left-1/2 w-[200%] aspect-square -translate-x-1/2 -translate-y-1/2">
          <div
            className="w-full h-full animate-spin"
            style={{
              animationDuration: "4s",
              background: `conic-gradient(from 0deg, transparent 0%, rgba(139,92,246,0.9) 15%, transparent 30%)`,
            }}
          />
        </div>
      </motion.div>

      <div className="relative backdrop-blur-[24px] bg-[#0A0A0A]/60 border border-white/10 rounded-[32px] p-8 md:p-10 shadow-[0_24px_80px_rgba(0,0,0,0.5)] overflow-hidden">

        {/* Top noise overlay for premium feel */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjAwIDIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJub2lzZUZpbHRlciI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuNjUiIG51bU9jdGF2ZXM9IjMiIHN0aXRjaFRpbGVzPSJzdGl0Y2giLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ0cmFuc3BhcmVudCIvPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNub2lzZUZpbHRlcikiIG9wYWNpdHk9IjEiLz48L3N2Zz4=')]"></div>

        <div className="flex justify-center mb-8">
          <ForgeXLogo />
        </div>

        <motion.div custom={1} initial="hidden" animate="visible" variants={staggerVariants} className="text-center mb-8">
          <h2 className="text-2xl font-medium text-white mb-2 tracking-tight">Welcome Back</h2>
          <p className="text-[#888888] text-sm">Sign in to continue forging your career.</p>
        </motion.div>

        {/* Premium Social Buttons - Navbar Style */}
        <motion.div 
          custom={2} 
          initial="hidden" 
          animate="visible" 
          variants={staggerVariants} 
          className="flex gap-2 mb-8 bg-white/[0.02] backdrop-blur-md rounded-full p-1.5 border border-white/[0.04] shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)] relative z-0"
          onMouseLeave={() => setHoveredSocialIndex(null)}
        >
          <button
            type="button"
            className="flex-1 relative flex items-center justify-center h-10 rounded-full transition-colors duration-300 z-10"
            onClick={() => { window.location.href = "/workspace"; }}
            onMouseEnter={() => setHoveredSocialIndex(0)}
          >
            <AnimatePresence>
              {hoveredSocialIndex === 0 && (
                <motion.div
                  layoutId="social-glass-pill"
                  className="absolute inset-0 rounded-full -z-10 realistic-glass-pill"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30, mass: 0.8 }}
                />
              )}
            </AnimatePresence>
            <svg viewBox="0 0 24 24" className={`w-5 h-5 fill-current transition-colors duration-300 relative z-20 ${hoveredSocialIndex === 0 ? "text-white" : "text-[#999999]"}`}>
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
          </button>

          <button
            type="button"
            className="flex-1 relative flex items-center justify-center h-10 rounded-full transition-colors duration-300 z-10"
            onClick={() => { window.location.href = "/workspace"; }}
            onMouseEnter={() => setHoveredSocialIndex(1)}
          >
            <AnimatePresence>
              {hoveredSocialIndex === 1 && (
                <motion.div
                  layoutId="social-glass-pill"
                  className="absolute inset-0 rounded-full -z-10 realistic-glass-pill"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30, mass: 0.8 }}
                />
              )}
            </AnimatePresence>
            <svg viewBox="0 0 24 24" className={`w-5 h-5 transition-colors duration-300 relative z-20 ${hoveredSocialIndex === 1 ? "fill-white" : "fill-[#999999]"}`}>
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
          </button>
        </motion.div>

        {/* Divider */}
        <motion.div custom={3} initial="hidden" animate="visible" variants={staggerVariants} className="flex items-center gap-4 mb-8">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
          <span className="text-xs text-[#555] uppercase tracking-wider font-medium">Or</span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Input */}
          <motion.div custom={4} initial="hidden" animate="visible" variants={staggerVariants} className="relative group">
            <div className={`absolute -inset-0.5 rounded-xl blur-[8px] opacity-0 transition-opacity duration-300 ${emailFocus ? 'bg-violet-500/30 opacity-100' : ''}`}></div>
            <div className={`relative flex items-center h-12 bg-[#121212] rounded-xl border transition-colors duration-300 ${emailFocus ? 'border-violet-500/50' : 'border-white/10'}`}>
              <Mail className={`w-5 h-5 ml-4 transition-colors duration-300 ${emailFocus ? 'text-violet-400' : 'text-[#666]'}`} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setEmailFocus(true)}
                onBlur={() => setEmailFocus(false)}
                className="w-full bg-transparent border-none text-[#999999] px-4 h-full outline-none peer placeholder-transparent"
                style={{ transition: "background-color 99999s ease-in-out 0s", WebkitTextFillColor: "#999999" }}
                id="email"
              />
              <label
                htmlFor="email"
                className={`absolute left-11 transition-all duration-300 pointer-events-none ${email || emailFocus
                  ? '-top-6 text-xs text-violet-400'
                  : 'top-3.5 text-sm text-[#666]'
                  }`}
              >
                Email Address
              </label>
            </div>
          </motion.div>

          {/* Password Input */}
          <motion.div custom={5} initial="hidden" animate="visible" variants={staggerVariants} className="relative group">
            <div className={`absolute -inset-0.5 rounded-xl blur-[8px] opacity-0 transition-opacity duration-300 ${passwordFocus ? 'bg-violet-500/30 opacity-100' : ''}`}></div>
            <div className={`relative flex items-center h-12 bg-[#121212] rounded-xl border transition-colors duration-300 ${passwordFocus ? 'border-violet-500/50' : 'border-white/10'}`}>
              <Lock className={`w-5 h-5 ml-4 transition-colors duration-300 ${passwordFocus ? 'text-violet-400' : 'text-[#666]'}`} />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setPasswordFocus(true)}
                onBlur={() => setPasswordFocus(false)}
                className="w-full bg-transparent border-none text-[#999999] pl-4 pr-12 h-full outline-none peer placeholder-transparent"
                style={{ transition: "background-color 99999s ease-in-out 0s", WebkitTextFillColor: "#999999" }}
                id="password"
              />
              <label
                htmlFor="password"
                className={`absolute left-11 transition-all duration-300 pointer-events-none ${password || passwordFocus
                  ? '-top-6 text-xs text-violet-400'
                  : 'top-3.5 text-sm text-[#666]'
                  }`}
              >
                Password
              </label>

              {/* Premium Reveal Button */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-[#666] hover:text-white transition-colors"
              >
                <div className="relative w-5 h-5">
                  <motion.div
                    initial={false}
                    animate={{ opacity: showPassword ? 0 : 1, rotate: showPassword ? -90 : 0, scale: showPassword ? 0.5 : 1 }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0"
                  >
                    <Eye className="w-5 h-5" />
                  </motion.div>
                  <motion.div
                    initial={false}
                    animate={{ opacity: showPassword ? 1 : 0, rotate: showPassword ? 0 : 90, scale: showPassword ? 1 : 0.5 }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0"
                  >
                    <EyeOff className="w-5 h-5" />
                  </motion.div>
                </div>
              </button>
            </div>
          </motion.div>

          <motion.div custom={6} initial="hidden" animate="visible" variants={staggerVariants} className="flex justify-between items-center mt-2">
            <label className="flex items-center space-x-2 cursor-pointer group">
              <div className="relative w-4 h-4 rounded-[4px] border border-white/20 bg-white/5 group-hover:border-violet-400/50 transition-colors flex items-center justify-center overflow-hidden">
                <input type="checkbox" className="peer sr-only" />
                <div className="absolute inset-0 bg-violet-500 scale-0 peer-checked:scale-100 transition-transform duration-200 ease-out"></div>
                <svg viewBox="0 0 24 24" className="w-3 h-3 text-white absolute inset-0 m-auto opacity-0 peer-checked:opacity-100 transition-opacity duration-200 delay-100" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </div>
              <span className="text-sm text-[#888] group-hover:text-[#aaa] transition-colors">Remember me</span>
            </label>
            <a href="#" className="text-sm text-violet-400 hover:text-violet-300 transition-colors">Forgot password?</a>
          </motion.div>

          {/* Main CTA */}
          <motion.div custom={7} initial="hidden" animate="visible" variants={staggerVariants} className="pt-4">
            <div className="w-full bg-white/[0.01] backdrop-blur-[20px] rounded-full p-1.5 border border-white/[0.06] shadow-[inset_0_1px_2px_rgba(0,0,0,0.5),0_8px_24px_rgba(0,0,0,0.4)]">
              <button
                type="submit"
                disabled={isLoading}
                className="relative w-full h-11 px-5 py-2 rounded-full flex items-center justify-center font-medium transition-all duration-500 z-10 group overflow-hidden"
              >
                {/* 1. Authentic Apple Glass Backdrop (Massive blur, high saturation, extremely low opacity) */}
                <div className="absolute inset-0 bg-white/[0.02] group-hover:bg-white/[0.06] backdrop-blur-[40px] saturate-[150%] transition-colors duration-500 -z-20"></div>

                {/* 2. Specular Top Edge Highlight (The secret to Apple's 3D physical glass) */}
                <div className="absolute inset-0 rounded-full border border-white/[0.08] shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),inset_0_-1px_2px_rgba(0,0,0,0.2)] -z-10 group-hover:border-white/[0.12] transition-colors duration-500"></div>

                {/* 3. Subtle internal light volume */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.08] to-transparent opacity-40 group-hover:opacity-80 transition-opacity duration-500 -z-10"></div>

                <span className="relative z-20 flex items-center justify-center text-white/90 group-hover:text-white font-medium transition-all duration-300 drop-shadow-md">
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin text-white/80" />
                  ) : (
                    "Sign In"
                  )}
                </span>
              </button>
            </div>
          </motion.div>
        </form>

        <motion.div custom={8} initial="hidden" animate="visible" variants={staggerVariants} className="mt-8 text-center">
          <span className="text-[#666] text-sm">Don't have an account? </span>
          <a href="#" className="text-white text-sm font-medium hover:text-violet-400 transition-colors">Request Access</a>
        </motion.div>

      </div>

      {/* Global styles for animations used in this component */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes sweep {
          0% { left: -100%; }
          100% { left: 200%; }
        }
      `}} />
    </div>
  );
}
