"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Check, Crown, ArrowRight, Zap, Shield, HelpCircle, HardDriveDownload } from "lucide-react";

export default function UpgradePage() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("yearly");

  const plans = [
    {
      name: "Free Tier",
      desc: "Essential features for initial jobseeker profiles and standard queries.",
      price: { monthly: 0, yearly: 0 },
      badge: "Starter",
      features: [
        "Access to Instant Mode (single-agent queries)",
        "Standard resume parsing and basic templates",
        "Join up to 3 communities",
        "10 active connections requests per day",
        "Standard security & cloud sync"
      ],
      cta: "Current Active Plan",
      active: true,
      popular: false,
      glow: "from-slate-800/10 to-slate-900/10"
    },
    {
      name: "Premium Pro",
      desc: "Unlock advanced multi-agent deep research, corporate outreach, and export tools.",
      price: { monthly: 19, yearly: 15 },
      badge: "Recommended",
      features: [
        "Access to Expert Mode (multi-agent research)",
        "Access to Corporate Mode (enterprise outreach)",
        "Unlimited Workspace Export (export full profile JSON)",
        "Create & administer unlimited communities",
        "Priority AI processing slots (10x faster)",
        "E2E secure database sync & advanced haptics"
      ],
      cta: "Upgrade to Premium",
      active: false,
      popular: true,
      glow: "from-blue-600/20 via-purple-600/10 to-transparent"
    }
  ];

  return (
    <div className="px-6 py-12 md:px-12 max-w-[1200px] mx-auto w-full min-h-0 flex flex-col gap-10">

      {/* Header Section */}
      <div className="text-center max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-[11px] font-semibold uppercase tracking-widest mb-4"
        >
          <Crown size={12} className="text-amber-400" /> Premium Access
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-[32px] md:text-[42px] font-extrabold text-white tracking-tight leading-tight"
        >
          Select Your Strategy
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="text-[14.5px] text-slate-400 mt-3 leading-relaxed"
        >
          Power up your ForgeX workspace with advanced agent engines, priority processing speeds, and data portability.
        </motion.p>

        {/* Billing Switcher (Pill Switcher) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="inline-flex items-center gap-1.5 bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-full p-1 mt-8 shadow-inner"
        >
          <button
            onClick={() => setBillingPeriod("monthly")}
            className={`px-4 py-1.5 rounded-full text-[11px] font-bold tracking-wide transition-all ${billingPeriod === "monthly"
              ? "bg-white/[0.08] text-white border border-white/10 shadow-sm"
              : "text-slate-400 hover:text-white"
              }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingPeriod("yearly")}
            className={`relative px-4 py-1.5 rounded-full text-[11px] font-bold tracking-wide transition-all flex items-center gap-1.5 ${billingPeriod === "yearly"
              ? "bg-white/[0.08] text-white border border-white/10 shadow-sm"
              : "text-slate-400 hover:text-white"
              }`}
          >
            Yearly
            <span className="px-1.5 py-0.5 rounded-md text-[8px] font-bold bg-amber-500/10 border border-amber-500/20 text-amber-400 uppercase">
              Save 20%
            </span>
          </button>
        </motion.div>
      </div>

      {/* Pricing Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch max-w-4xl mx-auto w-full">
        {plans.map((plan, idx) => {
          const price = plan.price[billingPeriod];
          const isPro = plan.popular;

          return (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + idx * 0.15 }}
              className={`rounded-[32px] border overflow-hidden relative p-8 flex flex-col justify-between transition-all duration-300 ${isPro
                ? "bg-[#0A0A0A]/50 border-blue-500/30 shadow-[inset_0_2px_3px_rgba(255,255,255,0.1),_0_20px_50px_rgba(59,130,246,0.15)] backdrop-blur-[60px]"
                : "bg-white/[0.01] border-white/[0.05] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),_0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-md"
                }`}
            >
              {/* Refraction background decoration for Pro */}
              {isPro && (
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/5 to-transparent pointer-events-none z-0" />
              )}

              {/* Premium frosted glass texture for Pro */}
              <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1.5px)] [background-size:12px_12px] z-0" />

              <div className="relative z-10 flex flex-col gap-6">
                {/* Card Title Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      {plan.badge}
                    </span>
                    <h3 className="text-[22px] font-extrabold text-white mt-1 tracking-tight">
                      {plan.name}
                    </h3>
                  </div>
                  {isPro && (
                    <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]">
                      <Crown size={16} />
                    </div>
                  )}
                </div>

                <p className="text-[13px] text-slate-400 leading-relaxed">
                  {plan.desc}
                </p>

                {/* Pricing Details */}
                <div className="py-2 border-y border-white/[0.04] flex items-baseline gap-1">
                  <span className="text-[36px] font-extrabold text-white tracking-tight">
                    ${price}
                  </span>
                  <span className="text-[13px] text-slate-500">
                    / {billingPeriod === "monthly" ? "month" : "month (billed yearly)"}
                  </span>
                </div>

                {/* Features List */}
                <div className="flex flex-col gap-3.5 my-2">
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                    Included Features
                  </p>
                  {plan.features.map((feat) => (
                    <div key={feat} className="flex items-start gap-3 text-[13px] text-slate-350 leading-relaxed font-medium">
                      <div className="w-5 h-5 rounded-full bg-white/[0.03] border border-white/[0.06] flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                        <Check size={11} className={isPro ? "text-blue-400" : "text-slate-500"} />
                      </div>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="relative z-10 mt-8 pt-4 border-t border-white/[0.04]">
                {isPro ? (
                  <button className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white text-[13.5px] font-bold transition-all shadow-[0_4px_20px_rgba(59,130,246,0.3)] hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2">
                    Upgrade to Premium <ArrowRight size={14} />
                  </button>
                ) : (
                  <button className="w-full py-3.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.05] border border-white/10 text-slate-400 hover:text-white text-[13.5px] font-bold transition-all active:scale-[0.99]">
                    {plan.cta}
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Feature Deep Dive / Details */}
      <div className="max-w-2xl mx-auto w-full mt-8">
        <h3 className="text-[15px] font-bold text-white text-center mb-6 uppercase tracking-widest">
          Premium Engine Highlights
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 bg-white/[0.01] border border-white/[0.04] rounded-2xl flex gap-4">
            <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 shrink-0 h-fit">
              <Zap size={16} />
            </div>
            <div>
              <h4 className="text-[13.5px] font-bold text-white mb-1">Expert Mode</h4>
              <p className="text-[11.5px] text-slate-550 leading-relaxed font-medium">
                Deploys multi-agent networks that research connection paths, cross-reference industry patterns, and fetch external metrics.
              </p>
            </div>
          </div>

          <div className="p-5 bg-white/[0.01] border border-white/[0.04] rounded-2xl flex gap-4">
            <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 shrink-0 h-fit">
              <Shield size={16} />
            </div>
            <div>
              <h4 className="text-[13.5px] font-bold text-white mb-1">Corporate Mode</h4>
              <p className="text-[11.5px] text-slate-550 leading-relaxed font-medium">
                Unlocks professional outreach scripts, cover letter automation, and specialized team portfolio templates.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
