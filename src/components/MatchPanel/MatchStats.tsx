"use client";

import { StatRow } from "@/lib/types";

interface MatchStatsProps {
  stats: StatRow[];
}

export function MatchStats({ stats }: MatchStatsProps) {
  if (stats.length === 0) {
    return (
      <div className="px-6 py-8 text-center">
        <p className="text-xs text-zinc-600">
          Statistics not available yet
        </p>
      </div>
    );
  }

  return (
    <div className="px-6 space-y-3.5">
      {stats.map((stat) => (
        <StatBar key={stat.label} stat={stat} />
      ))}
    </div>
  );
}

function StatBar({ stat }: { stat: StatRow }) {
  const total = stat.home + stat.away || 1;
  const homePct = (stat.home / total) * 100;
  const awayPct = (stat.away / total) * 100;

  const isPossession = stat.label === "Possession";
  const homeWins = stat.home > stat.away;
  const awayWins = stat.away > stat.home;

  return (
    <div>
      {/* Label row */}
      <div className="flex items-center justify-between mb-1.5">
        <span
          className={`text-[12px] font-semibold tabular-nums ${
            homeWins ? "text-white" : "text-zinc-500"
          }`}
        >
          {isPossession ? `${stat.home}%` : stat.home}
        </span>
        <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-medium">
          {stat.label}
        </span>
        <span
          className={`text-[12px] font-semibold tabular-nums ${
            awayWins ? "text-white" : "text-zinc-500"
          }`}
        >
          {isPossession ? `${stat.away}%` : stat.away}
        </span>
      </div>

      {/* Bar */}
      <div className="flex gap-1 h-1 rounded-full overflow-hidden">
        <div
          className={`rounded-full transition-all duration-700 ease-out ${
            homeWins ? "bg-emerald-400/70" : "bg-zinc-700"
          }`}
          style={{ width: `${homePct}%` }}
        />
        <div
          className={`rounded-full transition-all duration-700 ease-out ${
            awayWins ? "bg-emerald-400/70" : "bg-zinc-700"
          }`}
          style={{ width: `${awayPct}%` }}
        />
      </div>
    </div>
  );
}
