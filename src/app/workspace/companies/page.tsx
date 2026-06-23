"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import {
  Search, Plus, Upload, ChevronLeft, ChevronRight,
  Bookmark, BadgeCheck, Filter, ChevronDown, MoreHorizontal,
  MapPin, Link as LinkIcon, ExternalLink, ShieldCheck,
  Edit, Users, Shield
} from "lucide-react";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring" as const, stiffness: 300, damping: 24 } },
};

export default function CompaniesPage() {
  return (
    <div className="px-8 pb-16 pt-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-[1400px] mx-auto flex flex-col gap-8"
      >
        <CompaniesHeader />
        <FeaturedCompanies />
        
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-8 flex flex-col gap-6">
            <CompaniesList />
          </div>
          <div className="xl:col-span-4 flex flex-col gap-6">
            <CompanyDetailsPane />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── Header ────────────────────────────────────────────── */

function CompaniesHeader() {
  return (
    <motion.div variants={itemVariants} className="flex flex-wrap justify-between items-start gap-4 w-full">
      <div className="flex flex-col">
        <h1 className="text-[28px] font-semibold text-white tracking-tight mb-1">Companies</h1>
        <p className="text-[14px] text-[#a1a1aa]">Discover companies, explore cultures, and find the right place to grow your career.</p>
      </div>
      <div className="flex items-center gap-3">
        <button className="px-4 py-2.5 bg-transparent border border-[#262626] text-white text-[13px] font-medium rounded-lg hover:bg-[#1A1A1A] transition-colors flex items-center gap-2">
          <Upload size={16} className="text-[#a1a1aa]" /> Import Company
        </button>
        <button className="px-4 py-2.5 bg-[#6366f1] text-white text-[13px] font-medium rounded-lg hover:bg-[#4f46e5] transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(99,102,241,0.3)]">
          <Plus size={16} /> Add Company
        </button>
      </div>
    </motion.div>
  );
}

/* ─── Featured Companies ────────────────────────────────── */

function FeaturedCompanies() {
  const featured = [
    {
      name: "Stripe", verified: true, industry: "Financial Infrastructure",
      location: "San Francisco, CA • Remote", roles: "245 Open Roles",
      logo: "S", logoBg: "bg-[#6366f1]",
      bgImage: "bg-gradient-to-br from-[#121212] to-[#1e1a2e]"
    },
    {
      name: "Notion", verified: true, industry: "Productivity Software",
      location: "San Francisco, CA • Hybrid", roles: "89 Open Roles",
      logo: "N", logoBg: "bg-[#000000]",
      bgImage: "bg-gradient-to-br from-[#121212] to-[#1A1A1A]"
    },
    {
      name: "Linear", verified: true, industry: "Developer Tools",
      location: "Remote • Worldwide", roles: "42 Open Roles",
      logo: "L", logoBg: "bg-[#5E6AD2]",
      bgImage: "bg-gradient-to-br from-[#121212] to-[#1e1a2e]"
    }
  ];

  return (
    <motion.div variants={itemVariants} className="bg-[#121212] border border-[#1e1e1e] rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-[15px] font-semibold text-white mb-1">Featured Companies</h3>
          <p className="text-[13px] text-[#a1a1aa]">Top companies actively hiring and building the future.</p>
        </div>
        <button className="text-[13px] text-[#b19cd9] flex items-center gap-1.5 hover:text-[#c2c1ff] transition-colors">
          View all <ChevronRight size={14} />
        </button>
      </div>

      <div className="relative flex items-center">
        <button className="absolute -left-3 w-8 h-8 bg-[#1A1A1A] border border-[#262626] rounded-full flex items-center justify-center text-white z-10 shadow-lg">
          <ChevronLeft size={16} />
        </button>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
          {featured.map((company, i) => (
            <div key={i} className="rounded-xl border border-[#262626] overflow-hidden relative group">
              {/* Background pseudo-image */}
              <div className={`absolute inset-0 ${company.bgImage} opacity-40 group-hover:opacity-60 transition-opacity`}></div>
              
              <div className="p-5 relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-12">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xl ${company.logoBg}`}>
                    {company.logo}
                  </div>
                  <button className="w-8 h-8 rounded-lg bg-black/40 backdrop-blur border border-white/10 flex items-center justify-center text-[#a1a1aa] hover:text-white transition-colors">
                    <Bookmark size={14} />
                  </button>
                </div>
                
                <div className="mt-auto flex flex-col gap-1">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-[16px] font-semibold text-white leading-none">{company.name}</h4>
                    {company.verified && <BadgeCheck size={16} className="text-[#6366f1]" fill="currentColor" stroke="#121212" />}
                  </div>
                  <span className="text-[12px] text-[#a1a1aa]">{company.industry}</span>
                  <span className="text-[12px] text-[#71717a] mt-1">{company.location}</span>
                  <div className="mt-4 inline-flex items-center justify-center w-fit px-3 py-1.5 bg-[#1A1A1A] border border-[#262626] rounded-md text-[11px] font-medium text-white">
                    {company.roles}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <button className="absolute -right-3 w-8 h-8 bg-[#1A1A1A] border border-[#262626] rounded-full flex items-center justify-center text-white z-10 shadow-lg">
          <ChevronRight size={16} />
        </button>
      </div>
    </motion.div>
  );
}

/* ─── Companies List (Table) ────────────────────────────── */

function CompaniesList() {
  const companies = [
    { name: "Stripe", industry: "Fintech", size: "1,000 - 5,000", location: "San Francisco, CA", roles: 245, status: "Verified", logo: "S", logoBg: "bg-[#6366f1]" },
    { name: "OpenAI", industry: "Artificial Intelligence", size: "500 - 1,000", location: "San Francisco, CA", roles: 68, status: "Verified", logo: "O", logoBg: "bg-emerald-600" },
    { name: "Vercel", industry: "Developer Tools", size: "250 - 500", location: "San Francisco, CA", roles: 34, status: "Verified", logo: "V", logoBg: "bg-white text-black" },
    { name: "Figma", industry: "Design Software", size: "1,000 - 5,000", location: "San Francisco, CA", roles: 56, status: "Verified", logo: "F", logoBg: "bg-rose-500" },
    { name: "Datadog", industry: "DevOps", size: "1,000 - 5,000", location: "New York, NY", roles: 77, status: "Verified", logo: "D", logoBg: "bg-purple-600" },
    { name: "GitHub", industry: "Developer Tools", size: "1,000 - 5,000", location: "San Francisco, CA", roles: 91, status: "Verified", logo: "G", logoBg: "bg-gray-800" },
    { name: "Anthropic", industry: "Artificial Intelligence", size: "500 - 1,000", location: "San Francisco, CA", roles: 39, status: "Verified", logo: "A", logoBg: "bg-[#b19cd9]" }
  ];

  return (
    <motion.div variants={itemVariants} className="bg-[#121212] border border-[#1e1e1e] rounded-xl flex flex-col h-full">
      {/* Filters */}
      <div className="p-4 border-b border-[#1e1e1e] flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#71717a]" />
          <input 
            type="text" 
            placeholder="Search companies by name, industry, or location..." 
            className="w-full h-10 bg-[#0A0A0A] border border-[#262626] rounded-lg pl-10 pr-4 text-[13px] text-white focus:outline-none focus:border-[#6366f1] transition-colors"
          />
        </div>
        
        {["Industry", "Company Size", "Location", "Remote"].map((filter, i) => (
          <button key={i} className="h-10 px-3 bg-[#0A0A0A] border border-[#262626] rounded-lg text-[13px] text-[#a1a1aa] flex items-center gap-2 hover:bg-[#1A1A1A] transition-colors whitespace-nowrap">
            {filter} <ChevronDown size={14} />
          </button>
        ))}
        
        <button className="h-10 px-3 bg-[#0A0A0A] border border-[#262626] rounded-lg text-[13px] text-white flex items-center gap-2 hover:bg-[#1A1A1A] transition-colors shrink-0">
          <Filter size={14} /> Filters
        </button>
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#1e1e1e]">
              <th className="py-4 px-6 text-[11px] font-medium text-[#71717a] uppercase tracking-wider whitespace-nowrap">Company</th>
              <th className="py-4 px-6 text-[11px] font-medium text-[#71717a] uppercase tracking-wider whitespace-nowrap">Industry</th>
              <th className="py-4 px-6 text-[11px] font-medium text-[#71717a] uppercase tracking-wider whitespace-nowrap">Size</th>
              <th className="py-4 px-6 text-[11px] font-medium text-[#71717a] uppercase tracking-wider whitespace-nowrap">Location</th>
              <th className="py-4 px-6 text-[11px] font-medium text-[#71717a] uppercase tracking-wider whitespace-nowrap">Open Roles</th>
              <th className="py-4 px-6 text-[11px] font-medium text-[#71717a] uppercase tracking-wider whitespace-nowrap text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e1e1e]">
            {companies.map((company, i) => (
              <tr key={i} className="hover:bg-[#1A1A1A]/50 transition-colors cursor-pointer">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white text-[16px] shrink-0 ${company.logoBg}`}>
                      {company.logo}
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[14px] font-medium text-white">{company.name}</span>
                        <BadgeCheck size={14} className="text-[#6366f1]" fill="currentColor" stroke="#121212" />
                      </div>
                      <span className="text-[11px] text-[#71717a] max-w-[200px] truncate">
                        {company.industry === "Fintech" ? "Financial infrastructure for the internet." : 
                         company.industry === "Artificial Intelligence" ? "AI research and deployment company." :
                         company.industry === "Developer Tools" ? "Develop. Preview. Ship." :
                         company.industry === "Design Software" ? "Collaborative interface design." :
                         company.industry === "DevOps" ? "Monitoring and security platform." :
                         "Where the world builds software."}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6 text-[13px] text-[#a1a1aa] whitespace-nowrap">{company.industry}</td>
                <td className="py-4 px-6 text-[13px] text-[#a1a1aa] whitespace-nowrap">{company.size}</td>
                <td className="py-4 px-6 text-[13px] text-[#a1a1aa] whitespace-nowrap">{company.location}</td>
                <td className="py-4 px-6 text-[13px] text-white font-medium whitespace-nowrap">{company.roles}</td>
                <td className="py-4 px-6 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-4">
                    <span className="text-[12px] font-medium text-[#22c55e]">Verified</span>
                    <button className="text-[#71717a] hover:text-white transition-colors">
                      <Bookmark size={16} />
                    </button>
                    <button className="text-[#71717a] hover:text-white transition-colors">
                      <MoreHorizontal size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="p-4 border-t border-[#1e1e1e] flex items-center justify-between mt-auto">
        <span className="text-[12px] text-[#71717a]">Showing 1 to 7 of 128 companies</span>
        <div className="flex items-center gap-1">
          <button className="w-8 h-8 flex items-center justify-center text-[#71717a] hover:text-white hover:bg-[#1A1A1A] rounded transition-colors"><ChevronLeft size={14} /></button>
          <button className="w-8 h-8 flex items-center justify-center text-[#b19cd9] bg-[#1e1a2e] border border-[#2a2440] rounded text-[13px] font-medium transition-colors">1</button>
          <button className="w-8 h-8 flex items-center justify-center text-[#a1a1aa] hover:text-white hover:bg-[#1A1A1A] rounded text-[13px] transition-colors">2</button>
          <button className="w-8 h-8 flex items-center justify-center text-[#a1a1aa] hover:text-white hover:bg-[#1A1A1A] rounded text-[13px] transition-colors">3</button>
          <span className="text-[#71717a] mx-1">...</span>
          <button className="w-8 h-8 flex items-center justify-center text-[#a1a1aa] hover:text-white hover:bg-[#1A1A1A] rounded text-[13px] transition-colors">19</button>
          <button className="w-8 h-8 flex items-center justify-center text-[#71717a] hover:text-white hover:bg-[#1A1A1A] rounded transition-colors"><ChevronRight size={14} /></button>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Company Details Pane ──────────────────────────────── */

function CompanyDetailsPane() {
  return (
    <motion.div variants={itemVariants} className="bg-[#121212] border border-[#1e1e1e] rounded-xl flex flex-col h-full overflow-hidden">
      {/* Header Cover */}
      <div className="h-[120px] bg-gradient-to-br from-[#6366f1]/20 to-[#1e1a2e] relative p-4 flex items-start justify-between">
        <div className="absolute inset-0 bg-[#0A0A0A]/20 backdrop-blur-sm pointer-events-none"></div>
        <div className="w-16 h-16 bg-[#6366f1] rounded-xl flex items-center justify-center text-white text-3xl font-bold shadow-lg relative z-10 mt-10 border-4 border-[#121212]">
          S
        </div>
        <div className="flex gap-2 relative z-10">
          <button className="w-8 h-8 bg-[#121212]/80 backdrop-blur border border-[#262626] rounded-lg flex items-center justify-center text-[#a1a1aa] hover:text-white transition-colors">
            <Bookmark size={14} />
          </button>
          <button className="w-8 h-8 bg-[#121212]/80 backdrop-blur border border-[#262626] rounded-lg flex items-center justify-center text-[#a1a1aa] hover:text-white transition-colors">
            <MoreHorizontal size={14} />
          </button>
        </div>
      </div>

      <div className="p-6 pt-8 pb-0 flex flex-col">
        <div className="flex items-center gap-1.5 mb-1">
          <h2 className="text-[20px] font-semibold text-white tracking-tight">Stripe</h2>
          <BadgeCheck size={18} className="text-[#6366f1]" fill="currentColor" stroke="#121212" />
        </div>
        <p className="text-[13px] text-[#e5e2e1] mb-4">Financial infrastructure for the internet.</p>
        
        <div className="flex flex-wrap gap-4 mb-5">
          <div className="flex items-center gap-1.5 text-[12px] text-[#a1a1aa]">
            <MapPin size={14} />
            <span>San Francisco, CA, USA</span>
          </div>
          <div className="flex items-center gap-1.5 text-[12px] text-[#6366f1]">
            <LinkIcon size={14} />
            <span>stripe.com</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {["Fintech", "Payments", "SaaS", "Infrastructure"].map((tag, i) => (
            <span key={i} className="px-2.5 py-1 bg-[#1A1A1A] border border-[#262626] text-[11px] text-[#a1a1aa] rounded-md">{tag}</span>
          ))}
        </div>

        <div className="flex items-center gap-3 mb-8">
          <button className="flex-1 h-9 bg-[#6366f1] text-white text-[13px] font-medium rounded-lg hover:bg-[#4f46e5] transition-colors">
            View Company
          </button>
          <button className="flex-1 h-9 bg-transparent border border-[#262626] text-white text-[13px] font-medium rounded-lg hover:bg-[#1A1A1A] transition-colors flex items-center justify-center gap-2">
            Visit Website <ExternalLink size={14} />
          </button>
          <button className="w-9 h-9 bg-transparent border border-[#262626] text-white rounded-lg hover:bg-[#1A1A1A] transition-colors flex items-center justify-center shrink-0">
            <MoreHorizontal size={16} />
          </button>
        </div>

        <div className="mb-8">
          <h3 className="text-[14px] font-semibold text-white mb-2">About Stripe</h3>
          <p className="text-[13px] text-[#a1a1aa] leading-relaxed mb-3">
            Stripe builds technology that powers online businesses and financial infrastructure for companies of all sizes.
          </p>
          <p className="text-[13px] text-[#a1a1aa] leading-relaxed">
            Millions of businesses around the world use Stripe to accept payments, send payouts, and manage their operations online.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="flex flex-col">
            <span className="text-[11px] text-[#71717a] mb-1">Founded</span>
            <span className="text-[13px] font-medium text-white">2010</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] text-[#71717a] mb-1">Employees</span>
            <span className="text-[13px] font-medium text-white">3,000+</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] text-[#71717a] mb-1">Company Size</span>
            <span className="text-[13px] font-medium text-white">1,000 - 5,000</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] text-[#71717a] mb-1">Funding</span>
            <span className="text-[13px] font-medium text-white">Series I</span>
          </div>
        </div>
      </div>

      <div className="border-t border-[#1e1e1e] p-6 pb-6 flex flex-col gap-4">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-[14px] font-semibold text-white">Open Roles</h3>
          <button className="text-[12px] text-[#6366f1] hover:text-[#818cf8] transition-colors">View all (245)</button>
        </div>

        <div className="flex flex-col gap-3">
          {[
            { title: "Frontend Engineer", loc: "Remote • Full-time", tag: "React", icon: "F" },
            { title: "Backend Engineer", loc: "San Francisco, CA • Full-time", tag: "Go", icon: "B" },
            { title: "Product Designer", loc: "Hybrid • Full-time", tag: "Figma", icon: "P" },
          ].map((role, i) => (
            <div key={i} className="flex items-center gap-3 group cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-[#1A1A1A] border border-[#262626] flex items-center justify-center text-[#a1a1aa] text-[14px] shrink-0 font-medium">
                {role.icon}
              </div>
              <div className="flex flex-col flex-1">
                <h4 className="text-[13px] font-medium text-white group-hover:text-[#6366f1] transition-colors">{role.title}</h4>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-[#71717a]">{role.loc}</span>
                  <span className="text-[10px] text-[#a1a1aa] bg-[#1A1A1A] px-1.5 py-0.5 rounded border border-[#262626]">{role.tag}</span>
                </div>
              </div>
              <Bookmark size={14} className="text-[#71717a] opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>
        
        <button className="text-[12px] text-[#6366f1] flex items-center gap-1.5 hover:text-[#818cf8] transition-colors w-fit mt-1">
          View all open roles <ChevronRight size={14} />
        </button>
      </div>

      {/* Admin Actions */}
      <div className="border-t border-[#1e1e1e] p-6 pt-5 bg-[#0A0A0A]/50">
        <h3 className="text-[13px] font-semibold text-white mb-4">Admin Actions</h3>
        <div className="grid grid-cols-5 gap-2 text-center">
          <button className="flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-[#1A1A1A] transition-colors group">
            <div className="w-8 h-8 rounded-md bg-[#121212] border border-[#262626] flex items-center justify-center text-[#71717a] group-hover:text-white transition-colors"><Edit size={14} /></div>
            <span className="text-[10px] text-[#a1a1aa] group-hover:text-white transition-colors">Edit Company</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-[#1A1A1A] transition-colors group">
            <div className="w-8 h-8 rounded-md bg-[#121212] border border-[#262626] flex items-center justify-center text-[#71717a] group-hover:text-white transition-colors"><Users size={14} /></div>
            <span className="text-[10px] text-[#a1a1aa] group-hover:text-white transition-colors">Manage Roles</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-[#1A1A1A] transition-colors group">
            <div className="w-8 h-8 rounded-md bg-[#121212] border border-[#262626] flex items-center justify-center text-[#71717a] group-hover:text-white transition-colors"><Shield size={14} /></div>
            <span className="text-[10px] text-[#a1a1aa] group-hover:text-white transition-colors">Company Users</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-[#1A1A1A] transition-colors group">
            <div className="w-8 h-8 rounded-md bg-[#121212] border border-[#262626] flex items-center justify-center text-[#22c55e] group-hover:text-[#4ade80] transition-colors"><ShieldCheck size={14} /></div>
            <span className="text-[10px] text-[#a1a1aa] group-hover:text-white transition-colors">Verification</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-[#1A1A1A] transition-colors group">
            <div className="w-8 h-8 rounded-md bg-[#121212] border border-[#262626] flex items-center justify-center text-[#71717a] group-hover:text-white transition-colors"><MoreHorizontal size={14} /></div>
            <span className="text-[10px] text-[#a1a1aa] group-hover:text-white transition-colors">More</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
