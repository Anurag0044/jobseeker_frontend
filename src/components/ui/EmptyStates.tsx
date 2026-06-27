import React from 'react';
import { motion } from 'framer-motion';
import { FolderGit2, Plus, SearchX } from 'lucide-react';

interface EmptyStateProps {
  type: 'no-projects' | 'no-results';
  onAction?: () => void;
  searchQuery?: string;
}

export default function EmptyStates({ type, onAction, searchQuery }: EmptyStateProps) {
  if (type === 'no-projects') {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} 
        className="w-full flex flex-col items-center justify-center py-32 bg-[#121212] border border-[#1e1e1e] border-dashed rounded-2xl"
      >
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#5e5ce6]/20 to-transparent flex items-center justify-center mb-6 border border-[#5e5ce6]/30 shadow-[0_0_30px_rgba(94,92,230,0.15)]">
          <FolderGit2 size={32} className="text-[#b19cd9]" />
        </div>
        <h3 className="text-[20px] font-semibold text-white mb-2">Build something extraordinary.</h3>
        <p className="text-[14px] text-[#a1a1aa] mb-8 text-center max-w-sm">
          Your project showcase is currently empty. Start building your portfolio and share your best work with the world.
        </p>
        <button 
          onClick={onAction}
          className="px-6 py-2.5 rounded-xl bg-[#b19cd9] text-black text-[14px] font-bold shadow-[0_0_15px_rgba(177,156,217,0.3)] hover:bg-[#c2c1ff] transition-all flex items-center gap-2"
        >
          <Plus size={18} /> Create First Project
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} 
      className="w-full flex flex-col items-center justify-center py-32 bg-[#121212] border border-[#1e1e1e] rounded-2xl"
    >
      <div className="w-16 h-16 rounded-full bg-[#1A1A1A] flex items-center justify-center mb-4 border border-[#262626]">
        <SearchX size={24} className="text-[#71717a]" />
      </div>
      <h3 className="text-[18px] font-semibold text-white mb-1">No results found</h3>
      <p className="text-[14px] text-[#a1a1aa] text-center max-w-sm">
        We couldn&apos;t find anything matching &quot;<span className="text-white font-medium">{searchQuery}</span>&quot;. Try adjusting your search or filters.
      </p>
    </motion.div>
  );
}
