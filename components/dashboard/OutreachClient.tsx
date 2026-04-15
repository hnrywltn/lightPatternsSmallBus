"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  RefreshCw, Send, Trash2, Loader2, Search, CheckCircle,
  XCircle, Clock, MousePointerClick, Mail, AlertTriangle, Check,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

type ProspectStatus = "new" | "contacted" | "replied" | "converted" | "dead";
type EmailStatus = "sent" | "delivered" | "opened" | "clicked" | "bounced" | "complained" | null;

interface Prospect {
  id: string;
  place_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  full_address: string | null;
  type: string | null;
  status: ProspectStatus;
  notes: string | null;
  created_at: string;
  email_status: EmailStatus;
  last_sent_at: string | null;
  opened_at: string | null;
  clicked_at: string | null;
}

interface Stats {
  totalProspects: number;
  totalSends: number;
  totalDelivered: number;
  totalOpened: number;
  totalClicked: number;
  totalReplied: number;
  totalConverted: number;
  openRate: number;
  clickRate: number;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmtDate(iso: string | null) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

const PROSPECT_STATUS_META: Record<ProspectStatus, { label: string; cls: string }> = {
  new:       { label: "New",       cls: "text-[#f2ede4]/50 bg-white/5"         },
  contacted: { label: "Contacted", cls: "text-blue-400 bg-blue-400/10"         },
  replied:   { label: "Replied",   cls: "text-amber-400 bg-amber-400/10"       },
  converted: { label: "Converted", cls: "text-emerald-400 bg-emerald-400/10"   },
  dead:      { label: "Dead",      cls: "text-red-400/70 bg-red-400/10"        },
};

const EMAIL_STATUS_META: Record<NonNullable<EmailStatus>, { label: string; icon: React.ReactNode; cls: string }> = {
  sent:       { label: "Sent",       icon: <Mail className="w-3 h-3" />,              cls: "text-[#f2ede4]/40 bg-white/5"       },
  delivered:  { label: "Delivered",  icon: <CheckCircle className="w-3 h-3" />,       cls: "text-blue-400 bg-blue-400/10"       },
  opened:     { label: "Opened",     icon: <Clock className="w-3 h-3" />,             cls: "text-amber-400 bg-amber-400/10"     },
  clicked:    { label: "Clicked",    icon: <MousePointerClick className="w-3 h-3" />, cls: "text-emerald-400 bg-emerald-400/10" },
  bounced:    { label: "Bounced",    icon: <XCircle className="w-3 h-3" />,           cls: "text-red-400 bg-red-400/10"         },
  complained: { label: "Complained", icon: <AlertTriangle className="w-3 h-3" />,     cls: "text-red-400 bg-red-400/10"         },
};

const FILTER_TABS: { label: string; value: ProspectStatus | "all" }[] = [
  { label: "All",       value: "all"       },
  { label: "New",       value: "new"       },
  { label: "Contacted", value: "contacted" },
  { label: "Replied",   value: "replied"   },
  { label: "Converted", value: "converted" },
  { label: "Dead",      value: "dead"      },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="bg-white/[0.03] border border-white/8 rounded-xl px-5 py-4">
      <p className="text-[11px] text-[#f2ede4]/40 mb-1">{label}</p>
      <p className="text-2xl font-semibold text-[#f2ede4]">{value}</p>
      {sub && <p className="text-[11px] text-[#f2ede4]/30 mt-0.5">{sub}</p>}
    </div>
  );
}

