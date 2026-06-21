"use client";

import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { auth } from "../../lib/firebase";

export default function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!auth) {
      router.replace("/sign-in");
      return;
    }

    return onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace("/sign-in");
        return;
      }

      setIsChecking(false);
    });
  }, [router]);

  if (isChecking) {
    return (
      <div className="h-screen w-full bg-[#050505] text-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-violet-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return children;
}
