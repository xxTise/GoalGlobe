"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "goalglobe-favorites";

export function useFavorites() {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setFavorites(new Set(JSON.parse(stored)));
      }
    } catch {
      // Ignore parse errors
    }
  }, []);

  // Persist on change
  const persist = useCallback((next: Set<string>) => {
    setFavorites(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
    } catch {
      // Ignore quota errors
    }
  }, []);

  const toggle = useCallback(
    (matchId: string) => {
      const next = new Set(favorites);
      if (next.has(matchId)) {
        next.delete(matchId);
      } else {
        next.add(matchId);
      }
      persist(next);
    },
    [favorites, persist]
  );

  const isFavorite = useCallback(
    (matchId: string) => favorites.has(matchId),
    [favorites]
  );

  return { favorites, toggle, isFavorite };
}
