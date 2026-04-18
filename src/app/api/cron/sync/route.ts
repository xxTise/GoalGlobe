import { NextResponse } from "next/server";
import { isApiConfigured, fetchTodayFixtures } from "@/lib/api-football";
import { normalizeFixtures } from "@/lib/normalize";
import { setCachedMatches } from "@/lib/cache";

/**
 * GET /api/cron/sync
 *
 * Called by Vercel Cron every 60 seconds (configured in vercel.json).
 * Pre-fetches match data so the /api/matches route always has fresh cache.
 *
 * Protected by CRON_SECRET — Vercel sets the Authorization header
 * automatically for cron jobs.
 */
export async function GET(request: Request) {
  // Verify cron secret in production
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  if (!isApiConfigured()) {
    return NextResponse.json({
      ok: false,
      reason: "API_FOOTBALL_KEY not configured",
    });
  }

  try {
    const fixtures = await fetchTodayFixtures();
    const matches = normalizeFixtures(fixtures);
    setCachedMatches(matches, "api");

    return NextResponse.json({
      ok: true,
      fixtureCount: fixtures.length,
      mappedCount: matches.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[GoalGlobe] Cron sync failed:", error);
    return NextResponse.json(
      { ok: false, error: String(error) },
      { status: 500 }
    );
  }
}
