"use client";

import { useState, useEffect, useRef } from "react";
import {
  Plus,
  X,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Pencil,
  Check,
  Globe,
  Loader2,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

export type SiteStatus = "active" | "in_progress" | "inactive" | "paused";
export type Tier = "Starter" | "Growth" | "Pro";

export interface Site {
  id: string;
  businessName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  domain: string;
  tier: Tier;
  addOns: string[];
  status: SiteStatus;
  dateInitiated: string;
  datePublished: string;
  monthlyRevenue: number;
  buildFee: number;
  notes: string;
  userId: string | null;
  // joined from users table
  userEmail?: string;
  userName?: string;
}

// DB rows use snake_case — map to camelCase
function rowToSite(row: Record<string, unknown>): Site {
  return {
    id: row.id as string,
    businessName: row.business_name as string,
    contactName: (row.contact_name as string) ?? "",
    contactEmail: (row.contact_email as string) ?? "",
    contactPhone: (row.contact_phone as string) ?? "",
    domain: (row.domain as string) ?? "",
    tier: (row.tier as Tier) ?? "Starter",
    addOns: (row.add_ons as string[]) ?? [],
    status: (row.status as SiteStatus) ?? "in_progress",
    dateInitiated: row.date_initiated
      ? (row.date_initiated as string).slice(0, 10)
      : "",
    datePublished: row.date_published
      ? (row.date_published as string).slice(0, 10)
      : "",
    monthlyRevenue: (row.monthly_revenue as number) ?? 0,
    buildFee: (row.build_fee as number) ?? 0,
    notes: (row.notes as string) ?? "",
    userId: (row.user_id as string) ?? null,
    userEmail: (row.user_email as string) ?? undefined,
    userName: (row.user_name as string) ?? undefined,
  };
}

function siteToBody(s: Omit<Site, "id" | "userEmail" | "userName">) {
  return {
    businessName: s.businessName,
    contactName: s.contactName,
    contactEmail: s.contactEmail,
    contactPhone: s.contactPhone,
    domain: s.domain,
    tier: s.tier,
    addOns: s.addOns,
    status: s.status,
    dateInitiated: s.dateInitiated || null,
    datePublished: s.datePublished || null,
    monthlyRevenue: s.monthlyRevenue,
    buildFee: s.buildFee,
    notes: s.notes,
    userId: s.userId,
  };
}

// ─── Constants ───────────────────────────────────────────────────────────────

const TIERS: Tier[] = ["Starter", "Growth", "Pro"];

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

const STATUS_LABELS: Record<SiteStatus, string> = {
  active: "Active",
  in_progress: "In Progress",
  inactive: "Inactive",
  paused: "Paused",
};

const STATUS_STYLES: Record<SiteStatus, string> = {
  active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  in_progress: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  inactive: "bg-white/5 text-[#f2ede4]/30 border-white/10",
  paused: "bg-red-500/10 text-red-400 border-red-500/20",
};

const TIER_STYLES: Record<Tier, string> = {
  Starter: "text-[#f2ede4]/50",
  Growth: "text-amber-400",
  Pro: "text-violet-400",
};

const EMPTY_FORM: Omit<Site, "id" | "userEmail" | "userName"> = {
  businessName: "",
  contactName: "",
  contactEmail: "",
  contactPhone: "",
  domain: "",
  tier: "Starter",
  addOns: [],
  status: "in_progress",
  dateInitiated: new Date().toISOString().slice(0, 10),
  datePublished: "",
  monthlyRevenue: 0,
  buildFee: 0,
  notes: "",
  userId: null,
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmt(dateStr: string) {
  if (!dateStr) return "—";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: SiteStatus }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border ${STATUS_STYLES[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}

function InlineEdit({
  value,
  onSave,
  className,
  placeholder,
}: {
  value: string;
  onSave: (v: string) => void;
  className?: string;
  placeholder?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) ref.current?.focus();
  }, [editing]);

  function save() {
    onSave(draft.trim());
    setEditing(false);
  }

  if (editing) {
    return (
      <input
        ref={ref}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={save}
        onKeyDown={(e) => {
          if (e.key === "Enter") save();
          if (e.key === "Escape") {
            setDraft(value);
            setEditing(false);
          }
        }}
        className="w-full bg-white/8 border border-amber-600/40 rounded px-2 py-0.5 text-[#f2ede4] text-xs focus:outline-none"
      />
    );
  }

  return (
    <button
      onClick={() => {
        setDraft(value);
        setEditing(true);
      }}
      className={`group flex items-center gap-1.5 text-left w-full ${className}`}
    >
      {value ? (
        <span className="truncate">{value}</span>
      ) : (
        <span className="text-white/20 italic">{placeholder ?? "—"}</span>
      )}
      <Pencil className="w-3 h-3 text-white/20 group-hover:text-white/50 shrink-0 transition-colors" />
    </button>
  );
}

// ─── Add/Edit Modal ───────────────────────────────────────────────────────────

function SiteModal({
  initial,
  onSave,
  onClose,
}: {
  initial?: Site;
  onSave: (data: Omit<Site, "id" | "userEmail" | "userName">) => Promise<void>;
  onClose: () => void;
}) {
  const [form, setForm] = useState<Omit<Site, "id" | "userEmail" | "userName">>(
    initial
      ? {
          businessName: initial.businessName,
          contactName: initial.contactName,
          contactEmail: initial.contactEmail,
          contactPhone: initial.contactPhone,
          domain: initial.domain,
          tier: initial.tier,
          addOns: [...initial.addOns],
          status: initial.status,
          dateInitiated: initial.dateInitiated,
          datePublished: initial.datePublished,
          monthlyRevenue: initial.monthlyRevenue,
          buildFee: initial.buildFee,
          notes: initial.notes,
          userId: initial.userId,
        }
      : { ...EMPTY_FORM }
  );
  const [saving, setSaving] = useState(false);

  function set<K extends keyof typeof form>(key: K, val: (typeof form)[K]) {
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
    setSaving(true);
    await onSave(form);
    setSaving(false);
  }

  const inputCls =
    "bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-[#f2ede4] text-sm placeholder-white/20 focus:outline-none focus:border-amber-600/60 transition-colors w-full";
  const labelCls =
    "text-xs text-[#f2ede4]/40 uppercase tracking-wide font-medium mb-1 block";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-[#0c0a07] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/8">
          <h2 className="text-base font-semibold text-[#f2ede4]">
            {initial ? "Edit Site" : "Add Site"}
          </h2>
          <button
            onClick={onClose}
            className="text-[#f2ede4]/40 hover:text-[#f2ede4] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-5">
          {/* Business */}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className={labelCls}>Business Name</label>
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
              <label className={labelCls}>Contact Email</label>
              <input
                type="email"
                className={inputCls}
                value={form.contactEmail}
                onChange={(e) => set("contactEmail", e.target.value)}
                placeholder="jane@acme.com"
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
          </div>

          {/* Tier + Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Tier</label>
              <select
                className={inputCls}
                value={form.tier}
                onChange={(e) => set("tier", e.target.value as Tier)}
              >
                {TIERS.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Status</label>
              <select
                className={inputCls}
                value={form.status}
                onChange={(e) => set("status", e.target.value as SiteStatus)}
              >
                {(Object.keys(STATUS_LABELS) as SiteStatus[]).map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABELS[s]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Revenue */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Build Fee ($)</label>
              <input
                type="number"
                min={0}
                className={inputCls}
                value={form.buildFee || ""}
                onChange={(e) => set("buildFee", Number(e.target.value))}
                placeholder="500"
              />
            </div>
            <div>
              <label className={labelCls}>Monthly Revenue ($)</label>
              <input
                type="number"
                min={0}
                className={inputCls}
                value={form.monthlyRevenue || ""}
                onChange={(e) => set("monthlyRevenue", Number(e.target.value))}
                placeholder="79"
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Date Initiated</label>
              <input
                type="date"
                className={inputCls}
                value={form.dateInitiated}
                onChange={(e) => set("dateInitiated", e.target.value)}
              />
            </div>
            <div>
              <label className={labelCls}>Date Published</label>
              <input
                type="date"
                className={inputCls}
                value={form.datePublished}
                onChange={(e) => set("datePublished", e.target.value)}
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
              rows={3}
              className={`${inputCls} resize-none`}
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
              placeholder="Any extra context…"
            />
          </div>

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
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white text-sm font-medium transition-colors shadow-lg shadow-amber-600/20"
            >
              {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {initial ? "Save Changes" : "Add Site"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Row ─────────────────────────────────────────────────────────────────────

function SiteRow({
  site,
  onUpdate,
  onDelete,
}: {
  site: Site;
  onUpdate: (updated: Site) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  return (
    <>
      <div
        className="grid grid-cols-[1fr_10rem_7rem_6rem_7rem_7rem_2.5rem] gap-4 px-5 py-4 items-center hover:bg-white/[0.02] transition-colors cursor-pointer"
        onClick={() => setExpanded((v) => !v)}
      >
        {/* Business + contact */}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm text-[#f2ede4] font-medium truncate">
              {site.businessName}
            </span>
            {site.domain && (
              <a
                href={`https://${site.domain}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-[#f2ede4]/20 hover:text-[#f2ede4]/60 transition-colors shrink-0"
              >
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
          <div className="text-xs text-[#f2ede4]/30 truncate mt-0.5">
            {site.contactName || (
              <span className="italic">No contact</span>
            )}
            {site.contactEmail && ` · ${site.contactEmail}`}
          </div>
        </div>

        <div className={`text-xs font-medium ${TIER_STYLES[site.tier]}`}>
          {site.tier}
        </div>

        <div>
          <StatusBadge status={site.status} />
        </div>

        <div className="text-xs text-[#f2ede4]/60">
          {site.monthlyRevenue > 0 ? `$${site.monthlyRevenue}/mo` : "—"}
        </div>

        <div className="text-xs text-[#f2ede4]/40">{fmt(site.datePublished)}</div>

        <div className="text-xs text-[#f2ede4]/30">{fmt(site.dateInitiated)}</div>

        <div className="flex justify-center text-[#f2ede4]/30">
          {expanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </div>
      </div>

      {expanded && (
        <div className="px-5 pb-5 border-t border-white/5">
          <div className="pt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-4 mb-4">
            <Field label="Domain">
              <span className="text-xs text-[#f2ede4]/60">{site.domain || "—"}</span>
            </Field>
            <Field label="Contact Phone">
              <span className="text-xs text-[#f2ede4]/60">{site.contactPhone || "—"}</span>
            </Field>
            <Field label="Build Fee">
              <span className="text-xs text-[#f2ede4]/60">
                {site.buildFee > 0 ? `$${site.buildFee}` : "—"}
              </span>
            </Field>
            <Field label="Monthly Revenue">
              <span className="text-xs text-[#f2ede4]/60">
                {site.monthlyRevenue > 0 ? `$${site.monthlyRevenue}/mo` : "—"}
              </span>
            </Field>
            <Field label="Date Initiated">
              <span className="text-xs text-[#f2ede4]/60">{fmt(site.dateInitiated)}</span>
            </Field>
            <Field label="Date Published">
              <span className="text-xs text-[#f2ede4]/60">{fmt(site.datePublished)}</span>
            </Field>
            {site.userEmail && (
              <Field label="Client Account">
                <span className="text-xs text-[#f2ede4]/60">
                  {site.userName ? `${site.userName} · ` : ""}{site.userEmail}
                </span>
              </Field>
            )}
            <Field label="Add-ons" wide>
              {site.addOns.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {site.addOns.map((ao) => (
                    <span
                      key={ao}
                      className="text-[11px] px-2 py-0.5 rounded-full bg-amber-600/10 border border-amber-600/20 text-amber-400"
                    >
                      {ao}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-xs text-white/20 italic">None</span>
              )}
            </Field>
            {site.notes && (
              <Field label="Notes" wide>
                <p className="text-xs text-[#f2ede4]/50 leading-relaxed whitespace-pre-wrap">
                  {site.notes}
                </p>
              </Field>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setEditing(true)}
              className="text-xs px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/8 border border-white/10 text-[#f2ede4]/60 hover:text-[#f2ede4] transition-colors flex items-center gap-1.5"
            >
              <Pencil className="w-3 h-3" />
              Edit
            </button>
            <button
              disabled={deleting}
              onClick={async () => {
                if (!confirm(`Delete "${site.businessName}"?`)) return;
                setDeleting(true);
                await onDelete(site.id);
              }}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 text-red-400/60 hover:text-red-400 disabled:opacity-50 transition-colors"
            >
              {deleting && <Loader2 className="w-3 h-3 animate-spin" />}
              Delete
            </button>
          </div>
        </div>
      )}

      {editing && (
        <SiteModal
          initial={site}
          onSave={async (data) => {
            await onUpdate({ ...site, ...data });
            setEditing(false);
          }}
          onClose={() => setEditing(false)}
        />
      )}
    </>
  );
}

function Field({
  label,
  children,
  wide,
}: {
  label: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <div className={wide ? "col-span-2" : ""}>
      <div className="text-[10px] uppercase tracking-wide font-medium text-[#f2ede4]/25 mb-1">
        {label}
      </div>
      {children}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

type StatusFilter = "all" | SiteStatus;

export default function SitesClient() {
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [adding, setAdding] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  async function fetchSites() {
    try {
      const res = await fetch("/api/admin/sites");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSites((data.sites as Record<string, unknown>[]).map(rowToSite));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load sites.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchSites(); }, []);

  async function addSite(data: Omit<Site, "id" | "userEmail" | "userName">) {
    const res = await fetch("/api/admin/sites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(siteToBody(data)),
    });
    const json = await res.json();
    if (!res.ok) { setError(json.error); return; }
    setSites((prev) => [rowToSite(json.site as Record<string, unknown>), ...prev]);
    setAdding(false);
  }

  async function updateSite(updated: Site) {
    const res = await fetch(`/api/admin/sites/${updated.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(siteToBody(updated)),
    });
    const json = await res.json();
    if (!res.ok) { setError(json.error); return; }
    setSites((prev) =>
      prev.map((s) =>
        s.id === updated.id ? rowToSite(json.site as Record<string, unknown>) : s
      )
    );
  }

  async function deleteSite(id: string) {
    const res = await fetch(`/api/admin/sites/${id}`, { method: "DELETE" });
    if (!res.ok) { const j = await res.json(); setError(j.error); return; }
    setSites((prev) => prev.filter((s) => s.id !== id));
  }

  const filtered =
    statusFilter === "all" ? sites : sites.filter((s) => s.status === statusFilter);

  const totalMRR = sites
    .filter((s) => s.status === "active")
    .reduce((sum, s) => sum + (s.monthlyRevenue || 0), 0);

  const statusCounts = (Object.keys(STATUS_LABELS) as SiteStatus[]).reduce(
    (acc, s) => {
      acc[s] = sites.filter((site) => site.status === s).length;
      return acc;
    },
    {} as Record<SiteStatus, number>
  );

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#f2ede4]">Sites</h1>
          <p className="text-sm text-[#f2ede4]/40 mt-1">
            Every site you&apos;ve published, at a glance.
          </p>
        </div>
        <button
          onClick={() => setAdding(true)}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-sm font-medium transition-colors shadow-lg shadow-amber-600/20"
        >
          <Plus className="w-4 h-4" />
          Add Site
        </button>
      </div>

      {error && (
        <div className="mb-4 flex items-center gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
          <X className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <StatCard label="Total Sites" value={loading ? "—" : sites.length} />
        <StatCard label="Active" value={loading ? "—" : statusCounts.active} accent="emerald" />
        <StatCard label="In Progress" value={loading ? "—" : statusCounts.in_progress} accent="amber" />
        <StatCard label="MRR" value={loading ? "—" : totalMRR > 0 ? `$${totalMRR}` : "—"} />
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 mb-4">
        {(
          [["all", "All"], ...Object.entries(STATUS_LABELS)] as [string, string][]
        ).map(([val, label]) => (
          <button
            key={val}
            onClick={() => setStatusFilter(val as StatusFilter)}
            className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${
              statusFilter === val
                ? "bg-amber-600 text-white"
                : "bg-white/5 text-[#f2ede4]/40 hover:text-[#f2ede4] hover:bg-white/8"
            }`}
          >
            {label}
            {val !== "all" && statusCounts[val as SiteStatus] > 0 && (
              <span className="ml-1.5 text-[10px] opacity-70">
                {statusCounts[val as SiteStatus]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-[#f2ede4]/30">
          <Loader2 className="w-5 h-5 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white/[0.03] border border-white/8 rounded-2xl py-20 flex flex-col items-center gap-3 text-center">
          <Globe className="w-8 h-8 text-[#f2ede4]/10" />
          <p className="text-sm text-[#f2ede4]/30">
            {sites.length === 0
              ? "No sites yet. Add your first one."
              : "No sites match this filter."}
          </p>
          {sites.length === 0 && (
            <button
              onClick={() => setAdding(true)}
              className="mt-1 text-xs px-3 py-1.5 rounded-lg bg-amber-600/10 border border-amber-600/20 text-amber-400 hover:bg-amber-600/20 transition-colors"
            >
              Add Site
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white/[0.03] border border-white/8 rounded-2xl overflow-hidden">
          <div className="grid grid-cols-[1fr_10rem_7rem_6rem_7rem_7rem_2.5rem] gap-4 px-5 py-3 border-b border-white/6 text-[10px] text-[#f2ede4]/25 uppercase tracking-wide font-medium">
            <div>Business</div>
            <div>Tier</div>
            <div>Status</div>
            <div>Monthly</div>
            <div>Published</div>
            <div>Initiated</div>
            <div />
          </div>

          <div className="divide-y divide-white/5">
            {filtered.map((site) => (
              <SiteRow
                key={site.id}
                site={site}
                onUpdate={updateSite}
                onDelete={deleteSite}
              />
            ))}
          </div>
        </div>
      )}

      {adding && (
        <SiteModal onSave={addSite} onClose={() => setAdding(false)} />
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string | number;
  accent?: "emerald" | "amber";
}) {
  const valueColor =
    accent === "emerald"
      ? "text-emerald-400"
      : accent === "amber"
      ? "text-amber-400"
      : "text-[#f2ede4]";

  return (
    <div className="bg-white/[0.03] border border-white/8 rounded-xl px-4 py-3">
      <div className="text-[10px] uppercase tracking-wide text-[#f2ede4]/30 mb-1">
        {label}
      </div>
      <div className={`text-xl font-semibold ${valueColor}`}>{value}</div>
    </div>
  );
}
