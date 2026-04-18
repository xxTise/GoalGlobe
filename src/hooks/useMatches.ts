"use client";

import useSWR from "swr";
import { Match } from "@/lib/types";

interface MatchesResponse {
  matches: Match[];
  source: "api" | "mock" | "stale-cache" | "mock-fallback";
  cacheAge?: number;
  error?: string;
  apiCallsToday?: number;
}

const fetcher = async (url: string): Promise<MatchesResponse> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

export function useMatches() {
  const { data, error, isLoading, mutate } = useSWR<MatchesResponse>(
    "/api/matches",
    fetcher,
    {
      refreshInterval: 5 * 60_000, // 5 minutes — protects free tier quota
      revalidateOnFocus: false,    // don't burn calls on tab switch
      dedupingInterval: 30_000,
      errorRetryCount: 2,
      errorRetryInterval: 10_000,
    }
  );

  const isDemo = data?.source === "mock" || data?.source === "mock-fallback";

  return {
    matches: data?.matches ?? [],
    source: data?.source ?? null,
    isLoading,
    isDemo,
    error: error ?? (data?.error ? new Error(data.error) : null),
    apiCallsToday: data?.apiCallsToday,
    /** Force a fresh fetch — use sparingly on free tier */
    refresh: () => mutate(),
  };
}
