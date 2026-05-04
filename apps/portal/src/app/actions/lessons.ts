"use server";

import type { LessonFormValues } from "@/hooks/lessons/lessonForm.types";

function portalLessonWritesDisabled(): never {
  throw new Error("Lesson writes are not available in the client portal.");
}

export async function submitLesson(_values: LessonFormValues) {
  portalLessonWritesDisabled();
  return { lessonId: "", lessonPlayerByPlayerId: {} };
}

export async function updateLessonAction(
  _lessonId: string,
  _values: LessonFormValues
) {
  portalLessonWritesDisabled();
}
