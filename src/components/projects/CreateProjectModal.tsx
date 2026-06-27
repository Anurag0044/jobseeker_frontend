import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UploadCloud, ChevronRight, ChevronLeft, Link as LinkIcon, Box, Check, Search, Sparkles } from 'lucide-react';
import { useProjectStore, Project, ProjectStatus } from '../../store/useProjectStore';
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
      setTimeout(() => {
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
      }, 0);
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
          className="absolute inset-0 bg-black/70 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-3xl backdrop-blur-3xl rounded-[32px] overflow-hidden flex flex-col h-[650px]"
          style={{
            background: 'linear-gradient(135deg, rgba(10, 15, 30, 0.5) 0%, rgba(2, 4, 15, 0.7) 100%)',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            borderLeft: '1px solid rgba(255, 255, 255, 0.05)',
            borderRight: '1px solid rgba(255, 255, 255, 0.02)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.02)',
            boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.15), inset 0 0 30px rgba(255,255,255,0.02), 0 0 80px rgba(0,0,0,0.8)',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-8 border-b border-white/[0.05] bg-gradient-to-r from-white/[0.02] to-transparent">
            <div>
              <h2 className="text-[22px] font-bold text-white tracking-tight drop-shadow-sm">Create New Project</h2>
              <div className="flex items-center gap-2 mt-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className={`h-1.5 w-12 rounded-full transition-all duration-500 ${i <= step ? 'bg-gradient-to-r from-[#b19cd9] to-[#c2c1ff] shadow-[0_0_10px_rgba(177,156,217,0.5)]' : 'bg-white/10'}`} />
                ))}
              </div>
            </div>
            <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:scale-105 transition-all shadow-inner">
              <X size={18} />
            </button>
          </div>

          {/* Content Body */}
          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar relative">
            
            {/* Step 1: Basic Info */}
            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-5">
                <h3 className="text-[18px] font-medium text-white mb-2">Basic Information</h3>
                <div>
                  <label className="text-[13px] font-medium text-white mb-2 block tracking-wide">Project Name</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Orion AI"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-3 text-[14px] text-white placeholder-white/30 focus:border-[#b19cd9]/50 focus:bg-white/[0.05] transition-all outline-none shadow-inner"
                  />
                </div>
                <div>
                  <label className="text-[13px] font-medium text-white mb-2 block tracking-wide">Tagline</label>
                  <input
                    type="text"
                    value={formData.tagline}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                    placeholder="e.g. Multi-agent AI system for developers"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-3 text-[14px] text-white placeholder-white/30 focus:border-[#b19cd9]/50 focus:bg-white/[0.05] transition-all outline-none shadow-inner"
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-[13px] font-medium text-white mb-3 block tracking-wide">Category</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['Web App', 'Mobile App', 'AI Project', 'SaaS'].map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setFormData({ ...formData, category: cat })}
                          className={`py-2.5 rounded-2xl border text-[12px] font-medium transition-all duration-300 ${
                            formData.category === cat 
                              ? 'bg-gradient-to-r from-[#b19cd9]/20 to-[#c2c1ff]/10 border-[#b19cd9]/50 text-white shadow-[0_0_15px_rgba(177,156,217,0.15)]' 
                              : 'bg-white/[0.02] border-white/5 text-white/50 hover:bg-white/[0.05] hover:text-white hover:border-white/20'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-[13px] font-medium text-white mb-3 block tracking-wide">Project Type</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['Open Source', 'Proprietary', 'Client Work', 'Hackathon'].map((type) => (
                        <button
                          key={type}
                          onClick={() => setFormData({ ...formData, type: type })}
                          className={`py-2.5 rounded-2xl border text-[12px] font-medium transition-all duration-300 ${
                            formData.type === type 
                              ? 'bg-gradient-to-r from-[#b19cd9]/20 to-[#c2c1ff]/10 border-[#b19cd9]/50 text-white shadow-[0_0_15px_rgba(177,156,217,0.15)]' 
                              : 'bg-white/[0.02] border-white/5 text-white/50 hover:bg-white/[0.05] hover:text-white hover:border-white/20'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-[13px] font-medium text-white mb-2 block tracking-wide">Detailed Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe the problem it solves, features, and your role..."
                    rows={4}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-3 text-[14px] text-white placeholder-white/30 focus:border-[#b19cd9]/50 focus:bg-white/[0.05] transition-all outline-none resize-none shadow-inner"
                  />
                </div>
              </motion.div>
            )}

            {/* Step 2: Media */}
            {step === 2 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-6 h-full">
                <h3 className="text-[18px] font-medium text-white mb-2">Visual Assets</h3>
                <div className="flex flex-col items-center justify-center w-full h-72 border-2 border-dashed border-white/20 rounded-3xl bg-white/[0.02] hover:bg-white/[0.05] hover:border-[#b19cd9]/50 transition-all duration-300 relative overflow-hidden group shadow-inner">
                  <input type="file" onChange={handleFileSimulate} accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
                  {previewImage ? (
                    <img src={previewImage} alt="Preview" className="w-full h-full object-cover z-10 transition-transform duration-700 group-hover:scale-105" />
                  ) : (
                    <div className="flex flex-col items-center text-center z-10 pointer-events-none">
                      <div className="w-16 h-16 bg-gradient-to-br from-[#b19cd9]/20 to-[#c2c1ff]/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500 shadow-[0_0_20px_rgba(177,156,217,0.2)]">
                        <UploadCloud size={28} className="text-[#b19cd9]" />
                      </div>
                      <p className="text-[16px] text-white font-semibold mb-1 tracking-tight">Upload Cover Image</p>
                      <p className="text-[14px] text-white/50">Drag & drop or click to browse</p>
                    </div>
                  )}
                  {/* Glowing edge on hover */}
                  <div className="absolute inset-0 pointer-events-none border-2 border-[#b19cd9] rounded-3xl opacity-0 group-hover:opacity-100 blur-[2px] transition-opacity duration-500" />
                </div>
              </motion.div>
            )}

            {/* Step 3: Tech Stack */}
            {step === 3 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-5 h-full">
                <h3 className="text-[18px] font-medium text-white mb-2">Tech Stack</h3>
                <div className="relative">
                  <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                  <input
                    type="text"
                    placeholder="Search technologies..."
                    value={searchTag}
                    onChange={(e) => setSearchTag(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-11 pr-5 py-3 text-[14px] text-white placeholder-white/30 focus:border-[#b19cd9]/50 focus:bg-white/[0.05] transition-all outline-none shadow-inner"
                  />
                </div>
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
                          className={`flex items-center gap-3 p-3 rounded-2xl border text-left transition-all duration-300 ${
                            isSelected ? 'bg-gradient-to-r from-[#b19cd9]/20 to-[#c2c1ff]/10 border-[#b19cd9]/50 shadow-[0_0_15px_rgba(177,156,217,0.2)]' : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.05] hover:border-white/20 shadow-inner'
                          }`}
                        >
                          <skill.icon size={18} style={{ color: isSelected ? skill.color : '#a1a1aa' }} className={isSelected ? 'drop-shadow-md' : 'grayscale opacity-50'} />
                          <span className={`text-[13px] font-medium truncate tracking-wide ${isSelected ? 'text-white' : 'text-white/60'}`}>{skill.name}</span>
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
                    <label className="text-[13px] font-medium text-white mb-2 block tracking-wide">Live Demo URL</label>
                    <div className="relative">
                      <LinkIcon size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                      <input type="text" value={formData.links?.demo} onChange={(e) => setFormData({...formData, links: {...formData.links!, demo: e.target.value}})} className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-10 pr-5 py-3 text-[14px] text-white placeholder-white/30 focus:border-[#b19cd9]/50 focus:bg-white/[0.05] transition-all outline-none shadow-inner" placeholder="https://" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[13px] font-medium text-white mb-2 block tracking-wide">GitHub Repository</label>
                    <div className="relative">
                      <Box size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                      <input type="text" value={formData.links?.github} onChange={(e) => setFormData({...formData, links: {...formData.links!, github: e.target.value}})} className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-10 pr-5 py-3 text-[14px] text-white placeholder-white/30 focus:border-[#b19cd9]/50 focus:bg-white/[0.05] transition-all outline-none shadow-inner" placeholder="https://github.com/..." />
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="text-[13px] font-medium text-white mb-3 block tracking-wide">Visibility Status</label>
                  <div className="flex gap-3">
                    {['Draft', 'Published', 'Private'].map((status) => (
                      <button
                        key={status}
                        onClick={() => setFormData({ ...formData, status: status as ProjectStatus })}
                        className={`flex-1 py-3.5 rounded-2xl border text-[13px] font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                          formData.status === status 
                            ? 'bg-gradient-to-r from-[#b19cd9]/20 to-[#c2c1ff]/10 border-[#b19cd9]/50 text-white shadow-[0_0_15px_rgba(177,156,217,0.2)]' 
                            : 'bg-white/[0.02] border-white/10 text-white/60 hover:bg-white/[0.05] hover:text-white hover:border-white/20 shadow-inner'
                        }`}
                      >
                        {formData.status === status && <Check size={16} className="text-[#b19cd9] drop-shadow-md" />}
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

              </motion.div>
            )}

          </div>

          {/* Footer Navigation */}
          <div className="p-6 border-t border-white/[0.05] bg-white/[0.01] flex items-center justify-between">
            <button
              onClick={handlePrev}
              disabled={step === 1}
              className={`px-6 py-3 rounded-full text-[14px] font-medium flex items-center gap-2 transition-all duration-300 ${step === 1 ? 'opacity-0 cursor-default' : 'bg-white/5 border border-white/10 text-white hover:bg-white/10 shadow-inner'}`}
            >
              <ChevronLeft size={16} /> Back
            </button>
            
            {step < totalSteps ? (
              <button
                onClick={handleNext}
                className="px-6 py-3 rounded-full bg-white/10 border border-white/20 text-white text-[14px] font-bold flex items-center gap-2 hover:bg-white/20 hover:scale-105 transition-all shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]"
              >
                Next Step <ChevronRight size={16} />
              </button>
            ) : (
              <button
                onClick={handlePublish}
                className="relative px-8 py-3 rounded-full text-[14px] font-bold text-white transition-all duration-300 group overflow-hidden hover:scale-105 active:scale-95"
                style={{
                  background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.4) 0%, rgba(139, 92, 246, 0.4) 100%)',
                  boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.2), 0 4px 15px rgba(0,0,0,0.2), 0 0 20px rgba(99,102,241,0.4)',
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
                <span className="relative z-10 flex items-center gap-2 drop-shadow-sm"><Sparkles size={16}/> Publish Project</span>
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
