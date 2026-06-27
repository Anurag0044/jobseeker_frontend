"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Eye, ExternalLink, Globe, Folder, MoreHorizontal, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { Project, ViewMode } from "../../store/useProjectStore";

interface ProjectCardProps {
  project: Project;
  viewMode: ViewMode;
  isManageMode?: boolean;
  isSelected?: boolean;
  onSelect?: () => void;
}

export default function ProjectCard({ project, viewMode, isManageMode, isSelected, onSelect }: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => {
        if (isManageMode && onSelect) {
          onSelect();
        }
      }}
      className={`group relative overflow-hidden backdrop-blur-xl transition-all duration-500 cursor-pointer shadow-sm
        ${isManageMode && !isSelected ? 'opacity-80 scale-[0.98]' : ''}
        ${viewMode === 'grid' ? 'rounded-[24px] flex flex-col h-full' : ''}
        ${viewMode === 'list' ? 'rounded-[20px] flex flex-row items-center gap-5 p-4' : ''}
        ${viewMode === 'compact' ? 'flex flex-row items-center justify-between p-3.5 border-t border-white/[0.08] border-x-0 border-b-0 shadow-none hover:bg-white/[0.03]' : ''}
      `}
      style={{
        background: viewMode === 'compact' 
          ? 'transparent' 
          : isManageMode && isSelected 
            ? 'rgba(177,156,217,0.1)' 
            : 'linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.01))',
        border: viewMode === 'compact'
          ? undefined
          : isManageMode && isSelected
            ? '1px solid #b19cd9'
            : '1px solid rgba(255,255,255,0.1)',
      }}
    >
      {/* SELECTION OVERLAY */}
      <AnimatePresence>
        {isManageMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`absolute top-4 left-4 z-30 w-6 h-6 rounded-full border-[2.5px] flex items-center justify-center transition-colors ${isSelected ? 'bg-[#b19cd9] border-[#b19cd9] text-black' : 'border-white/30 bg-black/40 text-transparent group-hover:border-white/60'}`}
          >
            <CheckCircle2 size={14} strokeWidth={3} className={isSelected ? 'opacity-100' : 'opacity-0'} />
          </motion.div>
        )}
      </AnimatePresence>


      {/* IMAGE CONTAINER */}
      {(viewMode === 'grid' || viewMode === 'list') && (
        <div className={`relative overflow-hidden ${viewMode === 'grid' ? 'h-48 w-full p-2 pb-0' : 'h-28 w-40 rounded-xl shrink-0'}`}>
          <div className={`relative w-full h-full overflow-hidden ${viewMode === 'grid' ? 'rounded-[16px]' : 'rounded-xl'}`}>
            {project.media?.cover ? (
              <Image
                src={project.media.cover}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-white/5 to-black/20 flex flex-col items-center justify-center transition-transform duration-700 group-hover:scale-105">
                <Folder size={40} className="text-white/20" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
          </div>

          {/* Quick Actions (Hover) */}
          <AnimatePresence>
            {isHovered && viewMode === 'grid' && !isManageMode && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-4 right-4 flex items-center gap-2 z-20"
              >
                {project.links?.demo && (
                  <button className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                    <ExternalLink size={14} />
                  </button>
                )}
                {project.links?.github && (
                  <button className="w-9 h-9 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20 flex items-center justify-center hover:scale-110 transition-transform">
                    <Globe size={14} />
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* CONTENT */}
      <div className={`flex-1 flex flex-col ${viewMode === 'grid' ? 'p-5 pt-4' : ''} ${viewMode === 'compact' ? 'flex-row items-center w-full gap-6' : ''}`}>

        {/* Title & Description */}
        <div className={viewMode === 'compact' ? 'flex-1 min-w-0' : 'mb-3'}>
          <div className="flex items-center justify-between mb-1.5">
            <h3 className={`font-bold text-white tracking-tight truncate transition-colors ${viewMode === 'compact' ? 'text-[15px]' : 'text-[17px]'}`}>
              {project.title}
            </h3>
            {viewMode === 'list' && (
              <button className="text-[#a1a1aa] hover:text-white transition-colors p-1.5 rounded-full hover:bg-white/5">
                <MoreHorizontal size={18} />
              </button>
            )}
          </div>
          {viewMode !== 'compact' && (
            <p className="text-[14px] text-[#a1a1aa] line-clamp-2 leading-relaxed">
              {project.description}
            </p>
          )}
        </div>

        {/* Tags */}
        <div className={`flex flex-wrap gap-2 ${viewMode === 'compact' ? 'w-[30%] justify-end' : 'mb-5'}`}>
          {project.tags.slice(0, viewMode === 'compact' ? 2 : 3).map((tag: string) => (
            <span key={tag} className="px-3 py-1 rounded-md text-[11px] font-semibold tracking-wider uppercase bg-white/[0.03] text-[#a1a1aa] border border-white/[0.05] group-hover:border-white/[0.15] transition-colors shadow-sm">
              {tag}
            </span>
          ))}
          {project.tags.length > (viewMode === 'compact' ? 2 : 3) && (
            <span className="px-2 py-1 rounded-md text-[11px] font-semibold text-[#737373] bg-transparent border border-white/5">
              +{project.tags.length - (viewMode === 'compact' ? 2 : 3)}
            </span>
          )}
        </div>

        {/* Footer Metrics */}
        <div className={`flex items-center text-[13px] text-[#737373] font-medium ${viewMode === 'compact' ? 'w-[15%] justify-end' : 'mt-auto justify-between'}`}>
          <div className="flex items-center gap-4">
            {project.metrics?.likes !== undefined && (
              <div className="flex items-center gap-1.5 hover:text-[#fde047] transition-colors">
                <Star size={14} className={project.metrics.likes > 10 ? "fill-current" : ""} />
                {project.metrics.likes}
              </div>
            )}
            {project.metrics?.views !== undefined && (
              <div className="flex items-center gap-1.5 hover:text-white transition-colors">
                <Eye size={14} />
                {project.metrics.views.toLocaleString()}
              </div>
            )}
          </div>

          {viewMode === 'compact' && !isManageMode && (
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity ml-4">
              <button className="p-1.5 text-[#a1a1aa] hover:text-white transition-colors bg-white/5 rounded-full"><ExternalLink size={14} /></button>
            </div>
          )}
        </div>

      </div>
    </motion.div>
  );
}
