"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Settings, LayoutGrid, List, ChevronDown, Search, Filter, Hash, StretchHorizontal
} from "lucide-react";
import { useProjectStore, Project } from "../../../store/useProjectStore";
import ProjectCard from "../../../components/projects/ProjectCard";
import CreateProjectModal from "../../../components/projects/CreateProjectModal";
import ProjectDrawer from "../../../components/projects/ProjectDrawer";
import EmptyStates from "../../../components/ui/EmptyStates";

export default function ProjectsPage() {
  const { 
    projects, viewMode, sortMethod, searchQuery, 
    setViewMode, setSortMethod, setSearchQuery 
  } = useProjectStore();

  const [activeTab, setActiveTab] = useState("All Projects");
  const tabs = ["All Projects", "Published", "Drafts", "Private"];
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Filter and Sort Logic
  const filteredProjects = useMemo(() => {
    let result = [...projects];

    // Status filtering based on Tab
    if (activeTab === "Published") result = result.filter(p => p.status === 'Published');
    if (activeTab === "Drafts") result = result.filter(p => p.status === 'Draft');
    if (activeTab === "Private") result = result.filter(p => p.status === 'Private');

    // Search query filtering
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.category.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    // Sorting
    switch (sortMethod) {
      case 'latest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'views':
        result.sort((a, b) => b.metrics.views - a.metrics.views);
        break;
      case 'likes':
        result.sort((a, b) => b.metrics.likes - a.metrics.likes);
        break;
      case 'a-z':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }

    return result;
  }, [projects, activeTab, searchQuery, sortMethod]);

  const handleOpenProject = (project: Project) => {
    setSelectedProject(project);
    setIsDrawerOpen(true);
  };

  return (
    <div className="px-8 pb-16 pt-8">
      <div className="max-w-[1100px] mx-auto flex flex-col gap-6">
        
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-[28px] font-semibold text-white tracking-tight mb-1">Projects</h1>
            <p className="text-[14px] text-[#a1a1aa]">Manage your portfolio, open source, and side projects.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-[#121212] border border-[#262626] text-white text-[13px] font-medium rounded-lg hover:bg-[#1A1A1A] transition-colors">
              <Settings size={16} /> Manage
            </button>
            <button 
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#b19cd9] text-black text-[13px] font-bold rounded-lg hover:bg-[#c2c1ff] shadow-[0_0_15px_rgba(177,156,217,0.3)] transition-all"
            >
              <Plus size={16} /> New Project
            </button>
          </div>
        </div>

        {/* Command Palette Style Search & Filters */}
        <div className="flex items-center gap-4 p-2 bg-[#121212] border border-[#262626] rounded-xl relative focus-within:border-[#b19cd9] focus-within:ring-1 focus-within:ring-[#b19cd9]/50 transition-all">
          <Search size={18} className="text-[#71717a] ml-2" />
          <input 
            type="text" 
            placeholder="Search projects by name, technology, or category..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-[14px] text-white placeholder:text-[#71717a]"
          />
          <div className="flex items-center gap-2 pr-1">
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1A1A1A] rounded-lg text-[12px] text-[#a1a1aa] hover:text-white border border-[#262626] transition-colors">
              <Filter size={14} /> Filter
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1A1A1A] rounded-lg text-[12px] text-[#a1a1aa] hover:text-white border border-[#262626] transition-colors">
              <Hash size={14} /> Tags
            </button>
          </div>
        </div>

        {/* Tabs & View Controls */}
        <div className="flex items-center justify-between border-b border-[#1e1e1e] pb-3">
          <div className="flex gap-6">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-[13px] font-medium transition-colors relative ${
                  activeTab === tab ? "text-[#b19cd9]" : "text-[#a1a1aa] hover:text-white"
                }`}
              >
                {tab}
                {activeTab === tab && <div className="absolute -bottom-[13px] left-0 w-full h-[2px] bg-[#b19cd9] rounded-t-full"></div>}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative group cursor-pointer">
              <button className="flex items-center gap-1.5 text-[12px] text-[#a1a1aa] hover:text-white transition-colors">
                Sort by: <span className="capitalize text-white">{sortMethod.replace('-', ' to ')}</span> <ChevronDown size={14} />
              </button>
              {/* Dropdown would go here in full implementation, for now we rotate on click */}
              <select 
                className="absolute inset-0 opacity-0 cursor-pointer"
                value={sortMethod}
                onChange={(e) => setSortMethod(e.target.value as any)}
              >
                <option value="latest">Latest</option>
                <option value="oldest">Oldest</option>
                <option value="views">Most Viewed</option>
                <option value="likes">Most Liked</option>
                <option value="a-z">A to Z</option>
              </select>
            </div>
            <div className="w-px h-4 bg-[#262626]"></div>
            <div className="flex items-center gap-1 bg-[#121212] border border-[#262626] rounded-lg p-0.5">
              <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-[#262626] text-white' : 'text-[#71717a] hover:text-white'}`}><LayoutGrid size={14} /></button>
              <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-[#262626] text-white' : 'text-[#71717a] hover:text-white'}`}><StretchHorizontal size={14} /></button>
              <button onClick={() => setViewMode('compact')} className={`p-1.5 rounded-md transition-colors ${viewMode === 'compact' ? 'bg-[#262626] text-white' : 'text-[#71717a] hover:text-white'}`}><List size={14} /></button>
            </div>
          </div>
        </div>

        {/* Dynamic Project Rendering */}
        <div className="min-h-[400px]">
          {filteredProjects.length === 0 ? (
            projects.length === 0 
              ? <EmptyStates type="no-projects" onAction={() => setIsCreateModalOpen(true)} />
              : <EmptyStates type="no-results" searchQuery={searchQuery} />
          ) : (
            <motion.div 
              layout
              className={`
                ${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5' : ''}
                ${viewMode === 'list' ? 'flex flex-col gap-4' : ''}
                ${viewMode === 'compact' ? 'flex flex-col gap-2' : ''}
              `}
            >
              <AnimatePresence>
                {filteredProjects.map((proj) => (
                  <ProjectCard 
                    key={proj.id} 
                    project={proj} 
                    viewMode={viewMode} 
                    onClick={() => handleOpenProject(proj)} 
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>

      <CreateProjectModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />
      
      <ProjectDrawer 
        project={selectedProject} 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
      />
    </div>
  );
}
