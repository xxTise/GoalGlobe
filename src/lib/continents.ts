export type Continent =
  | "all"
  | "europe"
  | "south-america"
  | "north-america"
  | "africa"
  | "asia"
  | "oceania";

export interface ContinentConfig {
  label: string;
  lat: number;
  lng: number;
  altitude: number;
}

export const CONTINENT_CONFIG: Record<Continent, ContinentConfig> = {
  all: { label: "All", lat: 20, lng: 10, altitude: 2.5 },
  europe: { label: "Europe", lat: 50, lng: 10, altitude: 1.4 },
  "south-america": { label: "S. America", lat: -15, lng: -55, altitude: 1.5 },
  "north-america": { label: "N. America", lat: 40, lng: -100, altitude: 1.5 },
  africa: { label: "Africa", lat: 5, lng: 20, altitude: 1.5 },
  asia: { label: "Asia", lat: 35, lng: 90, altitude: 1.5 },
  oceania: { label: "Oceania", lat: -25, lng: 140, altitude: 1.6 },
};

const COUNTRY_TO_CONTINENT: Record<string, Continent> = {
  // Europe
  England: "europe",
  Spain: "europe",
  Germany: "europe",
  France: "europe",
  Italy: "europe",
  Portugal: "europe",
  Netherlands: "europe",
  Belgium: "europe",
  Turkey: "europe",
  Scotland: "europe",
  Greece: "europe",
  Switzerland: "europe",
  Austria: "europe",
  Poland: "europe",
  Ukraine: "europe",
  Russia: "europe",
  Croatia: "europe",
  Serbia: "europe",
  Sweden: "europe",
  Norway: "europe",
  Denmark: "europe",
  "Czech Republic": "europe",
  Romania: "europe",

  // South America
  Brazil: "south-america",
  Argentina: "south-america",
  Colombia: "south-america",
  Chile: "south-america",
  Uruguay: "south-america",
  Peru: "south-america",
  Ecuador: "south-america",
  Paraguay: "south-america",
  Bolivia: "south-america",
  Venezuela: "south-america",

  // North / Central America
  "United States": "north-america",
  Mexico: "north-america",
  Canada: "north-america",
  "Costa Rica": "north-america",
  Honduras: "north-america",
  Jamaica: "north-america",

  // Africa
  "South Africa": "africa",
  Nigeria: "africa",
  Egypt: "africa",
  Morocco: "africa",
  Ghana: "africa",
  Cameroon: "africa",
  Senegal: "africa",
  "Ivory Coast": "africa",
  Algeria: "africa",
  Tunisia: "africa",
  Kenya: "africa",
  Tanzania: "africa",

  // Asia
  Japan: "asia",
  "South Korea": "asia",
  China: "asia",
  "Saudi Arabia": "asia",
  UAE: "asia",
  Qatar: "asia",
  Iran: "asia",
  India: "asia",
  Thailand: "asia",
  Indonesia: "asia",
  Vietnam: "asia",
  Uzbekistan: "asia",

  // Oceania
  Australia: "oceania",
  "New Zealand": "oceania",
};

export function getContinent(country: string): Continent {
  return COUNTRY_TO_CONTINENT[country] ?? "europe";
}
