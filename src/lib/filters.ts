import { Match, MatchStatus, MatchCategory } from "./types";
import { Continent, getContinent } from "./continents";

// ── Filter state shape ──

export interface FilterState {
  // Status (OR logic — show any selected status)
  statuses: Set<MatchStatus>;

  // Categories (OR logic within, AND with other filters)
  categories: Set<MatchCategory>;

  // Location
  continent: Continent;
  country: string; // empty = all

  // Search (applied to team names + league name)
  search: string;

  // Quick toggles
  topLeaguesOnly: boolean;
  favoritesOnly: boolean;
  hideFriendlies: boolean;
  hasGoals: boolean;
  hasRedCard: boolean;
}

export const DEFAULT_FILTERS: FilterState = {
  statuses: new Set(),
  categories: new Set(),
  continent: "all",
  country: "",
  search: "",
  topLeaguesOnly: false,
  favoritesOnly: false,
  hideFriendlies: false,
  hasGoals: false,
  hasRedCard: false,
};

/**
 * Count how many filters are active (for the badge).
 */
export function activeFilterCount(filters: FilterState): number {
  let count = 0;
  if (filters.statuses.size > 0) count++;
  if (filters.categories.size > 0) count += filters.categories.size;
  if (filters.continent !== "all") count++;
  if (filters.country) count++;
  if (filters.search) count++;
  if (filters.topLeaguesOnly) count++;
  if (filters.favoritesOnly) count++;
  if (filters.hideFriendlies) count++;
  if (filters.hasGoals) count++;
  if (filters.hasRedCard) count++;
  return count;
}

/**
 * Apply all active filters to a match list.
 * Filters are AND'd together (all must pass).
 * Within a filter group (statuses, categories), items are OR'd.
 */
export function filterMatches(
  matches: Match[],
  filters: FilterState,
  favorites: Set<string>
): Match[] {
  const {
    statuses,
    categories,
    continent,
    country,
    search,
    topLeaguesOnly,
    favoritesOnly,
    hideFriendlies,
    hasGoals,
    hasRedCard,
  } = filters;

  const searchLower = search.toLowerCase().trim();

  return matches.filter((m) => {
    // Status filter (OR within group)
    if (statuses.size > 0) {
      // Map HT to LIVE for filtering convenience (both are "in-play")
      const effective = m.status === "HT" ? new Set([m.status, "LIVE" as MatchStatus]) : new Set([m.status]);
      let matched = false;
      for (const s of effective) {
        if (statuses.has(s)) { matched = true; break; }
      }
      if (!matched) return false;
    }

    // Category filter (OR within group)
    if (categories.size > 0) {
      let matched = false;
      for (const cat of categories) {
        if (m.categories.includes(cat)) { matched = true; break; }
      }
      if (!matched) return false;
    }

    // Continent
    if (continent !== "all" && getContinent(m.country) !== continent) {
      return false;
    }

    // Country
    if (country && m.country.toLowerCase() !== country.toLowerCase()) {
      return false;
    }

    // Search
    if (searchLower) {
      const haystack = `${m.homeTeam} ${m.awayTeam} ${m.league} ${m.stadium}`.toLowerCase();
      if (!haystack.includes(searchLower)) return false;
    }

    // Top leagues
    if (topLeaguesOnly && m.tier !== 1) return false;

    // Favorites
    if (favoritesOnly && !favorites.has(m.id)) return false;

    // Hide friendlies
    if (hideFriendlies && m.categories.includes("friendly")) return false;

    // Has goals
    if (hasGoals && m.events.filter((e) => e.type === "goal").length === 0) {
      return false;
    }

    // Has red card
    if (hasRedCard && m.events.filter((e) => e.type === "red_card").length === 0) {
      return false;
    }

    return true;
  });
}

/**
 * Get unique countries from matches for the country dropdown.
 */
export function getUniqueCountries(matches: Match[]): string[] {
  const countries = new Set<string>();
  for (const m of matches) countries.add(m.country);
  return [...countries].sort();
}
