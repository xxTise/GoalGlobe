"use client";

import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  forwardRef,
} from "react";
import Map, { MapRef, NavigationControl } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { Match } from "@/lib/types";
import { Continent, getContinent } from "@/lib/continents";
import { MatchMarker } from "./MatchMarker";
import { MatchPanel } from "../MatchPanel/MatchPanel";
import { Starfield } from "./Starfield";

const MAP_STYLE =
  "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";

const CONTINENT_ZOOM: Record<
  Continent,
  { center: [number, number]; zoom: number }
> = {
  all: { center: [10, 20], zoom: 1.5 },
  europe: { center: [10, 50], zoom: 3.5 },
  "south-america": { center: [-55, -15], zoom: 3 },
  "north-america": { center: [-100, 40], zoom: 3 },
  africa: { center: [20, 5], zoom: 3 },
  asia: { center: [90, 35], zoom: 3 },
  oceania: { center: [140, -25], zoom: 3.5 },
};

const ROTATION_SPEED = 0.03;
const IDLE_RESUME_DELAY = 4000;

interface GlobeMapProps {
  matches: Match[];
  continent: Continent;
  favorites: Set<string>;
  onToggleFavorite: (matchId: string) => void;
}

export interface GlobeMapHandle {
  flyToMatch: (match: Match) => void;
}

export const GlobeMap = forwardRef<GlobeMapHandle, GlobeMapProps>(
  function GlobeMap({ matches, continent, favorites, onToggleFavorite }, ref) {
    const mapRef = useRef<MapRef>(null);
    const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
    const prevContinentRef = useRef<Continent>(continent);

    // Auto-rotation state
    const rotatingRef = useRef(true);
    const rafRef = useRef<number>(0);
    const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Filter by continent
    const filteredMatches = useMemo(() => {
      if (continent === "all") return matches;
      return matches.filter((m) => getContinent(m.country) === continent);
    }, [matches, continent]);

    // Fly to continent when it changes
    if (continent !== prevContinentRef.current) {
      prevContinentRef.current = continent;
      const target = CONTINENT_ZOOM[continent];
      rotatingRef.current = false;
      mapRef.current?.flyTo({
        center: target.center,
        zoom: target.zoom,
        duration: 1800,
        essential: true,
      });
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
      if (continent === "all") {
        resumeTimerRef.current = setTimeout(() => {
          rotatingRef.current = true;
        }, 2200);
      }
    }

    // Auto-rotation loop
    useEffect(() => {
      const map = mapRef.current?.getMap();
      if (!map) return;

      const rotate = () => {
        if (rotatingRef.current && map.getZoom() < 3) {
          const center = map.getCenter();
          map.setCenter([center.lng + ROTATION_SPEED, center.lat]);
        }
        rafRef.current = requestAnimationFrame(rotate);
      };

      rafRef.current = requestAnimationFrame(rotate);
      return () => cancelAnimationFrame(rafRef.current);
    }, []);

    // Pause rotation on user interaction, resume after idle
    const pauseRotation = useCallback(() => {
      rotatingRef.current = false;
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = setTimeout(() => {
        if (!selectedMatch && prevContinentRef.current === "all") {
          rotatingRef.current = true;
        }
      }, IDLE_RESUME_DELAY);
    }, [selectedMatch]);

    // Fly to match
    const flyToMatch = useCallback((match: Match) => {
      setSelectedMatch(match);
      rotatingRef.current = false;
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
      mapRef.current?.flyTo({
        center: [match.longitude, match.latitude],
        zoom: 14,
        duration: 2000,
        essential: true,
      });
    }, []);

    useImperativeHandle(ref, () => ({ flyToMatch }), [flyToMatch]);

    const handleMarkerClick = useCallback(
      (match: Match) => flyToMatch(match),
      [flyToMatch]
    );

    const handleClose = useCallback(() => {
      setSelectedMatch(null);
      const target = CONTINENT_ZOOM[continent];
      mapRef.current?.flyTo({
        center: target.center,
        zoom: target.zoom,
        duration: 1500,
        essential: true,
      });
      if (continent === "all") {
        if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
        resumeTimerRef.current = setTimeout(() => {
          rotatingRef.current = true;
        }, 2000);
      }
    }, [continent]);

    // Configure atmosphere on map load
    const handleMapLoad = useCallback(() => {
      const map = mapRef.current?.getMap() as any; // eslint-disable-line @typescript-eslint/no-explicit-any
      if (!map || typeof map.setFog !== "function") return;

      try {
        map.setFog({
          color: "rgba(6, 6, 15, 1)",
          "high-color": "rgba(20, 30, 60, 1)",
          "horizon-blend": 0.04,
          "space-color": "rgba(4, 4, 12, 0)",
          "star-intensity": 0.0,
        });
      } catch {
        // Fog API may not be available in all MapLibre versions
      }
    }, []);

    return (
      <div className="relative h-full w-full">
        <Starfield />

        <div className="relative z-[1] h-full w-full">
          <Map
            ref={mapRef}
            initialViewState={{
              longitude: 10,
              latitude: 20,
              zoom: 1.5,
            }}
            mapStyle={MAP_STYLE}
            projection="globe"
            style={{ width: "100%", height: "100%" }}
            attributionControl={false}
            maxPitch={60}
            onLoad={handleMapLoad}
            onMouseDown={pauseRotation}
            onTouchStart={pauseRotation}
            onWheel={pauseRotation}
          >
            <NavigationControl position="bottom-right" showCompass={false} />

            {filteredMatches.map((match) => (
              <MatchMarker
                key={match.id}
                match={match}
                isSelected={selectedMatch?.id === match.id}
                onClick={handleMarkerClick}
              />
            ))}
          </Map>
        </div>

        <MatchPanel
          match={selectedMatch}
          onClose={handleClose}
          isFavorite={selectedMatch ? favorites.has(selectedMatch.id) : false}
          onToggleFavorite={onToggleFavorite}
        />
      </div>
    );
  }
);
