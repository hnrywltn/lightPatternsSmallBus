"use client";

import { useState, useEffect } from "react";
import { Send, Plus, X, Check, Loader2 } from "lucide-react";

interface Invite {
  email: string;
  accepted_at: string | null;
  expires_at: string;
  created_at: string;
  site_id: string | null;
  business_name: string | null;
}

const ADD_ON_OPTIONS = [
  "SEO Package",
  "Blog",
  "Online Booking",
  "E-commerce",
  "Google Analytics",
  "Custom Domain",
  "Google Ads Management",
  "Email Marketing",
  "Live Chat",
  "Logo Design",
];

const TIERS = ["Starter", "Growth", "Pro"];

const STATUSES = [
  { value: "in_progress", label: "In Progress" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "paused", label: "Paused" },
];

interface SiteFormData {
  businessName: string;
  contactName: string;
  contactPhone: string;
  domain: string;
  tier: string;
  addOns: string[];
  status: string;
  dateInitiated: string;
  datePublished: string;
  monthlyRevenue: string;
  buildFee: string;
  notes: string;
}

const EMPTY: SiteFormData = {
  businessName: "",
  contactName: "",
  contactPhone: "",
  domain: "",
  tier: "Starter",
  addOns: [],
  status: "in_progress",
  dateInitiated: new Date().toISOString().slice(0, 10),
  datePublished: "",
  monthlyRevenue: "",
  buildFee: "",
  notes: "",
};

