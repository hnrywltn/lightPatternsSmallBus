"use client";

import { useState } from "react";
import { Search, ExternalLink, UserPlus, Check, Loader2, X } from "lucide-react";
import type { Prospect } from "@/app/api/prospects/search/route";

type Status = "idle" | "adding" | "added" | "error";

export default function ProspectsPage() {
  const [zip, setZip] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [totalFound, setTotalFound] = useState<number | null>(null);
  const [emails, setEmails] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [statuses, setStatuses] = useState<Record<string, Status>>({});

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setProspects([]);
    setSelected(new Set());
    setEmails({});
    setStatuses({});
    setTotalFound(null);

    const params = new URLSearchParams({ zip });
    if (category.trim()) params.set("category", category.trim());

    const res = await fetch(`/api/prospects/search?${params}`);
    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Search failed.");
    } else {
      setProspects(data.prospects);
      setTotalFound(data.total);
    }

    setLoading(false);
  }

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function toggleAll() {
    if (selected.size === eligible.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(eligible.map((p) => p.place_id)));
    }
  }

  // Only prospects with an email that haven't been added yet
  const eligible = prospects.filter(
    (p) => statuses[p.place_id] !== "added"
  );

  const selectedWithEmail = prospects.filter(
    (p) => selected.has(p.place_id) && emails[p.place_id]?.trim()
  );

  async function handleAddToAudience() {
    const contacts = selectedWithEmail.map((p) => ({
      name: p.name,
      email: emails[p.place_id].trim(),
      phone: p.phone,
    }));

    // Mark as adding
    const adding: Record<string, Status> = {};
    selectedWithEmail.forEach((p) => (adding[p.place_id] = "adding"));
    setStatuses((prev) => ({ ...prev, ...adding }));

    const res = await fetch("/api/prospects/add-to-audience", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contacts }),
    });

    const data = await res.json();

    // Update statuses based on results
    const updated: Record<string, Status> = {};
    data.results?.forEach(({ email, success }: { email: string; success: boolean }) => {
      const prospect = selectedWithEmail.find(
        (p) => emails[p.place_id].trim() === email
      );
      if (prospect) updated[prospect.place_id] = success ? "added" : "error";
    });

    setStatuses((prev) => ({ ...prev, ...updated }));
    setSelected(new Set());
  }

  const hasSearched = totalFound !== null;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[#f2ede4]">Prospect Finder</h1>
        <p className="text-sm text-[#f2ede4]/40 mt-1">
          Find businesses with no website, add emails, send to Resend.
        </p>
      </div>

      {/* Search form */}
      <form
        onSubmit={handleSearch}
        className="bg-white/[0.03] border border-white/8 rounded-2xl p-6 mb-6 flex flex-col sm:flex-row gap-3"
      >
        <div className="flex flex-col gap-1.5 flex-1">
          <label className="text-xs text-[#f2ede4]/40 uppercase tracking-wide font-medium">
            Zip Code
          </label>
          <input
            type="text"
            value={zip}
            onChange={(e) => setZip(e.target.value)}
            placeholder="e.g. 10001"
            required
            className="bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-[#f2ede4] text-sm placeholder-white/20 focus:outline-none focus:border-amber-600/60 transition-colors"
          />
        </div>

        <div className="flex flex-col gap-1.5 flex-1">
          <label className="text-xs text-[#f2ede4]/40 uppercase tracking-wide font-medium">
            Category <span className="normal-case text-white/20">(optional)</span>
          </label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g. hair salon, restaurant, plumber"
            className="bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-[#f2ede4] text-sm placeholder-white/20 focus:outline-none focus:border-amber-600/60 transition-colors"
          />
        </div>

        <div className="flex flex-col gap-1.5 sm:w-36">
          <label className="text-xs text-transparent select-none">Search</label>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium text-sm transition-colors shadow-lg shadow-amber-600/20"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            {loading ? "Searching…" : "Search"}
          </button>
        </div>
      </form>

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
              <span className="text-[#f2ede4] font-medium">{prospects.length}</span> without a website
              {totalFound !== null && (
                <span className="text-white/30"> out of {totalFound} found</span>
              )}
            </div>

            {selectedWithEmail.length > 0 && (
              <button
                onClick={handleAddToAudience}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-sm font-medium transition-colors shadow-lg shadow-amber-600/20"
              >
                <UserPlus className="w-4 h-4" />
                Add {selectedWithEmail.length} to Resend
              </button>
            )}
          </div>

          {prospects.length === 0 ? (
            <div className="text-center py-16 text-[#f2ede4]/30 text-sm">
              No businesses without a website found in this area.
            </div>
          ) : (
            <div className="bg-white/[0.03] border border-white/8 rounded-2xl overflow-hidden">
              {/* Table header */}
              <div className="grid grid-cols-[2rem_1fr_1fr_8rem_10rem_2.5rem] gap-4 px-5 py-3 border-b border-white/6 text-xs text-[#f2ede4]/30 uppercase tracking-wide font-medium">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selected.size === eligible.length && eligible.length > 0}
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

              {/* Rows */}
              <div className="divide-y divide-white/5">
                {prospects.map((p) => {
                  const status = statuses[p.place_id] ?? "idle";
                  const isAdded = status === "added";
                  const isAdding = status === "adding";
                  const isError = status === "error";

                  return (
                    <div
                      key={p.place_id}
                      className={`grid grid-cols-[2rem_1fr_1fr_8rem_10rem_2.5rem] gap-4 px-5 py-4 items-center transition-colors ${
                        isAdded ? "opacity-40" : "hover:bg-white/[0.02]"
                      }`}
                    >
                      <div>
                        <input
                          type="checkbox"
                          checked={selected.has(p.place_id)}
                          onChange={() => toggleSelect(p.place_id)}
                          disabled={isAdded || isAdding}
                          className="accent-amber-600 w-3.5 h-3.5 cursor-pointer disabled:cursor-default"
                        />
                      </div>

                      <div className="min-w-0">
                        <div className="text-sm text-[#f2ede4] font-medium truncate">
                          {p.name}
                        </div>
                        <div className="text-xs text-[#f2ede4]/30 truncate mt-0.5">
                          {p.type}
                          {p.rating > 0 && (
                            <span className="ml-2">
                              ★ {p.rating.toFixed(1)} ({p.reviews})
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="text-xs text-[#f2ede4]/50 min-w-0 truncate">
                        {p.full_address}
                      </div>

                      <div className="text-xs text-[#f2ede4]/50 min-w-0 truncate">
                        {p.phone || "—"}
                      </div>

                      <div>
                        {isAdded ? (
                          <span className="text-xs text-emerald-400 flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> Added
                          </span>
                        ) : isError ? (
                          <span className="text-xs text-red-400">Failed</span>
                        ) : (
                          <input
                            type="email"
                            value={emails[p.place_id] ?? ""}
                            onChange={(e) =>
                              setEmails((prev) => ({
                                ...prev,
                                [p.place_id]: e.target.value,
                              }))
                            }
                            placeholder="email@business.com"
                            disabled={isAdding}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-[#f2ede4] text-xs placeholder-white/20 focus:outline-none focus:border-amber-600/60 transition-colors disabled:opacity-50"
                          />
                        )}
                      </div>

                      <div className="flex justify-center">
                        {isAdding ? (
                          <Loader2 className="w-3.5 h-3.5 text-amber-500 animate-spin" />
                        ) : (
                          p.google_maps_url && (
                            <a
                              href={p.google_maps_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#f2ede4]/20 hover:text-[#f2ede4]/60 transition-colors"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
