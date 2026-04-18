import { MatchTier } from "./types";

/**
 * Maps API-Football league IDs to prestige tiers.
 * Tier 1: Top 5 European leagues + Champions League + major cups
 * Tier 2: Strong domestic leagues + continental competitions
 * Tier 3: Everything else
 */

const TIER_1_LEAGUES = new Set([
  // Top 5 European
  39,  // Premier League
  140, // La Liga
  78,  // Bundesliga
  135, // Serie A
  61,  // Ligue 1

  // Champions League / Europa
  2,   // Champions League
  3,   // Europa League
  848, // Conference League

  // Major cups
  45,  // FA Cup
  143, // Copa del Rey
  81,  // DFB Pokal
  137, // Coppa Italia
  66,  // Coupe de France

  // International
  1,   // World Cup
  4,   // Euro Championship
  9,   // Copa America
  29,  // World Cup Qualifiers
]);

const TIER_2_LEAGUES = new Set([
  // Strong European
  88,  // Eredivisie
  94,  // Liga Portugal
  144, // Belgian Pro League
  203, // Super Lig (Turkey)
  197, // Super League (Greece)
  207, // Swiss Super League
  218, // Bundesliga (Austria)
  106, // Ekstraklasa (Poland)
  235, // Premier League (Russia)

  // South America
  71,  // Brasileirão Série A
  128, // Liga Profesional (Argentina)
  239, // Colombian Primera A

  // Asia / Middle East
  307, // Saudi Pro League
  169, // J1 League (Japan)
  292, // K League 1 (South Korea)
  188, // A-League (Australia)

  // North America
  253, // MLS
  262, // Liga MX

  // Africa
  233, // Egyptian Premier League
  200, // South Africa PSL

  // Continental
  13,  // Copa Libertadores
  11,  // AFC Champions League
  12,  // CAF Champions League
  14,  // Copa Sudamericana
]);

export function getLeagueTier(leagueId: number): MatchTier {
  if (TIER_1_LEAGUES.has(leagueId)) return 1;
  if (TIER_2_LEAGUES.has(leagueId)) return 2;
  return 3;
}
