"use client";

import { useState, useEffect } from "react";
import { Plus, X, Pencil, Trash2, Loader2, Check, UserPlus, Mail } from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface ReferralSend {
  id: string;
  recipient_name: string;
  recipient_email: string;
  sent_at: string;
  referrer_name: string;
  referrer_email: string;
}

export type CommissionType = "flat" | "percentage";
export type ReferrerStatus = "active" | "inactive";

export interface Referrer {
  id: string;
  name: string;
  email: string;
  phone: string;
  commissionType: CommissionType;
  commissionAmount: number;
  referralCode: string;
  status: ReferrerStatus;
  notes: string;
  createdAt: string;
}

function rowToReferrer(row: Record<string, unknown>): Referrer {
  return {
    id: row.id as string,
    name: row.name as string,
    email: row.email as string,
    phone: (row.phone as string) ?? "",
    commissionType: (row.commission_type as CommissionType) ?? "flat",
    commissionAmount: (row.commission_amount as number) ?? 0,
    referralCode: (row.referral_code as string) ?? "",
    status: (row.status as ReferrerStatus) ?? "active",
    notes: (row.notes as string) ?? "",
    createdAt: row.created_at as string,
  };
}

const EMPTY_FORM = {
  name: "",
  email: "",
  phone: "",
  commissionType: "flat" as CommissionType,
  commissionAmount: 0,
  referralCode: "",
  status: "active" as ReferrerStatus,
  notes: "",
};

// ─── Commission display ───────────────────────────────────────────────────────

function formatCommission(type: CommissionType, amount: number) {
  return type === "flat" ? `$${amount}` : `${amount}%`;
}

// ─── Modal ────────────────────────────────────────────────────────────────────

