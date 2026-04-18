export type MatchStatus = "LIVE" | "HT" | "FT" | "NS" | "PST";

/**
 * Match prestige tier — drives dot size on the globe.
 * 1 = marquee (top 5 league derbies, Champions League knockout)
 * 2 = standard top-flight
 * 3 = lower-profile leagues
 */
export type MatchTier = 1 | 2 | 3;

export interface MatchEvent {
  minute: number;
  type: "goal" | "yellow_card" | "red_card" | "substitution";
  player: string;
  team: "home" | "away";
  detail?: string; // "Penalty", "Own Goal", "Yellow Card", etc.
  assist?: string | null;
}

export type MatchCategory = "women" | "youth" | "international" | "friendly";

export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  minute: number | null;
  status: MatchStatus;
  league: string;
  leagueId: number;
  country: string;
  stadium: string;
  latitude: number;
  longitude: number;
  events: MatchEvent[];
  tier: MatchTier;
  categories: MatchCategory[];
  homeLogo?: string;
  awayLogo?: string;
}

// ── Match detail types (fetched on-demand when pin is clicked) ──

export interface StatRow {
  label: string;
  home: number;
  away: number;
}

export interface Player {
  id: number;
  name: string;
  number: number | null;
  pos: string | null; // G, D, M, F
}

export interface TeamLineup {
  formation: string | null;
  startXI: Player[];
  substitutes: Player[];
}

export interface MatchDetail {
  stats: StatRow[];
  homeLineup: TeamLineup | null;
  awayLineup: TeamLineup | null;
  referee: string | null;
  venue: string | null;
  city: string | null;
  kickoff: string | null; // ISO date string
  round: string | null;
  leagueLogo: string | null;
}
