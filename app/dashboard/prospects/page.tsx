"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { Search, ExternalLink, Loader2, X, SlidersHorizontal, Pencil, Check, ListPlus, Users, Send, BookmarkPlus } from "lucide-react";
import type { Prospect } from "@/app/api/prospects/search/route";

const BUSINESS_TYPES = [
  { label: "All types", value: "" },
  { label: "Restaurant", value: "restaurant" },
  { label: "Bar / Cafe", value: "bar cafe" },
  { label: "Hair Salon", value: "hair salon" },
  { label: "Barbershop", value: "barbershop" },
  { label: "Nail Salon", value: "nail salon" },
  { label: "Spa / Beauty", value: "spa beauty salon" },
  { label: "Auto Repair", value: "auto repair shop" },
  { label: "Plumber", value: "plumber" },
  { label: "Electrician", value: "electrician" },
  { label: "HVAC", value: "hvac contractor" },
  { label: "Landscaping", value: "landscaping lawn care" },
  { label: "Cleaning Service", value: "cleaning service" },
  { label: "Contractor", value: "general contractor" },
  { label: "Painter", value: "painter" },
  { label: "Roofing", value: "roofing contractor" },
  { label: "Dentist", value: "dentist" },
  { label: "Chiropractor", value: "chiropractor" },
  { label: "Gym / Fitness", value: "gym fitness" },
  { label: "Retail Shop", value: "retail store" },
  { label: "Laundromat", value: "laundromat" },
  { label: "Daycare", value: "daycare" },
  { label: "Custom…", value: "__custom__" },
];

const MIN_REVIEWS_OPTIONS = [
  { label: "Any", value: 0 },
  { label: "5+", value: 5 },
  { label: "10+", value: 10 },
  { label: "25+", value: 25 },
  { label: "50+", value: 50 },
];

const MIN_RATING_OPTIONS = [
  { label: "Any", value: 0 },
  { label: "3+", value: 3 },
  { label: "3.5+", value: 3.5 },
  { label: "4+", value: 4 },
  { label: "4.5+", value: 4.5 },
];

type PresenceFilter = "any" | "yes" | "no";

export interface SavedContact {
  place_id: string;
  name: string;
  email: string;
  phone: string;
  full_address: string;
  type: string;
}

const LS_EMAILS_KEY = "lp_prospect_emails";
const LS_LIST_KEY = "lp_prospect_list";

