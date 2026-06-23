import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UploadCloud, ChevronRight, ChevronLeft, Link as LinkIcon, Box, Image as ImageIcon, Check } from 'lucide-react';
import { useProjectStore, Project } from '../../store/useProjectStore';
import { skillsData } from '../../data/skillsData';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateProjectModal({ isOpen, onClose }: CreateProjectModalProps) {
  const addProject = useProjectStore((state) => state.addProject);
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const [formData, setFormData] = useState<Partial<Project>>({
    title: '',
    tagline: '',
    description: '',
    category: 'Web App',
    type: 'SaaS',
    tags: [],
    status: 'Draft',
    featured: false,
    verified: false,
    media: { cover: '', thumbnail: '', gallery: [], demoVideo: '' },
    links: { github: '', demo: '', docs: '', figma: '' },
    metrics: { views: 0, likes: 0, bookmarks: 0, comments: 0, shares: 0, forks: 0, dailyData: [] },
    completionPercentage: 0,
    color: 'from-[#b19cd9]/20 to-[#1A1A1A]' // Default gradient
  });

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [searchTag, setSearchTag] = useState('');

  // Reset when opened
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setPreviewImage(null);
      setFormData({
        title: '', tagline: '', description: '', category: 'Web App', type: 'SaaS', tags: [],
        status: 'Draft', featured: false, verified: false,
        media: { cover: '', thumbnail: '', gallery: [], demoVideo: '' },
        links: { github: '', demo: '', docs: '', figma: '' },
        metrics: { views: 0, likes: 0, bookmarks: 0, comments: 0, shares: 0, forks: 0, dailyData: [] },
        completionPercentage: 0, color: 'from-[#b19cd9]/20 to-[#1A1A1A]'
      });
    }
  }, [isOpen]);

  const handleNext = () => setStep((s) => Math.min(s + 1, totalSteps));
  const handlePrev = () => setStep((s) => Math.max(s - 1, 1));

  const handleFileSimulate = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setPreviewImage(url);
      setFormData({ ...formData, media: { ...formData.media!, cover: url } });
    }
  };

  const handlePublish = () => {
    // Calculate mock completion percentage based on filled fields
    let filled = 0;
    if (formData.title) filled += 20;
    if (formData.description) filled += 20;
    if (formData.media?.cover) filled += 20;
    if (formData.tags && formData.tags.length > 0) filled += 20;
    if (formData.links?.demo || formData.links?.github) filled += 20;

    addProject({
      ...formData as Omit<Project, 'id' | 'createdAt' | 'updatedAt'>,
      completionPercentage: filled,
      metrics: {
        views: 0, likes: 0, bookmarks: 0, comments: 0, shares: 0, forks: 0,
        dailyData: Array.from({ length: 7 }).map((_, i) => ({ day: `Day ${i + 1}`, views: 0, clicks: 0 }))
      }
    });
    onClose();
  };

  const filteredSkills = skillsData.filter((s) => s.name.toLowerCase().includes(searchTag.toLowerCase()));

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-3xl bg-[#0A0A0A] border border-[#262626] rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[650px]"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-[#1e1e1e] bg-gradient-to-r from-[#121212] to-[#0A0A0A]">
            <div>
              <h2 className="text-[20px] font-semibold text-white tracking-tight">Create New Project</h2>
              <div className="flex items-center gap-2 mt-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className={`h-1.5 w-12 rounded-full transition-colors ${i <= step ? 'bg-[#b19cd9]' : 'bg-[#262626]'}`} />
                ))}
              </div>
            </div>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-[#1A1A1A] text-[#a1a1aa] hover:text-white transition-colors">
              <X size={16} />
            </button>
          </div>

          {/* Content Body */}
          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar relative">
            
            {/* Step 1: Basic Info */}
            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-5">
                <h3 className="text-[18px] font-medium text-white mb-2">Basic Information</h3>
                <div>
                  <label className="text-[13px] text-[#a1a1aa] mb-1.5 block">Project Name</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Orion AI"
                    className="w-full bg-[#121212] border border-[#262626] rounded-xl px-4 py-2.5 text-[14px] text-white focus:border-[#b19cd9] focus:ring-1 focus:ring-[#b19cd9]/50 transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="text-[13px] text-[#a1a1aa] mb-1.5 block">Tagline</label>
                  <input
                    type="text"
                    value={formData.tagline}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                    placeholder="e.g. Multi-agent AI system for developers"
                    className="w-full bg-[#121212] border border-[#262626] rounded-xl px-4 py-2.5 text-[14px] text-white focus:border-[#b19cd9] focus:ring-1 focus:ring-[#b19cd9]/50 transition-all outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[13px] text-[#a1a1aa] mb-1.5 block">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full bg-[#121212] border border-[#262626] rounded-xl px-4 py-2.5 text-[14px] text-white focus:border-[#b19cd9] transition-all outline-none appearance-none"
                    >
                      <option>Web App</option><option>Mobile App</option><option>AI Project</option><option>SaaS</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[13px] text-[#a1a1aa] mb-1.5 block">Project Type</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full bg-[#121212] border border-[#262626] rounded-xl px-4 py-2.5 text-[14px] text-white focus:border-[#b19cd9] transition-all outline-none appearance-none"
                    >
                      <option>Open Source</option><option>Proprietary</option><option>Client Work</option><option>Hackathon</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-[13px] text-[#a1a1aa] mb-1.5 block">Detailed Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe the problem it solves, features, and your role..."
                    rows={4}
                    className="w-full bg-[#121212] border border-[#262626] rounded-xl px-4 py-2.5 text-[14px] text-white focus:border-[#b19cd9] focus:ring-1 focus:ring-[#b19cd9]/50 transition-all outline-none resize-none"
                  />
                </div>
              </motion.div>
            )}

            {/* Step 2: Media */}
            {step === 2 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-6">
                <h3 className="text-[18px] font-medium text-white mb-2">Visual Assets</h3>
                <div className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-[#262626] rounded-2xl bg-[#121212] hover:bg-[#1A1A1A] transition-colors relative overflow-hidden group">
                  <input type="file" onChange={handleFileSimulate} accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
                  {previewImage ? (
                    <img src={previewImage} alt="Preview" className="w-full h-full object-cover z-10" />
                  ) : (
                    <div className="flex flex-col items-center text-center z-10 pointer-events-none">
                      <div className="w-14 h-14 bg-[#1e1e1e] rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <UploadCloud size={24} className="text-[#b19cd9]" />
                      </div>
                      <p className="text-[15px] text-white font-medium mb-1">Upload Cover Image</p>
                      <p className="text-[13px] text-[#a1a1aa]">Drag & drop or click to browse</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Step 3: Tech Stack */}
            {step === 3 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-5 h-full">
                <h3 className="text-[18px] font-medium text-white mb-2">Tech Stack</h3>
                <input
                  type="text"
                  placeholder="Search technologies..."
                  value={searchTag}
                  onChange={(e) => setSearchTag(e.target.value)}
                  className="w-full bg-[#121212] border border-[#262626] rounded-xl px-4 py-2.5 text-[14px] text-white focus:border-[#b19cd9] outline-none"
                />
                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 mt-2">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {filteredSkills.map((skill) => {
                      const isSelected = formData.tags?.includes(skill.name);
                      return (
                        <button
                          key={skill.name}
                          onClick={() => {
                            const newTags = isSelected 
                              ? formData.tags!.filter(t => t !== skill.name)
                              : [...formData.tags!, skill.name];
                            setFormData({ ...formData, tags: newTags });
                          }}
                          className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                            isSelected ? 'bg-[#b19cd9]/10 border-[#b19cd9]' : 'bg-[#121212] border-[#262626] hover:bg-[#1A1A1A]'
                          }`}
                        >
                          <skill.icon size={16} style={{ color: isSelected ? skill.color : '#a1a1aa' }} className={isSelected ? '' : 'grayscale'} />
                          <span className={`text-[13px] truncate ${isSelected ? 'text-white' : 'text-[#a1a1aa]'}`}>{skill.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 4: Links & Publishing */}
            {step === 4 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-6">
                <h3 className="text-[18px] font-medium text-white mb-2">Links & Publishing</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[13px] text-[#a1a1aa] mb-1.5 block">Live Demo URL</label>
                    <div className="relative">
                      <LinkIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#71717a]" />
                      <input type="text" value={formData.links?.demo} onChange={(e) => setFormData({...formData, links: {...formData.links!, demo: e.target.value}})} className="w-full bg-[#121212] border border-[#262626] rounded-xl pl-9 pr-4 py-2.5 text-[14px] text-white outline-none focus:border-[#b19cd9]" placeholder="https://" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[13px] text-[#a1a1aa] mb-1.5 block">GitHub Repository</label>
                    <div className="relative">
                      <Box size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#71717a]" />
                      <input type="text" value={formData.links?.github} onChange={(e) => setFormData({...formData, links: {...formData.links!, github: e.target.value}})} className="w-full bg-[#121212] border border-[#262626] rounded-xl pl-9 pr-4 py-2.5 text-[14px] text-white outline-none focus:border-[#b19cd9]" placeholder="https://github.com/..." />
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="text-[13px] text-[#a1a1aa] mb-3 block">Visibility Status</label>
                  <div className="flex gap-3">
                    {['Draft', 'Published', 'Private'].map((status) => (
                      <button
                        key={status}
                        onClick={() => setFormData({ ...formData, status: status as any })}
                        className={`flex-1 py-3 rounded-xl border text-[13px] font-medium transition-all flex items-center justify-center gap-2 ${
                          formData.status === status 
                            ? 'bg-[#b19cd9]/10 border-[#b19cd9] text-white shadow-[0_0_15px_rgba(177,156,217,0.15)]' 
                            : 'bg-[#121212] border-[#262626] text-[#a1a1aa] hover:bg-[#1A1A1A] hover:text-white'
                        }`}
                      >
                        {formData.status === status && <Check size={14} className="text-[#b19cd9]" />}
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

              </motion.div>
            )}

          </div>

          {/* Footer Navigation */}
          <div className="p-6 border-t border-[#1e1e1e] bg-[#0A0A0A] flex items-center justify-between">
            <button
              onClick={handlePrev}
              disabled={step === 1}
              className={`px-5 py-2.5 rounded-xl text-[14px] font-medium flex items-center gap-2 transition-colors ${step === 1 ? 'opacity-0 cursor-default' : 'bg-[#1A1A1A] text-white hover:bg-[#262626]'}`}
            >
              <ChevronLeft size={16} /> Back
            </button>
            
            {step < totalSteps ? (
              <button
                onClick={handleNext}
                className="px-5 py-2.5 rounded-xl bg-white text-black text-[14px] font-medium flex items-center gap-2 hover:bg-[#e5e2e1] transition-colors"
              >
                Next Step <ChevronRight size={16} />
              </button>
            ) : (
              <button
                onClick={handlePublish}
                className="px-6 py-2.5 rounded-xl bg-[#b19cd9] text-black text-[14px] font-bold shadow-[0_0_15px_rgba(177,156,217,0.3)] hover:bg-[#c2c1ff] transition-all"
              >
                Publish Project
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
