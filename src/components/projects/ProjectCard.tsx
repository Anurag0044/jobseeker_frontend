"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Eye, ExternalLink, Globe, Folder, MoreHorizontal, CheckCircle2, Edit2, Trash2, X } from "lucide-react";
import Image from "next/image";
import { ViewMode } from "../../store/useProjectStore";
import { FirestoreProject } from "../../hooks/useFirestoreProjects";
import EditProjectModal from "./EditProjectModal";

interface ProjectCardProps {
  project: FirestoreProject;
  viewMode: ViewMode;
  isManageMode?: boolean;
  isSelected?: boolean;
  onSelect?: () => void;
  onDelete?: (id: string) => void;
}

export default function ProjectCard({ project, viewMode, isManageMode, isSelected, onSelect, onDelete }: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const coverSrc = project.coverUrl || "";

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        whileHover={{ y: -4 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={() => { if (isManageMode && onSelect) onSelect(); }}
        className={`group relative overflow-hidden backdrop-blur-xl transition-all duration-500 cursor-pointer shadow-sm
          ${isManageMode && !isSelected ? 'opacity-80 scale-[0.98]' : ''}
          ${viewMode === 'grid' ? 'rounded-[24px] flex flex-col h-full' : ''}
          ${viewMode === 'list' ? 'rounded-[20px] flex flex-row items-center gap-5 p-4' : ''}
          ${viewMode === 'compact' ? 'flex flex-row items-center justify-between p-3.5 border-t border-white/[0.08] border-x-0 border-b-0 shadow-none hover:bg-white/[0.03]' : ''}
        `}
        style={{
          background: viewMode === 'compact' ? 'transparent' : isManageMode && isSelected ? 'rgba(177,156,217,0.1)' : 'linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.01))',
          border: viewMode === 'compact' ? undefined : isManageMode && isSelected ? '1px solid #b19cd9' : '1px solid rgba(255,255,255,0.1)',
        }}
      >
        {/* Selection Overlay */}
        <AnimatePresence>
          {isManageMode && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className={`absolute top-4 left-4 z-30 w-6 h-6 rounded-full border-[2.5px] flex items-center justify-center transition-colors ${isSelected ? 'bg-[#b19cd9] border-[#b19cd9] text-black' : 'border-white/30 bg-black/40 text-transparent'}`}
            >
              <CheckCircle2 size={14} strokeWidth={3} className={isSelected ? 'opacity-100' : 'opacity-0'} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Kebab menu (non-manage mode) */}
        {!isManageMode && viewMode !== 'compact' && (
          <div className="absolute top-3 right-3 z-30 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="relative">
              <button
                onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
                className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-black/80 transition-colors"
              >
                <MoreHorizontal size={14} />
              </button>
              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: -5 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -5 }}
                    className="absolute right-0 top-10 w-36 bg-[#0a0a0a]/95 backdrop-blur-xl border border-white/[0.08] rounded-xl shadow-2xl overflow-hidden z-50 p-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => { setMenuOpen(false); setIsEditOpen(true); }}
                      className="w-full text-left px-3 py-2.5 text-[12px] text-[#a1a1aa] hover:text-white hover:bg-white/5 rounded-lg flex items-center gap-2 transition-all"
                    >
                      <Edit2 size={12} /> Edit Project
                    </button>
                    <button
                      onClick={() => { setMenuOpen(false); setConfirmDelete(true); }}
                      className="w-full text-left px-3 py-2.5 text-[12px] text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg flex items-center gap-2 transition-all"
                    >
                      <Trash2 size={12} /> Delete
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Image */}
        {(viewMode === 'grid' || viewMode === 'list') && (
          <div className={`relative overflow-hidden ${viewMode === 'grid' ? 'h-48 w-full p-2 pb-0' : 'h-28 w-40 rounded-xl shrink-0'}`}>
            <div className={`relative w-full h-full overflow-hidden ${viewMode === 'grid' ? 'rounded-[16px]' : 'rounded-xl'}`}>
              {coverSrc ? (
                <Image src={coverSrc} alt={project.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" unoptimized />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-white/5 to-black/20 flex items-center justify-center">
                  <Folder size={40} className="text-white/20" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
            </div>
            <AnimatePresence>
              {isHovered && viewMode === 'grid' && !isManageMode && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute bottom-4 right-4 flex items-center gap-2 z-20">
                  {project.links?.demo && (
                    <a href={project.links.demo} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                      <ExternalLink size={14} />
                    </a>
                  )}
                  {project.links?.github && (
                    <a href={project.links.github} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="w-9 h-9 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20 flex items-center justify-center hover:scale-110 transition-transform">
                      <Globe size={14} />
                    </a>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Content */}
        <div className={`flex-1 flex flex-col ${viewMode === 'grid' ? 'p-5 pt-4' : ''} ${viewMode === 'compact' ? 'flex-row items-center w-full gap-6' : ''}`}>
          <div className={viewMode === 'compact' ? 'flex-1 min-w-0' : 'mb-3'}>
            <div className="flex items-center justify-between mb-1.5">
              <h3 className={`font-bold text-white tracking-tight truncate transition-colors ${viewMode === 'compact' ? 'text-[15px]' : 'text-[17px]'}`}>{project.title}</h3>
              {viewMode === 'list' && (
                <button onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }} className="text-[#a1a1aa] hover:text-white p-1.5 rounded-full hover:bg-white/5">
                  <MoreHorizontal size={18} />
                </button>
              )}
            </div>
            {viewMode !== 'compact' && (
              <p className="text-[14px] text-[#a1a1aa] line-clamp-2 leading-relaxed">{project.description}</p>
            )}
          </div>

          <div className={`flex flex-wrap gap-2 ${viewMode === 'compact' ? 'w-[30%] justify-end' : 'mb-5'}`}>
            {project.tags.slice(0, viewMode === 'compact' ? 2 : 3).map((tag: string) => (
              <span key={tag} className="px-3 py-1 rounded-md text-[11px] font-semibold uppercase bg-white/[0.03] text-[#a1a1aa] border border-white/[0.05] group-hover:border-white/[0.15] transition-colors">{tag}</span>
            ))}
            {project.tags.length > (viewMode === 'compact' ? 2 : 3) && (
              <span className="px-2 py-1 rounded-md text-[11px] font-semibold text-[#737373] border border-white/5">+{project.tags.length - (viewMode === 'compact' ? 2 : 3)}</span>
            )}
          </div>

          <div className={`flex items-center text-[13px] text-[#737373] font-medium ${viewMode === 'compact' ? 'w-[15%] justify-end' : 'mt-auto justify-between'}`}>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5"><Star size={14} /> 0</div>
              <div className="flex items-center gap-1.5"><Eye size={14} /> 0</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Confirm delete overlay */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setConfirmDelete(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 max-w-[384px] w-full mx-4"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[16px] font-semibold text-white">Delete Project?</h3>
                <button onClick={() => setConfirmDelete(false)} className="text-[#71717a] hover:text-white"><X size={18} /></button>
              </div>
              <p className="text-[13px] text-[#a1a1aa] mb-6">
                <strong className="text-white">{project.title}</strong> will be permanently deleted. This cannot be undone.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setConfirmDelete(false)} className="flex-1 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-[13px] font-medium hover:bg-white/10 transition-all">Cancel</button>
                <button
                  onClick={() => { onDelete?.(project.id); setConfirmDelete(false); }}
                  className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-[13px] font-bold hover:bg-red-600 transition-all"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <EditProjectModal project={project} isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} />
    </>
  );
}