function loadFromLS<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function PresencePills({
  value,
  onChange,
}: {
  value: PresenceFilter;
  onChange: (v: PresenceFilter) => void;
}) {
  return (
    <div className="flex gap-1">
      {(["any", "yes", "no"] as PresenceFilter[]).map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={`text-xs px-2.5 py-1 rounded-lg capitalize transition-colors ${
            value === opt
              ? "bg-amber-600 text-white"
              : "bg-white/5 text-[#f2ede4]/50 hover:text-[#f2ede4] hover:bg-white/8"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

function InlineEmail({
  value,
  onSave,
}: {
  value: string;
  onSave: (v: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  function save() {
    onSave(draft.trim());
    setEditing(false);
  }

  function cancel() {
    setDraft(value);
    setEditing(false);
  }

  if (editing) {
    return (
      <input
        ref={inputRef}
        type="email"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={save}
        onKeyDown={(e) => {
          if (e.key === "Enter") save();
          if (e.key === "Escape") cancel();
        }}
        className="w-full bg-white/8 border border-amber-600/40 rounded px-2 py-1 text-[#f2ede4] text-xs focus:outline-none"
      />
    );
  }

  return (
    <button
      onClick={() => { setDraft(value); setEditing(true); }}
      className="group flex items-center gap-1.5 w-full text-left"
    >
      {value ? (
        <span className="text-xs text-[#f2ede4]/60 truncate">{value}</span>
      ) : (
        <span className="text-xs text-white/20 italic">+ add email</span>
      )}
      <Pencil className="w-3 h-3 text-white/20 group-hover:text-white/50 shrink-0 transition-colors" />
    </button>
  );
}

export default function ProspectsPage() {
  const [zip, setZip] = useState("");
  const [categorySelect, setCategorySelect] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [prospects, setProspects] = useState<Prospect[]>([]);

  // Persisted emails keyed by place_id
  const [emails, setEmails] = useState<Record<string, string>>({});
  // Persisted saved contact list
  const [savedList, setSavedList] = useState<SavedContact[]>([]);
  // Selected rows
  const [selected, setSelected] = useState<Set<string>>(new Set());
  // Show saved list panel
  const [showList, setShowList] = useState(false);
  // Send state: record of email -> 'sending' | 'sent' | 'error'
  const [sendStatuses, setSendStatuses] = useState<Record<string, "sending" | "sent" | "error">>({});
  const [sending, setSending] = useState(false);
  const [savingToOutreach, setSavingToOutreach] = useState(false);
  const [savedToOutreachMsg, setSavedToOutreachMsg] = useState("");

  // Load persisted data on mount
  useEffect(() => {
    setEmails(loadFromLS<Record<string, string>>(LS_EMAILS_KEY, {}));
    setSavedList(loadFromLS<SavedContact[]>(LS_LIST_KEY, []));
  }, []);

  // Filters
  const [minReviews, setMinReviews] = useState(0);
  const [minRating, setMinRating] = useState(0);
  const [hasPhone, setHasPhone] = useState<PresenceFilter>("any");
  const [hasWebsite, setHasWebsite] = useState<PresenceFilter>("no");
  const [hasEmail, setHasEmail] = useState<PresenceFilter>("any");
  const [typeFilter, setTypeFilter] = useState("");

  const isCustom = categorySelect === "__custom__";
  const effectiveCategory = isCustom ? customCategory : categorySelect;

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setProspects([]);
    setSelected(new Set());
    setTypeFilter("");

    const params = new URLSearchParams({ zip });
    if (effectiveCategory.trim()) params.set("category", effectiveCategory.trim());

    const res = await fetch(`/api/prospects/search?${params}`);
    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Search failed.");
    } else {
      setProspects(data.prospects);
    }

    setLoading(false);
  }

  function saveEmail(place_id: string, email: string) {
    setEmails((prev) => {
      const next = { ...prev, [place_id]: email };
      localStorage.setItem(LS_EMAILS_KEY, JSON.stringify(next));
      return next;
    });
    // If this prospect is already in the saved list, update its email
    setSavedList((prev) => {
      const updated = prev.map((c) =>
        c.place_id === place_id ? { ...c, email } : c
      );
      if (updated.some((c) => c.place_id === place_id)) {
        localStorage.setItem(LS_LIST_KEY, JSON.stringify(updated));
        return updated;
      }
      return prev;
    });
  }

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function toggleAll() {
    if (selected.size === filtered.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map((p) => p.place_id)));
    }
  }

  function addToList() {
    const toAdd = filtered
      .filter((p) => selected.has(p.place_id))
      .map((p) => ({
        place_id: p.place_id,
        name: p.name,
        email: emails[p.place_id] ?? "",
        phone: p.phone,
        full_address: p.full_address,
        type: p.type,
      }));

    setSavedList((prev) => {
      const existingIds = new Set(prev.map((c) => c.place_id));
      const merged = [
        ...prev.map((c) => {
          const update = toAdd.find((a) => a.place_id === c.place_id);
          return update ? { ...c, ...update } : c;
        }),
        ...toAdd.filter((a) => !existingIds.has(a.place_id)),
      ];
      localStorage.setItem(LS_LIST_KEY, JSON.stringify(merged));
      return merged;
    });

    setSelected(new Set());
    setShowList(true);
  }

  async function saveToOutreach() {
    const toSave = filtered
      .filter((p) => selected.has(p.place_id))
      .map((p) => ({
        place_id: p.place_id,
        name: p.name,
        email: emails[p.place_id] ?? p.email ?? "",
        phone: p.phone,
        full_address: p.full_address,
        type: p.type,
      }));
    if (!toSave.length) return;
    setSavingToOutreach(true);
    setSavedToOutreachMsg("");
    const res = await fetch("/api/admin/outreach/prospects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prospects: toSave }),
    });
    const data = await res.json();
    setSavingToOutreach(false);
    if (res.ok) {
      setSavedToOutreachMsg(`${data.upserted} saved to Outreach.`);
      setSelected(new Set());
      setTimeout(() => setSavedToOutreachMsg(""), 3000);
    }
  }

  function removeFromList(place_id: string) {
    setSavedList((prev) => {
      const next = prev.filter((c) => c.place_id !== place_id);
      localStorage.setItem(LS_LIST_KEY, JSON.stringify(next));
      return next;
    });
  }

  async function sendEmails() {
    const toSend = savedList.filter(
      (c) => c.email && sendStatuses[c.email] !== "sent"
    );
    if (!toSend.length) return;

    setSending(true);
    const pending: Record<string, "sending"> = {};
    toSend.forEach((c) => (pending[c.email] = "sending"));
    setSendStatuses((prev) => ({ ...prev, ...pending }));

    const res = await fetch("/api/prospects/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contacts: toSend }),
    });
    const data = await res.json();

    const updated: Record<string, "sent" | "error"> = {};
    data.results?.forEach(({ email, success }: { email: string; success: boolean }) => {
      updated[email] = success ? "sent" : "error";
    });
    setSendStatuses((prev) => ({ ...prev, ...updated }));
    setSending(false);
  }

  const types = useMemo(() => {
    const set = new Set(prospects.map((p) => p.type).filter(Boolean));
    return Array.from(set).sort();
  }, [prospects]);

  const filtered = useMemo(() => {
    return prospects.filter((p) => {
      if (minReviews > 0 && p.reviews < minReviews) return false;
      if (minRating > 0 && p.rating < minRating) return false;
      if (hasPhone === "yes" && !p.phone) return false;
      if (hasPhone === "no" && p.phone) return false;
      if (hasWebsite === "yes" && !p.site) return false;
      if (hasWebsite === "no" && p.site) return false;
      if (hasEmail === "yes" && !p.email) return false;
      if (hasEmail === "no" && p.email) return false;
      if (typeFilter && p.type !== typeFilter) return false;
      return true;
    });
  }, [prospects, minReviews, minRating, hasPhone, hasWebsite, hasEmail, typeFilter]);

  const hasSearched = prospects.length > 0 || error !== "";
  const allSelected = filtered.length > 0 && selected.size === filtered.length;
  const filtersActive =
    minReviews > 0 ||
    minRating > 0 ||
    hasPhone !== "any" ||
    hasWebsite !== "no" ||
    hasEmail !== "any" ||
    typeFilter !== "";

  function resetFilters() {
    setMinReviews(0);
    setMinRating(0);
    setHasPhone("any");
    setHasWebsite("no");
    setHasEmail("any");
    setTypeFilter("");
  }

  const savedIds = new Set(savedList.map((c) => c.place_id));

  return (
    <div>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#f2ede4]">Prospect Finder</h1>
          <p className="text-sm text-[#f2ede4]/40 mt-1">
            Find businesses by zip code and filter by what they have or don&apos;t have.
          </p>
        </div>
        <button
          onClick={() => setShowList((v) => !v)}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-medium transition-colors ${
            showList
              ? "bg-amber-600/10 border-amber-600/30 text-amber-500"
              : "bg-white/[0.03] border-white/8 text-[#f2ede4]/50 hover:text-[#f2ede4]"
          }`}
        >
          <Users className="w-4 h-4" />
          List
          {savedList.length > 0 && (
            <span className="text-xs bg-amber-600 text-white rounded-full px-1.5 py-0.5 leading-none">
              {savedList.length}
            </span>
          )}
        </button>
      </div>

      {/* Saved list panel */}
      {showList && (
        <div className="bg-white/[0.03] border border-white/8 rounded-2xl mb-6 overflow-x-auto">
          <div className="min-w-[520px]">
          <div className="px-5 py-4 border-b border-white/6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-sm font-medium text-[#f2ede4]">Saved List</h2>
              <span className="text-xs text-[#f2ede4]/30">{savedList.length} contacts</span>
            </div>
            {savedList.some((c) => c.email && sendStatuses[c.email] !== "sent") && (
              <button
                onClick={sendEmails}
                disabled={sending}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white text-xs font-medium transition-colors shadow-lg shadow-amber-600/20"
              >
                {sending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                {sending ? "Sending…" : `Send ${savedList.filter((c) => c.email && sendStatuses[c.email] !== "sent").length} emails`}
              </button>
            )}
          </div>
          {savedList.length === 0 ? (
            <div className="px-5 py-8 text-center text-xs text-[#f2ede4]/30">
              No contacts saved yet. Select rows and click &quot;Add to list.&quot;
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {savedList.map((c) => {
                const status = c.email ? sendStatuses[c.email] : undefined;
                return (
                  <div key={c.place_id} className="grid grid-cols-[1fr_1fr_7rem_5rem_2rem] gap-4 px-5 py-3 items-center">
                    <div className="min-w-0">
                      <div className="text-sm text-[#f2ede4] font-medium truncate">{c.name}</div>
                      <div className="text-xs text-[#f2ede4]/30 truncate">{c.type}</div>
                    </div>
                    <div className="text-xs text-[#f2ede4]/50 truncate">{c.email || <span className="text-white/20 italic">no email</span>}</div>
                    <div className="text-xs text-[#f2ede4]/50 truncate">{c.phone || "—"}</div>
                    <div className="text-xs">
                      {status === "sending" && <span className="flex items-center gap-1 text-amber-500"><Loader2 className="w-3 h-3 animate-spin" /> Sending</span>}
                      {status === "sent" && <span className="flex items-center gap-1 text-emerald-400"><Check className="w-3 h-3" /> Sent</span>}
                      {status === "error" && <span className="text-red-400">Failed</span>}
                    </div>
                    <button
                      onClick={() => removeFromList(c.place_id)}
                      className="text-white/20 hover:text-red-400 transition-colors justify-self-center"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
          </div>
        </div>
      )}

      {/* Search form */}
      <form
        onSubmit={handleSearch}
        className="bg-white/[0.03] border border-white/8 rounded-2xl p-6 mb-4 flex flex-col sm:flex-row gap-3"
      >
        <div className="flex flex-col gap-1.5 flex-1">
          <label className="text-xs text-[#f2ede4]/40 uppercase tracking-wide font-medium">
            Zip Codes <span className="normal-case text-white/20">(comma-separated)</span>
          </label>
          <input
            type="text"
            value={zip}
            onChange={(e) => setZip(e.target.value)}
            placeholder="e.g. 10001, 10002, 10003"
            required
            className="bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-[#f2ede4] text-sm placeholder-white/20 focus:outline-none focus:border-amber-600/60 transition-colors"
          />
        </div>

        <div className="flex flex-col gap-1.5 flex-1">
          <label className="text-xs text-[#f2ede4]/40 uppercase tracking-wide font-medium">
            Business Type
          </label>
          <select
            value={categorySelect}
            onChange={(e) => setCategorySelect(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-[#f2ede4] text-sm focus:outline-none focus:border-amber-600/60 transition-colors"
          >
            {BUSINESS_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        {isCustom && (
          <div className="flex flex-col gap-1.5 flex-1">
            <label className="text-xs text-[#f2ede4]/40 uppercase tracking-wide font-medium">
              Custom Type
            </label>
            <input
              type="text"
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              placeholder="e.g. tattoo parlor"
              className="bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-[#f2ede4] text-sm placeholder-white/20 focus:outline-none focus:border-amber-600/60 transition-colors"
            />
          </div>
        )}

        <div className="flex flex-col gap-1.5 sm:w-36">
          <label className="text-xs text-transparent select-none">Search</label>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium text-sm transition-colors shadow-lg shadow-amber-600/20"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            {loading ? "Searching…" : "Search"}
          </button>
        </div>
      </form>

      {/* Filters */}
      <div className="bg-white/[0.03] border border-white/8 rounded-2xl px-5 py-4 mb-6 flex flex-wrap items-center gap-x-5 gap-y-3">
        <div className="flex items-center gap-2 text-xs text-[#f2ede4]/40">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span className="uppercase tracking-wide font-medium">Filter</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[#f2ede4]/40 w-14">Website</span>
          <PresencePills value={hasWebsite} onChange={setHasWebsite} />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[#f2ede4]/40 w-14">Email</span>
          <PresencePills value={hasEmail} onChange={setHasEmail} />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[#f2ede4]/40 w-14">Phone</span>
          <PresencePills value={hasPhone} onChange={setHasPhone} />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[#f2ede4]/40 w-14">Reviews</span>
          <div className="flex gap-1">
            {MIN_REVIEWS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setMinReviews(opt.value)}
                className={`text-xs px-2.5 py-1 rounded-lg transition-colors ${
                  minReviews === opt.value
                    ? "bg-amber-600 text-white"
                    : "bg-white/5 text-[#f2ede4]/50 hover:text-[#f2ede4] hover:bg-white/8"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[#f2ede4]/40 w-14">Rating</span>
          <div className="flex gap-1">
            {MIN_RATING_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setMinRating(opt.value)}
                className={`text-xs px-2.5 py-1 rounded-lg transition-colors ${
                  minRating === opt.value
                    ? "bg-amber-600 text-white"
                    : "bg-white/5 text-[#f2ede4]/50 hover:text-[#f2ede4] hover:bg-white/8"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {types.length > 1 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#f2ede4]/40 w-14">Type</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="text-xs bg-white/5 border border-white/10 rounded-lg px-2.5 py-1 text-[#f2ede4]/60 focus:outline-none focus:border-amber-600/60 transition-colors"
            >
              <option value="">All</option>
              {types.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        )}

        {filtersActive && (
          <button
            onClick={resetFilters}
            className="text-xs text-[#f2ede4]/30 hover:text-[#f2ede4]/60 transition-colors ml-auto"
          >
            Reset
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 flex items-center gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
          <X className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Results */}
      {hasSearched && (
        <>
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-[#f2ede4]/50">
              <span className="text-[#f2ede4] font-medium">{filtered.length}</span>
              {filtersActive && prospects.length !== filtered.length && (
                <span className="text-white/30"> of {prospects.length}</span>
              )}{" "}
              results
            </div>

            {selected.size > 0 && (
              <div className="flex items-center gap-2">
                {savedToOutreachMsg && (
                  <span className="text-xs text-emerald-400">{savedToOutreachMsg}</span>
                )}
                <button
                  onClick={saveToOutreach}
                  disabled={savingToOutreach}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-[#f2ede4]/70 text-xs font-medium transition-colors"
                >
                  {savingToOutreach ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <BookmarkPlus className="w-3.5 h-3.5" />}
                  Save to Outreach
                </button>
                <button
                  onClick={addToList}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-medium transition-colors shadow-lg shadow-amber-600/20"
                >
                  <ListPlus className="w-3.5 h-3.5" />
                  Add {selected.size} to list
                </button>
              </div>
            )}
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-16 text-[#f2ede4]/30 text-sm">
              {prospects.length === 0
                ? "No results found for this search."
                : "No results match the current filters."}
            </div>
          ) : (
            <div className="bg-white/[0.03] border border-white/8 rounded-2xl overflow-x-auto">
              <div className="min-w-[620px]">
              <div className="grid grid-cols-[2rem_1fr_1fr_7rem_9rem_2.5rem] gap-4 px-5 py-3 border-b border-white/6 text-xs text-[#f2ede4]/30 uppercase tracking-wide font-medium">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAll}
                    className="accent-amber-600 w-3.5 h-3.5 cursor-pointer"
                  />
                </div>
                <div>Business</div>
                <div>Address</div>
                <div>Phone</div>
                <div>Email</div>
                <div></div>
              </div>

              <div className="divide-y divide-white/5">
                {filtered.map((p) => {
                  const inList = savedIds.has(p.place_id);
                  return (
                    <div
                      key={p.place_id}
                      className={`grid grid-cols-[2rem_1fr_1fr_7rem_9rem_2.5rem] gap-4 px-5 py-3.5 items-center hover:bg-white/[0.02] transition-colors ${
                        inList ? "bg-amber-600/[0.03]" : ""
                      }`}
                    >
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selected.has(p.place_id)}
                          onChange={() => toggleSelect(p.place_id)}
                          className="accent-amber-600 w-3.5 h-3.5 cursor-pointer"
                        />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-[#f2ede4] font-medium truncate">{p.name}</span>
                          {inList && <Check className="w-3 h-3 text-amber-500 shrink-0" />}
                        </div>
                        <div className="text-xs text-[#f2ede4]/30 truncate mt-0.5">
                          {p.type}
                          {p.rating > 0 && (
                            <span className="ml-2">★ {p.rating.toFixed(1)} ({p.reviews})</span>
                          )}
                        </div>
                      </div>

                      <div className="text-xs text-[#f2ede4]/50 min-w-0 truncate">
                        {p.full_address}
                      </div>

                      <div className="text-xs text-[#f2ede4]/50 min-w-0 truncate">
                        {p.phone || <span className="text-white/20">—</span>}
                      </div>

                      <div className="min-w-0">
                        <InlineEmail
                          value={emails[p.place_id] ?? p.email ?? ""}
                          onSave={(v) => saveEmail(p.place_id, v)}
                        />
                      </div>

                      <div className="flex justify-center">
                        {p.google_maps_url && (
                          <a
                            href={p.google_maps_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#f2ede4]/20 hover:text-[#f2ede4]/60 transition-colors"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
