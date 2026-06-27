import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Eye, Star, Share2, Bookmark, ChevronRight, Activity, Calendar, GitFork } from 'lucide-react';
import { SiGithub } from 'react-icons/si';
import { Project } from '../../store/useProjectStore';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { skillsData } from '../../data/skillsData';

interface ProjectDrawerProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

// Custom Recharts Tooltip
const CustomTooltip = ({ active, payload, label }: Record<string, unknown>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#121212] border border-[#262626] p-3 rounded-lg shadow-xl">
        <p className="text-[12px] text-[#a1a1aa] mb-1">{label}</p>
        <p className="text-[14px] font-bold text-[#b19cd9]">
          {payload[0].value} Views
        </p>
      </div>
    );
  }
  return null;
};

export default function ProjectDrawer({ project, isOpen, onClose }: ProjectDrawerProps) {
  const [activeTab, setActiveTab] = useState<'Overview' | 'Analytics'>('Overview');

  if (!project) return null;

  const formattedDate = new Date(project.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%', opacity: 0.5 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0.5 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 z-[110] w-full md:w-[45%] lg:w-[40%] bg-[#0A0A0A] border-l border-[#262626] shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e1e1e] bg-[#121212] shrink-0">
              <div className="flex items-center gap-2">
                <button onClick={onClose} className="p-1 rounded hover:bg-[#262626] text-[#a1a1aa] hover:text-white transition-colors mr-2">
                  <ChevronRight size={20} />
                </button>
                <span className="text-[13px] font-medium text-[#a1a1aa]">Project Details</span>
              </div>
              <div className="flex items-center gap-2">
                <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[#1A1A1A] border border-[#262626] text-[#a1a1aa] hover:text-white transition-colors">
                  <Share2 size={14} />
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[#1A1A1A] border border-[#262626] text-[#a1a1aa] hover:text-white transition-colors">
                  <Bookmark size={14} />
                </button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              
              {/* Cover Area */}
              <div className={`w-full h-[200px] bg-gradient-to-br ${project.color} relative`}>
                {project.media?.cover && (
                  <img src={project.media.cover} alt="Cover" className="w-full h-full object-cover" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent"></div>
              </div>

              {/* Title & Actions */}
              <div className="px-8 -mt-10 relative z-10">
                <div className="flex items-end justify-between mb-4">
                  <div>
                    <h1 className="text-[28px] font-bold text-white tracking-tight leading-none mb-2">{project.title}</h1>
                    <p className="text-[14px] text-[#a1a1aa]">{project.tagline || project.category}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 py-4 border-b border-[#1e1e1e]">
                  {project.links?.demo && (
                    <a href={project.links.demo} target="_blank" rel="noreferrer" className="px-4 py-2 bg-white text-black text-[13px] font-semibold rounded-lg flex items-center gap-2 hover:bg-[#e5e2e1] transition-colors">
                      <ExternalLink size={14} /> Visit Demo
                    </a>
                  )}
                  {project.links?.github && (
                    <a href={project.links.github} target="_blank" rel="noreferrer" className="px-4 py-2 bg-[#1A1A1A] border border-[#262626] text-white text-[13px] font-semibold rounded-lg flex items-center gap-2 hover:bg-[#262626] transition-colors">
                      <SiGithub size={14} /> Repository
                    </a>
                  )}
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-6 mt-6 border-b border-[#1e1e1e]">
                  <button onClick={() => setActiveTab('Overview')} className={`pb-3 text-[14px] font-medium transition-colors relative ${activeTab === 'Overview' ? 'text-[#b19cd9]' : 'text-[#a1a1aa] hover:text-white'}`}>
                    Overview
                    {activeTab === 'Overview' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#b19cd9] rounded-t-full" />}
                  </button>
                  <button onClick={() => setActiveTab('Analytics')} className={`pb-3 text-[14px] font-medium transition-colors relative ${activeTab === 'Analytics' ? 'text-[#b19cd9]' : 'text-[#a1a1aa] hover:text-white'}`}>
                    Analytics
                    {activeTab === 'Analytics' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#b19cd9] rounded-t-full" />}
                  </button>
                </div>

                {/* Tab Content */}
                <div className="py-8">
                  <AnimatePresence mode="wait">
                    {activeTab === 'Overview' && (
                      <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col gap-8">
                        
                        {/* Description */}
                        <div>
                          <h3 className="text-[16px] font-semibold text-white mb-3">About</h3>
                          <p className="text-[14px] text-[#a1a1aa] leading-relaxed whitespace-pre-wrap">{project.description}</p>
                        </div>

                        {/* Tech Stack Visualized */}
                        <div>
                          <h3 className="text-[16px] font-semibold text-white mb-3">Technologies</h3>
                          <div className="flex flex-wrap gap-2">
                            {project.tags.map(tag => {
                              const skill = skillsData.find(s => s.name.toLowerCase() === tag.toLowerCase());
                              return (
                                <div key={tag} className="flex items-center gap-2 px-3 py-2 bg-[#121212] border border-[#262626] rounded-lg">
                                  {skill && <skill.icon size={14} style={{ color: skill.color }} />}
                                  <span className="text-[13px] text-[#e5e2e1]">{tag}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Timeline / Metadata */}
                        <div className="p-4 bg-[#121212] border border-[#262626] rounded-xl flex flex-col gap-3">
                          <div className="flex items-center justify-between text-[13px]">
                            <span className="flex items-center gap-2 text-[#71717a]"><Calendar size={14} /> Created</span>
                            <span className="text-white font-medium">{formattedDate}</span>
                          </div>
                          <div className="flex items-center justify-between text-[13px]">
                            <span className="flex items-center gap-2 text-[#71717a]"><Activity size={14} /> Status</span>
                            <span className="text-[#a3e635] font-medium flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-[#a3e635] rounded-full" /> {project.status}</span>
                          </div>
                          <div className="flex items-center justify-between text-[13px]">
                            <span className="flex items-center gap-2 text-[#71717a]"><GitFork size={14} /> Type</span>
                            <span className="text-white font-medium">{project.type}</span>
                          </div>
                        </div>

                      </motion.div>
                    )}

                    {activeTab === 'Analytics' && (
                      <motion.div key="analytics" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col gap-6">
                        
                        {/* Metrics Grid */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 bg-[#121212] border border-[#262626] rounded-xl flex flex-col gap-1">
                            <span className="text-[13px] text-[#71717a] flex items-center gap-1.5"><Eye size={14} /> Total Views</span>
                            <span className="text-[24px] font-bold text-white">{project.metrics.views.toLocaleString()}</span>
                          </div>
                          <div className="p-4 bg-[#121212] border border-[#262626] rounded-xl flex flex-col gap-1">
                            <span className="text-[13px] text-[#71717a] flex items-center gap-1.5"><Star size={14} /> Total Likes</span>
                            <span className="text-[24px] font-bold text-white">{project.metrics.likes.toLocaleString()}</span>
                          </div>
                        </div>

                        {/* Chart Area */}
                        <div className="p-5 bg-[#121212] border border-[#262626] rounded-xl flex flex-col gap-4">
                          <h3 className="text-[14px] font-medium text-white">Views (Last 7 Days)</h3>
                          <div className="h-[200px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={project.metrics.dailyData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                                <defs>
                                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#b19cd9" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#b19cd9" stopOpacity={0}/>
                                  </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 11 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 11 }} />
                                <Tooltip content={<CustomTooltip />} />
                                <Area type="monotone" dataKey="views" stroke="#b19cd9" strokeWidth={2} fillOpacity={1} fill="url(#colorViews)" />
                              </AreaChart>
                            </ResponsiveContainer>
                          </div>
                        </div>

                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
