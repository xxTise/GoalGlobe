"use client";

import { useMemo, useState } from "react";
import { Match } from "@/lib/types";
import { FollowItem, FollowableType } from "@/hooks/useFollowing";

interface OnboardingModalProps {
  matches: Match[];
  isFollowing: (type: FollowableType, id: string) => boolean;
  onFollow: (item: FollowItem) => void;
  onUnfollow: (type: FollowableType, id: string) => void;
  onComplete: () => void;
}

// Popular teams to suggest during onboarding
const SUGGESTED_TEAMS = [
  "Arsenal", "Chelsea", "Liverpool", "Manchester City", "Manchester United",
  "Real Madrid", "Barcelona", "Atletico Madrid",
  "Bayern Munich", "Borussia Dortmund",
  "Juventus", "AC Milan", "Inter Milan", "Napoli",
  "PSG",
  "Flamengo", "Palmeiras",
  "River Plate", "Boca Juniors",
  "Al Hilal", "Al Nassr",
];

export function OnboardingModal({
  matches,
  isFollowing,
  onFollow,
  onUnfollow,
  onComplete,
}: OnboardingModalProps) {
  const [step, setStep] = useState<"teams" | "leagues">("teams");

  // Get teams that exist in today's matches + popular suggestions
  const availableTeams = useMemo(() => {
    const seen = new Set<string>();
    const result: { name: string; logo?: string }[] = [];

    // Add suggested teams that exist in match data first
    for (const m of matches) {
      if (SUGGESTED_TEAMS.includes(m.homeTeam) && !seen.has(m.homeTeam)) {
        seen.add(m.homeTeam);
        result.push({ name: m.homeTeam, logo: m.homeLogo });
      }
      if (SUGGESTED_TEAMS.includes(m.awayTeam) && !seen.has(m.awayTeam)) {
        seen.add(m.awayTeam);
        result.push({ name: m.awayTeam, logo: m.awayLogo });
      }
    }

    // Fill with remaining teams from matches
    for (const m of matches) {
      if (!seen.has(m.homeTeam)) {
        seen.add(m.homeTeam);
        result.push({ name: m.homeTeam, logo: m.homeLogo });
      }
      if (!seen.has(m.awayTeam) && result.length < 40) {
        seen.add(m.awayTeam);
        result.push({ name: m.awayTeam, logo: m.awayLogo });
      }
    }

    return result.slice(0, 30);
  }, [matches]);

  // Get unique leagues from matches, sorted by tier
  const availableLeagues = useMemo(() => {
    const map = new Map<string, { id: string; name: string; tier: number }>();
    for (const m of matches) {
      const lid = String(m.leagueId);
      if (!map.has(lid)) {
        map.set(lid, { id: lid, name: m.league, tier: m.tier });
      }
    }
    return [...map.values()].sort((a, b) => a.tier - b.tier).slice(0, 20);
  }, [matches]);

  const followedCount = availableTeams.filter((t) =>
    isFollowing("team", t.name)
  ).length + availableLeagues.filter((l) => isFollowing("league", l.id)).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-[#0c0c18] border border-white/[0.06] rounded-2xl shadow-2xl shadow-black/60 overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 text-center">
          <h2 className="text-lg font-bold text-white">
            {step === "teams" ? "Pick your teams" : "Follow leagues"}
          </h2>
          <p className="text-xs text-zinc-500 mt-1">
            {step === "teams"
              ? "Select teams you want to track on the globe"
              : "Follow competitions to see their matches highlighted"}
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 justify-center pb-4">
          <div className={`w-8 h-1 rounded-full ${step === "teams" ? "bg-emerald-400" : "bg-white/[0.1]"}`} />
          <div className={`w-8 h-1 rounded-full ${step === "leagues" ? "bg-emerald-400" : "bg-white/[0.1]"}`} />
        </div>

        {/* Content */}
        <div className="px-4 pb-4 max-h-[50vh] overflow-y-auto">
          {step === "teams" ? (
            <div className="flex flex-wrap gap-2">
              {availableTeams.map((team) => {
                const active = isFollowing("team", team.name);
                return (
                  <button
                    key={team.name}
                    onClick={() =>
                      active
                        ? onUnfollow("team", team.name)
                        : onFollow({
                            type: "team",
                            id: team.name,
                            name: team.name,
                            logo: team.logo,
                          })
                    }
                    className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-[12px] font-medium border transition-all cursor-pointer ${
                      active
                        ? "bg-emerald-500/15 border-emerald-500/25 text-emerald-400"
                        : "bg-white/[0.03] border-white/[0.06] text-zinc-400 hover:bg-white/[0.06] hover:text-white"
                    }`}
                  >
                    {team.logo ? (
                      <img src={team.logo} alt="" className="w-5 h-5 rounded-full object-contain" />
                    ) : (
                      <span className="w-5 h-5 rounded-full bg-white/[0.08] flex items-center justify-center text-[9px] font-bold">
                        {team.name.charAt(0)}
                      </span>
                    )}
                    {team.name}
                    {active && (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="space-y-1">
              {availableLeagues.map((league) => {
                const active = isFollowing("league", league.id);
                return (
                  <button
                    key={league.id}
                    onClick={() =>
                      active
                        ? onUnfollow("league", league.id)
                        : onFollow({
                            type: "league",
                            id: league.id,
                            name: league.name,
                          })
                    }
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[12px] font-medium border transition-all cursor-pointer ${
                      active
                        ? "bg-emerald-500/15 border-emerald-500/25 text-emerald-400"
                        : "bg-white/[0.03] border-white/[0.06] text-zinc-400 hover:bg-white/[0.06] hover:text-white"
                    }`}
                  >
                    <span className="w-6 h-6 rounded bg-white/[0.06] flex items-center justify-center text-[10px]">
                      🏆
                    </span>
                    <span className="flex-1 text-left truncate">{league.name}</span>
                    {active && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/[0.06] flex items-center justify-between">
          <span className="text-[11px] text-zinc-500">
            {followedCount} selected
          </span>
          <div className="flex gap-2">
            {step === "teams" ? (
              <button
                onClick={() => setStep("leagues")}
                className="px-4 py-2 rounded-xl text-xs font-medium bg-emerald-500 text-black hover:bg-emerald-400 transition-colors cursor-pointer"
              >
                Next
              </button>
            ) : (
              <>
                <button
                  onClick={() => setStep("teams")}
                  className="px-4 py-2 rounded-xl text-xs font-medium bg-white/[0.06] text-zinc-300 hover:bg-white/[0.1] transition-colors cursor-pointer"
                >
                  Back
                </button>
                <button
                  onClick={onComplete}
                  className="px-4 py-2 rounded-xl text-xs font-medium bg-emerald-500 text-black hover:bg-emerald-400 transition-colors cursor-pointer"
                >
                  Done
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
