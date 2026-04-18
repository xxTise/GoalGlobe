"use client";

import { Continent, CONTINENT_CONFIG } from "@/lib/continents";

interface ContinentPickerProps {
  active: Continent;
  onChange: (continent: Continent) => void;
  matchCounts: Record<Continent, number>;
}

const CONTINENTS: Continent[] = [
  "all",
  "europe",
  "africa",
  "asia",
  "south-america",
  "north-america",
  "oceania",
];

export function ContinentPicker({
  active,
  onChange,
  matchCounts,
}: ContinentPickerProps) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-auto">
      <div className="flex items-center gap-1 px-1.5 py-1.5 rounded-full bg-[#0c0c18]/80 backdrop-blur-2xl border border-white/[0.06] shadow-2xl shadow-black/50">
        {CONTINENTS.map((continent) => {
          const config = CONTINENT_CONFIG[continent];
          const count = matchCounts[continent] ?? 0;
          const isActive = active === continent;

          return (
            <button
              key={continent}
              onClick={() => onChange(continent)}
              className={`relative px-3 sm:px-4 py-2 rounded-full text-[11px] sm:text-xs font-medium transition-all duration-300 cursor-pointer whitespace-nowrap ${
                isActive
                  ? "bg-white/[0.12] text-white shadow-lg shadow-white/5"
                  : "text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.04]"
              }`}
            >
              {config.label}
              {continent !== "all" && count > 0 && (
                <span
                  className={`ml-1 text-[9px] tabular-nums ${
                    isActive ? "text-zinc-400" : "text-zinc-600"
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