function ProspectStatusBadge({ status }: { status: ProspectStatus }) {
  const m = PROSPECT_STATUS_META[status];
  return (
    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${m.cls}`}>{m.label}</span>
  );
}

function EmailStatusBadge({ status }: { status: EmailStatus }) {
  if (!status) return <span className="text-[11px] text-[#f2ede4]/20">—</span>;
  const m = EMAIL_STATUS_META[status];
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full ${m.cls}`}>
      {m.icon}{m.label}
    </span>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

export default function OutreachClient() {
  const [prospects, setProspects]   = useState<Prospect[]>([]);
  const [stats, setStats]           = useState<Stats | null>(null);
  const [loading, setLoading]       = useState(true);
  const [statusFilter, setStatusFilter] = useState<ProspectStatus | "all">("all");
  const [search, setSearch]         = useState("");
  const [selected, setSelected]     = useState<Set<string>>(new Set());
  const [sending, setSending]       = useState(false);
  const [sendResult, setSendResult] = useState<string>("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const [pRes, sRes] = await Promise.all([
      fetch("/api/admin/outreach/prospects"),
      fetch("/api/admin/outreach/stats"),
    ]);
    const [pData, sData] = await Promise.all([pRes.json(), sRes.json()]);
    if (pRes.ok) setProspects(pData.prospects);
    if (sRes.ok) setStats(sData);
    setLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // ── Filtering ───────────────────────────────────────────────────────────────

  const filtered = prospects.filter((p) => {
    if (statusFilter !== "all" && p.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        (p.email ?? "").toLowerCase().includes(q) ||
        (p.type ?? "").toLowerCase().includes(q)
      );
    }
    return true;
  });

  // ── Selection ───────────────────────────────────────────────────────────────

  const allSelected = filtered.length > 0 && filtered.every((p) => selected.has(p.id));

  function toggleAll() {
    setSelected(allSelected ? new Set() : new Set(filtered.map((p) => p.id)));
  }

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  // ── Actions ─────────────────────────────────────────────────────────────────

  async function sendSelected() {
    const ids = Array.from(selected);
    setSending(true);
    setSendResult("");
    const res = await fetch("/api/admin/outreach/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prospectIds: ids }),
    });
    const data = await res.json();
    if (res.ok) {
      setSendResult(`Sent ${data.sent} email${data.sent !== 1 ? "s" : ""}${data.failed > 0 ? `, ${data.failed} failed` : ""}.`);
    } else {
      setSendResult(data.error ?? "Send failed.");
    }
    setSending(false);
    setSelected(new Set());
    fetchAll();
  }

  async function updateStatus(id: string, status: ProspectStatus) {
    setUpdatingId(id);
    await fetch(`/api/admin/outreach/prospects/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setProspects((prev) => prev.map((p) => p.id === id ? { ...p, status } : p));
    setUpdatingId(null);
  }

  async function removeProspect(id: string) {
    await fetch(`/api/admin/outreach/prospects/${id}`, { method: "DELETE" });
    setProspects((prev) => prev.filter((p) => p.id !== id));
    setSelected((prev) => { const next = new Set(prev); next.delete(id); return next; });
  }

  async function bulkUpdateStatus(status: ProspectStatus) {
    const ids = Array.from(selected);
    await Promise.all(ids.map((id) =>
      fetch(`/api/admin/outreach/prospects/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
    ));
    setProspects((prev) => prev.map((p) => selected.has(p.id) ? { ...p, status } : p));
    setSelected(new Set());
  }

  async function bulkRemove() {
    const ids = Array.from(selected);
    await Promise.all(ids.map((id) =>
      fetch(`/api/admin/outreach/prospects/${id}`, { method: "DELETE" })
    ));
    setProspects((prev) => prev.filter((p) => !selected.has(p.id)));
    setSelected(new Set());
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  const selectedWithEmail = Array.from(selected).filter(
    (id) => prospects.find((p) => p.id === id)?.email
  ).length;

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold text-[#f2ede4]">Outreach</h1>
          <p className="text-sm text-[#f2ede4]/40 mt-1">Track cold email campaigns and engagement.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/prospects"
            className="flex items-center gap-1.5 text-xs text-[#f2ede4]/40 hover:text-[#f2ede4] transition-colors border border-white/8 px-3 py-1.5 rounded-lg"
          >
            <Search className="w-3.5 h-3.5" />
            Find Prospects
          </Link>
          <button
            onClick={fetchAll}
            className="flex items-center gap-1.5 text-xs text-[#f2ede4]/40 hover:text-[#f2ede4] transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-8">
          <StatCard label="Prospects"  value={stats.totalProspects} />
          <StatCard label="Sent"       value={stats.totalSends}     />
          <StatCard label="Delivered"  value={stats.totalDelivered} />
          <StatCard label="Open Rate"  value={`${stats.openRate}%`}  sub={`${stats.totalOpened} opens`}   />
          <StatCard label="Click Rate" value={`${stats.clickRate}%`} sub={`${stats.totalClicked} clicks`} />
          <StatCard label="Replied"    value={stats.totalReplied}   />
          <StatCard label="Converted"  value={stats.totalConverted} />
        </div>
      )}

      {/* Filter + search */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex gap-1">
          {FILTER_TABS.map((t) => (
            <button
              key={t.value}
              onClick={() => setStatusFilter(t.value)}
              className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${
                statusFilter === t.value
                  ? "bg-amber-600 text-white"
                  : "bg-white/5 text-[#f2ede4]/50 hover:text-[#f2ede4]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="relative ml-auto">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#f2ede4]/20" />
          <input
            type="text"
            placeholder="Search…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-lg pl-8 pr-3 py-1.5 text-sm text-[#f2ede4] placeholder-[#f2ede4]/20 focus:outline-none focus:border-amber-600/50 w-52"
          />
        </div>
      </div>

      {/* Bulk action bar */}
      {selected.size > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-4 bg-amber-600/10 border border-amber-600/20 rounded-xl px-4 py-2.5">
          <span className="text-xs text-amber-400 font-medium mr-1">{selected.size} selected</span>
          <button
            onClick={sendSelected}
            disabled={sending || selectedWithEmail === 0}
            className="flex items-center gap-1.5 text-xs bg-amber-600 hover:bg-amber-500 disabled:opacity-40 text-white px-3 py-1.5 rounded-lg transition-colors"
          >
            {sending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            Send ({selectedWithEmail})
          </button>
          <button onClick={() => bulkUpdateStatus("replied")}   className="text-xs bg-white/5 hover:bg-white/10 text-amber-400 px-3 py-1.5 rounded-lg transition-colors">Mark replied</button>
          <button onClick={() => bulkUpdateStatus("converted")} className="text-xs bg-white/5 hover:bg-white/10 text-emerald-400 px-3 py-1.5 rounded-lg transition-colors">Mark converted</button>
          <button onClick={() => bulkUpdateStatus("dead")}      className="text-xs bg-white/5 hover:bg-white/10 text-red-400/70 px-3 py-1.5 rounded-lg transition-colors">Mark dead</button>
          <button onClick={bulkRemove} className="flex items-center gap-1 text-xs bg-white/5 hover:bg-white/10 text-[#f2ede4]/40 px-3 py-1.5 rounded-lg transition-colors ml-auto">
            <Trash2 className="w-3.5 h-3.5" /> Remove
          </button>
          {sendResult && <span className="text-xs text-emerald-400 ml-2">{sendResult}</span>}
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="flex items-center gap-2 text-xs text-[#f2ede4]/30 py-10">
          <Loader2 className="w-4 h-4 animate-spin" />Loading…
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-sm text-[#f2ede4]/30">
          {prospects.length === 0
            ? <>No prospects yet. <Link href="/dashboard/prospects" className="text-amber-500 hover:underline">Find some →</Link></>
            : "No prospects match the current filter."}
        </div>
      ) : (
        <div className="bg-white/[0.03] border border-white/8 rounded-2xl overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-[2rem_1fr_1fr_6rem_7rem_7rem_2.5rem] gap-3 px-5 py-3 border-b border-white/8 text-[11px] text-[#f2ede4]/30 uppercase tracking-wide font-medium">
            <div className="flex items-center">
              <input type="checkbox" checked={allSelected} onChange={toggleAll} className="accent-amber-600 w-3.5 h-3.5 cursor-pointer" />
            </div>
            <div>Business</div>
            <div>Email</div>
            <div>Status</div>
            <div>Email</div>
            <div>Sent</div>
            <div></div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-white/5">
            {filtered.map((p) => (
              <div
                key={p.id}
                className="grid grid-cols-[2rem_1fr_1fr_6rem_7rem_7rem_2.5rem] gap-3 px-5 py-3.5 items-center hover:bg-white/[0.02] transition-colors"
              >
                {/* Checkbox */}
                <div className="flex items-center">
                  <input type="checkbox" checked={selected.has(p.id)} onChange={() => toggle(p.id)} className="accent-amber-600 w-3.5 h-3.5 cursor-pointer" />
                </div>

                {/* Name */}
                <div className="min-w-0">
                  <div className="text-sm text-[#f2ede4] font-medium truncate">{p.name}</div>
                  <div className="text-xs text-[#f2ede4]/30 truncate mt-0.5">{p.type ?? p.full_address ?? ""}</div>
                </div>

                {/* Email */}
                <div className="text-xs text-[#f2ede4]/50 truncate min-w-0">
                  {p.email ?? <span className="text-white/20 italic">no email</span>}
                </div>

                {/* Prospect status */}
                <div>
                  <div className="relative group">
                    <ProspectStatusBadge status={p.status} />
                    {/* Status dropdown on hover */}
                    <div className="absolute left-0 top-full mt-1 z-10 hidden group-hover:flex flex-col bg-[#1a1610] border border-white/12 rounded-xl shadow-xl overflow-hidden text-xs w-32">
                      {(["new","contacted","replied","converted","dead"] as ProspectStatus[]).map((s) => (
                        <button
                          key={s}
                          onClick={() => updateStatus(p.id, s)}
                          disabled={updatingId === p.id}
                          className={`flex items-center gap-2 px-3 py-2 hover:bg-white/5 transition-colors text-left ${p.status === s ? "text-amber-400" : "text-[#f2ede4]/60"}`}
                        >
                          {p.status === s && <Check className="w-3 h-3 shrink-0" />}
                          {p.status !== s && <span className="w-3 shrink-0" />}
                          <span className="capitalize">{s}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Email status */}
                <div><EmailStatusBadge status={p.email_status} /></div>

                {/* Last sent */}
                <div className="text-xs text-[#f2ede4]/30">
                  {fmtDate(p.last_sent_at) ?? "—"}
                </div>

                {/* Remove */}
                <div className="flex justify-center">
                  <button onClick={() => removeProspect(p.id)} className="text-[#f2ede4]/20 hover:text-red-400 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
