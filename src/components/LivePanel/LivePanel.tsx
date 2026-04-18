"use client";

import { useMemo } from "react";
import { Match } from "@/lib/types";

interface LivePanelProps {
  matches: Match[];
  isOpen: boolean;
  onClose: () => void;
  onMatchSelect: (match: Match) => void;
}

export function LivePanel({
  matches,
  isOpen,
  onClose,
  onMatchSelect,
}: LivePanelProps) {
  // Only live + half-time matches
  const liveMatches = useMemo(
    () => matches.filter((m) => m.status === "LIVE" || m.status === "HT"),
    [matches]
  );

  // Group by league
  const grouped = useMemo(() => {
    const map = new Map<string, Match[]>();
    for (const match of liveMatches) {
      const existing = map.get(match.league) ?? [];
      existing.push(match);
      map.set(match.league, existing);
    }
    return map;
  }, [liveMatches]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-30 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Panel — slides from left */}
      <div
        className={`fixed top-0 left-0 h-full w-full sm:w-[360px] z-40 transform transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full bg-[#0c0c18]/90 backdrop-blur-2xl border-r border-white/[0.06] shadow-2xl shadow-black/50 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-white/[0.06]">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </span>
                <span className="text-xs font-semibold text-emerald-400">
                  Live
                </span>
              </div>
              <span className="text-sm text-zinc-400">
                {liveMatches.length} match{liveMatches.length !== 1 ? "es" : ""}
              </span>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-zinc-500 hover:text-white transition-all cursor-pointer"
              aria-label="Close"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M1 1L13 13M13 1L1 13"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          {/* Match list */}
          <div className="flex-1 overflow-y-auto py-2">
            {liveMatches.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-6">
                <div className="w-12 h-12 rounded-full bg-white/[0.03] flex items-center justify-center mb-3">
                  <span className="text-2xl">⚽</span>
                </div>
                <p className="text-sm text-zinc-400">No live matches right now</p>
                <p className="text-xs text-zinc-600 mt-1">
                  Check back soon
                </p>
              </div>
            ) : (
              Array.from(grouped.entries()).map(([league, leagueMatches]) => (
                <LeagueGroup
                  key={league}
                  league={league}
                  country={leagueMatches[0].country}
                  matches={leagueMatches}
                  onMatchSelect={onMatchSelect}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function LeagueGroup({
  league,
  country,
  matches,
  onMatchSelect,
}: {
  league: string;
  country: string;
  matches: Match[];
  onMatchSelect: (match: Match) => void;
}) {
  return (
    <div className="mb-1">
      {/* League header */}
      <div className="px-6 py-2.5 flex items-center gap-2 sticky top-0 bg-[#0c0c18]/95 backdrop-blur-sm z-10">
        <div className="w-5 h-5 rounded bg-white/[0.06] flex items-center justify-center text-[10px] font-bold text-zinc-500">
          {league.charAt(0)}
        </div>
        <div>
          <p className="text-[12px] font-semibold text-zinc-300">{league}</p>
          <p className="text-[10px] text-zinc-600">{country}</p>
        </div>
      </div>

      {/* Matches in this league */}
      {matches.map((match) => (
        <MatchRow
          key={match.id}
          match={match}
          onSelect={() => onMatchSelect(match)}
        />
      ))}
    </div>
  );
}

function MatchRow({
  match,
  onSelect,
}: {
  match: Match;
  onSelect: () => void;
}) {
  const isHT = match.status === "HT";

  return (
    <button
      onClick={onSelect}
      className="w-full px-6 py-3 flex items-center gap-4 hover:bg-white/[0.03] transition-colors cursor-pointer group"
    >
      {/* Minute */}
      <div className="w-10 text-center shrink-0">
        {isHT ? (
          <span className="text-[11px] font-semibold text-amber-400">HT</span>
        ) : (
          <div className="flex items-center justify-center gap-1">
            <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[12px] font-mono font-semibold text-emerald-400">
              {match.minute}&apos;
            </span>
          </div>
        )}
      </div>

      {/* Teams + Score */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className="text-[13px] text-zinc-200 font-medium truncate">
            {match.homeTeam}
          </span>
          <span className="text-[13px] font-mono font-bold text-white ml-2">
            {match.homeScore}
          </span>
        </div>
        <div className="flex items-center justify-between mt-0.5">
          <span className="text-[13px] text-zinc-200 font-medium truncate">
            {match.awayTeam}
          </span>
          <span className="text-[13px] font-mono font-bold text-white ml-2">
            {match.awayScore}
          </span>
        </div>
      </div>

      {/* Arrow */}
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        className="text-zinc-700 group-hover:text-zinc-400 transition-colors shrink-0"
      >
        <path
          d="M6 4L10 8L6 12"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
