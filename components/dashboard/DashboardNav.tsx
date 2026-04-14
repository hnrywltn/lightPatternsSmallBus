"use client";

import { useRouter } from "next/navigation";
import { Lightbulb, LogOut } from "lucide-react";

export default function DashboardNav() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  }

  return (
    <nav className="border-b border-white/8 bg-[#0c0a07]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between h-14">
        <a href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-600 flex items-center justify-center shadow-lg shadow-amber-600/30">
            <Lightbulb className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-semibold tracking-tight text-[#f2ede4] text-sm">
            Light Patterns
          </span>
        </a>

        <div className="flex items-center gap-4">
          <span className="text-xs text-[#f2ede4]/30">Admin</span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs text-[#f2ede4]/50 hover:text-[#f2ede4] transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign out
          </button>
        </div>
      </div>
    </nav>
  );
}
