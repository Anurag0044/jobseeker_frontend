"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  UploadCloud,
  ChevronLeft,
  ChevronRight,
  Users,
  Globe,
  Lock,
  Loader2,
  Search,
  UserPlus,
  Check,
} from "lucide-react";
import { useCommunity } from "../../hooks/useCommunity";
import { db } from "../../lib/firebase";
import { collection, getDocs } from "firebase/firestore";

interface CreateCommunityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES = [
  "Students",
  "Employees",
  "Senior Developers",
  "Collaborators",
  "Recruiters",
  "Companies",
  "Custom",
];

interface UserSuggestion {
  uid: string;
  displayName: string;
  photoURL: string;
  email: string;
}

export default function CreateCommunityModal({
  isOpen,
  onClose,
}: CreateCommunityModalProps) {
  const { createCommunity, inviteMember, error: hookError } = useCommunity();

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  // Step 2 invite state
  const [inviteSearch, setInviteSearch] = useState("");
  const [allUsers, setAllUsers] = useState<UserSuggestion[]>([]);
  const [invitedUids, setInvitedUids] = useState<Set<string>>(new Set());

  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "Students",
    privacy: "public" as "public" | "private",
  });

  // Reset on open
  useEffect(() => {
    if (!isOpen) return;
    setStep(1);
    setSubmitting(false);
    setFormError("");
    setBannerPreview(null);
    setBannerFile(null);
    setInviteSearch("");
    setInvitedUids(new Set());
    setForm({ name: "", description: "", category: "Students", privacy: "public" });
  }, [isOpen]);

  // Fetch users for invite step
  useEffect(() => {
    if (step !== 2 || !db) return;
    getDocs(collection(db, "users")).then((snap) => {
      setAllUsers(
        snap.docs.map((d) => {
          const data = d.data() as Partial<UserSuggestion>;
          return {
            uid: d.id,
            displayName: data.displayName || data.email?.split("@")[0] || "Forge User",
            photoURL: data.photoURL || "",
            email: data.email || "",
          };
        })
      );
    });
  }, [step]);

  const handleBannerSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBannerFile(file);
    setBannerPreview(URL.createObjectURL(file));
  };

  const handleNext = () => {
    if (step === 1) {
      if (!form.name.trim()) {
        setFormError("Community name is required.");
        return;
      }
      if (!form.description.trim()) {
        setFormError("Description is required.");
        return;
      }
      setFormError("");
    }
    setStep((s) => Math.min(s + 1, 2));
  };

  const handleCreate = async () => {
    setSubmitting(true);
    setFormError("");
    try {
      const communityId = await createCommunity({
        name: form.name.trim(),
        description: form.description.trim(),
        category: form.category,
        privacy: form.privacy,
        bannerFile: bannerFile || undefined,
      });

      // Invite selected members
      if (communityId) {
        for (const uid of invitedUids) {
          const u = allUsers.find((u) => u.uid === uid);
          if (u) {
            await inviteMember(communityId, uid, {
              displayName: u.displayName,
              photoURL: u.photoURL,
            });
          }
        }
      }

      onClose();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to create community.");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredUsers = allUsers.filter((u) => {
    const q = inviteSearch.toLowerCase();
    return (
      u.displayName.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    );
  });

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/70 backdrop-blur-md"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-2xl backdrop-blur-3xl rounded-[32px] overflow-hidden flex flex-col h-[600px]"
          style={{
            background:
              "linear-gradient(135deg, rgba(10, 15, 30, 0.5) 0%, rgba(2, 4, 15, 0.7) 100%)",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            borderLeft: "1px solid rgba(255, 255, 255, 0.05)",
            borderRight: "1px solid rgba(255, 255, 255, 0.02)",
            borderBottom: "1px solid rgba(255, 255, 255, 0.02)",
            boxShadow:
              "inset 0 1px 1px rgba(255, 255, 255, 0.15), inset 0 0 30px rgba(255,255,255,0.02), 0 0 80px rgba(0,0,0,0.8)",
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-8 border-b border-white/[0.05] bg-gradient-to-r from-white/[0.02] to-transparent">
            <div>
              <h2 className="text-[22px] font-bold text-white tracking-tight">
                Create Community
              </h2>
              <div className="flex items-center gap-2 mt-3">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className={`h-1.5 w-20 rounded-full transition-all duration-500 ${
                      i <= step
                        ? "bg-gradient-to-r from-[#b19cd9] to-[#c2c1ff] shadow-[0_0_10px_rgba(177,156,217,0.5)]"
                        : "bg-white/10"
                    }`}
                  />
                ))}
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            {/* ── Step 1: Details ── */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col gap-5"
              >
                <h3 className="text-[18px] font-medium text-white mb-1">
                  Community Details
                </h3>

                {/* Banner */}
                <div>
                  <label className="text-[13px] font-medium text-white mb-2 block">
                    Banner Image
                  </label>
                  <div
                    onClick={() => bannerInputRef.current?.click()}
                    className="relative flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-white/20 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] hover:border-[#b19cd9]/50 transition-all duration-300 cursor-pointer overflow-hidden group"
                  >
                    <input
                      ref={bannerInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleBannerSelect}
                    />
                    {bannerPreview ? (
                      <img
                        src={bannerPreview}
                        alt="Banner preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center text-center pointer-events-none">
                        <UploadCloud size={24} className="text-[#b19cd9] mb-2" />
                        <p className="text-[13px] text-white font-medium">
                          Upload Banner
                        </p>
                        <p className="text-[11px] text-white/50">
                          Drag & drop or click
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="text-[13px] font-medium text-white mb-2 block">
                    Community Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Frontend Engineers"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-3 text-[14px] text-white placeholder-white/30 focus:border-[#b19cd9]/50 focus:bg-white/[0.05] transition-all outline-none shadow-inner"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="text-[13px] font-medium text-white mb-2 block">
                    Description <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    placeholder="What is this community about?"
                    rows={3}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-3 text-[14px] text-white placeholder-white/30 focus:border-[#b19cd9]/50 focus:bg-white/[0.05] transition-all outline-none resize-none shadow-inner"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="text-[13px] font-medium text-white mb-3 block">
                    Category
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setForm({ ...form, category: cat })}
                        className={`px-4 py-2 rounded-xl border text-[12px] font-medium transition-all duration-300 ${
                          form.category === cat
                            ? "bg-gradient-to-r from-[#b19cd9]/20 to-[#c2c1ff]/10 border-[#b19cd9]/50 text-white"
                            : "bg-white/[0.02] border-white/5 text-white/50 hover:bg-white/[0.05] hover:text-white"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Privacy */}
                <div>
                  <label className="text-[13px] font-medium text-white mb-3 block">
                    Privacy
                  </label>
                  <div className="flex gap-3">
                    {(["public", "private"] as const).map((p) => (
                      <button
                        key={p}
                        onClick={() => setForm({ ...form, privacy: p })}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border text-[13px] font-medium transition-all duration-300 ${
                          form.privacy === p
                            ? "bg-gradient-to-r from-[#b19cd9]/20 to-[#c2c1ff]/10 border-[#b19cd9]/50 text-white"
                            : "bg-white/[0.02] border-white/10 text-white/60 hover:bg-white/[0.05] hover:text-white"
                        }`}
                      >
                        {p === "public" ? (
                          <Globe size={15} />
                        ) : (
                          <Lock size={15} />
                        )}
                        {p.charAt(0).toUpperCase() + p.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {formError && (
                  <p className="text-[12px] text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2">
                    {formError}
                  </p>
                )}
              </motion.div>
            )}

            {/* ── Step 2: Invite Members ── */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col gap-5"
              >
                <div>
                  <h3 className="text-[18px] font-medium text-white mb-1">
                    Invite Members
                  </h3>
                  <p className="text-[13px] text-[#a1a1aa]">
                    Optionally add members now. You can always invite more later.
                  </p>
                </div>

                {/* Search */}
                <div className="relative">
                  <Search
                    size={15}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40"
                  />
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={inviteSearch}
                    onChange={(e) => setInviteSearch(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-11 pr-5 py-3 text-[14px] text-white placeholder-white/30 focus:border-[#b19cd9]/50 focus:bg-white/[0.05] transition-all outline-none"
                  />
                </div>

                {/* User list */}
                <div className="flex flex-col gap-2 max-h-[280px] overflow-y-auto custom-scrollbar">
                  {filteredUsers.length === 0 && (
                    <p className="text-[13px] text-[#71717a] text-center py-6">
                      No users found.
                    </p>
                  )}
                  {filteredUsers.map((u) => {
                    const isInvited = invitedUids.has(u.uid);
                    return (
                      <div
                        key={u.uid}
                        className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.05] transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#1A1A1A] border border-[#262626] flex items-center justify-center text-[11px] font-semibold text-[#b19cd9] overflow-hidden shrink-0">
                            {u.photoURL ? (
                              <img
                                src={u.photoURL}
                                alt={u.displayName}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              u.displayName.charAt(0).toUpperCase()
                            )}
                          </div>
                          <div>
                            <p className="text-[13px] font-medium text-white">
                              {u.displayName}
                            </p>
                            <p className="text-[11px] text-[#71717a]">{u.email}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setInvitedUids((prev) => {
                              const next = new Set(prev);
                              if (next.has(u.uid)) next.delete(u.uid);
                              else next.add(u.uid);
                              return next;
                            });
                          }}
                          className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all text-[12px] font-bold ${
                            isInvited
                              ? "bg-[#5e5ce6] border-[#5e5ce6] text-white"
                              : "border-white/20 text-[#a1a1aa] hover:border-[#b19cd9] hover:text-[#b19cd9]"
                          }`}
                        >
                          {isInvited ? <Check size={13} /> : <UserPlus size={13} />}
                        </button>
                      </div>
                    );
                  })}
                </div>

                {invitedUids.size > 0 && (
                  <p className="text-[12px] text-[#b19cd9]">
                    {invitedUids.size} member{invitedUids.size > 1 ? "s" : ""} selected
                  </p>
                )}

                {(formError || hookError) && (
                  <p className="text-[12px] text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2">
                    {formError || hookError}
                  </p>
                )}
              </motion.div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-white/[0.05] bg-white/[0.01] flex items-center justify-between">
            <button
              onClick={() => setStep((s) => Math.max(s - 1, 1))}
              disabled={step === 1}
              className={`px-6 py-3 rounded-full text-[14px] font-medium flex items-center gap-2 transition-all ${
                step === 1
                  ? "opacity-0 cursor-default"
                  : "bg-white/5 border border-white/10 text-white hover:bg-white/10"
              }`}
            >
              <ChevronLeft size={16} /> Back
            </button>

            {step < 2 ? (
              <button
                onClick={handleNext}
                className="px-6 py-3 rounded-full bg-white/10 border border-white/20 text-white text-[14px] font-bold flex items-center gap-2 hover:bg-white/20 transition-all"
              >
                Next Step <ChevronRight size={16} />
              </button>
            ) : (
              <button
                onClick={handleCreate}
                disabled={submitting}
                className="relative px-8 py-3 rounded-full text-[14px] font-bold text-white transition-all duration-300 flex items-center gap-2 disabled:opacity-60"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(94,92,230,0.6) 0%, rgba(139,92,246,0.4) 100%)",
                  boxShadow:
                    "inset 0 1px 1px rgba(255,255,255,0.2), 0 0 20px rgba(94,92,230,0.3)",
                }}
              >
                {submitting ? (
                  <>
                    <Loader2 size={15} className="animate-spin" /> Creating...
                  </>
                ) : (
                  <>
                    <Users size={15} /> Create Community
                  </>
                )}
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
