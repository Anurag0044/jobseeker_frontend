"use client";

import React, { useState } from "react";
import { motion, Variants } from "framer-motion";
import {
  Download, Plus, Users, ShieldCheck, Activity, UserMinus, Search,
  Filter, ChevronDown, MoreHorizontal, Check, X, ExternalLink,
  MessageSquare, UserX, Key, UserCog, FileText, ArrowRight, Shield
} from "lucide-react";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.04, delayChildren: 0.05 } },
};

const itemVariants: Variants = {
  hidden: { y: 15, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring" as const, stiffness: 300, damping: 24 } },
};

export default function AdminUsersPage() {
  return (
    <div className="px-8 pb-16 pt-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-[1400px] mx-auto flex flex-col gap-8"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex items-start justify-between">
          <div>
            <h1 className="text-[26px] font-semibold text-white tracking-tight mb-1">Users</h1>
            <p className="text-[13px] text-[#a1a1aa]">Manage and monitor platform users.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-[#121212] border border-[#262626] text-white text-[13px] font-medium rounded-lg hover:bg-[#1A1A1A] transition-colors">
              <Download size={16} /> Export
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#5e5ce6] hover:bg-[#4d4ad5] text-white text-[13px] font-medium rounded-lg transition-colors shadow-lg shadow-[#5e5ce6]/20">
              <Plus size={16} /> Add User
            </button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Users" value="24,851" change="+12.4%" trend="up" icon={<Users size={16} />} color="text-[#b19cd9]" bg="bg-[#b19cd9]/10" />
          <StatCard title="Verified Users" value="18,742" change="+8.7%" trend="up" icon={<ShieldCheck size={16} />} color="text-[#22c55e]" bg="bg-[#22c55e]/10" />
          <StatCard title="Active Users" value="6,243" change="+10.1%" trend="up" icon={<Activity size={16} />} color="text-[#3b82f6]" bg="bg-[#3b82f6]/10" />
          <StatCard title="Suspended Users" value="142" change="-2.3%" trend="down" icon={<UserMinus size={16} />} color="text-[#ef4444]" bg="bg-[#ef4444]/10" />
        </motion.div>

        {/* Main Grid */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          
          {/* LEFT: Table Container */}
          <div className="xl:col-span-8 flex flex-col gap-4">
            
            {/* Search & Filters */}
            <div className="bg-[#0A0A0A] border border-[#1e1e1e] rounded-xl p-3 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-[320px]">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#71717a]" />
                <input 
                  type="text" 
                  placeholder="Search users by name, email, or username..." 
                  className="w-full bg-[#121212] border border-[#262626] rounded-lg pl-9 pr-4 py-2 text-[12px] text-white placeholder:text-[#71717a] outline-none focus:border-[#3f3f46] transition-colors"
                />
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto custom-scrollbar pb-1 sm:pb-0">
                <FilterDropdown label="All Status" />
                <FilterDropdown label="All Roles" />
                <FilterDropdown label="Verified" />
                <button className="flex items-center gap-2 px-3 py-2 bg-[#121212] border border-[#262626] text-white text-[12px] rounded-lg hover:bg-[#1A1A1A] transition-colors ml-auto sm:ml-0 shrink-0">
                  <Filter size={14} /> Filters
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="bg-[#0A0A0A] border border-[#1e1e1e] rounded-xl overflow-hidden flex flex-col">
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="border-b border-[#1e1e1e] bg-[#0A0A0A]">
                      <th className="py-4 pl-6 pr-4 w-[40px]"><input type="checkbox" className="accent-[#5e5ce6] w-4 h-4 bg-[#121212] border-[#262626] rounded" /></th>
                      <th className="py-4 px-4 text-[11px] font-semibold text-[#71717a] uppercase tracking-wider">User</th>
                      <th className="py-4 px-4 text-[11px] font-semibold text-[#71717a] uppercase tracking-wider">Role</th>
                      <th className="py-4 px-4 text-[11px] font-semibold text-[#71717a] uppercase tracking-wider">Status</th>
                      <th className="py-4 px-4 text-[11px] font-semibold text-[#71717a] uppercase tracking-wider">Joined</th>
                      <th className="py-4 px-4 text-[11px] font-semibold text-[#b19cd9] uppercase tracking-wider flex items-center gap-1">Last Active <ChevronDown size={12} /></th>
                      <th className="py-4 pr-6 pl-4 w-[50px]"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <TableRow selected name="Orion Developer" email="orion.dev@example.com" role="User" status="Verified" date="May 12, 2024" active="2m ago" />
                    <TableRow name="Sarah Chen" email="sarah.chen@stripe.com" role="Recruiter" status="Verified" date="May 11, 2024" active="15m ago" />
                    <TableRow name="Alex Morgan" email="alex.morgan@vercel.com" role="User" status="Verified" date="May 10, 2024" active="1h ago" />
                    <TableRow name="Priya Patel" email="priya.patel@notion.so" role="User" status="Verified" date="May 9, 2024" active="2h ago" />
                    <TableRow name="Michael Rodriguez" email="michael.rodriguez@google.com" role="Recruiter" status="Pending" date="May 9, 2024" active="3h ago" />
                    <TableRow name="Emma Williams" email="emma.williams@airbnb.com" role="User" status="Verified" date="May 8, 2024" active="5h ago" />
                    <TableRow name="Daniel Kim" email="daniel.kim@meta.com" role="User" status="Suspended" date="May 7, 2024" active="2d ago" />
                    <TableRow name="Olivia Brown" email="olivia.brown@openai.com" role="User" status="Verified" date="May 7, 2024" active="6h ago" />
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-[#1e1e1e] bg-[#0A0A0A]">
                <span className="text-[12px] text-[#71717a]">Showing 1 to 8 of 24,851 users</span>
                <div className="flex items-center gap-1">
                  <PageBtn icon={<ChevronLeftIcon />} />
                  <PageBtn active>1</PageBtn>
                  <PageBtn>2</PageBtn>
                  <PageBtn>3</PageBtn>
                  <span className="px-2 text-[#71717a] text-[12px]">...</span>
                  <PageBtn>1,243</PageBtn>
                  <PageBtn icon={<ChevronRightIcon />} />
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT: Detail Panel */}
          <div className="xl:col-span-4 relative">
            <div className="sticky top-[88px] flex flex-col bg-[#0A0A0A] border border-[#1e1e1e] rounded-xl overflow-hidden shadow-2xl h-[calc(100vh-120px)]">
              <div className="absolute top-4 right-4 z-10 cursor-pointer text-[#71717a] hover:text-white transition-colors">
                <X size={18} />
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                
                {/* Profile Header */}
                <div className="flex flex-col mb-8">
                  <div className="w-16 h-16 rounded-full bg-[#121212] border border-[#262626] flex items-center justify-center text-[20px] font-bold text-[#b19cd9] mb-4 overflow-hidden">
                    <img src="https://i.pravatar.cc/100?img=11" alt="Avatar" className="w-full h-full object-cover opacity-80" />
                  </div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <h2 className="text-[20px] font-semibold text-white">Orion Developer</h2>
                    <ShieldCheckIcon />
                  </div>
                  <span className="text-[13px] text-[#a1a1aa] mb-1">orion.dev@example.com</span>
                  <span className="text-[13px] text-[#71717a] mb-3">@oriondev</span>
                  
                  <div className="flex items-center gap-2 text-[11px] text-[#71717a] mb-4">
                    <span>Joined May 12, 2024</span>
                    <span>•</span>
                    <span>2m ago</span>
                  </div>

                  <div className="flex">
                    <span className="px-2.5 py-1 bg-[#1A1A1A] border border-[#262626] rounded-md text-[11px] font-medium text-[#22c55e] flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]"></span> Verified User
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-8">
                  <button className="flex-1 flex items-center justify-center gap-2 py-2 bg-[#121212] border border-[#262626] hover:bg-[#1A1A1A] text-white text-[12px] font-medium rounded-lg transition-colors">
                    View Profile <ExternalLink size={12} />
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 py-2 bg-[#121212] border border-[#262626] hover:bg-[#1A1A1A] text-white text-[12px] font-medium rounded-lg transition-colors">
                    <MessageSquare size={14} /> Message
                  </button>
                  <button className="w-9 h-9 flex items-center justify-center bg-[#121212] border border-[#262626] hover:bg-[#1A1A1A] text-white rounded-lg transition-colors shrink-0">
                    <MoreHorizontal size={14} />
                  </button>
                </div>

                {/* Details Section */}
                <Section title="Details">
                  <DetailRow label="Role" value="User" />
                  <DetailRow label="Profile Status" value="Complete" color="text-[#22c55e]" />
                  <DetailRow label="Account Status" value="Active" color="text-[#22c55e]" />
                  <DetailRow label="Email Verified" value="Yes" icon={<Check size={12} />} color="text-[#22c55e]" />
                  <DetailRow label="Phone Verified" value="Yes" icon={<Check size={12} />} color="text-[#22c55e]" />
                  <DetailRow label="Two-Factor Auth" value="Enabled" color="text-[#22c55e]" />
                </Section>

                <div className="h-px w-full bg-[#1e1e1e] my-6"></div>

                {/* Quick Actions */}
                <Section title="Quick Actions">
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <ActionBtn icon={<UserMinus size={14} />} text="Suspend User" color="text-[#ef4444]" hover="hover:bg-[#ef4444]/10 hover:border-[#ef4444]/30" />
                    <ActionBtn icon={<Shield size={14} />} text="Verify User" color="text-[#22c55e]" hover="hover:bg-[#22c55e]/10 hover:border-[#22c55e]/30" />
                    <ActionBtn icon={<Key size={14} />} text="Reset Password" />
                    <ActionBtn icon={<UserCog size={14} />} text="Update Role" />
                  </div>
                  <ActionBtn icon={<FileText size={14} />} text="View Audit Logs" full />
                </Section>

                <div className="h-px w-full bg-[#1e1e1e] my-6"></div>

                {/* Recent Activity */}
                <Section title="Recent Activity">
                  <div className="flex flex-col gap-4 mb-4">
                    <ActivityRow icon={<Check size={14} className="text-[#22c55e]" />} title="Logged in" time="2m ago • Web" />
                    <ActivityRow icon={<UserCog size={14} className="text-[#22c55e]" />} title="Updated profile" time="1d ago • Web" />
                    <ActivityRow icon={<FileText size={14} className="text-[#eab308]" />} title="Created project &quot;Orion&quot;" time="3d ago • Web" />
                  </div>
                  <button className="text-[12px] text-[#b19cd9] flex items-center gap-1 hover:text-[#c2c1ff] transition-colors">
                    View all activity <ArrowRight size={12} />
                  </button>
                </Section>

              </div>
            </div>
          </div>

        </motion.div>
      </motion.div>
    </div>
  );
}

/* ─── Helpers ────────────────────────────────────────────── */

function StatCard({ title, value, change, trend, icon, color, bg }: Record<string, unknown>) {
  return (
    <div className="bg-[#121212] border border-[#1e1e1e] rounded-xl p-5 flex flex-col relative overflow-hidden">
      <div className={`absolute top-4 right-4 w-10 h-10 rounded-lg flex items-center justify-center ${color} ${bg}`}>
        {icon}
      </div>
      <span className="text-[12px] text-[#a1a1aa] font-medium mb-1">{title}</span>
      <span className="text-[28px] font-semibold text-white tracking-tight mb-2 leading-none">{value}</span>
      <div className="flex items-center gap-1 text-[11px]">
        <span className={trend === "up" ? "text-[#22c55e]" : "text-[#ef4444]"}>
          {trend === "up" ? "↗" : "↘"} {change}
        </span>
        <span className="text-[#71717a]">this week</span>
      </div>
    </div>
  );
}

function FilterDropdown({ label }: { label: string }) {
  return (
    <button className="flex items-center gap-2 px-3 py-2 bg-[#121212] border border-[#262626] text-white text-[12px] rounded-lg hover:bg-[#1A1A1A] transition-colors shrink-0">
      {label} <ChevronDown size={14} className="text-[#71717a]" />
    </button>
  );
}

function TableRow({ selected, name, email, role, status, date, active }: Record<string, unknown>) {
  return (
    <tr className={`border-b border-[#1e1e1e] group transition-colors ${selected ? "bg-[#1e1a2e]/30" : "hover:bg-[#121212]"}`}>
      <td className="py-3 pl-6 pr-4">
        <input type="checkbox" checked={selected} readOnly className="accent-[#5e5ce6] w-4 h-4 bg-[#121212] border-[#262626] rounded cursor-pointer" />
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#1A1A1A] border border-[#262626] overflow-hidden shrink-0">
            {/* Placeholder */}
            {selected && <img src="https://i.pravatar.cc/100?img=11" alt={name} className="w-full h-full object-cover opacity-80" />}
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1">
              <span className="text-[13px] font-medium text-white truncate">{name}</span>
              {selected && <ShieldCheckIcon />}
            </div>
            <span className="text-[11px] text-[#71717a] truncate">{email}</span>
          </div>
        </div>
      </td>
      <td className="py-3 px-4">
        <span className="px-2.5 py-1 bg-[#1A1A1A] border border-[#262626] text-[#a1a1aa] rounded text-[11px] font-medium">{role}</span>
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-1.5 text-[11px] font-medium">
          <span className={`w-1.5 h-1.5 rounded-full ${status === "Verified" ? "bg-[#22c55e]" : status === "Pending" ? "bg-[#eab308]" : "bg-[#ef4444]"}`}></span>
          <span className={status === "Verified" ? "text-[#22c55e]" : status === "Pending" ? "text-[#eab308]" : "text-[#ef4444]"}>{status}</span>
        </div>
      </td>
      <td className="py-3 px-4 text-[12px] text-[#a1a1aa]">{date}</td>
      <td className="py-3 px-4 text-[12px] text-[#a1a1aa]">{active}</td>
      <td className="py-3 pr-6 pl-4 text-right">
        <button className="text-[#71717a] hover:text-white transition-colors"><MoreHorizontal size={16} /></button>
      </td>
    </tr>
  );
}

function PageBtn({ active, icon, children }: Record<string, unknown>) {
  return (
    <button className={`w-8 h-8 flex items-center justify-center rounded-md text-[12px] font-medium transition-colors ${
      active 
        ? "bg-[#1e1a2e] border border-[#2a2440] text-[#b19cd9]" 
        : "text-[#a1a1aa] hover:bg-[#121212] hover:text-white"
    }`}>
      {icon || children}
    </button>
  );
}

function Section({ title, children }: Record<string, unknown>) {
  return (
    <div className="flex flex-col">
      <h3 className="text-[14px] font-semibold text-white mb-4">{title}</h3>
      {children}
    </div>
  );
}

function DetailRow({ label, value, icon, color }: Record<string, unknown>) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-[#1e1e1e] last:border-0">
      <span className="text-[12px] text-[#71717a]">{label}</span>
      <div className="flex items-center gap-1.5">
        {icon}
        <span className={`text-[12px] font-medium ${color || "text-[#e5e2e1]"}`}>{value}</span>
      </div>
    </div>
  );
}

function ActionBtn({ icon, text, color, hover, full }: Record<string, unknown>) {
  return (
    <button className={`flex items-center gap-2 px-3 py-2.5 bg-[#121212] border border-[#262626] rounded-lg transition-colors ${color || "text-[#a1a1aa] hover:text-white"} ${hover || "hover:bg-[#1A1A1A] hover:border-[#3f3f46]"} ${full ? "w-full justify-center" : "w-full"}`}>
      {icon} <span className="text-[12px] font-medium">{text}</span>
    </button>
  );
}

function ActivityRow({ icon, title, time }: Record<string, unknown>) {
  return (
    <div className="flex gap-3">
      <div className="mt-0.5">{icon}</div>
      <div className="flex flex-col">
        <span className="text-[12px] font-medium text-[#e5e2e1] mb-0.5">{title}</span>
        <span className="text-[10px] text-[#71717a]">{time}</span>
      </div>
    </div>
  );
}

function ShieldCheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="#b19cd9" stroke="#0a0a0a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" stroke="#0a0a0a" strokeWidth="3" />
    </svg>
  );
}

function ChevronLeftIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>;
}

function ChevronRightIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>;
}
