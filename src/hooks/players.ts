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
