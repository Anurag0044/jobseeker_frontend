"use client";

import { signOut } from "firebase/auth";
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
      className="flex items-center gap-md px-md py-sm rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-all duration-150 font-mono-label text-mono-label uppercase tracking-widest group text-left"
    >
      <span className="material-symbols-outlined text-[18px] opacity-70 group-hover:opacity-100 transition-opacity">logout</span>
      <span>Logout</span>
    </button>
  );
}
