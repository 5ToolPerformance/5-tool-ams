import type { LessonFormValues } from "./form";
import { LessonWritePayload } from "./types";

export function normalizeLessonForCreate(
  values: LessonFormValues
): LessonWritePayload {
  if (!values.lessonType) {
    throw new Error("Lesson type is required");
  }

  if (!values.lessonDate) {
    throw new Error("Lesson date is required");
  }

  if (values.selectedPlayerIds.length === 0) {
    throw new Error("At least one player is required");
  }

  const lesson = {
    date: values.lessonDate,
    type: values.lessonType,
    sharedNotes:
      values.selectedPlayerIds.length === 1
        ? ""
        : values.sharedNotes?.general || undefined,
  };

  const participants = values.selectedPlayerIds.map((playerId) => {
    const player = values.players[playerId] ?? {};
    const routineSelections = player.routineSelections ?? [];
    const fullRoutineCount = routineSelections.filter(
      (selection) => selection.routineType === "full_lesson"
    ).length;
    const hasPartialRoutine = routineSelections.some(
      (selection) => selection.routineType === "partial_lesson"
    );

    if (fullRoutineCount > 1) {
      throw new Error("Only one full lesson routine can be applied per player");
    }

    if (fullRoutineCount > 0 && hasPartialRoutine) {
      throw new Error(
        "Full lesson and partial lesson routines cannot be mixed for one player"
      );
    }

    return {
      playerId,
      notes: player.notes || undefined,
      routineSelections: routineSelections.length
        ? routineSelections.map((selection) => ({
            source: selection.source,
            routineId: selection.routineId,
            routineType: selection.routineType,
            title: selection.title,
          }))
        : undefined,
      lessonSpecific: player.lessonSpecific ?? undefined,
      fatigueReport: player.fatigueReport ?? undefined,
    };
  });

  const mechanics: LessonWritePayload["mechanics"] = [];
  const drills: LessonWritePayload["drills"] = [];

  for (const playerId of values.selectedPlayerIds) {
    const mechanicMap = values.players[playerId]?.mechanics ?? {};

    for (const [mechanicId, entry] of Object.entries(mechanicMap) as Array<
      [string, { notes?: string }]
    >) {
      mechanics.push({
        playerId,
        mechanicId,
        notes: entry.notes || undefined,
      });
    }
  }

  for (const playerId of values.selectedPlayerIds) {
    const drillMap = values.players[playerId]?.drills ?? {};

    for (const [drillId, entry] of Object.entries(drillMap) as Array<
      [string, { notes?: string }]
    >) {
      drills.push({
        playerId,
        drillId,
        notes: entry.notes || undefined,
      });
    }
  }

  return {
    lesson,
    participants,
    mechanics,
    drills,
  };
}
