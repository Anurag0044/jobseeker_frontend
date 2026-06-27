import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UploadCloud, Link as LinkIcon, Box, Check, Search, Sparkles, Plus, Trash2, Loader2 } from 'lucide-react';
import { skillsData } from '../../data/skillsData';
import { useFirestoreProjects, type FirestoreProject, type FirestoreProjectInput, type CustomLink } from '../../hooks/useFirestoreProjects';

interface EditProjectModalProps {
  project: FirestoreProject | null;
  isOpen: boolean;
  onClose: () => void;
}

const FIELD_CLASS = "w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-3 text-[14px] text-white placeholder-white/30 focus:border-[#b19cd9]/50 focus:bg-white/[0.05] transition-all outline-none shadow-inner";

export default function EditProjectModal({ project, isOpen, onClose }: EditProjectModalProps) {
  const { updateProject } = useFirestoreProjects();
  const [submitting, setSubmitting] = useState(false);
  const [searchTag, setSearchTag] = useState('');
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<Partial<FirestoreProjectInput>>({});
  const [customLinks, setCustomLinks] = useState<CustomLink[]>([]);

  useEffect(() => {
    if (project && isOpen) {
      setForm({
        title: project.title,
        tagline: project.tagline,
        description: project.description,
        category: project.category,
        type: project.type,
        tags: project.tags,
        status: project.status,
        featured: project.featured,
        coverUrl: project.coverUrl,
        links: project.links,
      });
      setCustomLinks(project.links?.custom || []);
      setPreviewImage(project.coverUrl || null);
      setCoverFile(null);
    }
  }, [project, isOpen]);

  const handleSave = async () => {
    if (!project) return;
    setSubmitting(true);
    try {
      await updateProject(project.id, {
        ...form,
        links: { ...form.links!, custom: customLinks },
      } as Partial<FirestoreProjectInput>, coverFile || undefined);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredSkills = skillsData.filter((s) => s.name.toLowerCase().includes(searchTag.toLowerCase()));

  const addCustomLink = () => setCustomLinks([...customLinks, { label: '', url: '' }]);
  const removeCustomLink = (i: number) => setCustomLinks(customLinks.filter((_, idx) => idx !== i));
  const updateCustomLink = (i: number, field: 'label' | 'url', val: string) =>
    setCustomLinks(customLinks.map((cl, idx) => (idx === i ? { ...cl, [field]: val } : cl)));

  if (!isOpen || !project) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/70 backdrop-blur-md" />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-3xl backdrop-blur-3xl rounded-[32px] overflow-hidden flex flex-col h-[680px]"
          style={{
            background: 'linear-gradient(135deg, rgba(10, 15, 30, 0.5) 0%, rgba(2, 4, 15, 0.7) 100%)',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            borderLeft: '1px solid rgba(255, 255, 255, 0.05)',
            borderRight: '1px solid rgba(255, 255, 255, 0.02)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.02)',
            boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.15), 0 0 80px rgba(0,0,0,0.8)',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-8 border-b border-white/[0.05]">
            <h2 className="text-[22px] font-bold text-white tracking-tight">Edit Project</h2>
            <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all">
              <X size={18} />
            </button>
          </div>

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar flex flex-col gap-6">
            {/* Basic Info */}
            <section className="flex flex-col gap-4">
              <h3 className="text-[15px] font-semibold text-white">Basic Information</h3>
              <div>
                <label className="text-[13px] font-medium text-white mb-2 block">Project Name</label>
                <input type="text" value={form.title || ''} onChange={(e) => setForm({ ...form, title: e.target.value })} className={FIELD_CLASS} />
              </div>
              <div>
                <label className="text-[13px] font-medium text-white mb-2 block">Tagline</label>
                <input type="text" value={form.tagline || ''} onChange={(e) => setForm({ ...form, tagline: e.target.value })} className={FIELD_CLASS} />
              </div>
              <div>
                <label className="text-[13px] font-medium text-white mb-2 block">Description</label>
                <textarea value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className={`${FIELD_CLASS} resize-none`} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[13px] font-medium text-white mb-2 block">Category</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Web App', 'Mobile App', 'AI Project', 'SaaS'].map((cat) => (
                      <button key={cat} onClick={() => setForm({ ...form, category: cat })} className={`py-2 rounded-xl border text-[12px] font-medium transition-all ${form.category === cat ? 'border-[#b19cd9]/50 text-white bg-[#b19cd9]/10' : 'border-white/5 text-white/50 hover:text-white hover:border-white/20'}`}>{cat}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-[13px] font-medium text-white mb-2 block">Status</label>
                  <div className="flex flex-col gap-2">
                    {(['Draft', 'Published', 'Private'] as const).map((s) => (
                      <button key={s} onClick={() => setForm({ ...form, status: s })} className={`flex items-center gap-2 py-2 px-3 rounded-xl border text-[12px] font-medium transition-all ${form.status === s ? 'border-[#b19cd9]/50 text-white bg-[#b19cd9]/10' : 'border-white/5 text-white/50 hover:text-white hover:border-white/20'}`}>
                        {form.status === s && <Check size={12} className="text-[#b19cd9]" />}{s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Cover Image */}
            <section className="flex flex-col gap-3">
              <h3 className="text-[15px] font-semibold text-white">Cover Image</h3>
              <div onClick={() => fileInputRef.current?.click()} className="relative flex flex-col items-center justify-center w-full h-44 border-2 border-dashed border-white/20 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] hover:border-[#b19cd9]/50 transition-all cursor-pointer overflow-hidden">
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  setCoverFile(f);
                  setPreviewImage(URL.createObjectURL(f));
                }} />
                {previewImage ? (
                  <img src={previewImage} alt="Cover" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center text-center pointer-events-none">
                    <UploadCloud size={24} className="text-[#b19cd9] mb-2" />
                    <p className="text-[13px] text-white font-medium">Click to change cover</p>
                  </div>
                )}
              </div>
            </section>

            {/* Tech Stack */}
            <section className="flex flex-col gap-3">
              <h3 className="text-[15px] font-semibold text-white">Tech Stack</h3>
              <div className="relative">
                <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                <input type="text" placeholder="Search..." value={searchTag} onChange={(e) => setSearchTag(e.target.value)} className={`${FIELD_CLASS} pl-11`} />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto custom-scrollbar pr-1">
                {filteredSkills.map((skill) => {
                  const isSelected = form.tags?.includes(skill.name);
                  return (
                    <button key={skill.name} onClick={() => {
                      const newTags = isSelected ? form.tags!.filter(t => t !== skill.name) : [...(form.tags || []), skill.name];
                      setForm({ ...form, tags: newTags });
                    }} className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition-all ${isSelected ? 'border-[#b19cd9]/50 bg-[#b19cd9]/10' : 'border-white/5 hover:border-white/20'}`}>
                      <skill.icon size={15} style={{ color: isSelected ? skill.color : '#a1a1aa' }} />
                      <span className={`text-[12px] font-medium truncate ${isSelected ? 'text-white' : 'text-white/50'}`}>{skill.name}</span>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Links */}
            <section className="flex flex-col gap-3">
              <h3 className="text-[15px] font-semibold text-white">Links</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <LinkIcon size={13} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                  <input type="text" value={form.links?.demo || ''} onChange={(e) => setForm({ ...form, links: { ...form.links!, demo: e.target.value } })} placeholder="Live Demo URL" className={`${FIELD_CLASS} pl-10`} />
                </div>
                <div className="relative">
                  <Box size={13} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                  <input type="text" value={form.links?.github || ''} onChange={(e) => setForm({ ...form, links: { ...form.links!, github: e.target.value } })} placeholder="GitHub URL" className={`${FIELD_CLASS} pl-10`} />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[13px] font-medium text-white/70">Additional URLs</span>
                <button onClick={addCustomLink} className="flex items-center gap-1.5 text-[12px] text-[#b19cd9] hover:text-[#c2c1ff] transition-colors">
                  <Plus size={13} /> Add URL
                </button>
              </div>
              <div className="flex flex-col gap-2">
                {customLinks.map((cl, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input type="text" value={cl.label} onChange={(e) => updateCustomLink(i, 'label', e.target.value)} placeholder="Label" className={`${FIELD_CLASS} w-28 shrink-0`} />
                    <input type="text" value={cl.url} onChange={(e) => updateCustomLink(i, 'url', e.target.value)} placeholder="https://" className={`${FIELD_CLASS} flex-1`} />
                    <button onClick={() => removeCustomLink(i)} className="text-[#71717a] hover:text-red-400 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-white/[0.05] bg-white/[0.01] flex items-center justify-end gap-3">
            <button onClick={onClose} className="px-6 py-3 rounded-full bg-white/5 border border-white/10 text-white text-[14px] font-medium hover:bg-white/10 transition-all">
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={submitting}
              className="px-8 py-3 rounded-full text-[14px] font-bold text-white flex items-center gap-2 transition-all disabled:opacity-60"
              style={{
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.4) 0%, rgba(139, 92, 246, 0.4) 100%)',
                boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.2), 0 0 20px rgba(99,102,241,0.4)',
              }}
            >
              {submitting ? <><Loader2 size={15} className="animate-spin" /> Saving...</> : <><Sparkles size={15} /> Save Changes</>}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
