import { eq } from "drizzle-orm";

import db from "@/db";
import { lesson, lessonMechanics, lessonPlayers } from "@/db/schema";
import type { LessonReadModel } from "@/domain/lessons/types";
import type { LessonType } from "@/hooks/lessons/lessonForm.types";

export async function getLessonForEdit(
  lessonId: string
): Promise<LessonReadModel> {
  console.log("lessonId:", lessonId);
  /**
   * Fetch lesson row
   */
  const lessonRow = await db.query.lesson.findFirst({
    where: eq(lesson.id, lessonId),
  });

  if (!lessonRow) {
    throw new Error("Lesson not found");
  }

  /**
   * Fetch lesson_players (new system)
   */
  const lessonPlayerRows = await db.query.lessonPlayers.findMany({
    where: eq(lessonPlayers.lessonId, lessonId),
  });

  /**
   * Fetch lesson_mechanics
   */
  const mechanicRows = await db.query.lessonMechanics.findMany({
    where: eq(lessonMechanics.lessonId, lessonId),
  });

  /**
   * Resolve participants (legacy-safe)
   */
  let participants: LessonReadModel["participants"];

  if (lessonPlayerRows.length > 0) {
    // New system
    participants = lessonPlayerRows.map((lp) => ({
      playerId: lp.playerId,
      notes: lp.notes ?? undefined,
    }));
  } else {
    // Legacy system fallback
    participants = [
      {
        playerId: lessonRow.playerId,
        notes: lessonRow.notes ?? undefined,
      },
    ];
  }

  /**
   * Attach lesson-type–specific data
   */
  if (lessonRow.lessonType === "pitching") {
    const pitchingRows = await db.query.pitchingLessonPlayers.findMany({
      where: (plp, { inArray }) =>
        inArray(
          plp.lessonPlayerId,
          lessonPlayerRows.map((lp) => lp.id)
        ),
    });

    const pitchingByLessonPlayerId = Object.fromEntries(
      pitchingRows.map((row) => [row.lessonPlayerId, row])
    );

    for (const p of participants) {
      const lp = lessonPlayerRows.find((row) => row.playerId === p.playerId);

      if (!lp) continue;

      const pitching = pitchingByLessonPlayerId[lp.id];
      if (!pitching) continue;

      p.lessonSpecific = {
        phase: pitching.phase,
        pitchCount: pitching.pitchCount ?? undefined,
        intentPercent: pitching.intentPercent ?? undefined,
      };
    }
  }

  if (lessonRow.lessonType === "strength") {
    const tsIsoRows = await db.query.manualTsIso.findMany({
      where: (t, { inArray }) =>
        inArray(
          t.lessonPlayerId,
          lessonPlayerRows.map((lp) => lp.id)
        ),
    });

    const tsIsoByLessonPlayerId = Object.fromEntries(
      tsIsoRows.map((row) => [row.lessonPlayerId, row])
    );

    for (const p of participants) {
      const lp = lessonPlayerRows.find((row) => row.playerId === p.playerId);
      if (!lp) continue;

      const tsIso = tsIsoByLessonPlayerId[lp.id];
      if (!tsIso) continue;

      p.lessonSpecific = {
        strength: {
          tsIso: {
            shoulderErL: tsIso.shoulderErL ?? undefined,
            shoulderErR: tsIso.shoulderErR ?? undefined,
            shoulderErTtpfL: tsIso.shoulderErTtpfL ?? undefined,
            shoulderErTtpfR: tsIso.shoulderErTtpfR ?? undefined,
            shoulderIrL: tsIso.shoulderIrL ?? undefined,
            shoulderIrR: tsIso.shoulderIrR ?? undefined,
            shoulderIrTtpfL: tsIso.shoulderIrTtpfL ?? undefined,
            shoulderIrTtpfR: tsIso.shoulderIrTtpfR ?? undefined,
            shoulderRotL: tsIso.shoulderRotL ?? undefined,
            shoulderRotR: tsIso.shoulderRotR ?? undefined,
            shoulderRotRfdL: tsIso.shoulderRotRfdL ?? undefined,
            shoulderRotRfdR: tsIso.shoulderRotRfdR ?? undefined,
            hipRotL: tsIso.hipRotL ?? undefined,
            hipRotR: tsIso.hipRotR ?? undefined,
            hipRotRfdL: tsIso.hipRotRfdL ?? undefined,
            hipRotRfdR: tsIso.hipRotRfdR ?? undefined,
          },
        },
      };
    }
  }

  /**
   * Return unified read model
   */
  return {
    lesson: {
      id: lessonRow.id,
      date: lessonRow.lessonDate,
      type: lessonRow.lessonType as LessonType,
      sharedNotes: lessonRow.notes ?? undefined,
    },

    participants,

    mechanics: mechanicRows.map((m) => ({
      playerId: m.playerId,
      mechanicId: m.mechanicId,
      notes: m.notes ?? undefined,
    })),
  };
}
