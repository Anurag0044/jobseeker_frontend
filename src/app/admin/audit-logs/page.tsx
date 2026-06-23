"use client";

import React from "react";
import { motion } from "framer-motion";

export default function AuditLogsPage() {
  return (
    <div className="px-8 pb-16 pt-8 h-full">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="h-full flex flex-col items-center justify-center border border-dashed border-[#262626] rounded-2xl bg-[#0A0A0A]/50 min-h-[400px]"
      >
        <div className="w-16 h-16 rounded-full bg-[#121212] border border-[#262626] flex items-center justify-center mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#71717a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
        </div>
        <h2 className="text-[20px] font-semibold text-white mb-2">Audit Logs</h2>
        <p className="text-[13px] text-[#71717a]">This admin module is currently under development.</p>
      </motion.div>
    </div>
  );
}
