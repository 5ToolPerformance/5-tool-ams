import { default as useSWR } from "swr";

import { ApiService } from "@/lib/services/api";

export function useLessonById(id: string) {
  return useSWR(id ? ["lesson", id] : null, () =>
    ApiService.fetchLessonById(id)
  );
}
