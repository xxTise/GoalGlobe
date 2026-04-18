import { NextResponse } from "next/server";
import {
  isApiConfigured,
  fetchFixtureStats,
  fetchFixtureLineups,
} from "@/lib/api-football";
import { buildMatchDetail } from "@/lib/normalize-detail";
import { MatchDetail } from "@/lib/types";

// In-memory cache for fixture details (keyed by fixture ID)
const detailCache = new Map<
  string,
  { data: MatchDetail; timestamp: number }
>();
const DETAIL_TTL_MS = 10 * 60_000; // 10 minutes

/**
 * GET /api/matches/[id]
 *
 * Fetches detailed match data: statistics + lineups.
 * Costs 2 API calls per uncached request.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Check cache
  const cached = detailCache.get(id);
  if (cached && Date.now() - cached.timestamp < DETAIL_TTL_MS) {
    return NextResponse.json({
      detail: cached.data,
      source: "cache",
    });
  }

  if (!isApiConfigured()) {
    return NextResponse.json({
      detail: null,
      source: "no-api-key",
    });
  }

  try {
    // Fetch stats and lineups in parallel (2 API calls)
    const [stats, lineups] = await Promise.all([
      fetchFixtureStats(id).catch(() => []),
      fetchFixtureLineups(id).catch(() => []),
    ]);

    const detail = buildMatchDetail(stats, lineups);

    // Cache it
    detailCache.set(id, { data: detail, timestamp: Date.now() });

    return NextResponse.json({
      detail,
      source: "api",
    });
  } catch (error) {
    console.error(`[GoalGlobe] Detail fetch failed for fixture ${id}:`, error);
    return NextResponse.json(
      { detail: null, source: "error", error: String(error) },
      { status: 200 }
    );
  }
}
