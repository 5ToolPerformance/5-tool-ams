"use server";

import { createLesson } from "@ams/application/lessons/createLesson";
import { resolveLessonRoutineSelections } from "@ams/application/lessons/routines";
import { updateLesson } from "@ams/application/lessons/updateLesson";
import { normalizeLessonForCreate } from "@ams/domain/lessons/normalize";
import type { LessonFormValues } from "@/hooks/lessons/lessonForm.types";
import { getAuthContext, requireRole } from "@/application/auth/auth-context";

export async function submitLesson(values: LessonFormValues) {
  // Normalize (domain logic)
  const payload = normalizeLessonForCreate(values);
  const ctx = await getAuthContext();
  requireRole(ctx, ["coach", "admin"]);

  const resolvedRoutines = await resolveLessonRoutineSelections({
    selectionsByPlayerId: Object.fromEntries(
      payload.participants.map((participant) => [
        participant.playerId,
        (participant.routineSelections ?? []).map((selection) => ({
          source: selection.source,
          routineId: selection.routineId,
        })),
      ])
    ),
    lessonType: payload.lesson.type,
    facilityId: ctx.facilityId,
  });

  for (const participant of payload.participants) {
    participant.routineSelections = resolvedRoutines
      .get(participant.playerId)
      ?.map((routine) => ({
        source: routine.source,
        routineId: routine.routineId,
        routineType: routine.routineType,
        title: routine.title,
        document: routine.document,
      }));
  }

  const { lessonId, lessonPlayerByPlayerId } = await createLesson(
    payload,
    ctx.userId
  );

  return { lessonId, lessonPlayerByPlayerId };
}

export async function updateLessonAction(
  lessonId: string,
  values: LessonFormValues
) {
  const payload = normalizeLessonForCreate(values);
  const ctx = await getAuthContext();
  requireRole(ctx, ["coach", "admin"]);

  const resolvedRoutines = await resolveLessonRoutineSelections({
    selectionsByPlayerId: Object.fromEntries(
      payload.participants.map((participant) => [
        participant.playerId,
        (participant.routineSelections ?? []).map((selection) => ({
          source: selection.source,
          routineId: selection.routineId,
        })),
      ])
    ),
    lessonType: payload.lesson.type,
    facilityId: ctx.facilityId,
  });

  for (const participant of payload.participants) {
    participant.routineSelections = resolvedRoutines
      .get(participant.playerId)
      ?.map((routine) => ({
        source: routine.source,
        routineId: routine.routineId,
        routineType: routine.routineType,
        title: routine.title,
        document: routine.document,
      }));
  }

  await updateLesson(lessonId, payload, ctx.userId);
}
