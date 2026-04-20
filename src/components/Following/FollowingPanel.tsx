"use client";

import { useMemo, useState } from "react";
import { Match } from "@/lib/types";
import { FollowItem, FollowableType } from "@/hooks/useFollowing";
import { FollowButton } from "./FollowButton";
import { buildSearchableTeams, LEAGUE_REGISTRY } from "@/lib/team-registry";

interface FollowingPanelProps {
  isOpen: boolean;
  onClose: () => void;
  matches: Match[];
  items: FollowItem[];
  isFollowing: (type: FollowableType, id: string) => boolean;
  onFollow: (item: FollowItem) => void;
  onUnfollow: (type: FollowableType, id: string) => void;
  onMatchSelect: (match: Match) => void;
}

type PanelTab = "feed" | "manage" | "discover";

export function FollowingPanel({
  isOpen,
  onClose,
  matches,
  items,
  isFollowing,
  onFollow,
  onUnfollow,
  onMatchSelect,
}: FollowingPanelProps) {
  const [tab, setTab] = useState<PanelTab>("feed");
  const [search, setSearch] = useState("");

  // Matches involving followed teams or leagues
  const relevantMatches = useMemo(() => {
    if (items.length === 0) return [];
    return matches.filter((m) => {
      for (const item of items) {
        if (item.type === "team" && (item.id === m.homeTeam || item.id === m.awayTeam)) return true;
        if (item.type === "league" && item.id === String(m.leagueId)) return true;
      }
      return false;
    });
  }, [matches, items]);

  // Group relevant matches by status
  const { live, upcoming, finished } = useMemo(() => {
    const live: Match[] = [];
    const upcoming: Match[] = [];
    const finished: Match[] = [];
    for (const m of relevantMatches) {
      if (m.status === "LIVE" || m.status === "HT") live.push(m);
      else if (m.status === "NS") upcoming.push(m);
      else finished.push(m);
    }
    return { live, upcoming, finished };
  }, [relevantMatches]);

  // Discover data
  const teamMap = useMemo(() => buildSearchableTeams(matches), [matches]);
  const searchLower = search.toLowerCase().trim();

  const discoverTeams = useMemo(() => {
    const all = [...teamMap.values()];
    if (!searchLower) return all.slice(0, 30);
    return all.filter((t) => t.name.toLowerCase().includes(searchLower)).slice(0, 30);
  }, [teamMap, searchLower]);

  const discoverLeagues = useMemo(() => {
    const fromRegistry = LEAGUE_REGISTRY.filter((l) =>
      !searchLower || l.name.toLowerCase().includes(searchLower)
    );
    // Add leagues from today's matches not in registry
    const registryIds = new Set(fromRegistry.map((l) => l.id));
    const fromMatches: typeof LEAGUE_REGISTRY = [];
    const seen = new Set<number>();
    for (const m of matches) {
      if (!registryIds.has(m.leagueId) && !seen.has(m.leagueId)) {
        seen.add(m.leagueId);
        if (!searchLower || m.league.toLowerCase().includes(searchLower)) {
          fromMatches.push({ id: m.leagueId, name: m.league, country: m.country, tier: m.tier });
        }
      }
    }
    return [...fromRegistry, ...fromMatches].slice(0, 20);
  }, [matches, searchLower]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-30 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`fixed top-0 left-0 h-full w-full sm:w-[400px] z-40 transform transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full bg-[#0a0a16]/95 backdrop-blur-2xl border-r border-white/[0.06] shadow-2xl shadow-black/50 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-white/[0.06]">
            <div>
              <h2 className="text-sm font-semibold text-white">Following</h2>
              <p className="text-[10px] text-zinc-600 mt-0.5">
                {items.length} followed · {relevantMatches.length} matches today
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-zinc-500 hover:text-white transition-all cursor-pointer"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 px-6 py-2.5 border-b border-white/[0.04]">
            {([
              { key: "feed" as PanelTab, label: "My Feed", count: relevantMatches.length },
              { key: "manage" as PanelTab, label: "My List", count: items.length },
              { key: "discover" as PanelTab, label: "Discover" },
            ]).map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
                  tab === t.key
                    ? "bg-white/[0.08] text-white"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {t.label}
                {t.count != null && t.count > 0 && (
                  <span className="ml-1 text-[9px] text-zinc-500 tabular-nums">{t.count}</span>
                )}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {tab === "feed" && (
              <FeedTab
                live={live}
                upcoming={upcoming}
                finished={finished}
                items={items}
                onMatchSelect={(m) => { onMatchSelect(m); onClose(); }}
              />
            )}
            {tab === "manage" && (
              <ManageTab items={items} onUnfollow={onUnfollow} />
            )}
            {tab === "discover" && (
              <DiscoverTab
                teams={discoverTeams}
                leagues={discoverLeagues}
                search={search}
                onSearchChange={setSearch}
                isFollowing={isFollowing}
                onFollow={onFollow}
                onUnfollow={onUnfollow}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// ── Feed Tab: matches for followed teams/leagues ──

function FeedTab({
  live,
  upcoming,
  finished,
  items,
  onMatchSelect,
}: {
  live: Match[];
  upcoming: Match[];
  finished: Match[];
  items: FollowItem[];
  onMatchSelect: (m: Match) => void;
}) {
  if (items.length === 0) {
    return (
      <EmptyState
        icon="⚽"
        title="Follow teams to see their matches"
        subtitle="Go to Discover to find teams and leagues"
      />
    );
  }

  if (live.length === 0 && upcoming.length === 0 && finished.length === 0) {
    return (
      <EmptyState
        icon="📅"
        title="No matches today"
        subtitle="Your followed teams aren't playing today"
      />
    );
  }

  return (
    <div className="py-1">
      {live.length > 0 && (
        <MatchSection label="Live Now" matches={live} onSelect={onMatchSelect} accent="emerald" />
      )}
      {upcoming.length > 0 && (
        <MatchSection label="Upcoming" matches={upcoming} onSelect={onMatchSelect} accent="blue" />
      )}
      {finished.length > 0 && (
        <MatchSection label="Results" matches={finished} onSelect={onMatchSelect} accent="zinc" />
      )}
    </div>
  );
}

function MatchSection({
  label,
  matches,
  onSelect,
  accent,
}: {
  label: string;
  matches: Match[];
  onSelect: (m: Match) => void;
  accent: "emerald" | "blue" | "zinc";
}) {
  const dotColor = accent === "emerald" ? "bg-emerald-400" : accent === "blue" ? "bg-blue-400" : "bg-zinc-500";

  return (
    <div className="mb-1">
      <div className="px-6 py-2 flex items-center gap-2 sticky top-0 bg-[#0a0a16]/95 backdrop-blur-sm z-10">
        <span className={`w-1.5 h-1.5 rounded-full ${dotColor} ${accent === "emerald" ? "animate-pulse" : ""}`} />
        <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-medium">{label}</span>
        <span className="text-[9px] text-zinc-700 tabular-nums">{matches.length}</span>
      </div>
      {matches.map((m) => (
        <button
          key={m.id}
          onClick={() => onSelect(m)}
          className="w-full flex items-center gap-3 px-6 py-2.5 hover:bg-white/[0.03] transition-colors cursor-pointer text-left"
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-zinc-200 font-medium truncate">{m.homeTeam}</span>
              <span className="text-[12px] font-mono font-bold text-white ml-2">
                {m.status === "NS" ? "" : m.homeScore}
              </span>
            </div>
            <div className="flex items-center justify-between mt-0.5">
              <span className="text-[12px] text-zinc-200 font-medium truncate">{m.awayTeam}</span>
              <span className="text-[12px] font-mono font-bold text-white ml-2">
                {m.status === "NS" ? "" : m.awayScore}
              </span>
            </div>
            <p className="text-[9px] text-zinc-600 mt-1 truncate">{m.league} · {m.stadium}</p>
          </div>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="text-zinc-700 shrink-0">
            <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      ))}
    </div>
  );
}

// ── Manage Tab ──

function ManageTab({
  items,
  onUnfollow,
}: {
  items: FollowItem[];
  onUnfollow: (type: FollowableType, id: string) => void;
}) {
  if (items.length === 0) {
    return (
      <EmptyState icon="⭐" title="Nothing followed yet" subtitle="Discover teams and leagues to follow" />
    );
  }

  const teams = items.filter((i) => i.type === "team");
  const leagues = items.filter((i) => i.type === "league");

  return (
    <div className="py-2">
      {teams.length > 0 && (
        <ItemSection label="Teams" items={teams} onUnfollow={onUnfollow} />
      )}
      {leagues.length > 0 && (
        <ItemSection label="Leagues" items={leagues} onUnfollow={onUnfollow} />
      )}
    </div>
  );
}

function ItemSection({
  label,
  items,
  onUnfollow,
}: {
  label: string;
  items: FollowItem[];
  onUnfollow: (type: FollowableType, id: string) => void;
}) {
  return (
    <div className="mb-2">
      <p className="px-6 py-2 text-[9px] text-zinc-600 uppercase tracking-wider font-medium">{label}</p>
      {items.map((item) => (
        <div key={`${item.type}-${item.id}`} className="flex items-center gap-3 px-6 py-2 hover:bg-white/[0.02] transition-colors">
          {item.logo ? (
            <img src={item.logo} alt="" className="w-7 h-7 rounded-full object-contain bg-white/[0.04]" />
          ) : (
            <div className="w-7 h-7 rounded-full bg-white/[0.06] flex items-center justify-center text-[10px] font-bold text-zinc-500">
              {item.type === "league" ? "🏆" : item.name.charAt(0)}
            </div>
          )}
          <span className="flex-1 text-[12px] text-zinc-300 font-medium truncate">{item.name}</span>
          <button
            onClick={() => onUnfollow(item.type, item.id)}
            className="text-[10px] text-zinc-600 hover:text-red-400 transition-colors cursor-pointer px-2 py-1 rounded hover:bg-red-500/10"
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}

// ── Discover Tab ──

function DiscoverTab({
  teams,
  leagues,
  search,
  onSearchChange,
  isFollowing,
  onFollow,
  onUnfollow,
}: {
  teams: { name: string; country: string; league: string; logo?: string }[];
  leagues: { id: number; name: string; country: string }[];
  search: string;
  onSearchChange: (v: string) => void;
  isFollowing: (type: FollowableType, id: string) => boolean;
  onFollow: (item: FollowItem) => void;
  onUnfollow: (type: FollowableType, id: string) => void;
}) {
  return (
    <div>
      {/* Search */}
      <div className="px-6 py-3">
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.06]">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-zinc-600 shrink-0">
            <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M9.5 9.5L13 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search teams or leagues..."
            className="flex-1 bg-transparent text-xs text-white placeholder:text-zinc-600 outline-none"
          />
          {search && (
            <button onClick={() => onSearchChange("")} className="text-zinc-600 hover:text-white cursor-pointer">
              <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
                <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {leagues.length > 0 && (
        <div className="mb-2">
          <p className="px-6 py-2 text-[9px] text-zinc-600 uppercase tracking-wider font-medium">Leagues</p>
          {leagues.map((l) => {
            const following = isFollowing("league", String(l.id));
            return (
              <div key={l.id} className="flex items-center gap-3 px-6 py-2 hover:bg-white/[0.02] transition-colors">
                <div className="w-7 h-7 rounded bg-white/[0.06] flex items-center justify-center text-xs">🏆</div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] text-zinc-300 truncate">{l.name}</p>
                  <p className="text-[9px] text-zinc-600">{l.country}</p>
                </div>
                <FollowButton
                  type="league" id={String(l.id)} name={l.name}
                  isFollowing={following}
                  onFollow={() => onFollow({ type: "league", id: String(l.id), name: l.name })}
                  onUnfollow={() => onUnfollow("league", String(l.id))}
                />
              </div>
            );
          })}
        </div>
      )}

      {teams.length > 0 && (
        <div className="mb-2">
          <p className="px-6 py-2 text-[9px] text-zinc-600 uppercase tracking-wider font-medium">Teams</p>
          {teams.map((t) => {
            const following = isFollowing("team", t.name);
            return (
              <div key={t.name} className="flex items-center gap-3 px-6 py-2 hover:bg-white/[0.02] transition-colors">
                {t.logo ? (
                  <img src={t.logo} alt="" className="w-7 h-7 rounded-full object-contain bg-white/[0.04]" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-white/[0.06] flex items-center justify-center text-[10px] font-bold text-zinc-500">
                    {t.name.charAt(0)}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] text-zinc-300 truncate">{t.name}</p>
                  <p className="text-[9px] text-zinc-600">{t.league}{t.country ? ` · ${t.country}` : ""}</p>
                </div>
                <FollowButton
                  type="team" id={t.name} name={t.name} logo={t.logo}
                  isFollowing={following}
                  onFollow={() => onFollow({ type: "team", id: t.name, name: t.name, logo: t.logo })}
                  onUnfollow={() => onUnfollow("team", t.name)}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function EmptyState({ icon, title, subtitle }: { icon: string; title: string; subtitle: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full px-6 text-center">
      <div className="w-14 h-14 rounded-full bg-white/[0.03] flex items-center justify-center mb-3 text-2xl">
        {icon}
      </div>
      <p className="text-sm text-zinc-400 font-medium">{title}</p>
      <p className="text-xs text-zinc-600 mt-1">{subtitle}</p>
    </div>
  );
}
