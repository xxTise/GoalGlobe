"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { GlobeMap, GlobeMapHandle } from "@/components/Globe/GlobeMap";
import { Header } from "@/components/ui/Header";
import { SmartFilters } from "@/components/Filters/SmartFilters";
import { ContinentPicker } from "@/components/ui/ContinentPicker";
import { LivePanel } from "@/components/LivePanel/LivePanel";
import { LoadingGlobe } from "@/components/ui/LoadingGlobe";
import { useMatches } from "@/hooks/useMatches";
import { useFavorites } from "@/hooks/useFavorites";
import { Continent, getContinent } from "@/lib/continents";
import { Match } from "@/lib/types";
import { FilterState, DEFAULT_FILTERS, filterMatches } from "@/lib/filters";

export default function Home() {
  const { matches, isLoading, isDemo, source, apiCallsToday, refresh } =
    useMatches();
  const { favorites, toggle: toggleFavorite } = useFavorites();
  const globeRef = useRef<GlobeMapHandle>(null);

  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [livePanelOpen, setLivePanelOpen] = useState(false);

  // Apply all filters
  const displayMatches = useMemo(
    () => filterMatches(matches, filters, favorites),
    [matches, filters, favorites]
  );

  const liveCount = useMemo(
    () =>
      displayMatches.filter((m) => m.status === "LIVE" || m.status === "HT")
        .length,
    [displayMatches]
  );

  // Match counts per continent for the picker
  const matchCounts = useMemo(() => {
    const counts: Record<Continent, number> = {
      all: displayMatches.length,
      europe: 0,
      "south-america": 0,
      "north-america": 0,
      africa: 0,
      asia: 0,
      oceania: 0,
    };
    for (const m of displayMatches) {
      const c = getContinent(m.country);
      counts[c] = (counts[c] ?? 0) + 1;
    }
    return counts;
  }, [displayMatches]);

  const handleContinentChange = useCallback(
    (c: Continent) => {
      setFilters((f) => ({ ...f, continent: c, country: "" }));
    },
    []
  );

  const handleSearchSelect = useCallback((match: Match) => {
    setLivePanelOpen(false);
    globeRef.current?.flyToMatch(match);
  }, []);

  const handleLiveMatchSelect = useCallback((match: Match) => {
    setLivePanelOpen(false);
    setTimeout(() => {
      globeRef.current?.flyToMatch(match);
    }, 150);
  }, []);

  if (isLoading) return <LoadingGlobe />;

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#06060f]">
      <Header
        matchCount={displayMatches.length}
        liveCount={liveCount}
        matches={matches}
        favoritesCount={favorites.size}
        showFavoritesOnly={filters.favoritesOnly}
        onLiveClick={() => setLivePanelOpen(true)}
        onSearchSelect={handleSearchSelect}
        onToggleFavoritesFilter={() =>
          setFilters((f) => ({ ...f, favoritesOnly: !f.favoritesOnly }))
        }
      />

      <SmartFilters
        matches={matches}
        filters={filters}
        onFiltersChange={setFilters}
        favoritesCount={favorites.size}
      />

      <GlobeMap
        ref={globeRef}
        matches={displayMatches}
        continent={filters.continent}
        favorites={favorites}
        onToggleFavorite={toggleFavorite}
      />

      <ContinentPicker
        active={filters.continent}
        onChange={handleContinentChange}
        matchCounts={matchCounts}
      />

      <LivePanel
        matches={displayMatches}
        isOpen={livePanelOpen}
        onClose={() => setLivePanelOpen(false)}
        onMatchSelect={handleLiveMatchSelect}
      />

      {/* Data source badge */}
      <div className="fixed bottom-16 left-1/2 -translate-x-1/2 z-20 pointer-events-auto">
        {isDemo ? (
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 backdrop-blur-xl">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span className="text-[11px] font-medium text-amber-400">
              Demo Mode — Add API_FOOTBALL_KEY for live data
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0c0c18]/80 border border-white/[0.06] backdrop-blur-xl">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-[10px] text-zinc-400">
              {source === "api" ? "Live" : "Cached"}
              {apiCallsToday != null && (
                <span className="text-zinc-600 ml-1">
                  · {apiCallsToday}/100 calls
                </span>
              )}
            </span>
            <button
              onClick={() => refresh()}
              className="ml-1 text-[10px] text-zinc-500 hover:text-white transition-colors cursor-pointer px-1.5 py-0.5 rounded bg-white/[0.04] hover:bg-white/[0.08]"
            >
              Refresh
            </button>
          </div>
        )}
      </div>

      {/* Bottom gradient */}
      <div className="fixed bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#06060f] to-transparent pointer-events-none z-10" />
    </div>
  );
}
