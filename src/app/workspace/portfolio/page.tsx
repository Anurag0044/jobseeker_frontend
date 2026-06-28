"use client";

import React, { useEffect, useState, Suspense } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import {
  FolderGit2, ExternalLink, Globe, GitBranch, Link as LinkIcon,
  Loader2, Users
} from "lucide-react";
import { useFirestoreProjects, type FirestoreProject } from "../../../hooks/useFirestoreProjects";
import { db } from "../../../lib/firebase";
import { doc, getDoc } from "firebase/firestore";

interface ProfileBasic {
  displayName: string;
  photoURL: string;
  title: string;
  bio: string;
}

function ProjectViewCard({ project }: { project: FirestoreProject }) {
  const customLinks = project.links?.custom || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative overflow-hidden rounded-[20px] flex flex-col"
      style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.01))', border: '1px solid rgba(255,255,255,0.1)' }}
    >
      {/* Cover */}
      <div className="relative h-44 overflow-hidden">
        {project.coverUrl ? (
          <img src={project.coverUrl} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-white/5 to-black/20 flex items-center justify-center">
            <FolderGit2 size={36} className="text-white/20" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {project.links?.demo && (
            <a href={project.links.demo} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 transition-transform shadow-lg" title="Live Demo">
              <ExternalLink size={13} />
            </a>
          )}
          {project.links?.github && (
            <a href={project.links.github} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-black/70 border border-white/20 text-white flex items-center justify-center hover:scale-110 transition-transform" title="GitHub">
              <Globe size={13} />
            </a>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col gap-3 flex-1">
        <div>
          <h3 className="text-[16px] font-bold text-white mb-1 truncate">{project.title}</h3>
          {project.tagline && <p className="text-[12px] text-[#b19cd9] font-medium mb-1">{project.tagline}</p>}
          <p className="text-[13px] text-[#a1a1aa] line-clamp-2 leading-relaxed">{project.description}</p>
        </div>

        {project.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {project.tags.slice(0, 4).map((tag) => (
              <span key={tag} className="px-2.5 py-0.5 rounded-md text-[10px] font-semibold uppercase bg-white/[0.03] text-[#a1a1aa] border border-white/[0.08]">{tag}</span>
            ))}
            {project.tags.length > 4 && <span className="text-[10px] text-[#71717a]">+{project.tags.length - 4}</span>}
          </div>
        )}

        <div className="flex flex-wrap gap-3 mt-auto pt-2 border-t border-white/[0.05]">
          {project.links?.github && (
            <a href={project.links.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[11px] text-[#a1a1aa] hover:text-white transition-colors">
              <GitBranch size={12} /> GitHub
            </a>
          )}
          {project.links?.demo && (
            <a href={project.links.demo} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[11px] text-[#a1a1aa] hover:text-white transition-colors">
              <ExternalLink size={12} /> Live Demo
            </a>
          )}
          {customLinks.map((cl, i) => cl.url && (
            <a key={i} href={cl.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[11px] text-[#a1a1aa] hover:text-white transition-colors">
              <LinkIcon size={12} /> {cl.label || "Link"}
            </a>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function PortfolioInner() {
  const searchParams = useSearchParams();
  const uid = searchParams.get("uid");

  const { projects, loading, error } = useFirestoreProjects(uid || undefined);
  const [targetProfile, setTargetProfile] = useState<ProfileBasic | null>(null);

  useEffect(() => {
    if (!uid || !db) return;
    getDoc(doc(db, "users", uid)).then((snap) => {
      if (snap.exists()) {
        const d = snap.data() as Partial<ProfileBasic>;
        setTargetProfile({
          displayName: d.displayName || "Forge User",
          photoURL: d.photoURL || "",
          title: d.title || "Builder",
          bio: d.bio || "",
        });
      }
    });
  }, [uid]);

  const visibleProjects = uid
    ? projects.filter((p) => p.status === "Published")
    : projects;

  return (
    <div className="px-8 pb-16 pt-8 overflow-x-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-[1100px] mx-auto flex flex-col gap-8"
      >
        {uid && targetProfile ? (
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 rounded-2xl overflow-hidden border border-white/10 bg-[#121212] shrink-0 flex items-center justify-center text-[20px] font-bold text-[#b19cd9]">
              {targetProfile.photoURL ? (
                <img src={targetProfile.photoURL} alt={targetProfile.displayName} className="w-full h-full object-cover" />
              ) : (
                targetProfile.displayName.charAt(0).toUpperCase()
              )}
            </div>
            <div>
              <h1 className="text-[26px] font-semibold text-white tracking-tight mb-1">
                {targetProfile.displayName}&apos;s Projects
              </h1>
              <p className="text-[14px] text-[#a1a1aa]">{targetProfile.title}</p>
              {targetProfile.bio && <p className="text-[13px] text-[#71717a] mt-1 line-clamp-2">{targetProfile.bio}</p>}
            </div>
          </div>
        ) : (
          <div>
            <h1 className="text-[28px] font-semibold text-white tracking-tight mb-1">Portfolio</h1>
            <p className="text-[14px] text-[#a1a1aa]">Showcase your projects and portfolio.</p>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={28} className="text-[#71717a] animate-spin" />
          </div>
        )}

        {error && !loading && (
          <div className="text-[13px] text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">{error}</div>
        )}

        {!loading && !error && visibleProjects.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 bg-[#121212] border border-[#1e1e1e] rounded-xl">
            <div className="w-16 h-16 rounded-2xl bg-[#1e1a2e] border border-[#2a2440] flex items-center justify-center mb-6">
              <FolderGit2 size={28} className="text-[#b19cd9]" />
            </div>
            <h2 className="text-[18px] font-semibold text-white mb-2">No Projects Yet</h2>
            <p className="text-[13px] text-[#a1a1aa] text-center max-w-[384px]">
              {uid ? "This user hasn't published any projects yet." : "Create your first project from the Projects section."}
            </p>
          </div>
        )}

        {!loading && !error && visibleProjects.length > 0 && (
          <>
            <div className="flex items-center justify-between">
              <span className="text-[14px] text-[#a1a1aa]">
                {visibleProjects.length} project{visibleProjects.length !== 1 ? "s" : ""}
              </span>
              {uid && (
                <div className="flex items-center gap-1.5 text-[12px] text-[#71717a]">
                  <Users size={13} /> Public portfolio
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleProjects.map((project) => (
                <ProjectViewCard key={project.id} project={project} />
              ))}
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}

export default function PortfolioPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-64">
        <Loader2 size={28} className="text-[#71717a] animate-spin" />
      </div>
    }>
      <PortfolioInner />
    </Suspense>
  );
}
