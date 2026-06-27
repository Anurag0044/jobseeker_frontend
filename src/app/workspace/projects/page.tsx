"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Plus, Settings, Filter, Hash,
  LayoutGrid, List as ListIcon, Maximize2,
  ChevronDown, Trash2, FolderGit2, Sparkles, Loader2
} from "lucide-react";
import { useForgeProfile } from "../../../hooks/useForgeProfile";
import { useProjectStore } from "../../../store/useProjectStore";
import { useFirestoreProjects } from "../../../hooks/useFirestoreProjects";
import ProfileContextStrip from "../../../components/profile/ProfileContextStrip";
import ProjectCard from "../../../components/projects/ProjectCard";
import CreateProjectModal from "../../../components/projects/CreateProjectModal";
import { skillsData } from "../../../data/skillsData";

const SORT_OPTIONS = [
  { label: "Latest", value: "latest" },
  { label: "Oldest", value: "oldest" },
  { label: "A-Z", value: "a-z" },
];

export default function ProjectsPage() {
  const { displayProfile } = useForgeProfile();
  const { projects, loading, error, deleteProject } = useFirestoreProjects();

  const {
    activeCategory, setActiveCategory,
    viewMode, setViewMode, activeTags, setActiveTags,
    isManageMode, setManageMode, selectedProjectIds,
    toggleProjectSelection, clearSelection,
  } = useProjectStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showTags, setShowTags] = useState(false);
  const [activeSort, setActiveSort] = useState("latest");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const allTags = useMemo(() => Array.from(new Set(projects.flatMap((p) => p.tags || []))), [projects]);

  const filteredProjects = useMemo(() => {
    let list = [...projects];

    // Filter by category tab
    if (activeCategory && activeCategory !== 'all') {
      list = list.filter((p) => p.status?.toLowerCase() === activeCategory.toLowerCase() || p.category?.toLowerCase() === activeCategory.toLowerCase());
    }

    // Filter by search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((p) =>
        p.title.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Filter by tags
    if (activeTags.length > 0) {
      list = list.filter((p) => activeTags.every((tag) => p.tags?.includes(tag)));
    }

    // Sort
    if (activeSort === "a-z") list.sort((a, b) => a.title.localeCompare(b.title));
    else if (activeSort === "oldest") list.reverse();

    return list;
  }, [projects, activeCategory, searchQuery, activeTags, activeSort]);

  const handleBulkDelete = async () => {
    await Promise.all(selectedProjectIds.map((id) => deleteProject(id)));
    clearSelection();
    setManageMode(false);
  };

  return (
    <div className="h-full w-full relative flex flex-col overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#b19cd9]/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#402060]/20 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />

      <div className="w-full h-full px-6 sm:px-10 lg:px-16 pt-6 pb-6 flex flex-col gap-6 relative z-10 overflow-hidden">
        {/* Header */}
        <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="flex items-center gap-5 flex-1 min-w-0">
            <div className="w-12 h-12 rounded-full overflow-hidden border border-[#262626] bg-[#121212] shrink-0 flex items-center justify-center text-[16px] font-bold text-[#b19cd9]">
              {displayProfile?.photoURL ? (
                <img src={displayProfile.photoURL} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                displayProfile?.displayName?.charAt(0).toUpperCase() || "U"
              )}
            </div>
            <div className="flex flex-col min-w-0">
              <h1 className="text-[24px] font-semibold tracking-tight text-white leading-tight truncate">
                {displayProfile?.displayName ? `${displayProfile.displayName.split(" ")[0]}'s Projects` : "Projects"}
              </h1>
              <p className="text-[13px] text-[#a1a1aa] truncate mt-0.5">
                {displayProfile?.techStack?.slice(0, 4).join(" • ")} {displayProfile?.techStack?.length ? "•" : ""} {displayProfile?.title || "AI Engineer"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setManageMode(!isManageMode)}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-[13px] font-medium transition-all duration-300 ${isManageMode ? 'bg-[#b19cd9]/20 border border-[#b19cd9]/40 text-white' : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'}`}
            >
              <Settings size={14} /> {isManageMode ? 'Done' : 'Manage'}
            </button>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2 rounded-full text-[13px] font-semibold text-white transition-all"
              style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.25), rgba(59,130,246,0.1))', boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.2), 0 0 20px rgba(99,102,241,0.2)' }}
            >
              <Plus size={16} /> New Project
            </button>
          </div>
        </div>

        <ProfileContextStrip label="Projects Context" />

        {/* Control Bar */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="w-full flex flex-col gap-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center w-full">
            {/* Search + Filters */}
            <div className="flex-1 flex items-center bg-black/40 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-1.5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] w-full">
              <div className="relative flex-1 flex items-center">
                <Search className="absolute left-4 text-[#a1a1aa]" size={18} />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-none py-3 pl-12 pr-4 text-[14px] text-white placeholder-[#a1a1aa] focus:outline-none"
                />
              </div>
              <div className="w-[1px] h-6 bg-white/[0.08] mx-2" />
              <button onClick={() => { setShowTags(false); setShowFilters(!showFilters); }} className={`px-4 py-2 rounded-xl text-[13px] font-semibold flex items-center gap-2 transition-all ${showFilters ? 'bg-[#b19cd9]/20 text-[#b19cd9]' : 'text-[#a1a1aa] hover:bg-white/5 hover:text-white'}`}>
                <Filter size={16} /> Filter
              </button>
              <button onClick={() => { setShowFilters(false); setShowTags(!showTags); }} className={`px-4 py-2 rounded-xl text-[13px] font-semibold flex items-center gap-2 transition-all ${showTags ? 'bg-[#b19cd9]/20 text-[#b19cd9]' : 'text-[#a1a1aa] hover:bg-white/5 hover:text-white'}`}>
                <Hash size={16} /> Tags
              </button>
            </div>

            {/* Segmented Control */}
            <div className="flex p-1 bg-black/40 backdrop-blur-xl border border-white/[0.08] rounded-2xl w-full lg:w-auto overflow-x-auto no-scrollbar">
              {['All', 'Published', 'Drafts', 'Private'].map((tab) => (
                <button key={tab} onClick={() => setActiveCategory(tab.toLowerCase())} className={`relative px-5 py-2.5 text-[13px] font-semibold rounded-xl transition-colors whitespace-nowrap z-10 ${(activeCategory === tab.toLowerCase() || (!activeCategory && tab === 'All')) ? 'text-white' : 'text-[#a1a1aa] hover:text-white'}`}>
                  {(activeCategory === tab.toLowerCase() || (!activeCategory && tab === 'All')) && (
                    <motion.div layoutId="activeSegment" className="absolute inset-0 bg-white/[0.08] border border-white/20 rounded-xl -z-10" transition={{ type: "spring", stiffness: 400, damping: 30 }} />
                  )}
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence>
            {(showFilters || showTags) && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                <div className="p-5 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/[0.08]">
                  {showTags && (
                    <div className="flex flex-wrap gap-2.5">
                      {allTags.length === 0 ? <p className="text-[14px] text-[#a1a1aa]">No tags yet.</p> : allTags.map(tag => (
                        <button key={tag} onClick={() => setActiveTags(activeTags.includes(tag) ? activeTags.filter(t => t !== tag) : [...activeTags, tag])} className={`px-4 py-2 rounded-xl text-[13px] font-medium transition-all ${activeTags.includes(tag) ? 'bg-[#b19cd9] text-black' : 'bg-white/[0.03] text-[#a1a1aa] border border-white/[0.08] hover:text-white'}`}>{tag}</button>
                      ))}
                    </div>
                  )}
                  {showFilters && <p className="text-[14px] text-[#a1a1aa] flex items-center gap-2"><Sparkles size={16} className="text-[#b19cd9]" /> Advanced filtering coming soon.</p>}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-end gap-3 mt-2 w-full">
            <div className="relative">
              <button onClick={() => setIsSortOpen(!isSortOpen)} className="flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-medium text-[#a1a1aa] hover:text-white transition-colors">
                Sort: <span className="text-white">{SORT_OPTIONS.find(o => o.value === activeSort)?.label}</span>
                <ChevronDown size={14} className={`transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {isSortOpen && (
                  <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} className="absolute right-0 top-full mt-2 w-48 bg-[#0a0a0a]/90 backdrop-blur-2xl border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden z-50 p-1">
                    {SORT_OPTIONS.map(o => (
                      <button key={o.value} onClick={() => { setActiveSort(o.value); setIsSortOpen(false); }} className={`w-full text-left px-4 py-3 text-[13px] font-medium rounded-xl transition-all ${activeSort === o.value ? 'bg-[#b19cd9]/15 text-[#b19cd9]' : 'text-[#a1a1aa] hover:bg-white/5 hover:text-white'}`}>{o.label}</button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="flex items-center gap-1 bg-black/40 backdrop-blur-xl border border-white/[0.08] rounded-xl p-1">
              {[{ id: 'grid', icon: LayoutGrid }, { id: 'list', icon: ListIcon }, { id: 'compact', icon: Maximize2 }].map(m => (
                <button key={m.id} onClick={() => setViewMode(m.id as any)} className={`p-1.5 rounded-lg transition-all ${viewMode === m.id ? 'bg-white/10 text-white' : 'text-[#a1a1aa] hover:text-white hover:bg-white/5'}`}>
                  <m.icon size={16} />
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto min-h-0 custom-scrollbar pr-2 flex flex-col">
          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <Loader2 size={28} className="text-[#71717a] animate-spin" />
            </div>
          ) : error ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-[13px] text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2">{error}</p>
            </div>
          ) : filteredProjects.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 w-full flex flex-col items-center justify-center bg-black/20 backdrop-blur-md border border-white/[0.03] rounded-[32px] py-12">
              <div className="w-20 h-20 rounded-full bg-white/[0.02] flex items-center justify-center border border-white/[0.05] mb-6">
                <FolderGit2 size={32} className="text-[#a1a1aa]" />
              </div>
              <h2 className="text-[22px] font-bold text-white mb-3">Build something extraordinary.</h2>
              <div className="w-[400px]">
                <p className="text-[15px] text-[#a1a1aa] text-center mb-8 leading-relaxed">
                  {searchQuery || activeTags.length > 0 ? "No projects match your search." : "Your project showcase is empty. Create your first project."}
                </p>
              </div>
              {!searchQuery && activeTags.length === 0 && (
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="flex items-center gap-2 px-8 py-3.5 rounded-full text-[14px] font-semibold text-white"
                  style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.25), rgba(59,130,246,0.1))', boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.2), 0 0 20px rgba(99,102,241,0.2)' }}
                >
                  <Plus size={18} /> Create New Project
                </button>
              )}
            </motion.div>
          ) : (
            <motion.div layout className={`mt-2 grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
              <AnimatePresence mode="popLayout">
                {filteredProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    viewMode={viewMode}
                    isManageMode={isManageMode}
                    isSelected={selectedProjectIds.includes(project.id)}
                    onSelect={() => toggleProjectSelection(project.id)}
                    onDelete={deleteProject}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>

      {/* Floating Bulk Delete Bar */}
      <AnimatePresence>
        {isManageMode && selectedProjectIds.length > 0 && (
          <motion.div
            initial={{ y: 80, opacity: 0, x: '-50%' }}
            animate={{ y: 0, opacity: 1, x: '-50%' }}
            exit={{ y: 80, opacity: 0, x: '-50%' }}
            className="fixed bottom-8 left-1/2 z-50 flex items-center gap-6 px-8 py-4 bg-[#0a0a0a]/90 backdrop-blur-2xl border border-white/[0.1] rounded-full shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#b19cd9] text-black flex items-center justify-center font-bold text-[14px]">{selectedProjectIds.length}</div>
              <span className="text-[15px] font-semibold text-white">Selected</span>
            </div>
            <div className="w-[1px] h-6 bg-white/[0.1]" />
            <button onClick={clearSelection} className="text-[14px] font-medium text-[#a1a1aa] hover:text-white transition-colors">Cancel</button>
            <button onClick={handleBulkDelete} className="flex items-center gap-2 px-5 py-2.5 bg-red-500 text-white rounded-full text-[14px] font-bold hover:bg-red-600 transition-all">
              <Trash2 size={16} /> Delete Items
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <CreateProjectModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
    </div>
  );
}
