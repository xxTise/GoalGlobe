"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Match } from "@/lib/types";

interface SearchBarProps {
  matches: Match[];
  onSelect: (match: Match) => void;
}

interface SearchResult {
  match: Match;
  label: string;
  sublabel: string;
  type: "team" | "league" | "stadium";
}

export function SearchBar({ matches, onSelect }: SearchBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Cmd+K to open
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
        setQuery("");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Build search index
  const results: SearchResult[] = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();

    const found: SearchResult[] = [];
    const seen = new Set<string>();

    for (const match of matches) {
      // Search by team
      if (match.homeTeam.toLowerCase().includes(q) && !seen.has(`team-${match.id}-home`)) {
        seen.add(`team-${match.id}-home`);
        found.push({
          match,
          label: match.homeTeam,
          sublabel: `vs ${match.awayTeam} · ${match.league}`,
          type: "team",
        });
      }
      if (match.awayTeam.toLowerCase().includes(q) && !seen.has(`team-${match.id}-away`)) {
        seen.add(`team-${match.id}-away`);
        found.push({
          match,
          label: match.awayTeam,
          sublabel: `vs ${match.homeTeam} · ${match.league}`,
          type: "team",
        });
      }
      // Search by league
      if (match.league.toLowerCase().includes(q) && !seen.has(`league-${match.league}-${match.id}`)) {
        seen.add(`league-${match.league}-${match.id}`);
        found.push({
          match,
          label: match.league,
          sublabel: `${match.homeTeam} vs ${match.awayTeam}`,
          type: "league",
        });
      }
      // Search by stadium
      if (match.stadium.toLowerCase().includes(q) && !seen.has(`stadium-${match.id}`)) {
        seen.add(`stadium-${match.id}`);
        found.push({
          match,
          label: match.stadium,
          sublabel: `${match.homeTeam} vs ${match.awayTeam} · ${match.country}`,
          type: "stadium",
        });
      }
      // Search by country
      if (match.country.toLowerCase().includes(q) && !seen.has(`country-${match.id}`)) {
        seen.add(`country-${match.id}`);
        found.push({
          match,
          label: `${match.homeTeam} vs ${match.awayTeam}`,
          sublabel: `${match.league} · ${match.country}`,
          type: "team",
        });
      }
    }

    return found.slice(0, 8);
  }, [query, matches]);

  const handleSelect = useCallback(
    (result: SearchResult) => {
      onSelect(result.match);
      setIsOpen(false);
      setQuery("");
    },
    [onSelect]
  );

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/[0.06] hover:bg-white/[0.08] transition-colors cursor-pointer"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-zinc-500">
          <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.5" />
          <path d="M9.5 9.5L13 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <span className="text-xs text-zinc-500 hidden sm:inline">Search</span>
        <kbd className="hidden sm:inline text-[10px] text-zinc-600 bg-white/[0.05] px-1.5 py-0.5 rounded font-mono">
          ⌘K
        </kbd>
      </button>

      {/* Modal overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center pt-[28vh]"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsOpen(false);
              setQuery("");
            }
          }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Search panel */}
          <div
            ref={panelRef}
            className="relative w-full max-w-lg mx-4 bg-[#0e0e1a]/95 backdrop-blur-2xl border border-white/[0.08] rounded-2xl shadow-2xl shadow-black/50 overflow-hidden"
          >
            {/* Input */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.06]">
              <svg width="18" height="18" viewBox="0 0 14 14" fill="none" className="text-zinc-500 shrink-0">
                <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.5" />
                <path d="M9.5 9.5L13 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search teams, leagues, stadiums..."
                className="flex-1 bg-transparent text-white text-sm placeholder:text-zinc-600 outline-none"
              />
              <kbd
                className="text-[10px] text-zinc-600 bg-white/[0.05] px-1.5 py-0.5 rounded font-mono cursor-pointer"
                onClick={() => {
                  setIsOpen(false);
                  setQuery("");
                }}
              >
                ESC
              </kbd>
            </div>

            {/* Results */}
            {query.trim() && (
              <div className="max-h-80 overflow-y-auto py-2">
                {results.length === 0 ? (
                  <div className="px-5 py-8 text-center">
                    <p className="text-sm text-zinc-500">No results found</p>
                    <p className="text-xs text-zinc-700 mt-1">
                      Try a team name, league, or stadium
                    </p>
                  </div>
                ) : (
                  results.map((result, i) => (
                    <button
                      key={`${result.type}-${result.match.id}-${i}`}
                      onClick={() => handleSelect(result)}
                      className="w-full flex items-center gap-3 px-5 py-3 hover:bg-white/[0.04] transition-colors cursor-pointer text-left"
                    >
                      <div className="w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center shrink-0">
                        <span className="text-xs">
                          {result.type === "team"
                            ? "⚽"
                            : result.type === "league"
                            ? "🏆"
                            : "🏟"}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] text-white font-medium truncate">
                          {result.label}
                        </p>
                        <p className="text-[11px] text-zinc-500 truncate">
                          {result.sublabel}
                        </p>
                      </div>
                      {result.match.status === "LIVE" && (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 shrink-0">
                          <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                          <span className="text-[10px] font-semibold text-emerald-400">
                            LIVE
                          </span>
                        </span>
                      )}
                    </button>
                  ))
                )}
              </div>
            )}

            {/* Empty state hint */}
            {!query.trim() && (
              <div className="px-5 py-6 text-center">
                <p className="text-xs text-zinc-600">
                  Type to search across all matches
                </p>
              </div>
            )}

            {/* Back to globe button */}
            <div className="px-4 py-3 border-t border-white/[0.06]">
              <button
                onClick={() => {
                  setIsOpen(false);
                  setQuery("");
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] transition-colors cursor-pointer"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-zinc-500">
                  <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-xs font-medium text-zinc-400">
                  Back to Globe
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
