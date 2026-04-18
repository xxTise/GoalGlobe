"use client";

import useSWR from "swr";
import { MatchDetail } from "@/lib/types";

interface DetailResponse {
  detail: MatchDetail | null;
  source: string;
  error?: string;
}

const fetcher = async (url: string): Promise<DetailResponse> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

/**
 * Fetches detailed match data (stats + lineups) when a match is selected.
 * Pass null to skip fetching (no match selected).
 */
export function useMatchDetail(matchId: string | null) {
  const { data, error, isLoading } = useSWR<DetailResponse>(
    matchId ? `/api/matches/${matchId}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60_000,
      errorRetryCount: 1,
    }
  );

  return {
    detail: data?.detail ?? null,
    isLoading,
    error: error ?? (data?.error ? new Error(data.error) : null),
  };
}
