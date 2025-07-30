import { ApiResponse } from "@/types/api";
import { LessonCreateData } from "@/types/lessons";

export const postLesson = async (data: LessonCreateData) => {
  const response = await fetch("/api/lessons", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const result: ApiResponse<LessonCreateData> = await response.json();

  if (!result.success) {
    throw new Error(result.error || "Failed to create lesson");
  }

  return result.data;
};
