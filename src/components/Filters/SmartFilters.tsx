"use client";

import { useCallback, useMemo, useState } from "react";
import { Match, MatchStatus, MatchCategory } from "@/lib/types";
import { FilterState, activeFilterCount } from "@/lib/filters";
import { FilterChip } from "./FilterChip";

interface SmartFiltersProps {
  matches: Match[];
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  favoritesCount: number;
}

export function SmartFilters({
  matches,
  filters,
  onFiltersChange,
  favoritesCount,
}: SmartFiltersProps) {
  const activeCount = activeFilterCount(filters);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { LIVE: 0, NS: 0, FT: 0 };
    for (const m of matches) {
      if (m.status === "LIVE" || m.status === "HT") counts.LIVE++;
      else if (m.status === "NS") counts.NS++;
      else if (m.status === "FT") counts.FT++;
    }
    return counts;
  }, [matches]);

  const toggleStatus = useCallback(
    (status: MatchStatus) => {
      const next = new Set(filters.statuses);
      if (next.has(status)) next.delete(status);
      else next.add(status);
      onFiltersChange({ ...filters, statuses: next });
    },
    [filters, onFiltersChange]
  );

  const toggleCategory = useCallback(
    (cat: MatchCategory) => {
      const next = new Set(filters.categories);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      onFiltersChange({ ...filters, categories: next });
    },
    [filters, onFiltersChange]
  );

  const toggleBool = useCallback(
    (key: "topLeaguesOnly" | "favoritesOnly" | "hideFriendlies" | "hasGoals" | "hasRedCard") => {
      onFiltersChange({ ...filters, [key]: !filters[key] });
    },
    [filters, onFiltersChange]
  );

  const clearAll = useCallback(() => {
    onFiltersChange({
      statuses: new Set(),
      categories: new Set(),
      continent: filters.continent, // preserve continent (controlled by bottom picker)
      country: "",
      search: "",
      topLeaguesOnly: false,
      favoritesOnly: false,
      hideFriendlies: false,
      hasGoals: false,
      hasRedCard: false,
    });
  }, [filters.continent, onFiltersChange]);

  // Check if any "More" filters are active
  const hasExpandedFilters =
    filters.categories.size > 0 || filters.hideFriendlies || filters.hasGoals || filters.hasRedCard;
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="fixed top-[72px] left-0 right-0 z-20 pointer-events-none">
      <div className="px-4 sm:px-8 pointer-events-auto">
        <div className="inline-flex flex-col bg-[#0a0a16]/85 backdrop-blur-2xl border border-white/[0.05] rounded-2xl shadow-xl shadow-black/30 overflow-hidden">
          {/* ── Filter chips ── */}
          <div className="flex items-center gap-2 px-4 py-2.5 overflow-x-auto no-scrollbar">
            <FilterChip
              label="Live"
              active={filters.statuses.has("LIVE")}
              onClick={() => toggleStatus("LIVE")}
              count={statusCounts.LIVE}
              color="green"
              icon={
                filters.statuses.has("LIVE") ? (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                ) : undefined
              }
            />
            <FilterChip
              label="Upcoming"
              active={filters.statuses.has("NS")}
              onClick={() => toggleStatus("NS")}
              count={statusCounts.NS}
              color="blue"
            />
            <FilterChip
              label="Finished"
              active={filters.statuses.has("FT")}
              onClick={() => toggleStatus("FT")}
              count={statusCounts.FT}
            />

            <div className="w-px h-5 bg-white/[0.06] shrink-0" />

            <FilterChip
              label="Top Leagues"
              active={filters.topLeaguesOnly}
              onClick={() => toggleBool("topLeaguesOnly")}
              color="amber"
            />

            {favoritesCount > 0 && (
              <FilterChip
                label="Favorites"
                active={filters.favoritesOnly}
                onClick={() => toggleBool("favoritesOnly")}
                count={favoritesCount}
                color="amber"
              />
            )}

            <div className="w-px h-5 bg-white/[0.06] shrink-0" />

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium border transition-all cursor-pointer whitespace-nowrap ${
                isExpanded || hasExpandedFilters
                  ? "bg-white/[0.08] text-white border-white/[0.1]"
                  : "bg-white/[0.03] text-zinc-500 border-white/[0.04] hover:bg-white/[0.06]"
              }`}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="4" y1="21" x2="4" y2="14" /><line x1="4" y1="10" x2="4" y2="3" />
                <line x1="12" y1="21" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="3" />
                <line x1="20" y1="21" x2="20" y2="16" /><line x1="20" y1="12" x2="20" y2="3" />
                <line x1="1" y1="14" x2="7" y2="14" /><line x1="9" y1="8" x2="15" y2="8" />
                <line x1="17" y1="16" x2="23" y2="16" />
              </svg>
              More
            </button>

            {activeCount > 0 && (
              <button
                onClick={clearAll}
                className="text-[10px] text-zinc-500 hover:text-white transition-colors cursor-pointer whitespace-nowrap px-2 py-1 rounded-lg hover:bg-white/[0.05]"
              >
                Clear ({activeCount})
              </button>
            )}
          </div>

          {/* ── Expanded section ── */}
          <div
            className={`overflow-hidden transition-all duration-300 ease-out ${
              isExpanded ? "max-h-[200px] opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="px-4 pb-3 pt-1 border-t border-white/[0.04] space-y-3">
              <FilterSection label="Category">
                <FilterChip label="International" active={filters.categories.has("international")} onClick={() => toggleCategory("international")} />
                <FilterChip label="Women's" active={filters.categories.has("women")} onClick={() => toggleCategory("women")} />
                <FilterChip label="Youth" active={filters.categories.has("youth")} onClick={() => toggleCategory("youth")} />
                <FilterChip label="Hide Friendlies" active={filters.hideFriendlies} onClick={() => toggleBool("hideFriendlies")} />
              </FilterSection>

              <FilterSection label="Match Events">
                <FilterChip label="Has Goals" active={filters.hasGoals} onClick={() => toggleBool("hasGoals")} color="green" />
                <FilterChip label="Has Red Card" active={filters.hasRedCard} onClick={() => toggleBool("hasRedCard")} color="red" />
              </FilterSection>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterSection({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-[9px] text-zinc-600 uppercase tracking-wider font-medium mb-1.5">
        {label}
      </p>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}
