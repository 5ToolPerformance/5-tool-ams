import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useRecentArmScore(id: string) {
  const { data, error, isLoading } = useSWR(
    id ? `/api/players/${id}/armcare/recent-score` : null,
    fetcher
  );

  return {
    recentScore: data?.data ?? [],
    isLoading,
    error,
  };
}
