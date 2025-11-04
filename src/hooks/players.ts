import useSWR from "swr";

import { ApiService } from "@/lib/services/api";

export function useAllPlayers() {
  return useSWR("/api/players", ApiService.fetchAllPlayers);
}

export function useUserById(id: string) {
  return useSWR(id ? `/api/users/${id}` : null, () =>
    ApiService.fetchUserById(id)
  );
}

export function useMotorPreferences(id: string) {
  return useSWR(id ? `/api/players/${id}/motor-preferences` : null, () =>
    ApiService.fetchMotorPreferenceById(id)
  );
}

export function usePlayerWithInformationById(id: string) {
  return useSWR(id ? `/api/players/${id}` : null, () =>
    ApiService.fetchPlayerWithInformationById(id)
  );
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

/**
 * Fetches all players from the API.
 * @returns An array of Player objects.
 */
export function usePlayers() {
  const { data, error, isLoading } = useSWR("/api/players", fetcher);

  return {
    players: data?.data ?? [],
    isLoading,
    error,
  };
}

/**
 * Fetches a player by ID from the API.
 * @param id The ID of the player to fetch.
 * @returns The Player object if found, otherwise null.
 */
export function usePlayerById(id: string) {
  const { data, error, isLoading } = useSWR(
    id ? `/api/players/${id}` : null,
    fetcher
  );

  return {
    player: data?.data ?? null,
    isLoading,
    error,
  };
}

/**
 * Fetches a player's motor preferences by player ID from the API.
 * @param id The ID of the player to fetch.
 * @returns The MotorPreferences object if found, otherwise null.
 */
export function useMotorPreferences2(id: string) {
  const { data, error, isLoading } = useSWR(
    id ? `/api/players/${id}/motor-preferences` : null,
    fetcher
  );

  return {
    motorPreferences: data?.data ?? null,
    isLoading,
    error,
  };
}

export function useCoachSubmissionMetrics() {
  const { data, error, isLoading } = useSWR(
    "/api/coaches/submission-metrics",
    fetcher
  );

  return {
    avgDaysToSubmit: data?.data?.avgDaysToSubmit ?? null,
    minDaysToSubmit: data?.data?.minDaysToSubmit ?? null,
    maxDaysToSubmit: data?.data?.maxDaysToSubmit ?? null,
    isLoading,
    error,
  };
}
