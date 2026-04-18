"use client";

import { useRouter, usePathname } from "next/navigation";
import { Lightbulb, LogOut, BookOpen, LayoutDashboard, Search, Send, CreditCard, Users } from "lucide-react";

const NAV_LINKS = [
  { href: "/dashboard",             label: "Home",      icon: LayoutDashboard },
  { href: "/dashboard/prospects",   label: "Prospects", icon: Search },
  { href: "/dashboard/outreach",    label: "Outreach",  icon: Send },
  { href: "/dashboard/referrers",   label: "Referrers", icon: Users },
  { href: "/dashboard/billing",     label: "Billing",   icon: CreditCard },
];

export default function DashboardNav() {
  const router = useRouter();
  const pathname = usePathname();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  }

  function isActive(href: string) {
    return href === "/dashboard" ? pathname === href : pathname.startsWith(href);
  }

  return (
    <nav className="border-b border-white/8 bg-[#0c0a07]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between h-14">
        <div className="flex items-center gap-6">
          <a href="/dashboard" className="flex items-center gap-2 shrink-0">
            <div className="w-7 h-7 rounded-lg bg-amber-600 flex items-center justify-center shadow-lg shadow-amber-600/30">
              <Lightbulb className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-semibold tracking-tight text-[#f2ede4] text-sm">
              Light Patterns
            </span>
          </a>

          <div className="flex items-center gap-1">
            {NAV_LINKS.map(({ href, label, icon: Icon }) => (
              <a
                key={href}
                href={href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  isActive(href)
                    ? "bg-white/8 text-[#f2ede4]"
                    : "text-[#f2ede4]/40 hover:text-[#f2ede4] hover:bg-white/5"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </a>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="/dashboard/guide"
            className={`flex items-center gap-1.5 text-xs transition-colors ${
              pathname === "/dashboard/guide"
                ? "text-amber-400"
                : "text-[#f2ede4]/40 hover:text-[#f2ede4]"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Guide
          </a>
          <span className="text-[#f2ede4]/10">|</span>
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
