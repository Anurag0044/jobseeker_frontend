"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Plus, Settings, Filter, Hash,
  LayoutGrid, List as ListIcon, Maximize2,
  ChevronDown, Trash2, CheckCircle2, FolderGit2,
  Sparkles
} from "lucide-react";
import { useForgeProfile } from "../../../hooks/useForgeProfile";
import { useProjectStore } from "../../../store/useProjectStore";
import ProfileContextStrip from "../../../components/profile/ProfileContextStrip";
import ProjectCard from "../../../components/projects/ProjectCard";
import CreateProjectModal from "../../../components/projects/CreateProjectModal";

const SORT_OPTIONS = [
  { label: "Latest", value: "latest" },
  { label: "Oldest", value: "oldest" },
  { label: "Most Viewed", value: "views" },
  { label: "Most Liked", value: "likes" },
  { label: "A-Z", value: "a-z" }
];

export default function ProjectsPage() {
  const { displayProfile } = useForgeProfile();
  const {
    projects, activeCategory, setActiveCategory,
    viewMode, setViewMode, activeTags, setActiveTags,
    isManageMode, setManageMode, selectedProjectIds,
    toggleProjectSelection, clearSelection, bulkDelete
  } = useProjectStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showTags, setShowTags] = useState(false);
  const [activeSort, setActiveSort] = useState("latest");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const allTags = Array.from(new Set(projects.flatMap(p => p.tags || [])));

  return (
    <div className="h-full w-full relative flex flex-col overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#b19cd9]/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#402060]/20 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />

      <div className="w-full h-full px-6 sm:px-10 lg:px-16 pt-6 pb-6 flex flex-col gap-6 relative z-10 overflow-hidden">

        {/* Sleek Native Header */}
        <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="flex items-center gap-5 flex-1 min-w-0">
            {/* Native Avatar */}
            <div className="w-12 h-12 rounded-full overflow-hidden border border-[#262626] bg-[#121212] shrink-0 flex items-center justify-center text-[16px] font-bold text-[#b19cd9]">
              {displayProfile?.photoURL ? (
                <img src={displayProfile.photoURL} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                displayProfile?.displayName?.charAt(0).toUpperCase() || "U"
              )}
            </div>

            <div className="flex flex-col min-w-0 justify-center">
              <h1 className="text-[24px] font-semibold tracking-tight text-white leading-tight truncate">
                {displayProfile?.displayName ? `${displayProfile.displayName.split(" ")[0]}'s Projects` : "Projects"}
              </h1>
              <p className="text-[13px] text-[#a1a1aa] truncate mt-0.5">
                {displayProfile?.techStack?.slice(0, 4).join(" • ")} {displayProfile?.techStack?.length ? '•' : ''} {displayProfile?.title || "AI Engineer"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button 
              onClick={() => setManageMode(!isManageMode)}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-[13px] font-medium transition-all duration-300 ${isManageMode ? 'bg-[#b19cd9]/20 backdrop-blur-2xl border border-[#b19cd9]/40 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]' : 'bg-white/5 backdrop-blur-2xl border border-white/10 text-white hover:bg-white/10 hover:border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]'}`}
            >
              <Settings size={14} className={isManageMode ? 'animate-spin-slow' : ''} /> {isManageMode ? 'Done' : 'Manage'}
            </button>
            <button 
              onClick={() => setIsCreateModalOpen(true)}
              className="relative flex items-center justify-center gap-2 px-5 py-2 rounded-full text-[13px] font-semibold text-white transition-all duration-300 group overflow-hidden hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.25) 0%, rgba(59, 130, 246, 0.1) 100%)',
                boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.2), 0 4px 15px rgba(0,0,0,0.2), 0 0 20px rgba(99,102,241,0.2)',
              }}
            >
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
                <div className="w-full h-full animate-[spin_4s_linear_infinite]" style={{ background: "conic-gradient(from 0deg, transparent 0 340deg, rgba(255,255,255,0.8) 360deg)" }} />
              </div>
            </div>
            <Plus size={16} className="relative z-10" /> 
            <span className="relative z-10">New Project</span>
          </button>
          </div>
        </div>

        {/* Premium Control Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full flex flex-col gap-4"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center w-full">
            {/* Unified Search & Filters */}
            <div className="flex-1 flex items-center bg-black/40 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-1.5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] w-full">
              <div className="relative flex-1 flex items-center">
                <Search className="absolute left-4 text-[#a1a1aa]" size={18} />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-none py-3 pl-12 pr-4 text-[14px] text-white placeholder-[#a1a1aa] focus:outline-none focus:ring-0"
                />
              </div>
              <div className="w-[1px] h-6 bg-white/[0.08] mx-2" />
              <button
                onClick={() => { setShowTags(false); setShowFilters(!showFilters); }}
                className={`px-4 py-2 rounded-xl text-[13px] font-semibold flex items-center gap-2 transition-all ${showFilters ? 'bg-[#b19cd9]/20 text-[#b19cd9]' : 'text-[#a1a1aa] hover:bg-white/5 hover:text-white'}`}
              >
                <Filter size={16} /> Filter
              </button>
              <button
                onClick={() => { setShowFilters(false); setShowTags(!showTags); }}
                className={`px-4 py-2 rounded-xl text-[13px] font-semibold flex items-center gap-2 transition-all ${showTags ? 'bg-[#b19cd9]/20 text-[#b19cd9]' : 'text-[#a1a1aa] hover:bg-white/5 hover:text-white'}`}
              >
                <Hash size={16} /> Tags
              </button>
            </div>

            {/* Apple-style Segmented Control */}
            <div className="flex p-1 bg-black/40 backdrop-blur-xl border border-white/[0.08] rounded-2xl w-full lg:w-auto overflow-x-auto no-scrollbar shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
              {['All', 'Published', 'Drafts', 'Private'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveCategory(tab.toLowerCase())}
                  className={`relative px-5 py-2.5 text-[13px] font-semibold rounded-xl transition-colors whitespace-nowrap z-10 ${activeCategory === tab.toLowerCase() ? 'text-white drop-shadow-md' : 'text-[#a1a1aa] hover:text-white'}`}
                >
                  {activeCategory === tab.toLowerCase() && (
                    <motion.div 
                      layoutId="activeSegment" 
                      className="absolute inset-0 bg-white/[0.08] backdrop-blur-md border border-white/20 rounded-xl -z-10 shadow-[0_8px_20px_rgba(255,255,255,0.05),inset_0_1px_1px_rgba(255,255,255,0.4)]" 
                      transition={{ type: "spring", stiffness: 400, damping: 30 }} 
                    />
                  )}
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Animated Filter/Tag Panels */}
          <AnimatePresence>
            {(showFilters || showTags) && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: -10 }}
                className="overflow-hidden"
              >
                <div className="p-5 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/[0.08] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
                  {showTags && (
                    <div className="flex flex-wrap gap-2.5">
                      {allTags.length === 0 ? <p className="text-[14px] text-[#a1a1aa]">No tags available.</p> : allTags.map(tag => {
                        const isActive = activeTags.includes(tag);
                        return (
                          <button
                            key={tag}
                            onClick={() => {
                              if (isActive) {
                                setActiveTags(activeTags.filter(t => t !== tag));
                              } else {
                                setActiveTags([...activeTags, tag]);
                              }
                            }}
                            className={`px-4 py-2 rounded-xl text-[13px] font-medium transition-all duration-300 ${isActive ? 'bg-[#b19cd9] text-black shadow-[0_0_15px_rgba(177,156,217,0.4)] scale-105' : 'bg-white/[0.03] text-[#a1a1aa] border border-white/[0.08] hover:border-white/20 hover:text-white'}`}
                          >
                            {tag}
                          </button>
                        )
                      })}
                    </div>
                  )}
                  {showFilters && (
                    <p className="text-[14px] text-[#a1a1aa] flex items-center gap-2"><Sparkles size={16} className="text-[#b19cd9]" /> Advanced filtering options coming soon.</p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Sort & View Row */}
          <div className="flex justify-end gap-3 mt-2 w-full">
            <div className="relative">
              <button
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-transparent rounded-xl text-[13px] font-medium text-[#a1a1aa] hover:text-white transition-colors group"
              >
                Sort: <span className="text-white group-hover:text-[#b19cd9] transition-colors">{SORT_OPTIONS.find(o => o.value === activeSort)?.label}</span>
                <ChevronDown size={14} className={`transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {isSortOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 top-full mt-2 w-48 bg-[#0a0a0a]/90 backdrop-blur-2xl border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden z-50 p-1"
                  >
                    {SORT_OPTIONS.map(option => (
                      <button
                        key={option.value}
                        onClick={() => { setActiveSort(option.value); setIsSortOpen(false); }}
                        className={`w-full text-left px-4 py-3 text-[13px] font-medium rounded-xl transition-all ${activeSort === option.value ? 'bg-[#b19cd9]/15 text-[#b19cd9]' : 'text-[#a1a1aa] hover:bg-white/5 hover:text-white'}`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex items-center gap-1 bg-black/40 backdrop-blur-xl border border-white/[0.08] rounded-xl p-1">
              {[
                { id: 'grid', icon: LayoutGrid },
                { id: 'list', icon: ListIcon },
                { id: 'compact', icon: Maximize2 }
              ].map(mode => (
                <button
                  key={mode.id}
                  onClick={() => setViewMode(mode.id as 'grid' | 'list' | 'compact')}
                  className={`p-1.5 rounded-lg transition-all duration-300 ${viewMode === mode.id ? 'bg-white/10 text-white shadow-sm' : 'text-[#a1a1aa] hover:text-white hover:bg-white/5'}`}
                >
                  <mode.icon size={16} />
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Grid Content / Empty State */}
        <div className="flex-1 overflow-y-auto min-h-0 custom-scrollbar pr-2 flex flex-col">
          {projects.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex-1 w-full flex flex-col items-center justify-center bg-black/20 backdrop-blur-md border border-white/[0.03] rounded-[32px] shadow-inner py-12"
            >
              <div className="w-20 h-20 rounded-full bg-white/[0.02] flex items-center justify-center border border-white/[0.05] mb-6 shadow-lg">
                <FolderGit2 size={32} className="text-[#a1a1aa]" />
              </div>
              <h2 className="text-[22px] font-bold text-white mb-3">Build something extraordinary.</h2>

              {/* FIX: Replaced max-w-sm with a fixed width wrapper so text does NOT wrap to 1 word per line */}
              <div className="w-[400px]">
                <p className="text-[15px] text-[#a1a1aa] text-center mb-8 leading-relaxed">
                  Your project showcase is currently empty. Start by adding your first project to attract recruiters.
                </p>
              </div>

              <button 
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-[14px] font-semibold text-white transition-all duration-300 group overflow-hidden hover:scale-[1.05] active:scale-[0.95]"
              style={{
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.25) 0%, rgba(59, 130, 246, 0.1) 100%)',
                boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.2), 0 4px 15px rgba(0,0,0,0.2), 0 0 20px rgba(99,102,241,0.2)',
              }}
            >
              <Plus size={18} />
              Create New Project
            </button>
            </motion.div>
          ) : (
            <motion.div
              layout
              className={`mt-2 grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}
            >
              <AnimatePresence mode="popLayout">
                {projects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    viewMode={viewMode}
                    isManageMode={isManageMode}
                    isSelected={selectedProjectIds.includes(project.id)}
                    onSelect={() => toggleProjectSelection(project.id)}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>

      {/* Floating Action Bar */}
      <AnimatePresence>
        {isManageMode && selectedProjectIds.length > 0 && (
          <motion.div
            initial={{ y: 80, opacity: 0, x: '-50%' }}
            animate={{ y: 0, opacity: 1, x: '-50%' }}
            exit={{ y: 80, opacity: 0, x: '-50%' }}
            className="fixed bottom-8 left-1/2 z-50 flex items-center gap-6 px-8 py-4 bg-[#0a0a0a]/90 backdrop-blur-2xl border border-white/[0.1] rounded-full shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#b19cd9] text-black flex items-center justify-center font-bold text-[14px]">
                {selectedProjectIds.length}
              </div>
              <span className="text-[15px] font-semibold text-white">Selected</span>
            </div>
            <div className="w-[1px] h-6 bg-white/[0.1]" />
            <button onClick={clearSelection} className="text-[14px] font-medium text-[#a1a1aa] hover:text-white transition-colors">
              Cancel
            </button>
            <button
              onClick={() => { bulkDelete(); setManageMode(false); }}
              className="flex items-center gap-2 px-5 py-2.5 bg-red-500 text-white rounded-full text-[14px] font-bold hover:bg-red-600 transition-all shadow-[0_0_20px_rgba(239,68,68,0.4)]"
            >
              <Trash2 size={16} /> Delete Items
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <CreateProjectModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />
    </div>
  );
}
