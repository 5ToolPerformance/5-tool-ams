"use client";

import useSWR from "swr";

import type { PlayerDevelopmentPageBootstrapData } from "@/application/players/development/loadPlayerDevelopmentPageData";

import { fetcher } from "./fetcher";

function buildKey(playerId: string, discipline: string | null) {
  const params = new URLSearchParams();
  if (discipline) {
    params.set("discipline", discipline);
  }

  const query = params.toString();
  return `/api/players/${playerId}/development${query ? `?${query}` : ""}`;
}

export function usePlayerDevelopmentPageData(
  playerId: string,
  discipline: string | null,
  fallbackData: PlayerDevelopmentPageBootstrapData
) {
  const key = buildKey(playerId, discipline);
  const swr = useSWR<PlayerDevelopmentPageBootstrapData>(key, fetcher, {
    fallbackData,
    revalidateOnFocus: false,
    revalidateIfStale: false,
  });

  return {
    ...swr,
    refresh: async () => swr.mutate(),
  };
}
