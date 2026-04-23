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

export function useCoaches() {
  const { data, error, isLoading } = useSWR("/api/coaches", fetcher);

  return {
    coaches: data?.data ?? [],
    isLoading,
    error,
  };
}

export function useCoachById(coachId?: string | null) {
  const { data, isLoading } = useSWR(
    coachId ? `/api/users/${coachId}` : null,
    fetcher
  );

  return {
    coach: data?.data ?? null,
    isLoading,
  };
}
