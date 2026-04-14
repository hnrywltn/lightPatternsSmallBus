"use client";

import { useRouter } from "next/navigation";

interface ClientData {
  name: string;
  email: string;
  site_url: string | null;
  plan: string;
  billing_status: string;
}

export default function ClientDashboardClient({ client }: { client: ClientData }) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/client/auth/logout", { method: "POST" });
    router.push("/client/login");
  }

  const planLabel = client.plan === "growth" ? "Growth" : client.plan === "pro" ? "Pro" : "Starter";

  return (
    <div className="min-h-screen bg-[#05050a] text-white">
      {/* Nav */}
      <nav className="border-b border-white/8 px-8 py-4 flex items-center justify-between">
        <span className="font-bold text-lg">Light Patterns</span>
        <div className="flex items-center gap-6">
          <span className="text-white/40 text-sm">{client.email}</span>
          <button
            onClick={handleLogout}
            className="text-sm text-white/40 hover:text-white/70 transition-colors"
          >
            Sign out
          </button>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-8 py-16">
        {/* Welcome */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold mb-2">Hey, {client.name.split(" ")[0]} 👋</h1>
          <p className="text-white/40">Here's a look at your account.</p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* Site */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-3">Your site</div>
            {client.site_url ? (
              <a
                href={client.site_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-violet-400 hover:text-violet-300 text-sm font-medium break-all"
              >
                {client.site_url}
              </a>
            ) : (
              <p className="text-white/30 text-sm">Coming soon — we'll update this once your site is live.</p>
            )}
          </div>

          {/* Plan */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-3">Plan</div>
            <div className="flex items-center gap-3">
              <span className="text-white font-semibold text-lg">{planLabel}</span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                client.billing_status === "active"
                  ? "bg-emerald-500/15 text-emerald-400"
                  : "bg-red-500/15 text-red-400"
              }`}>
                {client.billing_status === "active" ? "Active" : client.billing_status}
              </span>
            </div>
          </div>

          {/* Support */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-3">Need something?</div>
            <p className="text-white/50 text-sm mb-4 leading-relaxed">
              Changes, questions, or anything else — just send us an email.
            </p>
            <a
              href="mailto:hello@lightpatternsonline.com"
              className="text-sm font-semibold text-violet-400 hover:text-violet-300"
            >
              hello@lightpatternsonline.com
            </a>
          </div>

          {/* Account */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-3">Account</div>
            <p className="text-white/50 text-sm mb-4">{client.email}</p>
            <a
              href="/client/forgot-password"
              className="text-sm font-semibold text-white/40 hover:text-white/70 transition-colors"
            >
              Change password →
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}
