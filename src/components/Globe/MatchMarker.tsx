"use client";

import { memo, useCallback, useState } from "react";
import { Marker } from "react-map-gl/maplibre";
import { Match, MatchTier } from "@/lib/types";
import { getQualityConfig } from "@/lib/quality";

interface MatchMarkerProps {
  match: Match;
  isSelected: boolean;
  onClick: (match: Match) => void;
}

const DOT_SIZE: Record<MatchTier, number> = { 1: 14, 2: 10, 3: 7 };

const DOT_COLORS = {
  LIVE: { bg: "#34d399", glow: "0 0 12px rgba(52,211,153,0.5), 0 0 4px rgba(52,211,153,0.8)" },
  HT: { bg: "#fbbf24", glow: "0 0 10px rgba(251,191,36,0.4), 0 0 4px rgba(251,191,36,0.7)" },
  NS: { bg: "#60a5fa", glow: "0 0 8px rgba(96,165,250,0.3), 0 0 3px rgba(96,165,250,0.6)" },
  FT: { bg: "#52525b", glow: "0 0 4px rgba(82,82,91,0.3)" },
  PST: { bg: "#ef4444", glow: "0 0 6px rgba(239,68,68,0.3)" },
} as const;

export const MatchMarker = memo(function MatchMarker({
  match,
  isSelected,
  onClick,
}: MatchMarkerProps) {
  const [hovered, setHovered] = useState(false);
  const handleClick = useCallback(() => onClick(match), [match, onClick]);
  const quality = getQualityConfig();

  const isLive = match.status === "LIVE";
  const size = isSelected ? DOT_SIZE[match.tier] + 4 : DOT_SIZE[match.tier];
  const colors = DOT_COLORS[match.status] ?? DOT_COLORS.FT;

  return (
    <Marker
      latitude={match.latitude}
      longitude={match.longitude}
      anchor="center"
      onClick={handleClick}
    >
      <div
        className="relative cursor-pointer group"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Pulse ring — live only, skipped in performance mode */}
        {isLive && quality.markerPulse && (
          <span
            className="absolute rounded-full animate-ping"
            style={{
              width: size + 12,
              height: size + 12,
              top: -6,
              left: -6,
              backgroundColor: colors.bg,
              opacity: 0.2,
            }}
          />
        )}

        {/* Glow ring on hover/select */}
        {quality.markerGlow && (
          <span
            className="absolute rounded-full transition-opacity duration-200"
            style={{
              width: size + 8,
              height: size + 8,
              top: -4,
              left: -4,
              border: `1px solid ${colors.bg}`,
              opacity: hovered || isSelected ? 0.3 : 0,
            }}
          />
        )}

        {/* Dot */}
        <div
          className="rounded-full"
          style={{
            width: size,
            height: size,
            backgroundColor: colors.bg,
            boxShadow: quality.markerGlow ? colors.glow : undefined,
          }}
        />

        {/* Tooltip — only rendered when hovered */}
        {hovered && !isSelected && (
          <MarkerTooltip match={match} colors={colors} isLive={isLive} />
        )}
      </div>
    </Marker>
  );
},
// Custom comparator: only re-render if these values actually changed
(prev, next) =>
  prev.match.id === next.match.id &&
  prev.match.status === next.match.status &&
  prev.match.homeScore === next.match.homeScore &&
  prev.match.awayScore === next.match.awayScore &&
  prev.match.minute === next.match.minute &&
  prev.isSelected === next.isSelected
);

/** Extracted tooltip — only mounts on hover, zero cost when hidden */
function MarkerTooltip({
  match,
  colors,
  isLive,
}: {
  match: Match;
  colors: { bg: string };
  isLive: boolean;
}) {
  const score =
    match.status === "NS" ? "vs" : `${match.homeScore} - ${match.awayScore}`;
  const statusText =
    match.status === "LIVE"
      ? `${match.minute}'`
      : match.status === "HT"
      ? "HT"
      : match.status === "FT"
      ? "FT"
      : "Upcoming";

  return (
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 z-50 pointer-events-none">
      <div
        className="whitespace-nowrap rounded-xl px-4 py-3 text-left"
        style={{
          background: "rgba(8, 8, 16, 0.95)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.06)",
          boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
          minWidth: 200,
        }}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-medium">
            {match.league}
          </span>
          <span
            className="text-[10px] font-semibold flex items-center gap-1"
            style={{ color: colors.bg }}
          >
            {isLive && (
              <span
                className="inline-block w-[5px] h-[5px] rounded-full animate-pulse"
                style={{ backgroundColor: colors.bg, boxShadow: `0 0 6px ${colors.bg}` }}
              />
            )}
            {statusText}
          </span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-[13px] text-zinc-200 font-semibold">{match.homeTeam}</span>
          <span className="text-sm text-white font-bold font-mono tracking-wide">{score}</span>
          <span className="text-[13px] text-zinc-200 font-semibold text-right">{match.awayTeam}</span>
        </div>
        <div className="mt-2 pt-2 border-t border-white/[0.04]">
          <span className="text-[10px] text-zinc-600">{match.stadium} · {match.country}</span>
        </div>
      </div>
      <div className="w-2 h-2 rotate-45 mx-auto -mt-1" style={{ background: "rgba(8, 8, 16, 0.95)" }} />
    </div>
  );
}
