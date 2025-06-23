import { ApiService } from "@/lib/services/api";
import useSWR from "swr";


export function useAllPlayers() {
  return useSWR("players", ApiService.fetchAllPlayers);
}

export function useUserById(id: string) {
  return useSWR(id ? ["user", id] : null, () => ApiService.fetchUserById(id));
}

export function useMotorPreferences(id: string) {
  return useSWR(id ? ["motor-preference", id] : null, () => ApiService.fetchMotorPreferenceById(id));
}

export function usePlayerWithInformationById(id: string) {
  return useSWR(id ? ["player-information", id] : null, () => ApiService.fetchPlayerWithInformationById(id));
}