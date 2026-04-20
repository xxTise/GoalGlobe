/**
 * Static registry of teams and leagues for global search.
 *
 * This allows searching for teams/leagues even when they're not playing today.
 * The registry is enriched at runtime with any new teams from API data.
 */

export interface RegisteredTeam {
  name: string;
  country: string;
  league: string;
}

export interface RegisteredLeague {
  id: number;
  name: string;
  country: string;
  tier: 1 | 2 | 3;
}

// ── Top leagues ──
export const LEAGUE_REGISTRY: RegisteredLeague[] = [
  // Tier 1
  { id: 39, name: "Premier League", country: "England", tier: 1 },
  { id: 140, name: "La Liga", country: "Spain", tier: 1 },
  { id: 78, name: "Bundesliga", country: "Germany", tier: 1 },
  { id: 135, name: "Serie A", country: "Italy", tier: 1 },
  { id: 61, name: "Ligue 1", country: "France", tier: 1 },
  { id: 2, name: "Champions League", country: "World", tier: 1 },
  { id: 3, name: "Europa League", country: "World", tier: 1 },
  { id: 848, name: "Conference League", country: "World", tier: 1 },
  { id: 45, name: "FA Cup", country: "England", tier: 1 },
  { id: 143, name: "Copa del Rey", country: "Spain", tier: 1 },
  { id: 1, name: "World Cup", country: "World", tier: 1 },
  { id: 4, name: "Euro Championship", country: "World", tier: 1 },
  { id: 9, name: "Copa America", country: "World", tier: 1 },
  // Tier 2
  { id: 88, name: "Eredivisie", country: "Netherlands", tier: 2 },
  { id: 94, name: "Liga Portugal", country: "Portugal", tier: 2 },
  { id: 71, name: "Brasileirão", country: "Brazil", tier: 2 },
  { id: 128, name: "Liga Profesional", country: "Argentina", tier: 2 },
  { id: 253, name: "MLS", country: "USA", tier: 2 },
  { id: 262, name: "Liga MX", country: "Mexico", tier: 2 },
  { id: 307, name: "Saudi Pro League", country: "Saudi Arabia", tier: 2 },
  { id: 169, name: "J1 League", country: "Japan", tier: 2 },
  { id: 292, name: "K League 1", country: "South Korea", tier: 2 },
  { id: 203, name: "Super Lig", country: "Turkey", tier: 2 },
  { id: 144, name: "Belgian Pro League", country: "Belgium", tier: 2 },
  { id: 13, name: "Copa Libertadores", country: "South America", tier: 2 },
  { id: 233, name: "Egyptian Premier League", country: "Egypt", tier: 2 },
  { id: 200, name: "PSL", country: "South Africa", tier: 2 },
];

