import React from "react";
import Link from "next/link";
import SmoothScroller from "../components/layout/SmoothScroller";
import HeroSection from "../components/landing/HeroSection";
import ScrollShowcase from "../components/landing/ScrollShowcase";
import PremiumBentoGrid from "../components/landing/PremiumBentoGrid";
import ForgeXLogo from "../components/ui/ForgeXLogo";

import HoverNav from "../components/ui/HoverNav";

export default function LandingPage() {
  return (
    <SmoothScroller>
      <div className="relative min-h-screen bg-background text-on-background overflow-hidden font-body-lg">
        {/* Global Navigation */}
        <nav className="fixed top-0 w-full z-50 bg-black/60 backdrop-blur-xl border-b border-white/[0.06] transition-all duration-300">
          <div className="w-full px-6 md:px-12 h-16 grid grid-cols-[1fr_auto_1fr] items-center gap-md">
            {/* Logo — pinned left */}
            <div className="flex justify-start">
              <ForgeXLogo />
            </div>

            {/* Nav Links — centered */}
            <div className="flex justify-center">
              <HoverNav />
            </div>

            {/* Sign In — matches HoverNav pill style */}
            <div className="flex justify-end">
              <div className="flex items-center bg-gradient-to-br from-white/[0.06] to-white/[0.01] backdrop-blur-xl border border-white/10 rounded-full p-1.5 shadow-sm">
                <Link
                  href="/sign-in"
                  className="relative px-5 py-2 text-[14px] font-medium transition-colors duration-300 rounded-full z-10 text-[#999999] hover:text-white group"
                >
                  <span className="relative z-20">Sign In</span>
                  <span className="absolute inset-0 rounded-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/[0.08] backdrop-blur-md border border-white/20 shadow-[0_8px_20px_rgba(255,255,255,0.05),inset_0_1px_1px_rgba(255,255,255,0.4)]" />
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <main className="flex flex-col gap-xxl pb-xxl">
          <HeroSection />
          <ScrollShowcase />
          <PremiumBentoGrid />
        </main>

        {/* Footer */}
        <footer className="border-t border-white/5 py-xl mt-xxl relative z-10 bg-black">
          <div className="max-w-[1440px] mx-auto px-md md:px-xl flex flex-col md:flex-row justify-between items-center gap-md">
            <div className="font-title-md text-[14px] text-secondary">
              © 2024 ForgeX. Built for the AI era.
            </div>
            <div className="flex gap-md">
              <Link className="text-[13px] text-secondary hover:text-white transition-colors" href="#">Privacy</Link>
              <Link className="text-[13px] text-secondary hover:text-white transition-colors" href="#">Terms</Link>
              <Link className="text-[13px] text-secondary hover:text-white transition-colors" href="#">Security</Link>
            </div>
          </div>
        </footer>
      </div>
    </SmoothScroller>
  );
}

