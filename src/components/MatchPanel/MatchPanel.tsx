"use client";

import { lazy, Suspense, useEffect, useState } from "react";
import { Match } from "@/lib/types";
import { useMatchDetail } from "@/hooks/useMatchDetail";
import { Scoreboard } from "./Scoreboard";
import { DetailSkeleton } from "./DetailSkeleton";

// Lazy-load tab content — not needed until user clicks a tab
const MatchStats = lazy(() => import("./MatchStats").then(m => ({ default: m.MatchStats })));
const MatchTimeline = lazy(() => import("./MatchTimeline").then(m => ({ default: m.MatchTimeline })));
const MatchLineups = lazy(() => import("./MatchLineups").then(m => ({ default: m.MatchLineups })));

type Tab = "timeline" | "stats" | "lineups";

interface MatchPanelProps {
  match: Match | null;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (matchId: string) => void;
}

export function MatchPanel({
  match,
  onClose,
  isFavorite,
  onToggleFavorite,
}: MatchPanelProps) {
  const [activeTab, setActiveTab] = useState<Tab>("timeline");
  const { detail, isLoading: detailLoading } = useMatchDetail(match?.id ?? null);

  // Reset tab when match changes
  useEffect(() => {
    if (match) setActiveTab("timeline");
  }, [match?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Escape key closes panel
  useEffect(() => {
    if (!match) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [match, onClose]);

  return (
    <>
      {/* Backdrop (mobile) */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-30 transition-opacity duration-300 sm:hidden ${
          match ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] z-40 transform transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          match ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full bg-[#0a0a16]/95 backdrop-blur-2xl border-l border-white/[0.06] shadow-2xl shadow-black/60 flex flex-col">
          {match && (
            <>
              {/* ── Header bar ── */}
              <div className="flex items-center justify-between px-6 pt-5 pb-2 shrink-0">
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-medium text-zinc-400 uppercase tracking-[0.1em] truncate">
                    {match.league}
                  </p>
                  <p className="text-[10px] text-zinc-600 mt-0.5 truncate">
                    {match.stadium} · {match.country}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0 ml-3">
                  {/* Favorite */}
                  <button
                    onClick={() => onToggleFavorite(match.id)}
                    className={`w-8 h-8 flex items-center justify-center rounded-full transition-all cursor-pointer ${
                      isFavorite
                        ? "bg-amber-500/15 text-amber-400"
                        : "bg-white/[0.04] text-zinc-600 hover:text-amber-400 hover:bg-white/[0.07]"
                    }`}
                    aria-label={
                      isFavorite ? "Remove from favorites" : "Add to favorites"
                    }
                  >
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill={isFavorite ? "currentColor" : "none"}
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </button>
                  {/* Close */}
                  <button
                    onClick={onClose}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-zinc-500 hover:text-white transition-all cursor-pointer"
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
              </div>

              {/* ── Scoreboard ── */}
              <Scoreboard match={match} />

              {/* ── Divider ── */}
              <div className="h-px bg-white/[0.04] mx-6" />

              {/* ── Tabs ── */}
              <div className="flex items-center gap-1 px-6 py-3 shrink-0">
                {(["timeline", "stats", "lineups"] as Tab[]).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3.5 py-1.5 rounded-lg text-[11px] font-medium capitalize transition-all cursor-pointer ${
                      activeTab === tab
                        ? "bg-white/[0.08] text-white"
                        : "text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.03]"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* ── Tab content (scrollable, lazy-loaded) ── */}
              <div className="flex-1 overflow-y-auto pb-6">
                <Suspense fallback={<DetailSkeleton />}>
                  {activeTab === "timeline" && (
                    <MatchTimeline match={match} />
                  )}

                  {activeTab === "stats" && (
                    detailLoading ? (
                      <DetailSkeleton />
                    ) : (
                      <MatchStats stats={detail?.stats ?? []} />
                    )
                  )}

                  {activeTab === "lineups" && (
                    detailLoading ? (
                      <DetailSkeleton />
                    ) : (
                      <MatchLineups
                        homeTeam={match.homeTeam}
                        awayTeam={match.awayTeam}
                        homeLineup={detail?.homeLineup ?? null}
                        awayLineup={detail?.awayLineup ?? null}
                      />
                    )
                  )}
                </Suspense>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
