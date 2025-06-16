import { LessonCreateData } from "@/types/lessons";

export const postLesson = async (data: LessonCreateData) => {
  const response = await fetch("/api/lessons", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
};
