/**
 * Stadium → coordinates mapping.
 *
 * Key: lowercase venue name from API-Football.
 * Covers top ~150 stadiums globally. For unknown venues,
 * we fall back to country/city centroids.
 */

interface Coords {
  lat: number;
  lng: number;
}

const STADIUMS: Record<string, Coords> = {
  // ── ENGLAND ──
  "emirates stadium": { lat: 51.5549, lng: -0.1084 },
  "stamford bridge": { lat: 51.4817, lng: -0.191 },
  anfield: { lat: 53.4308, lng: -2.9609 },
  "etihad stadium": { lat: 53.4831, lng: -2.2004 },
  "old trafford": { lat: 53.4631, lng: -2.2913 },
  "tottenham hotspur stadium": { lat: 51.6043, lng: -0.0662 },
  "london stadium": { lat: 51.5387, lng: -0.0166 },
  "villa park": { lat: 52.5092, lng: -1.8847 },
  "st. james' park": { lat: 54.9756, lng: -1.6217 },
  "goodison park": { lat: 53.4389, lng: -2.9664 },
  "elland road": { lat: 53.778, lng: -1.5722 },
  "the city ground": { lat: 52.94, lng: -1.1325 },
  "molineux stadium": { lat: 52.5903, lng: -2.1306 },
  "selhurst park": { lat: 51.3983, lng: -0.0855 },
  wembley: { lat: 51.556, lng: -0.2795 },
  "king power stadium": { lat: 52.6203, lng: -1.1422 },
  "portman road": { lat: 52.0555, lng: 1.1447 },
  "gtech community stadium": { lat: 51.4908, lng: -0.2886 },
  "vitality stadium": { lat: 50.7352, lng: -1.838 },
  "amex stadium": { lat: 50.8616, lng: -0.0837 },

  // ── SPAIN ──
  "santiago bernabeu": { lat: 40.4531, lng: -3.6883 },
  "estadio santiago bernabéu": { lat: 40.4531, lng: -3.6883 },
  "spotify camp nou": { lat: 41.3809, lng: 2.1228 },
  "camp nou": { lat: 41.3809, lng: 2.1228 },
  "civitas metropolitano": { lat: 40.4362, lng: -3.5995 },
  "estadio de la cerámica": { lat: 39.9444, lng: -0.1036 },
  "estadio benito villamarín": { lat: 37.3564, lng: -5.9817 },
  "ramón sánchez-pizjuán": { lat: 37.384, lng: -5.9706 },
  "san mamés": { lat: 43.2643, lng: -2.9499 },
  "reale arena": { lat: 43.3013, lng: -1.9736 },

  // ── GERMANY ──
  "allianz arena": { lat: 48.2188, lng: 11.6247 },
  "signal iduna park": { lat: 51.4926, lng: 7.4518 },
  "olympiastadion berlin": { lat: 52.5147, lng: 13.2395 },
  "veltins-arena": { lat: 51.5536, lng: 7.0678 },
  "red bull arena": { lat: 51.3462, lng: 12.3481 },
  "mercedes-benz arena": { lat: 48.7921, lng: 9.2319 },
  "deutsche bank park": { lat: 50.0686, lng: 8.6455 },
  "borussia-park": { lat: 51.1747, lng: 6.3856 },
  "volkswagen arena": { lat: 52.4323, lng: 10.804 },
  "rheinenergiestadion": { lat: 50.9335, lng: 6.8751 },

  // ── ITALY ──
  "san siro": { lat: 45.478, lng: 9.124 },
  "stadio giuseppe meazza": { lat: 45.478, lng: 9.124 },
  "stadio olimpico": { lat: 41.9341, lng: 12.4547 },
  "allianz stadium": { lat: 45.1096, lng: 7.6413 },
  "stadio diego armando maradona": { lat: 40.828, lng: 14.193 },
  "gewiss stadium": { lat: 45.7089, lng: 9.6811 },
  "stadio artemio franchi": { lat: 43.7808, lng: 11.2822 },

  // ── FRANCE ──
  "parc des princes": { lat: 48.8414, lng: 2.253 },
  "stade de france": { lat: 48.9244, lng: 2.36 },
  "groupama stadium": { lat: 45.7653, lng: 4.9822 },
  "stade vélodrome": { lat: 43.2697, lng: 5.3959 },
  "allianz riviera": { lat: 43.7053, lng: 7.1928 },
  "roazhon park": { lat: 48.1075, lng: -1.7126 },
  "stade pierre-mauroy": { lat: 50.6119, lng: 3.1303 },

  // ── PORTUGAL ──
  "estádio da luz": { lat: 38.7527, lng: -9.1847 },
  "estádio do dragão": { lat: 41.1617, lng: -8.5836 },
  "estádio josé alvalade": { lat: 38.7613, lng: -9.1609 },

  // ── NETHERLANDS ──
  "johan cruyff arena": { lat: 52.3142, lng: 4.9419 },
  "de kuip": { lat: 51.8939, lng: 4.5231 },
  "philips stadion": { lat: 51.4417, lng: 5.4681 },

  // ── SOUTH AMERICA ──
  maracanã: { lat: -22.9121, lng: -43.2302 },
  "estadio maracanã": { lat: -22.9121, lng: -43.2302 },
  "neo química arena": { lat: -23.5453, lng: -46.4744 },
  "allianz parque": { lat: -23.5275, lng: -46.6781 },
  "morumbi": { lat: -23.6003, lng: -46.7222 },
  "estadio monumental": { lat: -34.5453, lng: -58.4498 },
  "la bombonera": { lat: -34.6355, lng: -58.3649 },
  "estadio centenario": { lat: -34.8942, lng: -56.1527 },
  "estadio nacional": { lat: -33.4656, lng: -70.6106 },

  // ── ASIA / MIDDLE EAST ──
  "kingdom arena": { lat: 24.7136, lng: 46.6753 },
  "al-awwal park": { lat: 24.7136, lng: 46.6753 },
  "mrsool park": { lat: 24.7566, lng: 46.6932 },
  "nissan stadium": { lat: 35.51, lng: 139.6064 },
  "saitama stadium 2002": { lat: 35.8629, lng: 139.7173 },
  "seoul world cup stadium": { lat: 37.5683, lng: 126.8972 },
  "rajamangala national stadium": { lat: 13.7551, lng: 100.6207 },
  "salt lake stadium": { lat: 22.5726, lng: 88.4082 },

  // ── AFRICA ──
  "fnb stadium": { lat: -26.2325, lng: 27.9828 },
  "cairo international stadium": { lat: 30.0694, lng: 31.3131 },
  "stade mohammed v": { lat: 33.5833, lng: -7.6166 },
  "stade des martyrs": { lat: -4.3281, lng: 15.3135 },

  // ── NORTH AMERICA ──
  "bmo stadium": { lat: 34.0128, lng: -118.2841 },
  "dignity health sports park": { lat: 33.8644, lng: -118.2611 },
  "sofi stadium": { lat: 33.9534, lng: -118.3387 },
  "estadio azteca": { lat: 19.3029, lng: -99.1505 },
  "mercedes-benz stadium": { lat: 33.7553, lng: -84.4006 },
  "metlife stadium": { lat: 40.8128, lng: -74.0742 },
  "soldier field": { lat: 41.8623, lng: -87.6167 },
  "gillette stadium": { lat: 42.0909, lng: -71.2643 },
  "geodis park": { lat: 36.1302, lng: -86.7658 },
  "q2 stadium": { lat: 30.3882, lng: -97.7191 },
};

