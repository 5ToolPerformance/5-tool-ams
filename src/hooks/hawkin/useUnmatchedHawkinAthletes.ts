import useSWR from "swr";

import { fetcher } from "@/hooks/fetcher";

export function useUnmatchedHawkinAthletes() {
  const { data, error, mutate } = useSWR(
    "/api/admin/hawkin/unlinked-athletes",
    fetcher
  );

  return {
    athletes: data?.athletes ?? [],
    isLoading: !data && !error,
    error,
    refresh: mutate,
  };
}
