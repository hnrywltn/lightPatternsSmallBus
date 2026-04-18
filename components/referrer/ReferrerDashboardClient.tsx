"use client";

import { useState, useEffect } from "react";
import { Lightbulb, Loader2, Send, UserPlus, X, Check } from "lucide-react";

interface ReferrerSite {
  id: string;
  business_name: string;
  status: string;
  date_initiated: string | null;
  date_published: string | null;
  tier: string;
}

interface ReferrerData {
  id: string;
  name: string;
  email: string;
  commission_type: "flat" | "percentage";
  commission_amount: number;
  status: string;
}

const STATUS_STYLES: Record<string, string> = {
  active: "bg-emerald-500/10 text-emerald-400",
  in_progress: "bg-amber-500/10 text-amber-400",
  inactive: "bg-white/5 text-[#f2ede4]/30",
  paused: "bg-red-500/10 text-red-400",
};

const STATUS_LABELS: Record<string, string> = {
  active: "Live",
  in_progress: "In Progress",
  inactive: "Inactive",
  paused: "Paused",
};

function formatCommission(type: "flat" | "percentage", amount: number) {
  return type === "flat" ? `$${amount.toLocaleString()}` : `${amount}%`;
}

// ─── Send Referral Modal ──────────────────────────────────────────────────────

function SendReferralModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setError("");
    const res = await fetch("/api/referrer/send-referral", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recipientName: name, recipientEmail: email }),
    });
    const data = await res.json();
    setSending(false);
    if (!res.ok) { setError(data.error || "Failed to send."); return; }
    setSent(true);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#0f0d0a] border border-white/10 rounded-2xl w-full max-w-sm shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/8">
          <h2 className="text-sm font-semibold text-[#f2ede4]">Send a Referral</h2>
          <button onClick={onClose} className="text-[#f2ede4]/40 hover:text-[#f2ede4] transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-6">
          {sent ? (
            <div className="text-center py-4">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-3">
                <Check className="w-5 h-5 text-emerald-400" />
              </div>
              <p className="text-sm text-[#f2ede4]">Email sent to {email}</p>
              <p className="text-xs text-[#f2ede4]/40 mt-1">We'll be in touch with them.</p>
              <button onClick={onClose} className="mt-4 text-xs text-amber-400 hover:text-amber-300 transition-colors">
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-[#f2ede4]/50 mb-1.5">Their name</label>
                <input required value={name} onChange={e => setName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-[#f2ede4] placeholder-[#f2ede4]/20 focus:outline-none focus:border-amber-600/50"
                  placeholder="John's Barbershop" />
              </div>
              <div>
                <label className="block text-xs text-[#f2ede4]/50 mb-1.5">Their email</label>
                <input required type="email" value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-[#f2ede4] placeholder-[#f2ede4]/20 focus:outline-none focus:border-amber-600/50"
                  placeholder="john@example.com" />
              </div>
              {error && <p className="text-xs text-red-400">{error}</p>}
              <div className="flex justify-end gap-3 pt-1">
                <button type="button" onClick={onClose} className="px-4 py-2 text-xs text-[#f2ede4]/50 hover:text-[#f2ede4] transition-colors">Cancel</button>
                <button type="submit" disabled={sending}
                  className="flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white text-xs font-medium rounded-lg transition-colors">
                  {sending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  {sending ? "Sending…" : "Send email"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Refer a Friend Modal ─────────────────────────────────────────────────────

function ReferFriendModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setError("");
    const res = await fetch("/api/referrer/refer-friend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ friendName: name, friendEmail: email }),
    });
    const data = await res.json();
    setSending(false);
    if (!res.ok) { setError(data.error || "Failed to submit."); return; }
    setSent(true);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#0f0d0a] border border-white/10 rounded-2xl w-full max-w-sm shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/8">
          <div>
            <h2 className="text-sm font-semibold text-[#f2ede4]">Refer a Friend</h2>
            <p className="text-xs text-[#f2ede4]/40 mt-0.5">Earn a $100 bonus when they get their first payout.</p>
          </div>
          <button onClick={onClose} className="text-[#f2ede4]/40 hover:text-[#f2ede4] transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-6">
          {sent ? (
            <div className="text-center py-4">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-3">
                <Check className="w-5 h-5 text-emerald-400" />
              </div>
              <p className="text-sm text-[#f2ede4]">Application submitted</p>
              <p className="text-xs text-[#f2ede4]/40 mt-1">We'll review {name} and reach out to them if approved.</p>
              <button onClick={onClose} className="mt-4 text-xs text-amber-400 hover:text-amber-300 transition-colors">Done</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-[#f2ede4]/50 mb-1.5">Friend's name</label>
                <input required value={name} onChange={e => setName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-[#f2ede4] placeholder-[#f2ede4]/20 focus:outline-none focus:border-amber-600/50"
                  placeholder="Jane Smith" />
              </div>
              <div>
                <label className="block text-xs text-[#f2ede4]/50 mb-1.5">Friend's email</label>
                <input required type="email" value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-[#f2ede4] placeholder-[#f2ede4]/20 focus:outline-none focus:border-amber-600/50"
                  placeholder="jane@example.com" />
              </div>
              {error && <p className="text-xs text-red-400">{error}</p>}
              <div className="flex justify-end gap-3 pt-1">
                <button type="button" onClick={onClose} className="px-4 py-2 text-xs text-[#f2ede4]/50 hover:text-[#f2ede4] transition-colors">Cancel</button>
                <button type="submit" disabled={sending}
                  className="flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white text-xs font-medium rounded-lg transition-colors">
                  {sending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UserPlus className="w-3.5 h-3.5" />}
                  {sending ? "Submitting…" : "Submit"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function ReferrerDashboardClient() {
  const [referrer, setReferrer] = useState<ReferrerData | null>(null);
  const [sites, setSites] = useState<ReferrerSite[]>([]);
  const [loading, setLoading] = useState(true);
  const [showReferral, setShowReferral] = useState(false);
  const [showFriend, setShowFriend] = useState(false);

  useEffect(() => {
    fetch("/api/referrer/me")
      .then(r => r.json())
      .then(data => {
        setReferrer(data.referrer);
        setSites(data.sites ?? []);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0c0a07] flex items-center justify-center">
        <Loader2 className="w-5 h-5 animate-spin text-[#f2ede4]/30" />
      </div>
    );
  }

  if (!referrer) {
    return (
      <div className="min-h-screen bg-[#0c0a07] flex items-center justify-center">
        <p className="text-[#f2ede4]/40 text-sm">Session expired. Please sign in again.</p>
      </div>
    );
  }

  const liveSites = sites.filter(s => s.status === "active");
  const commission = formatCommission(referrer.commission_type, referrer.commission_amount);
  const firstName = referrer.name.split(" ")[0];

  return (
    <div className="min-h-screen bg-[#0c0a07]">
      {/* Nav */}
      <nav className="border-b border-white/8 bg-[#0c0a07]">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-600 flex items-center justify-center shadow-lg shadow-amber-600/30">
              <Lightbulb className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-semibold tracking-tight text-[#f2ede4] text-sm">Light Patterns</span>
          </div>
          <span className="text-xs text-[#f2ede4]/30">{referrer.email}</span>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <h1 className="text-2xl font-semibold text-[#f2ede4]">Hey, {firstName} 👋</h1>
            <p className="text-sm text-[#f2ede4]/40 mt-1">
              You earn <span className="text-amber-400 font-medium">{commission}</span> for every business you refer whose site goes live.
            </p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowFriend(true)}
              className="flex items-center gap-1.5 px-4 py-2 border border-white/10 text-[#f2ede4]/60 hover:text-[#f2ede4] hover:border-white/20 text-xs font-medium rounded-lg transition-colors">
              <UserPlus className="w-3.5 h-3.5" />
              Refer a friend
            </button>
            <button onClick={() => setShowReferral(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-medium rounded-lg transition-colors">
              <Send className="w-3.5 h-3.5" />
              Send referral
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { label: "Total referrals", value: sites.length },
            { label: "Sites live", value: liveSites.length },
            { label: "Earned", value: liveSites.length > 0 ? (referrer.commission_type === "flat" ? `$${(liveSites.length * referrer.commission_amount).toLocaleString()}` : `${liveSites.length} × ${commission}`) : "—" },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white/[0.03] border border-white/8 rounded-2xl p-5">
              <p className="text-xs text-[#f2ede4]/40 mb-1">{label}</p>
              <p className="text-2xl font-semibold text-[#f2ede4]">{value}</p>
            </div>
          ))}
        </div>

        {/* Referred sites */}
        <div>
          <h2 className="text-sm font-semibold text-[#f2ede4] mb-4">Your referrals</h2>
          {sites.length === 0 ? (
            <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-10 text-center">
              <p className="text-sm text-[#f2ede4]/40">No referrals yet.</p>
              <p className="text-xs text-[#f2ede4]/25 mt-1">Send your first referral to get started.</p>
              <button onClick={() => setShowReferral(true)}
                className="mt-4 flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-medium rounded-lg transition-colors mx-auto">
                <Send className="w-3.5 h-3.5" />
                Send referral
              </button>
            </div>
          ) : (
            <div className="bg-white/[0.03] border border-white/8 rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/8">
                    <th className="text-left px-5 py-3 text-xs font-medium text-[#f2ede4]/40">Business</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-[#f2ede4]/40">Tier</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-[#f2ede4]/40">Status</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-[#f2ede4]/40 hidden md:table-cell">Started</th>
                  </tr>
                </thead>
                <tbody>
                  {sites.map((s, i) => (
                    <tr key={s.id} className={`border-b border-white/5 ${i === sites.length - 1 ? "border-b-0" : ""}`}>
                      <td className="px-5 py-3.5 text-[#f2ede4] font-medium">{s.business_name}</td>
                      <td className="px-5 py-3.5 text-[#f2ede4]/60 text-xs">{s.tier}</td>
                      <td className="px-5 py-3.5">
                        <span className={`text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full ${STATUS_STYLES[s.status] ?? "bg-white/5 text-[#f2ede4]/30"}`}>
                          {STATUS_LABELS[s.status] ?? s.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-[#f2ede4]/40 text-xs hidden md:table-cell">
                        {s.date_initiated ? new Date(s.date_initiated).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showReferral && <SendReferralModal onClose={() => setShowReferral(false)} />}
      {showFriend && <ReferFriendModal onClose={() => setShowFriend(false)} />}
    </div>
  );
}