// ── Top teams (name + country + primary league) ──
export const TEAM_REGISTRY: RegisteredTeam[] = [
  // England
  { name: "Arsenal", country: "England", league: "Premier League" },
  { name: "Aston Villa", country: "England", league: "Premier League" },
  { name: "Bournemouth", country: "England", league: "Premier League" },
  { name: "Brentford", country: "England", league: "Premier League" },
  { name: "Brighton", country: "England", league: "Premier League" },
  { name: "Chelsea", country: "England", league: "Premier League" },
  { name: "Crystal Palace", country: "England", league: "Premier League" },
  { name: "Everton", country: "England", league: "Premier League" },
  { name: "Fulham", country: "England", league: "Premier League" },
  { name: "Ipswich", country: "England", league: "Premier League" },
  { name: "Leicester City", country: "England", league: "Premier League" },
  { name: "Liverpool", country: "England", league: "Premier League" },
  { name: "Manchester City", country: "England", league: "Premier League" },
  { name: "Manchester United", country: "England", league: "Premier League" },
  { name: "Newcastle", country: "England", league: "Premier League" },
  { name: "Nottingham Forest", country: "England", league: "Premier League" },
  { name: "Southampton", country: "England", league: "Premier League" },
  { name: "Tottenham", country: "England", league: "Premier League" },
  { name: "West Ham", country: "England", league: "Premier League" },
  { name: "Wolverhampton", country: "England", league: "Premier League" },
  // Spain
  { name: "Real Madrid", country: "Spain", league: "La Liga" },
  { name: "Barcelona", country: "Spain", league: "La Liga" },
  { name: "Atletico Madrid", country: "Spain", league: "La Liga" },
  { name: "Real Sociedad", country: "Spain", league: "La Liga" },
  { name: "Athletic Club", country: "Spain", league: "La Liga" },
  { name: "Real Betis", country: "Spain", league: "La Liga" },
  { name: "Villarreal", country: "Spain", league: "La Liga" },
  { name: "Sevilla", country: "Spain", league: "La Liga" },
  { name: "Valencia", country: "Spain", league: "La Liga" },
  { name: "Girona", country: "Spain", league: "La Liga" },
  // Germany
  { name: "Bayern Munich", country: "Germany", league: "Bundesliga" },
  { name: "Borussia Dortmund", country: "Germany", league: "Bundesliga" },
  { name: "Bayer Leverkusen", country: "Germany", league: "Bundesliga" },
  { name: "RB Leipzig", country: "Germany", league: "Bundesliga" },
  { name: "Eintracht Frankfurt", country: "Germany", league: "Bundesliga" },
  { name: "Stuttgart", country: "Germany", league: "Bundesliga" },
  { name: "Wolfsburg", country: "Germany", league: "Bundesliga" },
  // Italy
  { name: "Inter Milan", country: "Italy", league: "Serie A" },
  { name: "AC Milan", country: "Italy", league: "Serie A" },
  { name: "Juventus", country: "Italy", league: "Serie A" },
  { name: "Napoli", country: "Italy", league: "Serie A" },
  { name: "AS Roma", country: "Italy", league: "Serie A" },
  { name: "Lazio", country: "Italy", league: "Serie A" },
  { name: "Atalanta", country: "Italy", league: "Serie A" },
  { name: "Fiorentina", country: "Italy", league: "Serie A" },
  // France
  { name: "PSG", country: "France", league: "Ligue 1" },
  { name: "Marseille", country: "France", league: "Ligue 1" },
  { name: "Lyon", country: "France", league: "Ligue 1" },
  { name: "Monaco", country: "France", league: "Ligue 1" },
  { name: "Lille", country: "France", league: "Ligue 1" },
  // Portugal
  { name: "Benfica", country: "Portugal", league: "Liga Portugal" },
  { name: "Porto", country: "Portugal", league: "Liga Portugal" },
  { name: "Sporting CP", country: "Portugal", league: "Liga Portugal" },
  // Netherlands
  { name: "Ajax", country: "Netherlands", league: "Eredivisie" },
  { name: "PSV", country: "Netherlands", league: "Eredivisie" },
  { name: "Feyenoord", country: "Netherlands", league: "Eredivisie" },
  // South America
  { name: "Flamengo", country: "Brazil", league: "Brasileirão" },
  { name: "Palmeiras", country: "Brazil", league: "Brasileirão" },
  { name: "Corinthians", country: "Brazil", league: "Brasileirão" },
  { name: "São Paulo", country: "Brazil", league: "Brasileirão" },
  { name: "River Plate", country: "Argentina", league: "Liga Profesional" },
  { name: "Boca Juniors", country: "Argentina", league: "Liga Profesional" },
  // Other
  { name: "Al Hilal", country: "Saudi Arabia", league: "Saudi Pro League" },
  { name: "Al Nassr", country: "Saudi Arabia", league: "Saudi Pro League" },
  { name: "Al Ahli", country: "Saudi Arabia", league: "Saudi Pro League" },
  { name: "Al Ittihad", country: "Saudi Arabia", league: "Saudi Pro League" },
  { name: "Galatasaray", country: "Turkey", league: "Super Lig" },
  { name: "Fenerbahce", country: "Turkey", league: "Super Lig" },
  { name: "Besiktas", country: "Turkey", league: "Super Lig" },
  { name: "Celtic", country: "Scotland", league: "Premiership" },
  { name: "Rangers", country: "Scotland", league: "Premiership" },
  { name: "LAFC", country: "USA", league: "MLS" },
  { name: "Inter Miami", country: "USA", league: "MLS" },
  { name: "LA Galaxy", country: "USA", league: "MLS" },
  { name: "Club América", country: "Mexico", league: "Liga MX" },
  { name: "Guadalajara", country: "Mexico", league: "Liga MX" },
  // National teams
  { name: "Brazil", country: "Brazil", league: "International" },
  { name: "Argentina", country: "Argentina", league: "International" },
  { name: "France", country: "France", league: "International" },
  { name: "England", country: "England", league: "International" },
  { name: "Spain", country: "Spain", league: "International" },
  { name: "Germany", country: "Germany", league: "International" },
  { name: "Portugal", country: "Portugal", league: "International" },
  { name: "Netherlands", country: "Netherlands", league: "International" },
  { name: "Italy", country: "Italy", league: "International" },
  { name: "Belgium", country: "Belgium", league: "International" },
  { name: "USA", country: "USA", league: "International" },
  { name: "Mexico", country: "Mexico", league: "International" },
  { name: "Japan", country: "Japan", league: "International" },
  { name: "Nigeria", country: "Nigeria", league: "International" },
];

/**
 * Merge registry with live match data to get a complete team list
 * with logos from API when available.
 */
export function buildSearchableTeams(
  matches: { homeTeam: string; awayTeam: string; homeLogo?: string; awayLogo?: string }[]
): Map<string, { name: string; country: string; league: string; logo?: string }> {
  const map = new Map<string, { name: string; country: string; league: string; logo?: string }>();

  // Seed with registry
  for (const t of TEAM_REGISTRY) {
    map.set(t.name.toLowerCase(), { ...t });
  }

  // Enrich with live logos + add any teams not in registry
  for (const m of matches) {
    const hk = m.homeTeam.toLowerCase();
    if (map.has(hk)) {
      map.get(hk)!.logo = m.homeLogo;
    } else {
      map.set(hk, { name: m.homeTeam, country: "", league: "", logo: m.homeLogo });
    }
    const ak = m.awayTeam.toLowerCase();
    if (map.has(ak)) {
      map.get(ak)!.logo = m.awayLogo;
    } else {
      map.set(ak, { name: m.awayTeam, country: "", league: "", logo: m.awayLogo });
    }
  }

  return map;
}
