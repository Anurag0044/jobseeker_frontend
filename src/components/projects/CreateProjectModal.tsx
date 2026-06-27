import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UploadCloud, ChevronRight, ChevronLeft, Link as LinkIcon, Box, Check, Search, Sparkles, Plus, Trash2, Loader2 } from 'lucide-react';
import { skillsData } from '../../data/skillsData';
import { useFirestoreProjects, type FirestoreProjectInput, type CustomLink } from '../../hooks/useFirestoreProjects';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FIELD_CLASS = "w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-3 text-[14px] text-white placeholder-white/30 focus:border-[#b19cd9]/50 focus:bg-white/[0.05] transition-all outline-none shadow-inner";

export default function CreateProjectModal({ isOpen, onClose }: CreateProjectModalProps) {
  const { createProject } = useFirestoreProjects();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(false);

  const [formData, setFormData] = useState<Partial<FirestoreProjectInput>>({
    title: '',
    tagline: '',
    description: '',
    category: 'Web App',
    type: 'SaaS',
    tags: [],
    status: 'Draft',
    featured: false,
    coverUrl: '',
    links: { github: '', demo: '', docs: '', figma: '', custom: [] },
  });

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [searchTag, setSearchTag] = useState('');
  const [customLinks, setCustomLinks] = useState<CustomLink[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setPreviewImage(null);
      setCoverFile(null);
      setCustomLinks([]);
      setSubmitting(false);
      setUploadProgress(false);
      setFormData({
        title: '', tagline: '', description: '', category: 'Web App', type: 'SaaS', tags: [],
        status: 'Draft', featured: false, coverUrl: '',
        links: { github: '', demo: '', docs: '', figma: '', custom: [] },
      });
    }
  }, [isOpen]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverFile(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handlePublish = async () => {
    setSubmitting(true);
    try {
      const input: FirestoreProjectInput = {
        title: formData.title || '',
        tagline: formData.tagline || '',
        description: formData.description || '',
        category: formData.category || 'Web App',
        type: formData.type || 'SaaS',
        tags: formData.tags || [],
        status: formData.status || 'Draft',
        featured: false,
        coverUrl: '',
        links: {
          github: formData.links?.github || '',
          demo: formData.links?.demo || '',
          docs: formData.links?.docs || '',
          figma: formData.links?.figma || '',
          custom: customLinks,
        },
      };
      if (coverFile) setUploadProgress(true);
      await createProject(input, coverFile || undefined);
      setUploadProgress(false);
      onClose();
    } catch (err) {
      console.error(err);
      setUploadProgress(false);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredSkills = skillsData.filter((s) => s.name.toLowerCase().includes(searchTag.toLowerCase()));

  const addCustomLink = () => setCustomLinks([...customLinks, { label: '', url: '' }]);
  const removeCustomLink = (i: number) => setCustomLinks(customLinks.filter((_, idx) => idx !== i));
  const updateCustomLink = (i: number, field: 'label' | 'url', val: string) => {
    setCustomLinks(customLinks.map((cl, idx) => idx === i ? { ...cl, [field]: val } : cl));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/70 backdrop-blur-md" />
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
            <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all">
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar relative">
            {/* Step 1: Basic Info */}
            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-5">
                <h3 className="text-[18px] font-medium text-white mb-2">Basic Information</h3>
                <div>
                  <label className="text-[13px] font-medium text-white mb-2 block">Project Name</label>
                  <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. Orion AI" className={FIELD_CLASS} />
                </div>
                <div>
                  <label className="text-[13px] font-medium text-white mb-2 block">Tagline</label>
                  <input type="text" value={formData.tagline} onChange={(e) => setFormData({ ...formData, tagline: e.target.value })} placeholder="e.g. Multi-agent AI system for developers" className={FIELD_CLASS} />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-[13px] font-medium text-white mb-3 block">Category</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['Web App', 'Mobile App', 'AI Project', 'SaaS'].map((cat) => (
                        <button key={cat} onClick={() => setFormData({ ...formData, category: cat })} className={`py-2.5 rounded-2xl border text-[12px] font-medium transition-all ${formData.category === cat ? 'bg-gradient-to-r from-[#b19cd9]/20 to-[#c2c1ff]/10 border-[#b19cd9]/50 text-white' : 'bg-white/[0.02] border-white/5 text-white/50 hover:bg-white/[0.05] hover:text-white hover:border-white/20'}`}>{cat}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-[13px] font-medium text-white mb-3 block">Project Type</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['Open Source', 'Proprietary', 'Client Work', 'Hackathon'].map((type) => (
                        <button key={type} onClick={() => setFormData({ ...formData, type: type })} className={`py-2.5 rounded-2xl border text-[12px] font-medium transition-all ${formData.type === type ? 'bg-gradient-to-r from-[#b19cd9]/20 to-[#c2c1ff]/10 border-[#b19cd9]/50 text-white' : 'bg-white/[0.02] border-white/5 text-white/50 hover:bg-white/[0.05] hover:text-white hover:border-white/20'}`}>{type}</button>
                      ))}
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-[13px] font-medium text-white mb-2 block">Description</label>
                  <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Describe the problem it solves, features, and your role..." rows={4} className={`${FIELD_CLASS} resize-none`} />
                </div>
              </motion.div>
            )}

            {/* Step 2: Cover Image */}
            {step === 2 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-6 h-full">
                <h3 className="text-[18px] font-medium text-white mb-2">Cover Image</h3>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center justify-center w-full h-72 border-2 border-dashed border-white/20 rounded-3xl bg-white/[0.02] hover:bg-white/[0.05] hover:border-[#b19cd9]/50 transition-all duration-300 relative overflow-hidden group shadow-inner cursor-pointer"
                >
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
                  {previewImage ? (
                    <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center text-center pointer-events-none">
                      <div className="w-16 h-16 bg-gradient-to-br from-[#b19cd9]/20 to-[#c2c1ff]/10 rounded-full flex items-center justify-center mb-4">
                        <UploadCloud size={28} className="text-[#b19cd9]" />
                      </div>
                      <p className="text-[16px] text-white font-semibold mb-1">Upload Cover Image</p>
                      <p className="text-[14px] text-white/50">Drag & drop or click to browse</p>
                      <p className="text-[11px] text-white/30 mt-1">Uploaded to Cloudinary — no local storage</p>
                    </div>
                  )}
                </div>
                {previewImage && (
                  <button onClick={() => { setPreviewImage(null); setCoverFile(null); }} className="text-[12px] text-[#a1a1aa] hover:text-red-400 transition-colors self-start">
                    Remove image
                  </button>
                )}
              </motion.div>
            )}

            {/* Step 3: Tech Stack */}
            {step === 3 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-5 h-full">
                <h3 className="text-[18px] font-medium text-white mb-2">Tech Stack</h3>
                <div className="relative">
                  <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                  <input type="text" placeholder="Search technologies..." value={searchTag} onChange={(e) => setSearchTag(e.target.value)} className={`${FIELD_CLASS} pl-11`} />
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 mt-2">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {filteredSkills.map((skill) => {
                      const isSelected = formData.tags?.includes(skill.name);
                      return (
                        <button key={skill.name} onClick={() => {
                          const newTags = isSelected ? formData.tags!.filter(t => t !== skill.name) : [...(formData.tags || []), skill.name];
                          setFormData({ ...formData, tags: newTags });
                        }} className={`flex items-center gap-3 p-3 rounded-2xl border text-left transition-all duration-300 ${isSelected ? 'bg-gradient-to-r from-[#b19cd9]/20 to-[#c2c1ff]/10 border-[#b19cd9]/50' : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.05] hover:border-white/20'}`}>
                          <skill.icon size={18} style={{ color: isSelected ? skill.color : '#a1a1aa' }} className={isSelected ? '' : 'grayscale opacity-50'} />
                          <span className={`text-[13px] font-medium truncate ${isSelected ? 'text-white' : 'text-white/60'}`}>{skill.name}</span>
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
                    <label className="text-[13px] font-medium text-white mb-2 block">Live Demo URL</label>
                    <div className="relative">
                      <LinkIcon size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                      <input type="text" value={formData.links?.demo} onChange={(e) => setFormData({ ...formData, links: { ...formData.links!, demo: e.target.value } })} className={`${FIELD_CLASS} pl-10`} placeholder="https://" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[13px] font-medium text-white mb-2 block">GitHub Repository</label>
                    <div className="relative">
                      <Box size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                      <input type="text" value={formData.links?.github} onChange={(e) => setFormData({ ...formData, links: { ...formData.links!, github: e.target.value } })} className={`${FIELD_CLASS} pl-10`} placeholder="https://github.com/..." />
                    </div>
                  </div>
                </div>

                {/* Custom URLs */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-[13px] font-medium text-white">Additional URLs</label>
                    <button onClick={addCustomLink} className="flex items-center gap-1.5 text-[12px] text-[#b19cd9] hover:text-[#c2c1ff] transition-colors">
                      <Plus size={14} /> Add URL
                    </button>
                  </div>
                  {customLinks.length === 0 && (
                    <p className="text-[12px] text-[#71717a]">Click "+ Add URL" to include documentation, Figma designs, or any other links.</p>
                  )}
                  <div className="flex flex-col gap-3">
                    {customLinks.map((cl, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={cl.label}
                          onChange={(e) => updateCustomLink(i, 'label', e.target.value)}
                          placeholder="Label (e.g. Docs)"
                          className={`${FIELD_CLASS} w-28 shrink-0`}
                        />
                        <input
                          type="text"
                          value={cl.url}
                          onChange={(e) => updateCustomLink(i, 'url', e.target.value)}
                          placeholder="https://"
                          className={`${FIELD_CLASS} flex-1`}
                        />
                        <button onClick={() => removeCustomLink(i)} className="text-[#71717a] hover:text-red-400 transition-colors shrink-0">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Status */}
                <div className="mt-2">
                  <label className="text-[13px] font-medium text-white mb-3 block">Visibility Status</label>
                  <div className="flex gap-3">
                    {(['Draft', 'Published', 'Private'] as const).map((status) => (
                      <button key={status} onClick={() => setFormData({ ...formData, status })} className={`flex-1 py-3.5 rounded-2xl border text-[13px] font-medium transition-all flex items-center justify-center gap-2 ${formData.status === status ? 'bg-gradient-to-r from-[#b19cd9]/20 to-[#c2c1ff]/10 border-[#b19cd9]/50 text-white' : 'bg-white/[0.02] border-white/10 text-white/60 hover:bg-white/[0.05] hover:text-white'}`}>
                        {formData.status === status && <Check size={16} className="text-[#b19cd9]" />}
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-white/[0.05] bg-white/[0.01] flex items-center justify-between">
            <button onClick={() => setStep((s) => Math.max(s - 1, 1))} disabled={step === 1} className={`px-6 py-3 rounded-full text-[14px] font-medium flex items-center gap-2 transition-all ${step === 1 ? 'opacity-0 cursor-default' : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'}`}>
              <ChevronLeft size={16} /> Back
            </button>
            {step < 4 ? (
              <button onClick={() => setStep((s) => Math.min(s + 1, 4))} className="px-6 py-3 rounded-full bg-white/10 border border-white/20 text-white text-[14px] font-bold flex items-center gap-2 hover:bg-white/20 transition-all">
                Next Step <ChevronRight size={16} />
              </button>
            ) : (
              <button
                onClick={handlePublish}
                disabled={submitting}
                className="relative px-8 py-3 rounded-full text-[14px] font-bold text-white transition-all duration-300 flex items-center gap-2 disabled:opacity-60"
                style={{
                  background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.4) 0%, rgba(139, 92, 246, 0.4) 100%)',
                  boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.2), 0 0 20px rgba(99,102,241,0.4)',
                }}
              >
                {submitting ? (
                  <><Loader2 size={15} className="animate-spin" /> {uploadProgress ? 'Uploading image...' : 'Saving...'}</>
                ) : (
                  <><Sparkles size={16} /> Publish Project</>
                )}
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
