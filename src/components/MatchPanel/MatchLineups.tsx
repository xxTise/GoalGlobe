"use client";

import { TeamLineup, Player } from "@/lib/types";

interface MatchLineupsProps {
  homeTeam: string;
  awayTeam: string;
  homeLineup: TeamLineup | null;
  awayLineup: TeamLineup | null;
}

export function MatchLineups({
  homeTeam,
  awayTeam,
  homeLineup,
  awayLineup,
}: MatchLineupsProps) {
  if (!homeLineup && !awayLineup) {
    return (
      <div className="px-6 py-8 text-center">
        <p className="text-xs text-zinc-600">
          Lineups not available yet
        </p>
      </div>
    );
  }

  return (
    <div className="px-6 space-y-6">
      {/* Formations */}
      {(homeLineup?.formation || awayLineup?.formation) && (
        <div className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
          <div className="text-center flex-1">
            <p className="text-[10px] text-zinc-600 uppercase tracking-wider">
              {homeTeam}
            </p>
            <p className="text-sm font-bold text-white font-mono mt-0.5">
              {homeLineup?.formation ?? "—"}
            </p>
          </div>
          <div className="w-px h-8 bg-white/[0.06]" />
          <div className="text-center flex-1">
            <p className="text-[10px] text-zinc-600 uppercase tracking-wider">
              {awayTeam}
            </p>
            <p className="text-sm font-bold text-white font-mono mt-0.5">
              {awayLineup?.formation ?? "—"}
            </p>
          </div>
        </div>
      )}

      {/* Starting XI side by side */}
      <div>
        <h4 className="text-[10px] text-zinc-500 uppercase tracking-wider font-medium mb-3">
          Starting XI
        </h4>
        <div className="flex gap-4">
          <PlayerList players={homeLineup?.startXI ?? []} />
          <div className="w-px bg-white/[0.04] shrink-0" />
          <PlayerList players={awayLineup?.startXI ?? []} align="right" />
        </div>
      </div>

      {/* Substitutes */}
      {((homeLineup?.substitutes?.length ?? 0) > 0 ||
        (awayLineup?.substitutes?.length ?? 0) > 0) && (
        <div>
          <h4 className="text-[10px] text-zinc-500 uppercase tracking-wider font-medium mb-3">
            Substitutes
          </h4>
          <div className="flex gap-4">
            <PlayerList players={homeLineup?.substitutes ?? []} dim />
            <div className="w-px bg-white/[0.04] shrink-0" />
            <PlayerList
              players={awayLineup?.substitutes ?? []}
              align="right"
              dim
            />
          </div>
        </div>
      )}
    </div>
  );
}

function PlayerList({
  players,
  align = "left",
  dim = false,
}: {
  players: Player[];
  align?: "left" | "right";
  dim?: boolean;
}) {
  if (players.length === 0) return <div className="flex-1" />;

  return (
    <div className={`flex-1 space-y-0.5 ${align === "right" ? "text-right" : ""}`}>
      {players.map((p) => (
        <div
          key={p.id}
          className={`flex items-center gap-2 py-1 ${
            align === "right" ? "flex-row-reverse" : ""
          }`}
        >
          {p.number != null && (
            <span
              className={`text-[10px] font-mono w-5 shrink-0 ${
                align === "right" ? "text-left" : "text-right"
              } ${dim ? "text-zinc-700" : "text-zinc-600"}`}
            >
              {p.number}
            </span>
          )}
          <span
            className={`text-[12px] truncate ${
              dim ? "text-zinc-600" : "text-zinc-300"
            }`}
          >
            {p.name}
          </span>
          {p.pos && (
            <span
              className={`text-[9px] font-medium px-1 py-0.5 rounded ${
                dim
                  ? "bg-white/[0.02] text-zinc-700"
                  : "bg-white/[0.04] text-zinc-600"
              }`}
            >
              {p.pos}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
