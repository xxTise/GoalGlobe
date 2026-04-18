import { NextResponse } from "next/server";
import { isApiConfigured, fetchTodayFixtures, getCallCount } from "@/lib/api-football";
import { normalizeFixtures } from "@/lib/normalize";
import { getCachedMatches, setCachedMatches, getCacheAge } from "@/lib/cache";
import { MOCK_MATCHES } from "@/lib/mock-data";

/**
 * GET /api/matches
 *
 * Serves match data to the frontend.
 * 1. If cache is fresh (< 60s) → serve from cache
 * 2. If API key is set → fetch from API-Football, cache, serve
 * 3. If no API key → serve mock data (labeled as demo)
 *
 * The frontend polls this every 30s. With a 60s cache TTL,
 * we make at most 1 API call per minute regardless of how many
 * users are connected.
 */
export async function GET() {
  try {
    // Check cache first
    const cached = getCachedMatches();
    if (cached) {
      return NextResponse.json({
        matches: cached.data,
        source: cached.source,
        cacheAge: getCacheAge(),
      });
    }

    // No fresh cache — try API
    if (isApiConfigured()) {
      try {
        const fixtures = await fetchTodayFixtures();
        const matches = normalizeFixtures(fixtures);
        setCachedMatches(matches, "api");

        return NextResponse.json({
          matches,
          source: "api",
          cacheAge: 0,
          fixtureCount: fixtures.length,
          mappedCount: matches.length,
          apiCallsToday: getCallCount(),
        });
      } catch (apiError) {
        // API failed — serve stale cache if available, else mock
        const stale = getCachedMatches(Infinity);
        if (stale) {
          return NextResponse.json({
            matches: stale.data,
            source: "stale-cache",
            cacheAge: getCacheAge(),
            error: String(apiError),
          });
        }

        // No cache at all — fall through to mock
        console.error("[GoalGlobe] API fetch failed:", apiError);
      }
    }

    // No API key or API failed with no cache — serve mock data
    setCachedMatches(MOCK_MATCHES, "mock");
    return NextResponse.json({
      matches: MOCK_MATCHES,
      source: "mock",
      cacheAge: 0,
    });
  } catch (error) {
    console.error("[GoalGlobe] Unexpected error in /api/matches:", error);
    return NextResponse.json(
      {
        matches: MOCK_MATCHES,
        source: "mock-fallback",
        error: "Internal server error — serving demo data",
      },
      { status: 200 } // Still 200 — frontend always gets data
    );
  }
}
