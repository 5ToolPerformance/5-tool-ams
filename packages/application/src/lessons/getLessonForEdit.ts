import { eq } from "drizzle-orm";

import db from "@ams/db";
import {
  lesson,
  lessonMechanics,
  lessonPlayers,
} from "@ams/db/schema";
import type { LessonReadModel } from "@ams/domain/lessons/types";
import type { RoutineDocumentV1 } from "@ams/domain/routines/types";
import type { LessonType } from "@ams/contracts/types/lesson-form";

export async function getLessonForEdit(
  lessonId: string
): Promise<LessonReadModel> {
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

  const drillRows = lessonPlayerRows.length
    ? await db.query.lessonDrills.findMany({
        where: (ld, { inArray }) =>
          inArray(
            ld.lessonPlayerId,
            lessonPlayerRows.map((item) => item.id)
          ),
      })
    : [];

  const routineRows = lessonPlayerRows.length
    ? await db.query.lessonPlayerRoutines.findMany({
        where: (lpr, { inArray }) =>
          inArray(
            lpr.lessonPlayerId,
            lessonPlayerRows.map((item) => item.id)
          ),
      })
    : [];

  /**
   * Resolve participants (legacy-safe)
   */
  let participants: LessonReadModel["participants"];

  if (lessonPlayerRows.length > 0) {
    // New system
    participants = lessonPlayerRows.map((lp) => ({
      playerId: lp.playerId,
      lessonPlayerId: lp.id,
      notes: lp.notes ?? undefined,
      routineSelections: routineRows
        .filter((row) => row.lessonPlayerId === lp.id)
        .map((row) => ({
          source: row.sourceRoutineSource,
          routineId: row.sourceRoutineId,
          routineType: row.sourceRoutineType as "partial_lesson" | "full_lesson",
          title: row.sourceRoutineTitle,
          document: row.sourceRoutineDocument as RoutineDocumentV1,
        })),
    }));
  } else {
    // Legacy system fallback
    participants = [
      {
        playerId: lessonRow.playerId,
        lessonPlayerId: undefined,
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
        pitching: {
          summary: pitching.summary ?? undefined,
          focus: pitching.focus ?? undefined,
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
    drills: drillRows.map((d) => {
      const lessonPlayer = lessonPlayerRows.find((lp) => lp.id === d.lessonPlayerId);

      if (!lessonPlayer) {
        throw new Error("Lesson drill is missing its lesson player.");
      }

      return {
        playerId: lessonPlayer.playerId,
        drillId: d.drillId,
        notes: d.notes ?? undefined,
      };
    }),
  };
}
