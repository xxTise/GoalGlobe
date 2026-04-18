import { MatchCategory } from "./types";

/**
 * Classifies league IDs into categories.
 * A league can belong to multiple categories (e.g., Women's International).
 *
 * Source: API-Football league IDs
 */

const WOMEN_LEAGUES = new Set([
  // Major women's leagues & cups
  766,  // FIFA Women's World Cup
  961,  // Women's Champions League
  180,  // WSL (England)
  750,  // Liga F (Spain)
  785,  // Frauen Bundesliga (Germany)
  751,  // Serie A Femminile (Italy)
  752,  // D1 Féminine (France)
  753,  // Eredivisie Vrouwen (Netherlands)
  754,  // NWSL (USA)
  764,  // W-League (Australia)
  797,  // International Women's Friendlies
  // Add more as needed
]);

const YOUTH_LEAGUES = new Set([
  // UEFA Youth
  747,  // UEFA Youth League
  // U-20 / U-21
  142,  // World Cup U20
  399,  // World Cup U17
  690,  // Euro U21
  691,  // Euro U19
  692,  // Euro U17
  // Add more as needed
]);

const INTERNATIONAL_LEAGUES = new Set([
  1,    // World Cup
  4,    // Euro Championship
  9,    // Copa America
  29,   // WCQ Europe
  30,   // WCQ South America
  31,   // WCQ Asia
  32,   // WCQ Africa
  33,   // WCQ North America
  34,   // WCQ Oceania
  5,    // UEFA Nations League
  6,    // Africa Cup of Nations
  7,    // Asian Cup
  8,    // CONCACAF Gold Cup
  10,   // Friendlies
  766,  // Women's World Cup
  797,  // Women's Friendlies
]);

const FRIENDLY_LEAGUES = new Set([
  10,   // International Friendlies
  667,  // Club Friendlies
  797,  // Women's Friendlies
  719,  // Club Friendlies 2
]);

/**
 * Returns all matching categories for a given league ID.
 */
export function getLeagueCategories(leagueId: number): MatchCategory[] {
  const cats: MatchCategory[] = [];
  if (WOMEN_LEAGUES.has(leagueId)) cats.push("women");
  if (YOUTH_LEAGUES.has(leagueId)) cats.push("youth");
  if (INTERNATIONAL_LEAGUES.has(leagueId)) cats.push("international");
  if (FRIENDLY_LEAGUES.has(leagueId)) cats.push("friendly");
  return cats;
}
