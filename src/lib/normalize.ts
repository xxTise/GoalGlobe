import { Match, MatchEvent, MatchStatus } from "./types";
import { ApiFixture, ApiEvent } from "./api-football";
import { getLeagueTier } from "./league-tiers";
import { getLeagueCategories } from "./league-categories";
import { getStadiumCoords } from "./stadiums";

/**
 * Map API-Football status codes to our MatchStatus.
 */
function normalizeStatus(apiStatus: string): MatchStatus {
  switch (apiStatus) {
    case "1H":
    case "2H":
    case "ET":
    case "LIVE":
      return "LIVE";
    case "HT":
      return "HT";
    case "FT":
    case "AET":
    case "PEN":
      return "FT";
    case "NS":
    case "TBD":
      return "NS";
    case "PST":
    case "CANC":
    case "ABD":
    case "AWD":
    case "WO":
    case "SUSP":
    case "INT":
      return "PST";
    default:
      // BT (break time), P (penalty shootout in progress), etc.
      return "LIVE";
  }
}

/**
 * Map API-Football event to our MatchEvent.
 */
function normalizeEvent(
  event: ApiEvent,
  homeTeamId: number
): MatchEvent | null {
  let type: MatchEvent["type"];

  if (event.type === "Goal") {
    type = "goal";
  } else if (event.type === "Card") {
    if (event.detail.toLowerCase().includes("red")) {
      type = "red_card";
    } else {
      type = "yellow_card";
    }
  } else if (event.type === "subst") {
    type = "substitution";
  } else {
    return null; // Skip VAR decisions, etc.
  }

  return {
    minute: event.time.elapsed,
    type,
    player: event.player?.name ?? "Unknown",
    team: event.team.id === homeTeamId ? "home" : "away",
    detail: event.detail || undefined,
    assist: event.assist?.name ?? undefined,
  };
}

/**
 * Transform an API-Football fixture into our Match type.
 */
export function normalizeFixture(fixture: ApiFixture): Match {
  const { fixture: f, league, teams, goals, events } = fixture;

  const status = normalizeStatus(f.status.short);
  const coords = getStadiumCoords(
    f.venue?.name ?? null,
    league.country
  );

  const normalizedEvents: MatchEvent[] = (events ?? [])
    .map((e) => normalizeEvent(e, teams.home.id))
    .filter((e): e is MatchEvent => e !== null);

  return {
    id: String(f.id),
    homeTeam: teams.home.name,
    awayTeam: teams.away.name,
    homeScore: goals.home ?? 0,
    awayScore: goals.away ?? 0,
    minute: f.status.elapsed,
    status,
    league: league.name,
    country: league.country,
    stadium: f.venue?.name ?? "Unknown Stadium",
    latitude: coords.lat,
    longitude: coords.lng,
    events: normalizedEvents,
    leagueId: league.id,
    tier: getLeagueTier(league.id),
    categories: getLeagueCategories(league.id),
    homeLogo: teams.home.logo,
    awayLogo: teams.away.logo,
  };
}

/**
 * Transform a full API response into Match[].
 * Filters out matches at lat/lng 0,0 (no known location).
 */
export function normalizeFixtures(fixtures: ApiFixture[]): Match[] {
  return fixtures
    .map(normalizeFixture)
    .filter((m) => !(m.latitude === 0 && m.longitude === 0));
}
