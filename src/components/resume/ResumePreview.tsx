import React, { useRef, useState, useEffect } from 'react';
import { Download, Mail, Phone, MapPin, Globe, Loader2, FileText, Eye, X } from 'lucide-react';
import { FaLinkedin, FaGithub } from 'react-icons/fa';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

export interface ResumeData {
  personalInfo: {
    name: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    linkedin?: string;
    github?: string;
    website?: string;
  };
  summary: string;
  skills: { category: string; items: string[] }[];
  experience: {
    company: string;
    role: string;
    duration: string;
    location?: string;
    bullets: string[];
  }[];
  education: {
    degree: string;
    institution: string;
    year: string;
  }[];
  projects?: {
    name: string;
    description: string;
    technologies: string[];
    link?: string;
  }[];
}

interface ResumePreviewProps {
  data: ResumeData;
}

export default function ResumePreview({ data }: ResumePreviewProps) {
  const resumeRef = useRef<HTMLDivElement>(null);
  const modalResumeRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDownloadPDF = async (refToUse: React.RefObject<HTMLDivElement | null>) => {
    if (!refToUse.current) return;
    setIsExporting(true);

    try {
      const element = refToUse.current;

      // Dynamically import html2pdf
      const html2pdfModule = await import('html2pdf.js');
      const html2pdf = (html2pdfModule.default ? html2pdfModule.default : html2pdfModule) as any;

      const opt = {
        margin: 0,
        filename: `${data.personalInfo.name.replace(/\s+/g, '_')}_Executive_Resume.pdf`,
        image: { type: 'jpeg', quality: 1 },
        html2canvas: { scale: 3, useCORS: true, logging: false, letterRendering: true, windowWidth: 794 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
      };

      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error("PDF Export failed:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const renderA4Resume = (ref: React.RefObject<HTMLDivElement | null>) => (
    <div
      ref={ref}
      className="bg-white relative shrink-0 overflow-hidden shadow-2xl"
      style={{
        width: '794px', // A4 width at 96 DPI
        minHeight: '1123px', // A4 height at 96 DPI
        fontFamily: '"Inter", "Helvetica Neue", Helvetica, sans-serif',
        color: '#111827' // gray-900
      }}
    >
      {/* Top Edge Accent */}
      <div className="absolute top-0 left-0 w-full h-2" style={{ backgroundColor: '#0f172a' }}></div>

      <div className="flex h-full min-h-[1123px]">
        {/* LEFT COLUMN (32%) - Deep Slate */}
        <div className="w-[32%] flex flex-col p-8 pt-12 shrink-0" style={{ backgroundColor: '#1e232e', color: '#ffffff' }}>
          {/* Contact Block */}
          <div className="mb-10 flex flex-col gap-4">
            {data.personalInfo.email && (
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
                  <Mail size={12} style={{ color: 'rgba(255, 255, 255, 0.8)' }} />
                </div>
                <span className="text-[11.5px] font-medium tracking-wide break-all" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>{data.personalInfo.email}</span>
              </div>
            )}
            {data.personalInfo.phone && (
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
                  <Phone size={12} style={{ color: 'rgba(255, 255, 255, 0.8)' }} />
                </div>
                <span className="text-[11.5px] font-medium tracking-wide" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>{data.personalInfo.phone}</span>
              </div>
            )}
            {data.personalInfo.location && (
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
                  <MapPin size={12} style={{ color: 'rgba(255, 255, 255, 0.8)' }} />
                </div>
                <span className="text-[11.5px] font-medium tracking-wide" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>{data.personalInfo.location}</span>
              </div>
            )}
            {data.personalInfo.linkedin && (
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
                  <FaLinkedin size={12} style={{ color: 'rgba(255, 255, 255, 0.8)' }} />
                </div>
                <span className="text-[11.5px] font-medium tracking-wide truncate" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>{data.personalInfo.linkedin.replace(/(^\w+:|^)\/\//, '')}</span>
              </div>
            )}
            {data.personalInfo.github && (
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
                  <FaGithub size={12} style={{ color: 'rgba(255, 255, 255, 0.8)' }} />
                </div>
                <span className="text-[11.5px] font-medium tracking-wide truncate" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>{data.personalInfo.github.replace(/(^\w+:|^)\/\//, '')}</span>
              </div>
            )}
          </div>

          {/* Education Block */}
          {data.education && data.education.length > 0 && (
            <div className="mb-10">
              <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase mb-5 pb-2" style={{ color: 'rgba(255, 255, 255, 0.5)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                Education
              </h3>
              <div className="flex flex-col gap-5">
                {data.education.map((edu, idx) => (
                  <div key={idx} className="relative">
                    <div className="text-[13px] font-semibold leading-tight mb-1" style={{ color: '#ffffff' }}>{edu.degree}</div>
                    <div className="text-[11.5px] mb-0.5" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>{edu.institution}</div>
                    <div className="text-[10px] font-medium tracking-wider uppercase" style={{ color: 'rgba(255, 255, 255, 0.4)' }}>{edu.year}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Technical Skills Block */}
          {data.skills && data.skills.length > 0 && (
            <div className="mb-10">
              <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase mb-5 pb-2" style={{ color: 'rgba(255, 255, 255, 0.5)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                Expertise
              </h3>
              <div className="flex flex-col gap-4">
                {data.skills.map((skillGroup, idx) => (
                  <div key={idx}>
                    <div className="text-[11px] font-bold mb-1.5 tracking-wide" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>{skillGroup.category}</div>
                    <div className="flex flex-wrap gap-1.5">
                      {skillGroup.items.map((skill, sIdx) => (
                        <span key={sIdx} className="text-[10.5px] px-2 py-0.5 rounded-md font-medium" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: 'rgba(255, 255, 255, 0.8)' }}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN (68%) - Crisp White */}
        <div className="w-[68%] p-10 pt-12 flex flex-col" style={{ backgroundColor: '#ffffff' }}>

          {/* Header: Name & Title */}
          <div className="mb-8">
            <h1 className="text-[44px] font-light tracking-tight leading-none mb-3 uppercase" style={{ letterSpacing: '-0.02em', color: '#0f172a' }}>
              {data.personalInfo.name.split(' ').map((word, i, arr) => (
                <span key={i} className={i === arr.length - 1 ? "font-bold" : ""}>
                  {word}{" "}
                </span>
              ))}
            </h1>
            <h2 className="text-[13px] font-bold tracking-[0.25em] uppercase" style={{ color: '#94a3b8' }}>
              {data.personalInfo.title}
            </h2>
          </div>

          {/* Summary */}
          {data.summary && (
            <div className="mb-9">
              <p className="text-[12.5px] leading-[1.8] font-medium" style={{ color: '#475569' }}>
                {data.summary}
              </p>
            </div>
          )}

          {/* Experience Section */}
          {data.experience && data.experience.length > 0 && (
            <div className="mb-9 relative">
              <h3 className="text-[11px] font-bold tracking-[0.2em] uppercase mb-6 flex items-center gap-4" style={{ color: '#94a3b8' }}>
                Experience
                <div className="h-[1px] flex-1" style={{ backgroundColor: '#e2e8f0' }}></div>
              </h3>

              <div className="flex flex-col gap-7">
                {data.experience.map((exp, idx) => (
                  <div key={idx} className="relative group">
                    <div className="flex justify-between items-baseline mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[15px] tracking-tight" style={{ color: '#0f172a' }}>{exp.role}</span>
                        <span style={{ color: '#cbd5e1' }}>|</span>
                        <span className="font-semibold text-[13px]" style={{ color: '#475569' }}>{exp.company}</span>
                      </div>
                      <span className="text-[11px] font-bold tracking-widest uppercase shrink-0" style={{ color: '#94a3b8' }}>
                        {exp.duration}
                      </span>
                    </div>
                    {exp.location && <div className="text-[11px] font-medium mb-2.5" style={{ color: '#94a3b8' }}>{exp.location}</div>}

                    <ul className="flex flex-col gap-2 mt-2.5">
                      {exp.bullets.map((bullet, bIdx) => (
                        <li key={bIdx} className="text-[12.5px] leading-[1.6] pl-4 relative" style={{ color: '#475569' }}>
                          <span className="absolute left-0 top-[8px] w-1 h-1 rounded-full" style={{ backgroundColor: '#cbd5e1' }}></span>
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects Section */}
          {data.projects && data.projects.length > 0 && (
            <div className="relative">
              <h3 className="text-[11px] font-bold tracking-[0.2em] uppercase mb-6 flex items-center gap-4" style={{ color: '#94a3b8' }}>
                Selected Projects
                <div className="h-[1px] flex-1" style={{ backgroundColor: '#e2e8f0' }}></div>
              </h3>

              <div className="flex flex-col gap-6">
                {data.projects.map((proj, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between items-baseline mb-1.5">
                      <span className="font-bold text-[14px] tracking-tight flex items-center gap-2" style={{ color: '#0f172a' }}>
                        {proj.name}
                        {proj.link && (
                          <a href={proj.link.startsWith('http') ? proj.link : `https://${proj.link}`} target="_blank" rel="noreferrer" className="transition-colors" style={{ color: '#94a3b8' }}>
                            <Globe size={12} />
                          </a>
                        )}
                      </span>
                    </div>
                    <p className="text-[12.5px] leading-[1.6] mb-2.5 font-medium" style={{ color: '#475569' }}>
                      {proj.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {proj.technologies.map((tech, tIdx) => (
                        <span key={tIdx} className="text-[10px] font-bold tracking-wider uppercase px-2 py-1 rounded" style={{ color: '#64748b', backgroundColor: '#f1f5f9' }}>
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-[320px] font-sans">
      {/* Premium Download Card */}
      <div className="relative overflow-hidden bg-black/40 backdrop-blur-xl border border-white/10 p-4 rounded-2xl flex flex-col gap-4 group hover:border-purple-500/30 hover:bg-white/[0.04] transition-all duration-500 shadow-2xl">
        {/* Subtle background glow */}
        <div className="absolute -inset-24 bg-gradient-to-tr from-purple-500/10 via-transparent to-pink-500/10 blur-2xl opacity-40 group-hover:opacity-80 transition-opacity pointer-events-none"></div>

        <div className="relative z-10 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-600/20 border border-indigo-500/30 flex items-center justify-center shadow-inner shrink-0">
            <FileText className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="flex flex-col flex-1 min-w-0">
            <h3 className="text-[13px] font-bold text-white/95 truncate tracking-wide">
              {data.personalInfo.name.split(' ')[0]}_Resume.pdf
            </h3>
            <p className="text-[10px] font-semibold text-white/40 tracking-[0.1em] uppercase mt-0.5">
              Executive Template
            </p>
          </div>
        </div>

        <div className="relative z-10 mt-1 flex gap-2">
          <button
            onClick={() => setShowPreview(true)}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 bg-white/5 hover:bg-white/10 text-white text-[12px] font-semibold tracking-wide rounded-xl transition-all duration-300 border border-white/5"
          >
            <Eye size={14} className="text-white/70" />
            <span>View</span>
          </button>

          <button
            onClick={() => handleDownloadPDF(resumeRef)}
            disabled={isExporting}
            className="flex-[1.5] flex items-center justify-center gap-1.5 px-3 py-2.5 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 text-[12px] font-semibold tracking-wide rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed border border-indigo-500/20"
          >
            {isExporting ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Download size={14} />
            )}
            <span>{isExporting ? 'Processing' : 'Download'}</span>
          </button>
        </div>
      </div>

      {/* Hidden A4 Container for direct download without viewing */}
      <div style={{ position: 'absolute', top: '-10000px', left: '-10000px', pointerEvents: 'none' }}>
        {renderA4Resume(resumeRef)}
      </div>

      {/* Fullscreen Preview Modal */}
      {mounted && createPortal(
        <AnimatePresence>
          {showPreview && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[9999] flex flex-col items-center justify-start bg-black/80 backdrop-blur-[12px] overflow-y-auto pt-10 pb-20 px-4 custom-scrollbar"
            >
              {/* Action Bar */}
              <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -50, opacity: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200, delay: 0.05 }}
                className="fixed top-6 bg-black/60 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3 flex items-center gap-6 shadow-2xl z-[10000]"
              >
                <span className="text-white/90 text-[13px] font-semibold tracking-wide flex items-center gap-2">
                  <FileText size={16} className="text-indigo-400" />
                  {data.personalInfo.name.split(' ')[0]}_Resume.pdf
                </span>
                <div className="w-px h-4 bg-white/20"></div>
                <button
                  onClick={() => handleDownloadPDF(modalResumeRef)}
                  disabled={isExporting}
                  className="flex items-center justify-center gap-2 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[12px] font-semibold tracking-wide rounded-lg transition-all duration-300 disabled:opacity-50"
                >
                  {isExporting ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
                  <span>Download</span>
                </button>
                <button
                  onClick={() => setShowPreview(false)}
                  disabled={isExporting}
                  className="p-1.5 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <X size={16} />
                </button>
              </motion.div>

              {/* Zoomed out slightly to fit screen nicely */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 40 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 40 }}
                transition={{ type: 'spring', damping: 25, stiffness: 180, delay: 0.1 }}
                className="mt-20 origin-top scale-[0.85] md:scale-100 transition-transform"
              >
                {renderA4Resume(modalResumeRef)}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
