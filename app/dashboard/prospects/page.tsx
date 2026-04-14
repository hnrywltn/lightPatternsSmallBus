"use client";

import { useState, useMemo } from "react";
import { Search, ExternalLink, Loader2, X, SlidersHorizontal } from "lucide-react";
import type { Prospect } from "@/app/api/prospects/search/route";

// type Status = "idle" | "adding" | "added" | "error";

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

export default function ProspectsPage() {
  const [zip, setZip] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [totalFound, setTotalFound] = useState<number | null>(null);

  // Filters
  const [minReviews, setMinReviews] = useState(0);
  const [minRating, setMinRating] = useState(0);
  const [hasPhone, setHasPhone] = useState(false);
  const [typeFilter, setTypeFilter] = useState("");

  // const [emails, setEmails] = useState<Record<string, string>>({});
  // const [selected, setSelected] = useState<Set<string>>(new Set());
  // const [statuses, setStatuses] = useState<Record<string, Status>>({});

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setProspects([]);
    setTotalFound(null);
    setTypeFilter("");

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

  // Unique business types from results for the type filter
  const types = useMemo(() => {
    const set = new Set(prospects.map((p) => p.type).filter(Boolean));
    return Array.from(set).sort();
  }, [prospects]);

  const filtered = useMemo(() => {
    return prospects.filter((p) => {
      if (minReviews > 0 && p.reviews < minReviews) return false;
      if (minRating > 0 && p.rating < minRating) return false;
      if (hasPhone && !p.phone) return false;
      if (typeFilter && p.type !== typeFilter) return false;
      return true;
    });
  }, [prospects, minReviews, minRating, hasPhone, typeFilter]);

  const hasSearched = totalFound !== null;
  const filtersActive = minReviews > 0 || minRating > 0 || hasPhone || typeFilter !== "";

  function resetFilters() {
    setMinReviews(0);
    setMinRating(0);
    setHasPhone(false);
    setTypeFilter("");
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[#f2ede4]">Prospect Finder</h1>
        <p className="text-sm text-[#f2ede4]/40 mt-1">
          Find businesses with no website.
        </p>
      </div>

      {/* Search form */}
      <form
        onSubmit={handleSearch}
        className="bg-white/[0.03] border border-white/8 rounded-2xl p-6 mb-4 flex flex-col sm:flex-row gap-3"
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

      {/* Filters — shown after search */}
      {hasSearched && prospects.length > 0 && (
        <div className="bg-white/[0.03] border border-white/8 rounded-2xl px-5 py-4 mb-6 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 text-xs text-[#f2ede4]/40">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="uppercase tracking-wide font-medium">Filter</span>
          </div>

          {/* Min reviews */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#f2ede4]/40">Reviews</span>
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

          {/* Min rating */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#f2ede4]/40">Rating</span>
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

          {/* Has phone */}
          <button
            onClick={() => setHasPhone((v) => !v)}
            className={`text-xs px-2.5 py-1 rounded-lg transition-colors ${
              hasPhone
                ? "bg-amber-600 text-white"
                : "bg-white/5 text-[#f2ede4]/50 hover:text-[#f2ede4] hover:bg-white/8"
            }`}
          >
            Has phone
          </button>

          {/* Type filter */}
          {types.length > 1 && (
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="text-xs bg-white/5 border border-white/10 rounded-lg px-2.5 py-1 text-[#f2ede4]/60 focus:outline-none focus:border-amber-600/60 transition-colors"
            >
              <option value="">All types</option>
              {types.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          )}

          {/* Reset */}
          {filtersActive && (
            <button
              onClick={resetFilters}
              className="text-xs text-[#f2ede4]/30 hover:text-[#f2ede4]/60 transition-colors ml-auto"
            >
              Reset
            </button>
          )}
        </div>
      )}

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
              {filtersActive && (
                <span className="text-white/30"> of {prospects.length}</span>
              )}{" "}
              without a website
              {totalFound !== null && (
                <span className="text-white/30"> · {totalFound} total found</span>
              )}
            </div>

            {/* Add to Resend button — re-enable when ready
            {selectedWithEmail.length > 0 && (
              <button onClick={handleAddToAudience} ...>
                Add {selectedWithEmail.length} to Resend
              </button>
            )} */}
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-16 text-[#f2ede4]/30 text-sm">
              {prospects.length === 0
                ? "No businesses without a website found in this area."
                : "No results match the current filters."}
            </div>
          ) : (
            <div className="bg-white/[0.03] border border-white/8 rounded-2xl overflow-hidden">
              <div className="grid grid-cols-[1fr_1fr_8rem_2.5rem] gap-4 px-5 py-3 border-b border-white/6 text-xs text-[#f2ede4]/30 uppercase tracking-wide font-medium">
                <div>Business</div>
                <div>Address</div>
                <div>Phone</div>
                <div></div>
              </div>

              <div className="divide-y divide-white/5">
                {filtered.map((p) => (
                  <div
                    key={p.place_id}
                    className="grid grid-cols-[1fr_1fr_8rem_2.5rem] gap-4 px-5 py-4 items-center hover:bg-white/[0.02] transition-colors"
                  >
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
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
