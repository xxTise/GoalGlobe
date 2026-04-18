"use client";

import { SearchBar } from "./SearchBar";
import { Match } from "@/lib/types";

interface HeaderProps {
  matchCount: number;
  liveCount: number;
  matches: Match[];
  favoritesCount: number;
  showFavoritesOnly: boolean;
  onLiveClick: () => void;
  onSearchSelect: (match: Match) => void;
  onToggleFavoritesFilter: () => void;
}

export function Header({
  matchCount,
  liveCount,
  matches,
  favoritesCount,
  showFavoritesOnly,
  onLiveClick,
  onSearchSelect,
  onToggleFavoritesFilter,
}: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-20 pointer-events-none">
      <div className="flex items-center justify-between px-5 sm:px-8 py-4 sm:py-5">
        {/* Logo */}
        <div className="pointer-events-auto">
          <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
            Goal
            <span className="bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent">
              Globe
            </span>
          </h1>
          <p className="text-[10px] sm:text-[11px] text-zinc-600 tracking-[0.15em] uppercase mt-0.5">
            Live football worldwide
          </p>
        </div>

        {/* Controls */}
        <div className="pointer-events-auto flex items-center gap-2 sm:gap-3">
          {/* Search */}
          <SearchBar matches={matches} onSelect={onSearchSelect} />

          {/* Favorites filter */}
          {favoritesCount > 0 && (
            <button
              onClick={onToggleFavoritesFilter}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                showFavoritesOnly
                  ? "bg-amber-500/15 border-amber-500/25 text-amber-400"
                  : "bg-white/[0.05] border-white/[0.06] text-zinc-500 hover:text-amber-400 hover:bg-white/[0.08]"
              }`}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill={showFavoritesOnly ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span className="text-xs font-medium tabular-nums hidden sm:inline">
                {favoritesCount}
              </span>
            </button>
          )}

          {/* Match count */}
          <div className="hidden sm:block text-right">
            <p className="text-[11px] text-zinc-600 uppercase tracking-wider">
              Matches
            </p>
            <p className="text-sm font-semibold text-zinc-300 tabular-nums">
              {matchCount}
            </p>
          </div>

          {/* Live button */}
          {liveCount > 0 && (
            <>
              <div className="hidden sm:block w-px h-8 bg-white/[0.06]" />
              <button
                onClick={onLiveClick}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors cursor-pointer"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </span>
                <span className="text-xs font-semibold text-emerald-400 tabular-nums">
                  {liveCount} Live
                </span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
