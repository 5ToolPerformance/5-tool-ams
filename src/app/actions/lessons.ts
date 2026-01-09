"use server";

import { createLesson } from "@/application/lessons/createLesson";
import { auth } from "@/auth";
import { normalizeLessonForCreate } from "@/domain/lessons/normalize";
import type { LessonFormValues } from "@/hooks/lessons/lessonForm.types";

export async function submitLesson(values: LessonFormValues) {
  // Normalize (domain logic)
  const payload = normalizeLessonForCreate(values);

  // TODO: replace with real auth
  const session = await auth();
  if (
    !session ||
    (session.user.role !== "coach" && session.user.role !== "admin")
  ) {
    throw new Error("Unauthorized");
  }
  const coachId = session.user.id!;

  const lessonId = await createLesson(payload, coachId);

  return { lessonId };
}
