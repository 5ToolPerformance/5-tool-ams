import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function usePlayerInjuries(playerId: string) {
  const { data, error, isLoading, mutate } = useSWR(
    `/api/players/${playerId}/injuries`,
    fetcher
  );

  return {
    injuries: data ?? [],
    isLoading,
    error,
    refresh: mutate,
  };
}