function InviteModal({
  onClose,
  onSent,
}: {
  onClose: () => void;
  onSent: () => void;
}) {
  const [email, setEmail] = useState("");
  const [form, setForm] = useState<SiteFormData>({ ...EMPTY });
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  function set<K extends keyof SiteFormData>(key: K, val: SiteFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: val }));
  }

  function toggleAddOn(ao: string) {
    setForm((prev) => ({
      ...prev,
      addOns: prev.addOns.includes(ao)
        ? prev.addOns.filter((a) => a !== ao)
        : [...prev.addOns, ao],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setError("");

    const res = await fetch("/api/admin/invites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        siteData: {
          ...form,
          monthlyRevenue: form.monthlyRevenue ? Number(form.monthlyRevenue) : 0,
          buildFee: form.buildFee ? Number(form.buildFee) : 0,
        },
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Something went wrong.");
      setSending(false);
      return;
    }

    onSent();
  }

  const inputCls =
    "bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-[#f2ede4] text-sm placeholder-white/20 focus:outline-none focus:border-amber-600/60 transition-colors w-full";
  const labelCls =
    "text-xs text-[#f2ede4]/40 uppercase tracking-wide font-medium mb-1 block";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#0c0a07] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/8">
          <div>
            <h2 className="text-base font-semibold text-[#f2ede4]">Invite a Client</h2>
            <p className="text-xs text-[#f2ede4]/40 mt-0.5">
              This creates their site record and sends them a portal invite.
            </p>
          </div>
          <button onClick={onClose} className="text-[#f2ede4]/40 hover:text-[#f2ede4] transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-5">
          {/* Email — top, prominent */}
          <div>
            <label className={labelCls}>Client Email <span className="text-amber-500">*</span></label>
            <input
              required
              type="email"
              className={inputCls}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="client@email.com"
            />
            <p className="text-[10px] text-[#f2ede4]/25 mt-1">
              The invite link will be sent here. If a site with this email already exists, the invite will be linked to it.
            </p>
          </div>

          <div className="border-t border-white/6 pt-4">
            <p className="text-xs text-[#f2ede4]/30 mb-4 uppercase tracking-wide font-medium">Site details</p>

            {/* Business */}
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className={labelCls}>Business Name <span className="text-amber-500">*</span></label>
                <input
                  required
                  className={inputCls}
                  value={form.businessName}
                  onChange={(e) => set("businessName", e.target.value)}
                  placeholder="Acme Plumbing"
                />
              </div>
              <div>
                <label className={labelCls}>Contact Name</label>
                <input
                  className={inputCls}
                  value={form.contactName}
                  onChange={(e) => set("contactName", e.target.value)}
                  placeholder="Jane Smith"
                />
              </div>
              <div>
                <label className={labelCls}>Contact Phone</label>
                <input
                  className={inputCls}
                  value={form.contactPhone}
                  onChange={(e) => set("contactPhone", e.target.value)}
                  placeholder="(555) 000-0000"
                />
              </div>
              <div>
                <label className={labelCls}>Domain</label>
                <input
                  className={inputCls}
                  value={form.domain}
                  onChange={(e) => set("domain", e.target.value)}
                  placeholder="acmeplumbing.com"
                />
              </div>
              <div>
                <label className={labelCls}>Tier</label>
                <select
                  className={inputCls}
                  value={form.tier}
                  onChange={(e) => set("tier", e.target.value)}
                >
                  {TIERS.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Status + Revenue */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Status</label>
              <select
                className={inputCls}
                value={form.status}
                onChange={(e) => set("status", e.target.value)}
              >
                {STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Build Fee ($)</label>
              <input
                type="number"
                min={0}
                className={inputCls}
                value={form.buildFee}
                onChange={(e) => set("buildFee", e.target.value)}
                placeholder="500"
              />
            </div>
            <div>
              <label className={labelCls}>Monthly Revenue ($)</label>
              <input
                type="number"
                min={0}
                className={inputCls}
                value={form.monthlyRevenue}
                onChange={(e) => set("monthlyRevenue", e.target.value)}
                placeholder="79"
              />
            </div>
            <div>
              <label className={labelCls}>Date Initiated</label>
              <input
                type="date"
                className={inputCls}
                value={form.dateInitiated}
                onChange={(e) => set("dateInitiated", e.target.value)}
              />
            </div>
          </div>

          {/* Add-ons */}
          <div>
            <label className={labelCls}>Add-ons</label>
            <div className="flex flex-wrap gap-2">
              {ADD_ON_OPTIONS.map((ao) => {
                const active = form.addOns.includes(ao);
                return (
                  <button
                    key={ao}
                    type="button"
                    onClick={() => toggleAddOn(ao)}
                    className={`text-xs px-2.5 py-1 rounded-lg border transition-colors ${
                      active
                        ? "bg-amber-600/10 border-amber-600/30 text-amber-400"
                        : "bg-white/5 border-white/10 text-[#f2ede4]/40 hover:text-[#f2ede4] hover:border-white/20"
                    }`}
                  >
                    {active && <Check className="w-3 h-3 inline mr-1" />}
                    {ao}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className={labelCls}>Notes</label>
            <textarea
              rows={2}
              className={`${inputCls} resize-none`}
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
              placeholder="Any extra context…"
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <div className="flex justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm text-[#f2ede4]/40 hover:text-[#f2ede4] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={sending}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white text-sm font-medium transition-colors shadow-lg shadow-amber-600/20"
            >
              {sending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              {sending ? "Sending…" : "Send Invite"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function InviteClient() {
  const [open, setOpen] = useState(false);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [justSent, setJustSent] = useState(false);

  useEffect(() => { fetchInvites(); }, []);

  async function fetchInvites() {
    const res = await fetch("/api/admin/invites");
    if (res.ok) {
      const data = await res.json();
      setInvites(data.invites);
    }
  }

  function handleSent() {
    setOpen(false);
    setJustSent(true);
    fetchInvites();
    setTimeout(() => setJustSent(false), 3000);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-[#f2ede4]">Client Invites</h2>
          <p className="text-sm text-[#f2ede4]/40 mt-1">
            Invite a client — sets up their site record and sends portal access.
          </p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-sm font-medium transition-colors shadow-lg shadow-amber-600/20"
        >
          <Plus className="w-4 h-4" />
          {justSent ? "Sent!" : "Invite Client"}
        </button>
      </div>

      {invites.length > 0 && (
        <div className="bg-white/[0.03] border border-white/8 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/8">
                <th className="text-left px-5 py-3 text-xs font-medium text-[#f2ede4]/30 uppercase tracking-wider">Email</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-[#f2ede4]/30 uppercase tracking-wider">Site</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-[#f2ede4]/30 uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-[#f2ede4]/30 uppercase tracking-wider">Sent</th>
              </tr>
            </thead>
            <tbody>
              {invites.map((invite) => (
                <tr key={invite.email} className="border-b border-white/5 last:border-none">
                  <td className="px-5 py-3 text-[#f2ede4]/70">{invite.email}</td>
                  <td className="px-5 py-3 text-[#f2ede4]/40 text-xs">
                    {invite.business_name ?? <span className="text-white/20 italic">—</span>}
                  </td>
                  <td className="px-5 py-3">
                    {invite.accepted_at ? (
                      <span className="text-xs font-medium bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded-full">Accepted</span>
                    ) : new Date(invite.expires_at) < new Date() ? (
                      <span className="text-xs font-medium bg-white/8 text-[#f2ede4]/30 px-2 py-0.5 rounded-full">Expired</span>
                    ) : (
                      <span className="text-xs font-medium bg-amber-500/15 text-amber-400 px-2 py-0.5 rounded-full">Pending</span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-[#f2ede4]/30">
                    {new Date(invite.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {open && <InviteModal onClose={() => setOpen(false)} onSent={handleSent} />}
    </div>
  );
}
