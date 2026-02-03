"use server";

import { createLesson } from "@/application/lessons/createLesson";
import { updateLesson } from "@/application/lessons/updateLesson";
import { auth } from "@/auth";
import { normalizeLessonForCreate } from "@/domain/lessons/normalize";
import type { LessonFormValues } from "@/hooks/lessons/lessonForm.types";

export async function submitLesson(values: LessonFormValues) {
  // Normalize (domain logic)
  const payload = normalizeLessonForCreate(values);

  const session = await auth();
  if (
    !session ||
    (session.user.role !== "coach" && session.user.role !== "admin")
  ) {
    throw new Error("Unauthorized");
  }
  const coachId = session.user.id!;

  const { lessonId, lessonPlayerByPlayerId } = await createLesson(
    payload,
    coachId
  );

  return { lessonId, lessonPlayerByPlayerId };
}

export async function updateLessonAction(
  lessonId: string,
  values: LessonFormValues
) {
  const payload = normalizeLessonForCreate(values);

  const session = await auth();
  if (
    !session ||
    (session.user.role !== "coach" && session.user.role !== "admin")
  ) {
    throw new Error("Unauthorized");
  }
  const coachId = session.user.id!;

  await updateLesson(lessonId, payload, coachId);
}
