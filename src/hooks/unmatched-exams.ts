import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useUnmatchedExams() {
  const { data, error, isLoading } = useSWR(
    "/api/admin/unmatched-exams",
    fetcher
  );

  return {
    exams: data?.unmatched ?? [],
    isLoading,
    error,
  };
}

export function useUnmatchedPlayers() {
  const { data, error, isLoading } = useSWR(
    "/api/admin/unmatched-exams/unique-players",
    fetcher
  );

  return {
    players: data?.players ?? [],
    isLoading,
    error,
  };
}
