"use client";

import { signOut } from "firebase/auth";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { auth } from "../../lib/firebase";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
    }

    router.replace("/sign-in");
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="flex items-center justify-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-[13px] font-medium text-red-100 transition-colors hover:bg-red-500/20"
    >
      <LogOut size={15} />
      <span>Logout</span>
    </button>
  );
}
