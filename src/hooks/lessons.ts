import { default as useSWR } from "swr";

import { ApiService } from "@/lib/services/api";

/**
 * Fetches a specific lesson from the API.
 * @param id - The ID of the lesson to fetch
 * @returns the lesson with the specified ID
 * @throws Error if there is an issue with the API request
 */
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

/**
 * Fetches all lessons from the API.
 * @returns An array of Lesson objects.
 * @throws Error if there is an issue with the API request.
 */
export function useAllLessons() {
  return useSWR("lessons", ApiService.fetchAllLessons);
}

/**
 * Fetches assessments for a specific lesson from the API.
 * @param lessonId - The ID of the lesson to fetch assessments for
 * @returns the assessments for the specified lesson
 * @throws Error if there is an issue with the API request
 */
export function useAssessmentsByLessonId(lessonId: string) {
  return useSWR(lessonId ? ["assessments", lessonId] : null, () =>
    ApiService.fetchAssessmentsByLessonId(lessonId)
  );
}
