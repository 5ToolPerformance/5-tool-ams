import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useCoachPlayerLessonCounts(id: string) {
  const { data, error, isLoading } = useSWR(
    id ? `/api/coaches/${id}/player-counts` : null,
    fetcher
  );

  return {
    lessonCounts: data?.counts ?? [],
    isLoading,
    error,
  };
}
