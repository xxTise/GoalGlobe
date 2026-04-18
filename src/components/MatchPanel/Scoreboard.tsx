"use client";

import Image from "next/image";
import { Match, MatchStatus } from "@/lib/types";

interface ScoreboardProps {
  match: Match;
}

export function Scoreboard({ match }: ScoreboardProps) {
  const isLive = match.status === "LIVE";

  return (
    <div className="px-6 pt-2 pb-6">
      {/* Teams + Score */}
      <div className="flex items-center justify-between gap-3">
        {/* Home */}
        <div className="flex-1 text-center">
          {match.homeLogo ? (
            <Image
              src={match.homeLogo}
              alt={match.homeTeam}
              width={48}
              height={48}
              className="mx-auto mb-2.5 object-contain"
              unoptimized
            />
          ) : (
            <div className="w-12 h-12 mx-auto mb-2.5 rounded-full bg-white/[0.06] flex items-center justify-center text-base font-bold text-white/50">
              {match.homeTeam.charAt(0)}
            </div>
          )}
          <p className="text-[13px] font-semibold text-white leading-tight">
            {match.homeTeam}
          </p>
        </div>

        {/* Score */}
        <div className="text-center px-3 min-w-[80px]">
          {match.status === "NS" ? (
            <p className="text-xl font-light text-zinc-500">vs</p>
          ) : (
            <p className="text-[38px] font-bold text-white tracking-tight font-mono leading-none">
              {match.homeScore}
              <span className="text-zinc-600 mx-1.5 text-3xl">:</span>
              {match.awayScore}
            </p>
          )}
          <StatusBadge status={match.status} minute={match.minute} />
        </div>

        {/* Away */}
        <div className="flex-1 text-center">
          {match.awayLogo ? (
            <Image
              src={match.awayLogo}
              alt={match.awayTeam}
              width={48}
              height={48}
              className="mx-auto mb-2.5 object-contain"
              unoptimized
            />
          ) : (
            <div className="w-12 h-12 mx-auto mb-2.5 rounded-full bg-white/[0.06] flex items-center justify-center text-base font-bold text-white/50">
              {match.awayTeam.charAt(0)}
            </div>
          )}
          <p className="text-[13px] font-semibold text-white leading-tight">
            {match.awayTeam}
          </p>
        </div>
      </div>

      {/* Goal scorers summary */}
      {match.events.filter((e) => e.type === "goal").length > 0 && (
        <div className="mt-5 flex gap-6">
          <GoalList
            goals={match.events.filter(
              (e) => e.type === "goal" && e.team === "home"
            )}
            align="right"
          />
          <div className="w-px bg-white/[0.06] shrink-0" />
          <GoalList
            goals={match.events.filter(
              (e) => e.type === "goal" && e.team === "away"
            )}
            align="left"
          />
        </div>
      )}
    </div>
  );
}

function GoalList({
  goals,
  align,
}: {
  goals: Match["events"];
  align: "left" | "right";
}) {
  if (goals.length === 0) return <div className="flex-1" />;

  return (
    <div className={`flex-1 space-y-0.5 ${align === "right" ? "text-right" : "text-left"}`}>
      {goals
        .sort((a, b) => a.minute - b.minute)
        .map((g, i) => (
          <p key={i} className="text-[11px] text-zinc-400">
            <span className="text-zinc-200 font-medium">{g.player}</span>
            <span className="text-zinc-600 ml-1">
              {g.minute}&apos;
              {g.detail === "Penalty" && " (P)"}
              {g.detail === "Own Goal" && " (OG)"}
            </span>
          </p>
        ))}
    </div>
  );
}

function StatusBadge({ status, minute }: { status: MatchStatus; minute: number | null }) {
  const config: Record<MatchStatus, { label: string; cls: string }> = {
    LIVE: {
      label: `${minute}'`,
      cls: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
    },
    HT: {
      label: "HT",
      cls: "bg-amber-500/15 text-amber-400 border-amber-500/25",
    },
    FT: {
      label: "FT",
      cls: "bg-zinc-500/15 text-zinc-400 border-zinc-500/25",
    },
    NS: {
      label: "Upcoming",
      cls: "bg-blue-500/15 text-blue-400 border-blue-500/25",
    },
    PST: {
      label: "Postponed",
      cls: "bg-red-500/15 text-red-400 border-red-500/25",
    },
  };

  const { label, cls } = config[status];

  return (
    <span className={`inline-flex items-center gap-1.5 mt-2 px-2.5 py-0.5 text-[10px] font-semibold tracking-wider rounded-full border ${cls}`}>
      {status === "LIVE" && (
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
      )}
      {label}
    </span>
  );
}
