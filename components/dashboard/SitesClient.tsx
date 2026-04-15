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
}

// ─── Constants ───────────────────────────────────────────────────────────────

const LS_KEY = "lp_sites";

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

const EMPTY_FORM: Omit<Site, "id"> = {
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
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function loadSites(): Site[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? (JSON.parse(raw) as Site[]) : [];
  } catch {
    return [];
  }
}

function saveSites(sites: Site[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(sites));
}

function fmt(dateStr: string) {
  if (!dateStr) return "—";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
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
  type = "text",
}: {
  value: string;
  onSave: (v: string) => void;
  className?: string;
  placeholder?: string;
  type?: string;
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
        type={type}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={save}
        onKeyDown={(e) => {
          if (e.key === "Enter") save();
          if (e.key === "Escape") { setDraft(value); setEditing(false); }
        }}
        className="w-full bg-white/8 border border-amber-600/40 rounded px-2 py-0.5 text-[#f2ede4] text-xs focus:outline-none"
      />
    );
  }

  return (
    <button
      onClick={() => { setDraft(value); setEditing(true); }}
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
  onSave: (data: Omit<Site, "id">) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<Omit<Site, "id">>(
    initial ? { ...initial } : { ...EMPTY_FORM }
  );

  function set<K extends keyof Omit<Site, "id">>(key: K, val: Omit<Site, "id">[K]) {
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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave(form);
  }

  const inputCls =
    "bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-[#f2ede4] text-sm placeholder-white/20 focus:outline-none focus:border-amber-600/60 transition-colors w-full";
  const labelCls = "text-xs text-[#f2ede4]/40 uppercase tracking-wide font-medium mb-1 block";

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
          <button onClick={onClose} className="text-[#f2ede4]/40 hover:text-[#f2ede4] transition-colors">
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
                {TIERS.map((t) => <option key={t}>{t}</option>)}
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
                  <option key={s} value={s}>{STATUS_LABELS[s]}</option>
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
              className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-sm font-medium transition-colors shadow-lg shadow-amber-600/20"
            >
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
  onUpdate: (updated: Site) => void;
  onDelete: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);

  function patch<K extends keyof Site>(key: K, val: Site[K]) {
    onUpdate({ ...site, [key]: val });
  }

  return (
    <>
      <div
        className="grid grid-cols-[1fr_10rem_7rem_6rem_7rem_7rem_2.5rem] gap-4 px-5 py-4 items-center hover:bg-white/[0.02] transition-colors cursor-pointer"
        onClick={() => setExpanded((v) => !v)}
      >
        {/* Business + contact */}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm text-[#f2ede4] font-medium truncate">{site.businessName}</span>
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
            {site.contactName || <span className="italic">No contact</span>}
            {site.contactEmail && ` · ${site.contactEmail}`}
          </div>
        </div>

        {/* Tier */}
        <div className={`text-xs font-medium ${TIER_STYLES[site.tier]}`}>
          {site.tier}
        </div>

        {/* Status */}
        <div>
          <StatusBadge status={site.status} />
        </div>

        {/* Monthly */}
        <div className="text-xs text-[#f2ede4]/60">
          {site.monthlyRevenue > 0 ? `$${site.monthlyRevenue}/mo` : "—"}
        </div>

        {/* Published */}
        <div className="text-xs text-[#f2ede4]/40">{fmt(site.datePublished)}</div>

        {/* Initiated */}
        <div className="text-xs text-[#f2ede4]/30">{fmt(site.dateInitiated)}</div>

        {/* Expand toggle */}
        <div className="flex justify-center text-[#f2ede4]/30">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </div>

      {expanded && (
        <div className="px-5 pb-5 border-t border-white/5">
          <div className="pt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-4 mb-4">
            <Field label="Domain">
              <InlineEdit
                value={site.domain}
                onSave={(v) => patch("domain", v)}
                placeholder="+ add domain"
                className="text-xs text-[#f2ede4]/60"
              />
            </Field>
            <Field label="Contact Phone">
              <InlineEdit
                value={site.contactPhone}
                onSave={(v) => patch("contactPhone", v)}
                placeholder="+ add phone"
                className="text-xs text-[#f2ede4]/60"
              />
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
                <p className="text-xs text-[#f2ede4]/50 leading-relaxed whitespace-pre-wrap">{site.notes}</p>
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
              onClick={() => {
                if (confirm(`Delete "${site.businessName}"?`)) onDelete(site.id);
              }}
              className="text-xs px-3 py-1.5 rounded-lg bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 text-red-400/60 hover:text-red-400 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      )}

      {editing && (
        <SiteModal
          initial={site}
          onSave={(data) => { onUpdate({ ...data, id: site.id }); setEditing(false); }}
          onClose={() => setEditing(false)}
        />
      )}
    </>
  );
}

function Field({ label, children, wide }: { label: string; children: React.ReactNode; wide?: boolean }) {
  return (
    <div className={wide ? "col-span-2" : ""}>
      <div className="text-[10px] uppercase tracking-wide font-medium text-[#f2ede4]/25 mb-1">{label}</div>
      {children}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

type StatusFilter = "all" | SiteStatus;

export default function SitesClient() {
  const [sites, setSites] = useState<Site[]>([]);
  const [adding, setAdding] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  useEffect(() => {
    setSites(loadSites());
  }, []);

  function addSite(data: Omit<Site, "id">) {
    const next = [{ ...data, id: uid() }, ...sites];
    setSites(next);
    saveSites(next);
    setAdding(false);
  }

  function updateSite(updated: Site) {
    const next = sites.map((s) => (s.id === updated.id ? updated : s));
    setSites(next);
    saveSites(next);
  }

  function deleteSite(id: string) {
    const next = sites.filter((s) => s.id !== id);
    setSites(next);
    saveSites(next);
  }

  const filtered =
    statusFilter === "all" ? sites : sites.filter((s) => s.status === statusFilter);

  const totalMRR = sites
    .filter((s) => s.status === "active")
    .reduce((sum, s) => sum + (s.monthlyRevenue || 0), 0);

  const statusCounts = (Object.keys(STATUS_LABELS) as SiteStatus[]).reduce((acc, s) => {
    acc[s] = sites.filter((site) => site.status === s).length;
    return acc;
  }, {} as Record<SiteStatus, number>);

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

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <StatCard label="Total Sites" value={sites.length} />
        <StatCard label="Active" value={statusCounts.active} accent="emerald" />
        <StatCard label="In Progress" value={statusCounts.in_progress} accent="amber" />
        <StatCard label="MRR" value={totalMRR > 0 ? `$${totalMRR}` : "—"} />
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 mb-4">
        {([["all", "All"], ...Object.entries(STATUS_LABELS)] as [string, string][]).map(([val, label]) => (
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
      {filtered.length === 0 ? (
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
          {/* Table header */}
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
      <div className="text-[10px] uppercase tracking-wide text-[#f2ede4]/30 mb-1">{label}</div>
      <div className={`text-xl font-semibold ${valueColor}`}>{value}</div>
    </div>
  );
}
