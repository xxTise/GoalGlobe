"use client";

import { Match, MatchEvent } from "@/lib/types";

interface MatchTimelineProps {
  match: Match;
}

const EVENT_ICONS: Record<MatchEvent["type"], string> = {
  goal: "⚽",
  yellow_card: "🟨",
  red_card: "🟥",
  substitution: "🔄",
};

export function MatchTimeline({ match }: MatchTimelineProps) {
  const events = [...match.events].sort((a, b) => a.minute - b.minute);

  if (events.length === 0) {
    return (
      <div className="px-6 py-8 text-center">
        <p className="text-xs text-zinc-600">No events yet</p>
      </div>
    );
  }

  return (
    <div className="px-6">
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-[27px] top-2 bottom-2 w-px bg-white/[0.06]" />

        <div className="space-y-0.5">
          {events.map((event, i) => (
            <TimelineRow
              key={`${event.minute}-${event.player}-${i}`}
              event={event}
              match={match}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function TimelineRow({ event, match }: { event: MatchEvent; match: Match }) {
  const isHome = event.team === "home";
  const teamName = isHome ? match.homeTeam : match.awayTeam;

  return (
    <div className="flex items-start gap-3 py-2.5 px-2 rounded-lg hover:bg-white/[0.02] transition-colors relative">
      {/* Minute */}
      <span className="text-[11px] text-zinc-600 font-mono w-6 text-right shrink-0 tabular-nums pt-0.5">
        {event.minute}&apos;
      </span>

      {/* Dot on timeline */}
      <div className="w-3 h-3 rounded-full bg-[#0c0c18] border border-white/[0.1] flex items-center justify-center shrink-0 mt-0.5 relative z-10">
        <div
          className={`w-1.5 h-1.5 rounded-full ${
            event.type === "goal"
              ? "bg-emerald-400"
              : event.type === "red_card"
              ? "bg-red-400"
              : event.type === "yellow_card"
              ? "bg-amber-400"
              : "bg-zinc-500"
          }`}
        />
      </div>

      {/* Event content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm">{EVENT_ICONS[event.type]}</span>
          <span className="text-[13px] text-zinc-200 font-medium truncate">
            {event.player}
          </span>
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[10px] text-zinc-600">{teamName}</span>
          {event.detail && (
            <span className="text-[10px] text-zinc-700">
              · {event.detail}
            </span>
          )}
          {event.assist && (
            <span className="text-[10px] text-zinc-700">
              · Assist: {event.assist}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
