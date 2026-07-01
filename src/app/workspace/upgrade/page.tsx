"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Check, Crown, ArrowRight } from "lucide-react";

export default function UpgradePage() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("yearly");

  const plans = [
    {
      name: "Premium",
      desc: "Essential features for advanced job seekers and standard agent queries.",
      price: { monthly: 799, yearly: 639 },
      badge: "Starter",
      features: [
        "Instant Mode (single-agent queries)",
        "Resume parsing & templates",
        "Up to 10 connection requests/day",
        "Standard security & cloud sync"
      ],
      cta: "Upgrade to Premium",
      active: false,
      popular: false,
      glow: "from-slate-800/10 to-slate-900/10"
    },
    {
      name: "Premium Pro",
      desc: "Unlock unlimited multi-agent deep research, corporate outreach, and priority support.",
      price: { monthly: 999, yearly: 799 },
      badge: "Recommended",
      features: [
        "Expert Mode (multi-agent research)",
        "Corporate Mode (outreach)",
        "Unlimited Workspace Export",
        "Priority AI processing (10x faster)",
        "E2E secure database sync"
      ],
      cta: "Upgrade to Premium Pro",
      active: false,
      popular: true,
      glow: "from-blue-600/20 via-purple-600/10 to-transparent"
    }
  ];

  return (
    <div className="px-4 py-2 md:px-8 max-w-[960px] mx-auto w-full h-full flex flex-col justify-center gap-5 overflow-hidden">

      {/* Header Section */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] md:items-end gap-6 max-w-3xl mx-auto w-full">
        <div className="text-left">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[10px] font-semibold uppercase tracking-widest mb-2"
          >
            <Crown size={11} className="text-amber-400" /> Premium Access
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-[26px] md:text-[32px] font-extrabold text-white tracking-tight leading-none"
          >
            Select Your Strategy
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-[13px] text-zinc-400 mt-2 leading-relaxed"
          >
            Power up your ForgeX workspace with advanced agent engines, priority processing speeds, and data portability.
          </motion.p>
        </div>

        {/* Billing Switcher (Frosted Glass Pill Switcher) */}
        <div className="flex items-center md:justify-end shrink-0 md:mb-1">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="inline-flex items-center gap-1 bg-white/[0.02] backdrop-blur-xl border border-white/[0.06] rounded-full p-0.5 shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.05)] relative"
          >
            <button
              onClick={() => setBillingPeriod("monthly")}
              className={`px-4 py-1 rounded-full text-[10px] font-bold tracking-wide transition-all duration-300 relative z-10 ${
                billingPeriod === "monthly" ? "text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              {billingPeriod === "monthly" && (
                <motion.div
                  layoutId="active-glass-pill"
                  className="absolute inset-0 rounded-full -z-10 bg-white/[0.08] border border-white/10 shadow-[0_2px_8px_rgba(255,255,255,0.05),_inset_0_1px_1px_rgba(255,255,255,0.15)] backdrop-blur-md"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod("yearly")}
              className={`relative px-4 py-1 rounded-full text-[10px] font-bold tracking-wide transition-all duration-300 z-10 flex items-center gap-1.5 ${
                billingPeriod === "yearly" ? "text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              {billingPeriod === "yearly" && (
                <motion.div
                  layoutId="active-glass-pill"
                  className="absolute inset-0 rounded-full -z-10 bg-white/[0.08] border border-white/10 shadow-[0_2px_8px_rgba(255,255,255,0.05),_inset_0_1px_1px_rgba(255,255,255,0.15)] backdrop-blur-md"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              Yearly
              <span className="px-1.5 py-0.5 rounded-md text-[7px] font-bold bg-amber-500/10 border border-amber-500/20 text-amber-400 uppercase">
                Save 20%
              </span>
            </button>
          </motion.div>
        </div>
      </div>

      {/* Pricing Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch max-w-3xl mx-auto w-full">
        {plans.map((plan, idx) => {
          const price = plan.price[billingPeriod];
          const isPro = plan.popular;

          return (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 + idx * 0.1 }}
              className={`rounded-[24px] border overflow-hidden relative p-6 flex flex-col justify-between transition-all duration-300 ${
                isPro
                  ? "bg-zinc-950/55 border-indigo-500/30 shadow-[0_20px_50px_rgba(99,102,241,0.1),_inset_0_1px_0_rgba(255,255,255,0.08)]"
                  : "bg-zinc-900/30 border-white/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.3),_inset_0_1px_0_rgba(255,255,255,0.04)]"
              } backdrop-blur-xl`}
            >
              {/* Refraction background decoration for Pro */}
              {isPro && (
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-transparent pointer-events-none z-0" />
              )}

              <div className="relative z-10 flex flex-col gap-4">
                {/* Card Title Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">
                      {plan.badge}
                    </span>
                    <h3 className="text-[18px] font-extrabold text-white mt-0.5 tracking-tight">
                      {plan.name}
                    </h3>
                  </div>
                  {isPro && (
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
                      <Crown size={14} />
                    </div>
                  )}
                </div>

                <p className="text-[12px] text-zinc-400 leading-normal">
                  {plan.desc}
                </p>

                {/* Pricing Details */}
                <div className="py-2 border-y border-white/[0.05] flex items-baseline gap-1.5">
                  <span className="text-[32px] font-extrabold text-white tracking-tight leading-none">
                    ₹{price}
                  </span>
                  <div className="flex flex-col">
                    <span className="text-[11px] text-zinc-450 font-medium">/ month</span>
                    {billingPeriod === "yearly" && (
                      <span className="text-[9px] text-indigo-400 font-semibold uppercase tracking-wider">Billed annually</span>
                    )}
                  </div>
                </div>

                {/* Features List */}
                <div className="flex flex-col gap-2.5 my-1">
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                    Included Features
                  </p>
                  {plan.features.map((feat) => (
                    <div key={feat} className="flex items-start gap-3 text-[12px] text-zinc-300 leading-relaxed font-medium">
                      <div className="w-4 h-4 rounded-full bg-white/[0.03] border border-white/[0.06] flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                        <Check size={10} className={isPro ? "text-indigo-400" : "text-zinc-500"} />
                      </div>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="relative z-10 mt-5 pt-3 border-t border-white/[0.05]">
                {isPro ? (
                  <button className="w-full py-2.5 rounded-xl bg-white text-zinc-950 hover:bg-zinc-100 font-bold text-[12.5px] transition-all shadow-[0_4px_20px_rgba(255,255,255,0.15)] hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-1.5 cursor-pointer">
                    Upgrade to Premium Pro <ArrowRight size={13} />
                  </button>
                ) : (
                  <button className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-[12.5px] transition-all active:scale-[0.99] cursor-pointer">
                    {plan.cta}
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
