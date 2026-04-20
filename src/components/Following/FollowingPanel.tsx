"use client";

import { useMemo, useState } from "react";
import { Match } from "@/lib/types";
import { FollowItem, FollowableType } from "@/hooks/useFollowing";
import { FollowButton } from "./FollowButton";

interface FollowingPanelProps {
  isOpen: boolean;
  onClose: () => void;
  matches: Match[];
  items: FollowItem[];
  isFollowing: (type: FollowableType, id: string) => boolean;
  onFollow: (item: FollowItem) => void;
  onUnfollow: (type: FollowableType, id: string) => void;
}

type PanelTab = "following" | "discover";

export function FollowingPanel({
  isOpen,
  onClose,
  matches,
  items,
  isFollowing,
  onFollow,
  onUnfollow,
}: FollowingPanelProps) {
  const [tab, setTab] = useState<PanelTab>("following");
  const [search, setSearch] = useState("");

  // Extract unique teams and leagues from match data
  const { teams, leagues } = useMemo(() => {
    const teamMap = new Map<string, { name: string; logo?: string }>();
    const leagueMap = new Map<string, { id: string; name: string }>();

    for (const m of matches) {
      if (!teamMap.has(m.homeTeam)) {
        teamMap.set(m.homeTeam, { name: m.homeTeam, logo: m.homeLogo });
      }
      if (!teamMap.has(m.awayTeam)) {
        teamMap.set(m.awayTeam, { name: m.awayTeam, logo: m.awayLogo });
      }
      const lid = String(m.leagueId);
      if (!leagueMap.has(lid)) {
        leagueMap.set(lid, { id: lid, name: m.league });
      }
    }

    return {
      teams: [...teamMap.values()].sort((a, b) => a.name.localeCompare(b.name)),
      leagues: [...leagueMap.values()].sort((a, b) =>
        a.name.localeCompare(b.name)
      ),
    };
  }, [matches]);

  // Filter discover results by search
  const searchLower = search.toLowerCase().trim();
  const filteredTeams = searchLower
    ? teams.filter((t) => t.name.toLowerCase().includes(searchLower))
    : teams;
  const filteredLeagues = searchLower
    ? leagues.filter((l) => l.name.toLowerCase().includes(searchLower))
    : leagues;

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
        className={`fixed top-0 left-0 h-full w-full sm:w-[380px] z-40 transform transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full bg-[#0a0a16]/95 backdrop-blur-2xl border-r border-white/[0.06] shadow-2xl shadow-black/50 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-white/[0.06]">
            <div>
              <h2 className="text-sm font-semibold text-white">Following</h2>
              <p className="text-[10px] text-zinc-600 mt-0.5">
                {items.length} team{items.length !== 1 ? "s" : ""} &
                league{items.length !== 1 ? "s" : ""}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-zinc-500 hover:text-white transition-all cursor-pointer"
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

          {/* Tabs */}
          <div className="flex items-center gap-1 px-6 py-3 border-b border-white/[0.04]">
            <button
              onClick={() => setTab("following")}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
                tab === "following"
                  ? "bg-white/[0.08] text-white"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              My List
              {items.length > 0 && (
                <span className="ml-1.5 text-[9px] text-zinc-500 tabular-nums">
                  {items.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setTab("discover")}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
                tab === "discover"
                  ? "bg-white/[0.08] text-white"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              Discover
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {tab === "following" ? (
              <FollowingList items={items} onUnfollow={onUnfollow} />
            ) : (
              <DiscoverList
                teams={filteredTeams}
                leagues={filteredLeagues}
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

function FollowingList({
  items,
  onUnfollow,
}: {
  items: FollowItem[];
  onUnfollow: (type: FollowableType, id: string) => void;
}) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-6 text-center">
        <div className="w-14 h-14 rounded-full bg-white/[0.03] flex items-center justify-center mb-3">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-zinc-600">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p className="text-sm text-zinc-400 font-medium">No teams followed yet</p>
        <p className="text-xs text-zinc-600 mt-1">
          Switch to Discover to find teams and leagues
        </p>
      </div>
    );
  }

  const teams = items.filter((i) => i.type === "team");
  const leagues = items.filter((i) => i.type === "league");

  return (
    <div className="py-2">
      {teams.length > 0 && (
        <Section label="Teams">
          {teams.map((item) => (
            <FollowRow
              key={`${item.type}-${item.id}`}
              item={item}
              onUnfollow={() => onUnfollow(item.type, item.id)}
            />
          ))}
        </Section>
      )}
      {leagues.length > 0 && (
        <Section label="Leagues">
          {leagues.map((item) => (
            <FollowRow
              key={`${item.type}-${item.id}`}
              item={item}
              onUnfollow={() => onUnfollow(item.type, item.id)}
            />
          ))}
        </Section>
      )}
    </div>
  );
}

function FollowRow({
  item,
  onUnfollow,
}: {
  item: FollowItem;
  onUnfollow: () => void;
}) {
  return (
    <div className="flex items-center gap-3 px-6 py-2.5 hover:bg-white/[0.02] transition-colors">
      {item.logo ? (
        <img
          src={item.logo}
          alt={item.name}
          className="w-8 h-8 rounded-full object-contain bg-white/[0.04]"
        />
      ) : (
        <div className="w-8 h-8 rounded-full bg-white/[0.06] flex items-center justify-center text-xs font-bold text-zinc-500">
          {item.name.charAt(0)}
        </div>
      )}
      <span className="flex-1 text-[13px] text-zinc-200 font-medium truncate">
        {item.name}
      </span>
      <button
        onClick={onUnfollow}
        className="text-[10px] text-zinc-600 hover:text-red-400 transition-colors cursor-pointer px-2 py-1 rounded hover:bg-red-500/10"
      >
        Remove
      </button>
    </div>
  );
}

function DiscoverList({
  teams,
  leagues,
  search,
  onSearchChange,
  isFollowing,
  onFollow,
  onUnfollow,
}: {
  teams: { name: string; logo?: string }[];
  leagues: { id: string; name: string }[];
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

      {/* Leagues */}
      {leagues.length > 0 && (
        <Section label="Leagues">
          {leagues.slice(0, 20).map((league) => {
            const following = isFollowing("league", league.id);
            return (
              <DiscoverRow
                key={`league-${league.id}`}
                name={league.name}
                icon="🏆"
              >
                <FollowButton
                  type="league"
                  id={league.id}
                  name={league.name}
                  isFollowing={following}
                  onFollow={() =>
                    onFollow({ type: "league", id: league.id, name: league.name })
                  }
                  onUnfollow={() => onUnfollow("league", league.id)}
                />
              </DiscoverRow>
            );
          })}
        </Section>
      )}

      {/* Teams */}
      {teams.length > 0 && (
        <Section label="Teams">
          {teams.slice(0, 40).map((team) => {
            const following = isFollowing("team", team.name);
            return (
              <DiscoverRow
                key={`team-${team.name}`}
                name={team.name}
                logo={team.logo}
              >
                <FollowButton
                  type="team"
                  id={team.name}
                  name={team.name}
                  logo={team.logo}
                  isFollowing={following}
                  onFollow={() =>
                    onFollow({
                      type: "team",
                      id: team.name,
                      name: team.name,
                      logo: team.logo,
                    })
                  }
                  onUnfollow={() => onUnfollow("team", team.name)}
                />
              </DiscoverRow>
            );
          })}
        </Section>
      )}

      {teams.length === 0 && leagues.length === 0 && search && (
        <div className="px-6 py-8 text-center">
          <p className="text-xs text-zinc-500">No results for &ldquo;{search}&rdquo;</p>
        </div>
      )}
    </div>
  );
}

function DiscoverRow({
  name,
  logo,
  icon,
  children,
}: {
  name: string;
  logo?: string;
  icon?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 px-6 py-2 hover:bg-white/[0.02] transition-colors">
      {logo ? (
        <img src={logo} alt={name} className="w-7 h-7 rounded-full object-contain bg-white/[0.04]" />
      ) : (
        <div className="w-7 h-7 rounded-full bg-white/[0.06] flex items-center justify-center text-xs">
          {icon ?? name.charAt(0)}
        </div>
      )}
      <span className="flex-1 text-[12px] text-zinc-300 truncate">{name}</span>
      {children}
    </div>
  );
}

function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-2">
      <p className="px-6 py-2 text-[9px] text-zinc-600 uppercase tracking-wider font-medium sticky top-0 bg-[#0a0a16]/95 backdrop-blur-sm z-10">
        {label}
      </p>
      {children}
    </div>
  );
}
