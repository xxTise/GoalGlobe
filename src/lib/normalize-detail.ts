import { MatchDetail, StatRow, TeamLineup, Player } from "./types";
import { ApiStatistic, ApiLineup } from "./api-football";

const STAT_LABELS: Record<string, string> = {
  "Ball Possession": "Possession",
  "Total Shots": "Total Shots",
  "Shots on Goal": "Shots on Target",
  "Shots off Goal": "Shots off Target",
  "Corner Kicks": "Corners",
  Fouls: "Fouls",
  Offsides: "Offsides",
  "Yellow Cards": "Yellow Cards",
  "Red Cards": "Red Cards",
  "Total passes": "Passes",
  "Passes accurate": "Pass Accuracy",
  "expected_goals": "xG",
};

// Order stats should appear
const STAT_ORDER = [
  "Possession",
  "Total Shots",
  "Shots on Target",
  "Corners",
  "Fouls",
  "Yellow Cards",
  "Red Cards",
  "Offsides",
  "Passes",
  "Pass Accuracy",
];

function parseStatValue(val: number | string | null): number {
  if (val === null) return 0;
  if (typeof val === "number") return val;
  // Handle "65%" → 65
  return parseInt(val.replace("%", ""), 10) || 0;
}

export function normalizeStats(apiStats: ApiStatistic[]): StatRow[] {
  if (apiStats.length < 2) return [];

  const home = apiStats[0];
  const away = apiStats[1];

  const homeMap = new Map<string, number | string | null>();
  const awayMap = new Map<string, number | string | null>();

  for (const s of home.statistics) homeMap.set(s.type, s.value);
  for (const s of away.statistics) awayMap.set(s.type, s.value);

  const rows: StatRow[] = [];

  for (const [apiKey, label] of Object.entries(STAT_LABELS)) {
    const h = homeMap.get(apiKey);
    const a = awayMap.get(apiKey);
    if (h === undefined && a === undefined) continue;

    rows.push({
      label,
      home: parseStatValue(h ?? null),
      away: parseStatValue(a ?? null),
    });
  }

  // Sort by desired display order
  rows.sort((a, b) => {
    const ai = STAT_ORDER.indexOf(a.label);
    const bi = STAT_ORDER.indexOf(b.label);
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });

  return rows;
}

function normalizePlayer(p: {
  id: number;
  name: string;
  number: number;
  pos: string;
}): Player {
  return {
    id: p.id,
    name: p.name,
    number: p.number ?? null,
    pos: p.pos ?? null,
  };
}

export function normalizeLineups(
  apiLineups: ApiLineup[]
): { home: TeamLineup | null; away: TeamLineup | null } {
  if (apiLineups.length < 2) return { home: null, away: null };

  const normalize = (lineup: ApiLineup): TeamLineup => ({
    formation: lineup.formation,
    startXI: lineup.startXI.map((s) => normalizePlayer(s.player)),
    substitutes: lineup.substitutes.map((s) => normalizePlayer(s.player)),
  });

  return {
    home: normalize(apiLineups[0]),
    away: normalize(apiLineups[1]),
  };
}

export function buildMatchDetail(
  stats: ApiStatistic[],
  lineups: ApiLineup[],
  extra: Partial<MatchDetail> = {}
): MatchDetail {
  const { home, away } = normalizeLineups(lineups);
  return {
    stats: normalizeStats(stats),
    homeLineup: home,
    awayLineup: away,
    referee: extra.referee ?? null,
    venue: extra.venue ?? null,
    city: extra.city ?? null,
    kickoff: extra.kickoff ?? null,
    round: extra.round ?? null,
    leagueLogo: extra.leagueLogo ?? null,
  };
}
