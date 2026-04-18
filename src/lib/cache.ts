import { Match } from "./types";

/**
 * Simple in-memory cache with TTL.
 *
 * Works in dev (single process) and on Vercel serverless
 * (cache lives per-instance, but that's fine — worst case
 * we fetch twice on cold starts).
 *
 * Upgrade path: swap this for Upstash Redis when needed.
 */

interface CacheEntry {
  data: Match[];
  timestamp: number;
  source: "api" | "mock";
}

let cache: CacheEntry | null = null;

const DEFAULT_TTL_MS = 10 * 60_000; // 10 minutes — keeps free tier under 100 req/day

export function getCachedMatches(ttlMs = DEFAULT_TTL_MS): CacheEntry | null {
  if (!cache) return null;
  if (Date.now() - cache.timestamp > ttlMs) return null;
  return cache;
}

export function setCachedMatches(data: Match[], source: "api" | "mock"): void {
  cache = {
    data,
    timestamp: Date.now(),
    source,
  };
}

export function getCacheAge(): number | null {
  if (!cache) return null;
  return Date.now() - cache.timestamp;
}

export function clearCache(): void {
  cache = null;
}
