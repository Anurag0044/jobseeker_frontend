"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function WorkspaceRedirect() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to profile or forge assistant since dashboard was removed from navbar
    router.push("/workspace/profile");
  }, [router]);

  return (
    <div className="flex h-full items-center justify-center">
      <div className="animate-pulse w-8 h-8 rounded-full border-2 border-[#5e5ce6] border-t-transparent animate-spin"></div>
    </div>
  );
}
