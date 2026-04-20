"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Follow system — tracks teams, leagues, and countries the user follows.
 *
 * localStorage now, database later. The shape is designed to serialize
 * cleanly to a user profile row when auth is added.
 */

export type FollowableType = "team" | "league";

export interface FollowItem {
  type: FollowableType;
  id: string; // team name (stable enough for now) or leagueId as string
  name: string;
  logo?: string;
}

interface FollowingState {
  items: FollowItem[];
  onboarded: boolean;
}

const STORAGE_KEY = "goalglobe-following";

function load(): FollowingState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // Ignore
  }
  return { items: [], onboarded: false };
}

function save(state: FollowingState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore quota
  }
}

export function useFollowing() {
  const [state, setState] = useState<FollowingState>({
    items: [],
    onboarded: false,
  });

  // Load on mount
  useEffect(() => {
    setState(load());
  }, []);

  const persist = useCallback((next: FollowingState) => {
    setState(next);
    save(next);
  }, []);

  const follow = useCallback(
    (item: FollowItem) => {
      const exists = state.items.some(
        (i) => i.type === item.type && i.id === item.id
      );
      if (exists) return;
      persist({ ...state, items: [...state.items, item] });
    },
    [state, persist]
  );

  const unfollow = useCallback(
    (type: FollowableType, id: string) => {
      persist({
        ...state,
        items: state.items.filter((i) => !(i.type === type && i.id === id)),
      });
    },
    [state, persist]
  );

  const isFollowing = useCallback(
    (type: FollowableType, id: string) =>
      state.items.some((i) => i.type === type && i.id === id),
    [state.items]
  );

  const completeOnboarding = useCallback(() => {
    persist({ ...state, onboarded: true });
  }, [state, persist]);

  const followedTeams = state.items.filter((i) => i.type === "team");
  const followedLeagues = state.items.filter((i) => i.type === "league");

  /**
   * Check if a match involves any followed entity.
   */
  const isMatchRelevant = useCallback(
    (match: {
      homeTeam: string;
      awayTeam: string;
      leagueId: number;
    }): boolean => {
      for (const item of state.items) {
        if (item.type === "team") {
          if (item.id === match.homeTeam || item.id === match.awayTeam)
            return true;
        }
        if (item.type === "league") {
          if (item.id === String(match.leagueId)) return true;
        }
      }
      return false;
    },
    [state.items]
  );

  return {
    items: state.items,
    followedTeams,
    followedLeagues,
    onboarded: state.onboarded,
    follow,
    unfollow,
    isFollowing,
    isMatchRelevant,
    completeOnboarding,
    totalCount: state.items.length,
  };
}
