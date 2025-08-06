import { default as useSWR } from "swr";

import { ApiService } from "@/lib/services/api";

export function useLessonById(id: string) {
  return useSWR(id ? ["lesson", id] : null, () =>
    ApiService.fetchLessonById(id)
  );
}

/**
 * Fetches lessons for a specific coach from the API.
 * @param coachId - The ID of the coach to fetch lessons for
 * @returns the lessons for the specified coach
 * @throws Error if there is an issue with the API request
 */
export function useLessonsByCoachId(coachId: string) {
  return useSWR(coachId ? ["lessons", coachId] : null, () =>
    ApiService.fetchLessonsByCoachId(coachId)
  );
}
