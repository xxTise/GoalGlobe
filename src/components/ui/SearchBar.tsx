"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Match } from "@/lib/types";
import { FollowItem } from "@/hooks/useFollowing";
import {
  buildSearchableTeams,
  LEAGUE_REGISTRY,
} from "@/lib/team-registry";

interface SearchBarProps {
  matches: Match[];
  onSelect: (match: Match) => void;
  onFollowTeam?: (item: FollowItem) => void;
  onOpenChange?: (open: boolean) => void;
}

// ── Result types ──

interface MatchResult {
  kind: "match";
  match: Match;
}

interface TeamResult {
  kind: "team";
  name: string;
  country: string;
  league: string;
  logo?: string;
  liveMatch?: Match; // if this team is playing right now
}

interface LeagueResult {
  kind: "league";
  id: number;
  name: string;
  country: string;
  matchCount: number; // how many matches today in this league
}

type SearchResult = MatchResult | TeamResult | LeagueResult;

interface GroupedResults {
  liveMatches: MatchResult[];
  teams: TeamResult[];
  leagues: LeagueResult[];
  matches: MatchResult[];
}

export function SearchBar({
  matches,
  onSelect,
  onFollowTeam,
  onOpenChange,
}: SearchBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const onOpenChangeRef = useRef(onOpenChange);
  onOpenChangeRef.current = onOpenChange;

  const setOpen = useCallback((open: boolean) => {
    setIsOpen(open);
    onOpenChangeRef.current?.(open);
  }, []);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Build searchable team map (registry + live data)
  const teamMap = useMemo(() => buildSearchableTeams(matches), [matches]);

  // League match counts
  const leagueMatchCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const m of matches) {
      counts.set(m.league, (counts.get(m.league) ?? 0) + 1);
    }
    return counts;
  }, [matches]);

  // Cmd+K to open
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === "Escape") {
        setOpen(false);
        setQuery("");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [setOpen]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 50);
  }, [isOpen]);

  // ── Search engine ──
  const grouped: GroupedResults = useMemo(() => {
    const result: GroupedResults = {
      liveMatches: [],
      teams: [],
      leagues: [],
      matches: [],
    };
    if (!query.trim()) return result;

    const q = query.toLowerCase().trim();
    const seenTeams = new Set<string>();
    const seenLeagues = new Set<string>();
    const seenMatches = new Set<string>();

    // 1. Search live matches (highest priority)
    for (const m of matches) {
      if (m.status !== "LIVE" && m.status !== "HT") continue;
      const haystack = `${m.homeTeam} ${m.awayTeam} ${m.league}`.toLowerCase();
      if (haystack.includes(q) && !seenMatches.has(m.id)) {
        seenMatches.add(m.id);
        result.liveMatches.push({ kind: "match", match: m });
      }
    }

    // 2. Search teams (registry + live data)
    for (const [key, team] of teamMap) {
      if (key.includes(q) && !seenTeams.has(key)) {
        seenTeams.add(key);
        // Check if this team has a match today
        const liveMatch = matches.find(
          (m) =>
            (m.homeTeam.toLowerCase() === key ||
              m.awayTeam.toLowerCase() === key) &&
            (m.status === "LIVE" || m.status === "HT")
        );
        result.teams.push({ kind: "team", ...team, liveMatch });
      }
      if (result.teams.length >= 10) break;
    }

    // 3. Search leagues (registry + live data)
    for (const league of LEAGUE_REGISTRY) {
      if (
        league.name.toLowerCase().includes(q) &&
        !seenLeagues.has(league.name)
      ) {
        seenLeagues.add(league.name);
        result.leagues.push({
          kind: "league",
          ...league,
          matchCount: leagueMatchCounts.get(league.name) ?? 0,
        });
      }
    }
    // Also search leagues from today's data not in registry
    for (const m of matches) {
      if (
        m.league.toLowerCase().includes(q) &&
        !seenLeagues.has(m.league)
      ) {
        seenLeagues.add(m.league);
        result.leagues.push({
          kind: "league",
          id: m.leagueId,
          name: m.league,
          country: m.country,
          matchCount: leagueMatchCounts.get(m.league) ?? 0,
        });
      }
    }

    // 4. Search remaining matches (upcoming, finished)
    for (const m of matches) {
      if (seenMatches.has(m.id)) continue;
      const haystack =
        `${m.homeTeam} ${m.awayTeam} ${m.league} ${m.stadium} ${m.country}`.toLowerCase();
      if (haystack.includes(q)) {
        seenMatches.add(m.id);
        result.matches.push({ kind: "match", match: m });
      }
      if (result.matches.length >= 6) break;
    }

    return result;
  }, [query, matches, teamMap, leagueMatchCounts]);

  const hasResults =
    grouped.liveMatches.length > 0 ||
    grouped.teams.length > 0 ||
    grouped.leagues.length > 0 ||
    grouped.matches.length > 0;

  const handleMatchSelect = useCallback(
    (match: Match) => {
      onSelect(match);
      setOpen(false);
      setQuery("");
    },
    [onSelect, setOpen]
  );

  const handleTeamFollow = useCallback(
    (team: TeamResult) => {
      onFollowTeam?.({
        type: "team",
        id: team.name,
        name: team.name,
        logo: team.logo,
      });
    },
    [onFollowTeam]
  );

  return (
    <>
      {/* Trigger */}
      <button
        onClick={() => setOpen(true)}
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

      {/* Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setOpen(false);
              setQuery("");
            }
          }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          <div className="relative w-full max-w-lg mx-4 bg-[#0c0c18]/95 backdrop-blur-2xl border border-white/[0.08] rounded-2xl shadow-2xl shadow-black/50 overflow-hidden">
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
                onClick={() => { setOpen(false); setQuery(""); }}
              >
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div className="max-h-[50vh] overflow-y-auto">
              {query.trim() && !hasResults && (
                <div className="px-5 py-8 text-center">
                  <p className="text-sm text-zinc-500">No results for &ldquo;{query}&rdquo;</p>
                  <p className="text-xs text-zinc-700 mt-1">Try a different team, league, or country</p>
                </div>
              )}

              {/* Live Matches */}
              {grouped.liveMatches.length > 0 && (
                <ResultGroup label="Live Now">
                  {grouped.liveMatches.map((r) => (
                    <MatchRow key={r.match.id} match={r.match} onClick={handleMatchSelect} />
                  ))}
                </ResultGroup>
              )}

              {/* Teams */}
              {grouped.teams.length > 0 && (
                <ResultGroup label="Teams">
                  {grouped.teams.map((t) => (
                    <button
                      key={t.name}
                      onClick={() => {
                        if (t.liveMatch) {
                          handleMatchSelect(t.liveMatch);
                        } else {
                          handleTeamFollow(t);
                          setOpen(false);
                          setQuery("");
                        }
                      }}
                      className="w-full flex items-center gap-3 px-5 py-2.5 hover:bg-white/[0.04] transition-colors cursor-pointer text-left"
                    >
                      {t.logo ? (
                        <img src={t.logo} alt="" className="w-7 h-7 rounded-full object-contain bg-white/[0.04] shrink-0" />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-white/[0.06] flex items-center justify-center text-[10px] font-bold text-zinc-500 shrink-0">
                          {t.name.charAt(0)}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] text-white font-medium truncate">{t.name}</p>
                        <p className="text-[10px] text-zinc-600 truncate">
                          {t.league}{t.country ? ` · ${t.country}` : ""}
                        </p>
                      </div>
                      {t.liveMatch && (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 shrink-0">
                          <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                          <span className="text-[9px] font-semibold text-emerald-400">
                            {t.liveMatch.homeScore}-{t.liveMatch.awayScore}
                          </span>
                        </span>
                      )}
                      {!t.liveMatch && (
                        <span className="text-[9px] text-zinc-700 shrink-0">
                          + Follow
                        </span>
                      )}
                    </button>
                  ))}
                </ResultGroup>
              )}

              {/* Leagues */}
              {grouped.leagues.length > 0 && (
                <ResultGroup label="Leagues & Competitions">
                  {grouped.leagues.map((l) => (
                    <button
                      key={l.id}
                      onClick={() => {
                        // Find first match in this league to fly to
                        const first = matches.find((m) => m.league === l.name);
                        if (first) handleMatchSelect(first);
                        else { setOpen(false); setQuery(""); }
                      }}
                      className="w-full flex items-center gap-3 px-5 py-2.5 hover:bg-white/[0.04] transition-colors cursor-pointer text-left"
                    >
                      <div className="w-7 h-7 rounded bg-white/[0.06] flex items-center justify-center text-xs shrink-0">
                        🏆
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] text-white font-medium truncate">{l.name}</p>
                        <p className="text-[10px] text-zinc-600 truncate">{l.country}</p>
                      </div>
                      {l.matchCount > 0 && (
                        <span className="text-[10px] text-zinc-500 tabular-nums shrink-0">
                          {l.matchCount} match{l.matchCount !== 1 ? "es" : ""} today
                        </span>
                      )}
                    </button>
                  ))}
                </ResultGroup>
              )}

              {/* Other matches */}
              {grouped.matches.length > 0 && (
                <ResultGroup label="Matches">
                  {grouped.matches.map((r) => (
                    <MatchRow key={r.match.id} match={r.match} onClick={handleMatchSelect} />
                  ))}
                </ResultGroup>
              )}

              {/* Empty state */}
              {!query.trim() && (
                <div className="px-5 py-6 text-center">
                  <p className="text-xs text-zinc-600">
                    Search across all teams, leagues, and matches
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-white/[0.06]">
              <button
                onClick={() => { setOpen(false); setQuery(""); }}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] transition-colors cursor-pointer"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-zinc-500">
                  <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-xs font-medium text-zinc-400">Back to Globe</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ResultGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="px-5 pt-3 pb-1.5 text-[9px] text-zinc-600 uppercase tracking-wider font-medium">
        {label}
      </p>
      {children}
    </div>
  );
}

function MatchRow({ match, onClick }: { match: Match; onClick: (m: Match) => void }) {
  const isLive = match.status === "LIVE" || match.status === "HT";
  const score = match.status === "NS" ? "vs" : `${match.homeScore}-${match.awayScore}`;

  return (
    <button
      onClick={() => onClick(match)}
      className="w-full flex items-center gap-3 px-5 py-2.5 hover:bg-white/[0.04] transition-colors cursor-pointer text-left"
    >
      <div className="w-7 h-7 rounded bg-white/[0.06] flex items-center justify-center text-xs shrink-0">
        ⚽
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] text-zinc-200 font-medium truncate">
          {match.homeTeam} <span className="text-zinc-500 font-mono text-xs">{score}</span> {match.awayTeam}
        </p>
        <p className="text-[10px] text-zinc-600 truncate">{match.league} · {match.stadium}</p>
      </div>
      {isLive && (
        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 shrink-0">
          <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[9px] font-semibold text-emerald-400">LIVE</span>
        </span>
      )}
      {match.status === "FT" && (
        <span className="text-[9px] text-zinc-600 shrink-0">FT</span>
      )}
    </button>
  );
}