function ReferrerModal({
  initial,
  onSave,
  onClose,
}: {
  initial: typeof EMPTY_FORM & { id?: string };
  onSave: (data: typeof EMPTY_FORM, id?: string) => Promise<void>;
  onClose: () => void;
}) {
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const isEdit = !!initial.id;

  function set(field: string, value: string | number) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await onSave(form, initial.id);
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#0f0d0a] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/8">
          <h2 className="text-sm font-semibold text-[#f2ede4]">
            {isEdit ? "Edit Referrer" : "Add Referrer"}
          </h2>
          <button onClick={onClose} className="text-[#f2ede4]/40 hover:text-[#f2ede4] transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs text-[#f2ede4]/50 mb-1.5">Name *</label>
              <input
                required
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-[#f2ede4] placeholder-[#f2ede4]/20 focus:outline-none focus:border-amber-600/50"
                placeholder="Jane Smith"
              />
            </div>

            <div>
              <label className="block text-xs text-[#f2ede4]/50 mb-1.5">Email *</label>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-[#f2ede4] placeholder-[#f2ede4]/20 focus:outline-none focus:border-amber-600/50"
                placeholder="jane@example.com"
              />
            </div>

            <div>
              <label className="block text-xs text-[#f2ede4]/50 mb-1.5">Phone</label>
              <input
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-[#f2ede4] placeholder-[#f2ede4]/20 focus:outline-none focus:border-amber-600/50"
                placeholder="(555) 000-0000"
              />
            </div>

            <div>
              <label className="block text-xs text-[#f2ede4]/50 mb-1.5">Commission Type</label>
              <select
                value={form.commissionType}
                onChange={(e) => set("commissionType", e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-[#f2ede4] focus:outline-none focus:border-amber-600/50"
              >
                <option value="flat">Flat ($)</option>
                <option value="percentage">Percentage (%)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-[#f2ede4]/50 mb-1.5">
                Commission Amount {form.commissionType === "flat" ? "($)" : "(%)"}
              </label>
              <input
                type="number"
                min={0}
                value={form.commissionAmount}
                onChange={(e) => set("commissionAmount", Number(e.target.value))}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-[#f2ede4] focus:outline-none focus:border-amber-600/50"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-xs text-[#f2ede4]/50 mb-1.5">Referral Code</label>
              <input
                value={form.referralCode}
                onChange={(e) => set("referralCode", e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-[#f2ede4] placeholder-[#f2ede4]/20 focus:outline-none focus:border-amber-600/50 font-mono"
                placeholder="JANE25"
              />
            </div>

            <div>
              <label className="block text-xs text-[#f2ede4]/50 mb-1.5">Status</label>
              <select
                value={form.status}
                onChange={(e) => set("status", e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-[#f2ede4] focus:outline-none focus:border-amber-600/50"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-xs text-[#f2ede4]/50 mb-1.5">Notes</label>
              <textarea
                value={form.notes}
                onChange={(e) => set("notes", e.target.value)}
                rows={3}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-[#f2ede4] placeholder-[#f2ede4]/20 focus:outline-none focus:border-amber-600/50 resize-none"
                placeholder="Any relevant notes..."
              />
            </div>
          </div>

          {error && <p className="text-xs text-red-400">{error}</p>}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-[#f2ede4]/50 hover:text-[#f2ede4] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white text-xs font-medium rounded-lg transition-colors"
            >
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
              {isEdit ? "Save changes" : "Add referrer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Invite modal ─────────────────────────────────────────────────────────────

const INVITE_DEFAULTS = {
  name: "",
  email: "",
  phone: "",
  commissionType: "flat" as CommissionType,
  commissionAmount: 500,
  referralCode: "",
  notes: "",
};

function InviteReferrerModal({ onClose, onSent }: { onClose: () => void; onSent: () => void }) {
  const [form, setForm] = useState(INVITE_DEFAULTS);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  function set(field: string, value: string | number) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setError("");
    const res = await fetch("/api/admin/referrers/invite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Failed to send invite.");
      setSending(false);
      return;
    }
    onSent();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#0f0d0a] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/8">
          <div>
            <h2 className="text-sm font-semibold text-[#f2ede4]">Invite Referrer</h2>
            <p className="text-xs text-[#f2ede4]/40 mt-0.5">
              Creates their account and sends them a program invite email.
            </p>
          </div>
          <button onClick={onClose} className="text-[#f2ede4]/40 hover:text-[#f2ede4] transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-[#f2ede4]/50 mb-1.5">Email *</label>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-[#f2ede4] placeholder-[#f2ede4]/20 focus:outline-none focus:border-amber-600/50"
                placeholder="jane@example.com"
              />
            </div>

            <div>
              <label className="block text-xs text-[#f2ede4]/50 mb-1.5">Name</label>
              <input
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-[#f2ede4] placeholder-[#f2ede4]/20 focus:outline-none focus:border-amber-600/50"
                placeholder="Jane Smith"
              />
            </div>

            <div>
              <label className="block text-xs text-[#f2ede4]/50 mb-1.5">Phone</label>
              <input
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-[#f2ede4] placeholder-[#f2ede4]/20 focus:outline-none focus:border-amber-600/50"
                placeholder="(555) 000-0000"
              />
            </div>

            <div>
              <label className="block text-xs text-[#f2ede4]/50 mb-1.5">Referral Code</label>
              <input
                value={form.referralCode}
                onChange={(e) => set("referralCode", e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-[#f2ede4] placeholder-[#f2ede4]/20 focus:outline-none focus:border-amber-600/50 font-mono"
                placeholder="JANE25"
              />
            </div>

            <div>
              <label className="block text-xs text-[#f2ede4]/50 mb-1.5">Commission Type</label>
              <select
                value={form.commissionType}
                onChange={(e) => set("commissionType", e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-[#f2ede4] focus:outline-none focus:border-amber-600/50"
              >
                <option value="flat">Flat ($)</option>
                <option value="percentage">Percentage (%)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-[#f2ede4]/50 mb-1.5">
                Payout {form.commissionType === "flat" ? "($)" : "(%)"}
              </label>
              <input
                type="number"
                min={0}
                value={form.commissionAmount}
                onChange={(e) => set("commissionAmount", Number(e.target.value))}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-[#f2ede4] focus:outline-none focus:border-amber-600/50"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-xs text-[#f2ede4]/50 mb-1.5">Notes</label>
              <textarea
                value={form.notes}
                onChange={(e) => set("notes", e.target.value)}
                rows={2}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-[#f2ede4] placeholder-[#f2ede4]/20 focus:outline-none focus:border-amber-600/50 resize-none"
                placeholder="Any relevant notes..."
              />
            </div>
          </div>

          {error && <p className="text-xs text-red-400">{error}</p>}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-[#f2ede4]/50 hover:text-[#f2ede4] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={sending}
              className="flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white text-xs font-medium rounded-lg transition-colors"
            >
              {sending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Mail className="w-3.5 h-3.5" />}
              {sending ? "Sending…" : "Send invite"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ReferrersClient() {
  const [referrers, setReferrers] = useState<Referrer[]>([]);
  const [sends, setSends] = useState<ReferralSend[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [justInvited, setJustInvited] = useState(false);
  const [editTarget, setEditTarget] = useState<Referrer | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function load() {
    setLoading(true);
    const [refRes, sendsRes] = await Promise.all([
      fetch("/api/admin/referrers"),
      fetch("/api/admin/referrers/sends"),
    ]);
    const [refData, sendsData] = await Promise.all([refRes.json(), sendsRes.json()]);
    setReferrers((refData.referrers ?? []).map(rowToReferrer));
    setSends(sendsData.sends ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleSave(form: typeof EMPTY_FORM, id?: string) {
    const method = id ? "PATCH" : "POST";
    const url = id ? `/api/admin/referrers/${id}` : "/api/admin/referrers";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to save.");
    setShowModal(false);
    setEditTarget(null);
    load();
  }

  async function handleDelete(id: string) {
    setDeleting(true);
    await fetch(`/api/admin/referrers/${id}`, { method: "DELETE" });
    setDeleteId(null);
    setDeleting(false);
    load();
  }

  function handleInviteSent() {
    setShowInviteModal(false);
    setJustInvited(true);
    load();
    setTimeout(() => setJustInvited(false), 3000);
  }

  const modalInitial = editTarget
    ? { ...editTarget, id: editTarget.id }
    : { ...EMPTY_FORM, id: undefined };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-[#f2ede4]">Referrers</h1>
          <p className="text-sm text-[#f2ede4]/40 mt-1">
            Manage your referral partners and their commission rates.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setEditTarget(null); setShowModal(true); }}
            className="flex items-center gap-2 px-4 py-2 border border-white/10 text-[#f2ede4]/60 hover:text-[#f2ede4] hover:border-white/20 text-xs font-medium rounded-lg transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add
          </button>
          <button
            onClick={() => setShowInviteModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-medium rounded-lg transition-colors"
          >
            <Mail className="w-3.5 h-3.5" />
            {justInvited ? "Invite sent!" : "Invite referrer"}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-5 h-5 animate-spin text-[#f2ede4]/30" />
        </div>
      ) : referrers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <UserPlus className="w-10 h-10 text-[#f2ede4]/10 mb-4" />
          <p className="text-sm text-[#f2ede4]/40">No referrers yet.</p>
          <p className="text-xs text-[#f2ede4]/25 mt-1">Add your first referral partner to get started.</p>
        </div>
      ) : (
        <div className="bg-white/[0.03] border border-white/8 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/8">
                <th className="text-left px-5 py-3 text-xs font-medium text-[#f2ede4]/40">Name</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-[#f2ede4]/40">Email</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-[#f2ede4]/40 hidden md:table-cell">Phone</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-[#f2ede4]/40">Commission</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-[#f2ede4]/40 hidden lg:table-cell">Code</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-[#f2ede4]/40">Status</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {referrers.map((r, i) => (
                <tr
                  key={r.id}
                  className={`border-b border-white/5 hover:bg-white/[0.02] transition-colors ${
                    i === referrers.length - 1 ? "border-b-0" : ""
                  }`}
                >
                  <td className="px-5 py-3.5 text-[#f2ede4] font-medium">{r.name}</td>
                  <td className="px-5 py-3.5 text-[#f2ede4]/60">{r.email}</td>
                  <td className="px-5 py-3.5 text-[#f2ede4]/60 hidden md:table-cell">
                    {r.phone || <span className="text-[#f2ede4]/20">—</span>}
                  </td>
                  <td className="px-5 py-3.5 text-amber-400 font-medium">
                    {formatCommission(r.commissionType, r.commissionAmount)}
                  </td>
                  <td className="px-5 py-3.5 hidden lg:table-cell">
                    {r.referralCode ? (
                      <span className="font-mono text-xs bg-white/5 border border-white/10 px-2 py-0.5 rounded text-[#f2ede4]/70">
                        {r.referralCode}
                      </span>
                    ) : (
                      <span className="text-[#f2ede4]/20">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        r.status === "active"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-white/5 text-[#f2ede4]/30"
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => { setEditTarget(r); setShowModal(true); }}
                        className="text-[#f2ede4]/30 hover:text-[#f2ede4] transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteId(r.id)}
                        className="text-[#f2ede4]/30 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Referral sends */}
      <div className="mt-10">
        <h2 className="text-sm font-semibold text-[#f2ede4] mb-4">Referrals sent</h2>
        {sends.length === 0 ? (
          <div className="bg-white/[0.03] border border-white/8 rounded-2xl px-5 py-8 text-center">
            <p className="text-sm text-[#f2ede4]/30">No referral emails sent yet.</p>
          </div>
        ) : (
          <div className="bg-white/[0.03] border border-white/8 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/8">
                  <th className="text-left px-5 py-3 text-xs font-medium text-[#f2ede4]/40">Recipient</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-[#f2ede4]/40 hidden md:table-cell">Email</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-[#f2ede4]/40">Sent by</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-[#f2ede4]/40 hidden lg:table-cell">Date</th>
                </tr>
              </thead>
              <tbody>
                {sends.map((s, i) => (
                  <tr key={s.id} className={`border-b border-white/5 ${i === sends.length - 1 ? "border-b-0" : ""}`}>
                    <td className="px-5 py-3.5 text-[#f2ede4] font-medium">{s.recipient_name}</td>
                    <td className="px-5 py-3.5 text-[#f2ede4]/60 hidden md:table-cell">{s.recipient_email}</td>
                    <td className="px-5 py-3.5 text-[#f2ede4]/60">{s.referrer_name}</td>
                    <td className="px-5 py-3.5 text-[#f2ede4]/40 hidden lg:table-cell">
                      {new Date(s.sent_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <ReferrerModal
          initial={modalInitial as typeof EMPTY_FORM & { id?: string }}
          onSave={handleSave}
          onClose={() => { setShowModal(false); setEditTarget(null); }}
        />
      )}

      {showInviteModal && (
        <InviteReferrerModal
          onClose={() => setShowInviteModal(false)}
          onSent={handleInviteSent}
        />
      )}

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0f0d0a] border border-white/10 rounded-2xl w-full max-w-sm p-6 shadow-2xl">
            <h3 className="text-sm font-semibold text-[#f2ede4] mb-2">Delete referrer?</h3>
            <p className="text-xs text-[#f2ede4]/50 mb-6">This cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 text-xs text-[#f2ede4]/50 hover:text-[#f2ede4] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                disabled={deleting}
                className="flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white text-xs font-medium rounded-lg transition-colors"
              >
                {deleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
