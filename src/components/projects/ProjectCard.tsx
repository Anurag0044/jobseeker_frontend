import React from 'react';
import { motion } from 'framer-motion';
import { Project, ViewMode } from '../../store/useProjectStore';
import { 
  Eye, Star, ExternalLink, Bookmark, MoreHorizontal, Play, GitFork
} from 'lucide-react';
import { SiGithub } from 'react-icons/si';
import { skillsData } from '../../data/skillsData';

interface ProjectCardProps {
  project: Project;
  viewMode: ViewMode;
  onClick: () => void;
}

export default function ProjectCard({ project, viewMode, onClick }: ProjectCardProps) {
  // Format dates nicely
  const formattedDate = new Date(project.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  
  // Find icons for the first 3 tags
  const renderTechStack = (limit = 3) => {
    return project.tags.slice(0, limit).map((tag, i) => {
      const skill = skillsData.find(s => s.name.toLowerCase() === tag.toLowerCase());
      return (
        <span key={i} className="flex items-center gap-1.5 px-2.5 py-1 bg-[#1A1A1A] border border-[#262626] rounded-md text-[11px] text-[#a1a1aa] whitespace-nowrap">
          {skill && <skill.icon size={10} style={{ color: skill.color }} />}
          {tag}
        </span>
      );
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Published': return 'text-[#a3e635] bg-[#a3e635]/10 border-[#a3e635]/20';
      case 'Draft': return 'text-[#fbbf24] bg-[#fbbf24]/10 border-[#fbbf24]/20';
      case 'Private': return 'text-[#f87171] bg-[#f87171]/10 border-[#f87171]/20';
      default: return 'text-[#a1a1aa] bg-[#1A1A1A] border-[#262626]';
    }
  };

  // GRID MODE
  if (viewMode === 'grid') {
    return (
      <motion.div
        layoutId={`project-${project.id}`}
        onClick={onClick}
        className="flex flex-col bg-[#121212] border border-[#1e1e1e] rounded-xl overflow-hidden hover:border-[#3f3f46] hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer group"
      >
        <div className={`w-full h-[180px] bg-gradient-to-br ${project.color} relative overflow-hidden flex items-center justify-center`}>
          {project.media?.cover ? (
            <img src={project.media.cover} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          ) : (
            <span className="text-[24px] font-bold text-white/30 tracking-widest uppercase">{project.title}</span>
          )}
          {project.featured && (
            <div className="absolute top-3 left-3 px-2 py-1 bg-black/40 backdrop-blur-md border border-white/10 rounded text-[10px] font-bold text-[#b19cd9] flex items-center gap-1 uppercase tracking-wider">
              <Star size={10} fill="currentColor" /> Featured
            </div>
          )}
          
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
            <button className="w-12 h-12 bg-white/10 border border-white/20 rounded-full flex items-center justify-center text-white backdrop-blur-md shadow-2xl scale-75 group-hover:scale-100 transition-transform">
              <Play size={18} className="ml-1" fill="currentColor" />
            </button>
          </div>
        </div>

        <div className="p-5 flex flex-col flex-1">
          <div className="flex items-start justify-between gap-3 mb-2">
            <h3 className="text-[16px] font-bold text-white truncate">{project.title}</h3>
            <span className={`px-2 py-0.5 rounded text-[10px] font-medium border shrink-0 ${getStatusColor(project.status)}`}>
              {project.status}
            </span>
          </div>
          <p className="text-[13px] text-[#a1a1aa] line-clamp-2 mb-4 flex-1 leading-relaxed">
            {project.tagline || project.description}
          </p>
          
          <div className="flex flex-wrap items-center gap-2 mb-5">
            {renderTechStack(3)}
            {project.tags.length > 3 && (
              <span className="text-[11px] text-[#71717a] font-medium">+{project.tags.length - 3}</span>
            )}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[#1e1e1e]">
            <div className="flex items-center gap-4 text-[#71717a] text-[12px] font-medium">
              <span className="flex items-center gap-1.5 hover:text-white transition-colors"><Eye size={14} /> {project.metrics.views.toLocaleString()}</span>
              <span className="flex items-center gap-1.5 hover:text-[#b19cd9] transition-colors"><Star size={14} /> {project.metrics.likes.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <button className="w-7 h-7 flex items-center justify-center rounded bg-[#1A1A1A] border border-[#262626] text-[#a1a1aa] hover:text-white transition-colors" onClick={(e) => e.stopPropagation()}>
                <Bookmark size={14} />
              </button>
              <button className="w-7 h-7 flex items-center justify-center rounded bg-[#1A1A1A] border border-[#262626] text-[#a1a1aa] hover:text-white transition-colors" onClick={(e) => e.stopPropagation()}>
                <MoreHorizontal size={14} />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // LIST MODE
  if (viewMode === 'list') {
    return (
      <motion.div
        layoutId={`project-${project.id}`}
        onClick={onClick}
        className="flex gap-6 p-5 bg-[#121212] border border-[#1e1e1e] rounded-xl hover:border-[#3f3f46] hover:bg-[#151515] transition-all cursor-pointer group"
      >
        <div className={`w-[240px] h-[140px] bg-gradient-to-br ${project.color} rounded-lg relative overflow-hidden flex items-center justify-center shrink-0`}>
          {project.media?.cover ? (
            <img src={project.media.cover} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          ) : (
            <span className="text-[16px] font-bold text-white/30 tracking-widest uppercase">{project.title}</span>
          )}
          {project.status === 'Draft' && (
             <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded border border-white/10 text-white text-[10px] font-bold">
               {project.completionPercentage}% Complete
             </div>
          )}
        </div>

        <div className="flex flex-col flex-1 justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1.5">
              <h3 className="text-[18px] font-bold text-white group-hover:text-[#b19cd9] transition-colors">{project.title}</h3>
              {project.featured && <span className="px-2 py-0.5 bg-[#5e5ce6]/20 border border-[#5e5ce6]/40 text-[#c2c1ff] rounded text-[10px] font-medium uppercase tracking-wide">Featured</span>}
              <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${getStatusColor(project.status)}`}>{project.status}</span>
            </div>
            <p className="text-[13px] text-[#a1a1aa] mb-3 leading-relaxed line-clamp-2 max-w-2xl">{project.description}</p>
            <div className="flex items-center gap-2">
              {renderTechStack(5)}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end justify-between shrink-0 min-w-[160px] pl-4 border-l border-[#1e1e1e]">
          <div className="flex flex-col gap-2 w-full">
            <div className="flex items-center justify-between text-[12px] text-[#71717a]">
              <span className="flex items-center gap-1.5"><Eye size={14} /> Views</span>
              <span className="text-white font-medium">{project.metrics.views.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-[12px] text-[#71717a]">
              <span className="flex items-center gap-1.5"><Star size={14} /> Likes</span>
              <span className="text-white font-medium">{project.metrics.likes.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-[12px] text-[#71717a]">
              <span className="flex items-center gap-1.5"><GitFork size={14} /> Forks</span>
              <span className="text-white font-medium">{project.metrics.forks.toLocaleString()}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 mt-4 w-full justify-end">
            {project.links?.github && (
              <button className="w-7 h-7 flex items-center justify-center rounded bg-[#1A1A1A] border border-[#262626] text-[#a1a1aa] hover:text-white transition-colors" onClick={(e) => e.stopPropagation()}>
                <SiGithub size={14} />
              </button>
            )}
            {project.links?.demo && (
              <button className="w-7 h-7 flex items-center justify-center rounded bg-[#1A1A1A] border border-[#262626] text-[#a1a1aa] hover:text-white transition-colors" onClick={(e) => e.stopPropagation()}>
                <ExternalLink size={14} />
              </button>
            )}
            <button className="w-7 h-7 flex items-center justify-center rounded bg-[#1A1A1A] border border-[#262626] text-[#a1a1aa] hover:text-white transition-colors" onClick={(e) => e.stopPropagation()}>
              <MoreHorizontal size={14} />
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  // COMPACT MODE (GitHub Style)
  return (
    <motion.div
      layoutId={`project-${project.id}`}
      onClick={onClick}
      className="flex flex-col p-4 bg-[#0A0A0A] border border-[#1e1e1e] rounded-xl hover:border-[#3f3f46] hover:bg-[#121212] transition-all cursor-pointer"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <h3 className="text-[15px] font-semibold text-[#b19cd9] hover:underline decoration-[#b19cd9]/30 underline-offset-4">{project.title}</h3>
          <span className={`px-2 py-0.5 rounded-full border text-[10px] font-medium ${getStatusColor(project.status)}`}>{project.status}</span>
        </div>
        <button className="text-[#71717a] hover:text-white transition-colors p-1" onClick={(e) => e.stopPropagation()}>
          <MoreHorizontal size={14} />
        </button>
      </div>
      <p className="text-[13px] text-[#a1a1aa] mb-4 line-clamp-1">{project.tagline || project.description}</p>
      
      <div className="flex items-center gap-5 text-[12px] text-[#71717a]">
        <span className="flex items-center gap-1.5">
          <div className={`w-2.5 h-2.5 rounded-full ${project.tags[0] === 'TypeScript' ? 'bg-[#3178C6]' : project.tags[0] === 'Python' ? 'bg-[#3776AB]' : 'bg-[#eab308]'}`}></div>
          {project.tags[0] || project.category}
        </span>
        <span className="flex items-center gap-1 hover:text-[#b19cd9] transition-colors"><Star size={14} /> {project.metrics.likes}</span>
        <span className="flex items-center gap-1 hover:text-white transition-colors"><GitFork size={14} /> {project.metrics.forks}</span>
        <span className="flex items-center gap-1 text-[#52525b]">Updated {formattedDate}</span>
      </div>
    </motion.div>
  );
}
