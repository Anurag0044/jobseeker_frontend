import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, Check } from "lucide-react";
import { skillsData } from "../../data/skillsData";

interface AddSkillModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSkills: string[];
  onToggleSkill: (skillName: string) => void;
}

export default function AddSkillModal({ isOpen, onClose, selectedSkills, onToggleSkill }: AddSkillModalProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSkills = useMemo(() => {
    if (!searchQuery) return skillsData;
    return skillsData.filter((s) => s.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [searchQuery]);

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
            className="fixed inset-0 bg-[#050505]/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl bg-[#0d0d0d]/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/5">
                <div>
                  <h2 className="text-[20px] font-semibold text-white tracking-tight">Add Skills</h2>
                  <p className="text-[13px] text-[#a1a1aa] mt-1">Select the technologies you work with.</p>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-[#a1a1aa] hover:text-white transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Search */}
              <div className="p-4 border-b border-white/5 bg-black/20">
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#71717a]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search 100+ technologies..."
                    className="w-full bg-[#1A1A1A] border border-[#262626] rounded-xl py-2.5 pl-10 pr-4 text-[14px] text-white placeholder:text-[#71717a] focus:outline-none focus:border-[#b19cd9] focus:ring-1 focus:ring-[#b19cd9]/50 transition-all"
                  />
                </div>
              </div>

              {/* Grid */}
              <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {filteredSkills.map((skill) => {
                    const isSelected = selectedSkills.includes(skill.name);
                    return (
                      <button
                        key={skill.name}
                        onClick={() => onToggleSkill(skill.name)}
                        className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                          isSelected
                            ? "bg-[#b19cd9]/10 border-[#b19cd9] shadow-[0_0_15px_rgba(177,156,217,0.15)]"
                            : "bg-[#121212] border-[#262626] hover:border-[#3f3f46] hover:bg-[#1A1A1A]"
                        }`}
                      >
                        <div className="shrink-0 flex items-center justify-center relative">
                          <skill.icon
                            size={20}
                            style={{ color: isSelected ? skill.color : "#a1a1aa" }}
                            className={`transition-colors ${isSelected ? "scale-110" : "grayscale"}`}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className={`block text-[13px] font-medium truncate transition-colors ${isSelected ? "text-white" : "text-[#e5e2e1]"}`}>
                            {skill.name}
                          </span>
                        </div>
                        {isSelected && (
                          <div className="shrink-0 text-[#b19cd9]">
                            <Check size={14} strokeWidth={3} />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
                {filteredSkills.length === 0 && (
                  <div className="text-center py-12 text-[#a1a1aa] text-[14px]">
                    No technologies found matching &quot;{searchQuery}&quot;
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-white/5 bg-black/40 flex justify-between items-center">
                <span className="text-[13px] text-[#a1a1aa]">
                  <span className="text-white font-medium">{selectedSkills.length}</span> skills selected
                </span>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-[#b19cd9] hover:bg-[#c2c1ff] text-black text-[14px] font-semibold rounded-xl transition-colors shadow-[0_0_15px_rgba(177,156,217,0.3)]"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
