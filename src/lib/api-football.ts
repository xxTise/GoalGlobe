/**
 * API-Football client (api-sports.io / RapidAPI).
 *
 * Supports two auth modes:
 *   1. Direct: x-apisports-key header (api-sports.io dashboard key)
 *   2. RapidAPI: x-rapidapi-key header (RapidAPI marketplace key)
 *
 * Set API_FOOTBALL_KEY in .env.local.
 * Optionally set API_FOOTBALL_HOST to override the host.
 */

const API_KEY = process.env.API_FOOTBALL_KEY ?? "";
const API_HOST =
  process.env.API_FOOTBALL_HOST ?? "v3.football.api-sports.io";

// RapidAPI keys are typically 50 chars, direct keys are shorter
const IS_RAPID_API = API_KEY.length >= 40;

const BASE_URL = `https://${API_HOST}`;

// Track daily API calls to help stay within free tier limits
let dailyCallCount = 0;
let lastResetDate = new Date().toISOString().slice(0, 10);

function trackCall(): number {
  const today = new Date().toISOString().slice(0, 10);
  if (today !== lastResetDate) {
    dailyCallCount = 0;
    lastResetDate = today;
  }
  dailyCallCount++;
  return dailyCallCount;
}

export function getCallCount(): number {
  const today = new Date().toISOString().slice(0, 10);
  if (today !== lastResetDate) return 0;
  return dailyCallCount;
}

interface ApiResponse<T> {
  get: string;
  parameters: Record<string, string>;
  errors: Record<string, string> | string[];
  results: number;
  paging: { current: number; total: number };
  response: T;
}

// ── Raw types from API-Football ──

export interface ApiFixture {
  fixture: {
    id: number;
    referee: string | null;
    timezone: string;
    date: string;
    timestamp: number;
    status: {
      long: string;
      short: string; // "1H" "2H" "HT" "FT" "NS" "PST" "CANC" "SUSP" etc.
      elapsed: number | null;
    };
    venue: {
      id: number | null;
      name: string | null;
      city: string | null;
    };
  };
  league: {
    id: number;
    name: string;
    country: string;
    logo: string;
    flag: string | null;
    season: number;
    round: string;
  };
  teams: {
    home: { id: number; name: string; logo: string; winner: boolean | null };
    away: { id: number; name: string; logo: string; winner: boolean | null };
  };
  goals: {
    home: number | null;
    away: number | null;
  };
  score: {
    halftime: { home: number | null; away: number | null };
    fulltime: { home: number | null; away: number | null };
    extratime: { home: number | null; away: number | null };
    penalty: { home: number | null; away: number | null };
  };
  events: ApiEvent[];
}

export interface ApiEvent {
  time: { elapsed: number; extra: number | null };
  team: { id: number; name: string; logo: string };
  player: { id: number; name: string };
  assist: { id: number | null; name: string | null };
  type: string; // "Goal", "Card", "subst"
  detail: string; // "Normal Goal", "Yellow Card", "Red Card", "Substitution 1" etc.
  comments: string | null;
}

// ── API client ──

function buildHeaders(): HeadersInit {
  if (IS_RAPID_API) {
    return {
      "x-rapidapi-key": API_KEY,
      "x-rapidapi-host": API_HOST,
    };
  }
  return {
    "x-apisports-key": API_KEY,
  };
}

async function apiFetch<T>(
  endpoint: string,
  params: Record<string, string>
): Promise<ApiResponse<T>> {
  const url = new URL(endpoint, BASE_URL);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  const callNum = trackCall();
  console.log(
    `[GoalGlobe API] Call #${callNum} today → ${endpoint} ${JSON.stringify(params)}`
  );

  const res = await fetch(url.toString(), {
    headers: buildHeaders(),
    next: { revalidate: 0 }, // no Next.js cache — we manage our own
  });

  if (!res.ok) {
    throw new Error(
      `API-Football ${res.status}: ${res.statusText} — ${url.pathname}`
    );
  }

  const data: ApiResponse<T> = await res.json();

  // Log remaining quota from response headers
  const remaining = res.headers.get("x-ratelimit-requests-remaining");
  if (remaining) {
    console.log(`[GoalGlobe API] Quota remaining: ${remaining}/100`);
  }

  return data;
}

/**
 * Fetch today's fixtures (all statuses: scheduled, live, finished).
 */
export async function fetchTodayFixtures(): Promise<ApiFixture[]> {
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const data = await apiFetch<ApiFixture[]>("/fixtures", { date: today });
  return data.response;
}

/**
 * Fetch only live fixtures (in-play right now).
 */
export async function fetchLiveFixtures(): Promise<ApiFixture[]> {
  const data = await apiFetch<ApiFixture[]>("/fixtures", { live: "all" });
  return data.response;
}

// ── Fixture detail types ──

export interface ApiStatistic {
  team: { id: number; name: string; logo: string };
  statistics: Array<{ type: string; value: number | string | null }>;
}

export interface ApiLineupPlayer {
  player: { id: number; name: string; number: number; pos: string | null };
}

export interface ApiLineup {
  team: { id: number; name: string; logo: string };
  formation: string | null;
  startXI: Array<{ player: { id: number; name: string; number: number; pos: string } }>;
  substitutes: Array<{ player: { id: number; name: string; number: number; pos: string } }>;
}

/**
 * Fetch match statistics for a fixture.
 */
export async function fetchFixtureStats(
  fixtureId: string
): Promise<ApiStatistic[]> {
  const data = await apiFetch<ApiStatistic[]>("/fixtures/statistics", {
    fixture: fixtureId,
  });
  return data.response;
}

/**
 * Fetch lineups for a fixture.
 */
export async function fetchFixtureLineups(
  fixtureId: string
): Promise<ApiLineup[]> {
  const data = await apiFetch<ApiLineup[]>("/fixtures/lineups", {
    fixture: fixtureId,
  });
  return data.response;
}

/**
 * Returns true if the API key is configured.
 */
export function isApiConfigured(): boolean {
  return API_KEY.length > 0;
}