/**
 * Country capital/centroid fallbacks.
 * Used when a stadium isn't in our mapping.
 */
const COUNTRY_CENTROIDS: Record<string, Coords> = {
  England: { lat: 51.51, lng: -0.13 },
  Spain: { lat: 40.42, lng: -3.7 },
  Germany: { lat: 52.52, lng: 13.4 },
  France: { lat: 48.86, lng: 2.35 },
  Italy: { lat: 41.9, lng: 12.5 },
  Portugal: { lat: 38.72, lng: -9.14 },
  Netherlands: { lat: 52.37, lng: 4.9 },
  Belgium: { lat: 50.85, lng: 4.35 },
  Turkey: { lat: 41.01, lng: 28.98 },
  Scotland: { lat: 55.95, lng: -3.19 },
  Greece: { lat: 37.98, lng: 23.73 },
  Switzerland: { lat: 46.95, lng: 7.45 },
  Austria: { lat: 48.21, lng: 16.37 },
  Poland: { lat: 52.23, lng: 21.01 },
  Ukraine: { lat: 50.45, lng: 30.52 },
  Russia: { lat: 55.75, lng: 37.62 },
  Croatia: { lat: 45.81, lng: 15.98 },
  Serbia: { lat: 44.79, lng: 20.47 },
  Sweden: { lat: 59.33, lng: 18.07 },
  Norway: { lat: 59.91, lng: 10.75 },
  Denmark: { lat: 55.68, lng: 12.57 },
  "Czech-Republic": { lat: 50.08, lng: 14.44 },
  Romania: { lat: 44.43, lng: 26.1 },
  Brazil: { lat: -15.79, lng: -47.88 },
  Argentina: { lat: -34.6, lng: -58.38 },
  Colombia: { lat: 4.71, lng: -74.07 },
  Chile: { lat: -33.45, lng: -70.67 },
  Uruguay: { lat: -34.88, lng: -56.17 },
  Peru: { lat: -12.05, lng: -77.04 },
  Ecuador: { lat: -0.18, lng: -78.47 },
  Paraguay: { lat: -25.3, lng: -57.64 },
  Venezuela: { lat: 10.49, lng: -66.88 },
  USA: { lat: 38.91, lng: -77.04 },
  Mexico: { lat: 19.43, lng: -99.13 },
  Canada: { lat: 43.65, lng: -79.38 },
  Japan: { lat: 35.68, lng: 139.69 },
  "South-Korea": { lat: 37.57, lng: 126.98 },
  China: { lat: 39.9, lng: 116.4 },
  "Saudi-Arabia": { lat: 24.71, lng: 46.68 },
  Australia: { lat: -33.87, lng: 151.21 },
  "South-Africa": { lat: -26.2, lng: 28.04 },
  Egypt: { lat: 30.04, lng: 31.24 },
  Morocco: { lat: 33.97, lng: -6.85 },
  Nigeria: { lat: 9.06, lng: 7.49 },
  India: { lat: 28.61, lng: 77.21 },
  Thailand: { lat: 13.76, lng: 100.5 },
  Indonesia: { lat: -6.21, lng: 106.85 },
};

/**
 * Look up coordinates for a venue + country.
 * Falls back to country centroid if the stadium isn't mapped.
 */
export function getStadiumCoords(
  venueName: string | null,
  country: string
): Coords {
  if (venueName) {
    const key = venueName.toLowerCase().trim();
    if (STADIUMS[key]) return STADIUMS[key];

    // Try partial match (e.g., "Estadio Santiago Bernabéu" → "santiago bernabeu")
    for (const [stadiumKey, coords] of Object.entries(STADIUMS)) {
      if (key.includes(stadiumKey) || stadiumKey.includes(key)) {
        return coords;
      }
    }
  }

  // Country fallback — normalize country name for lookup
  const normalized = country.replace(/\s+/g, "-");
  return COUNTRY_CENTROIDS[normalized] ?? COUNTRY_CENTROIDS[country] ?? { lat: 0, lng: 0 };
}
