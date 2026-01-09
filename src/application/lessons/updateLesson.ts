import { InferInsertModel, eq } from "drizzle-orm";

import db from "@/db";
import {
  lesson,
  lessonMechanics,
  lessonPlayers,
  pitchingLessonPlayers,
} from "@/db/schema";
import type { LessonWritePayload } from "@/domain/lessons/types";
import { isPitchingLessonSpecific } from "@/domain/lessons/types";

type PitchingLessonPlayerInsert = InferInsertModel<
  typeof pitchingLessonPlayers
>;

export async function updateLesson(
  lessonId: string,
  payload: LessonWritePayload,
  coachId: string
) {
  return db.transaction(async (tx) => {
    /**
     * 1️⃣ Update lesson row (legacy-compatible)
     */
    await tx
      .update(lesson)
      .set({
        coachId: coachId,
        lessonType: payload.lesson.type,
        lessonDate: payload.lesson.date,
        notes: payload.lesson.sharedNotes,
        playerId: payload.participants[0].playerId,
      })
      .where(eq(lesson.id, lessonId));

    /**
     * 2️⃣ Delete existing child rows
     */
    await tx.delete(lessonPlayers).where(eq(lessonPlayers.lessonId, lessonId));

    await tx
      .delete(lessonMechanics)
      .where(eq(lessonMechanics.lessonId, lessonId));

    // lesson-type–specific deletes
    if (payload.lesson.type === "pitching") {
      await tx.delete(pitchingLessonPlayers).where(
        eq(
          pitchingLessonPlayers.lessonPlayerId,
          lessonId // explained below
        )
      );
    }

    /**
     * 3️⃣ Reinsert lesson_players
     */
    const insertedLessonPlayers = await tx
      .insert(lessonPlayers)
      .values(
        payload.participants.map((p) => ({
          lessonId,
          playerId: p.playerId,
          notes: p.notes,
        }))
      )
      .returning();

    const lessonPlayerByPlayerId = Object.fromEntries(
      insertedLessonPlayers.map((lp) => [lp.playerId, lp.id])
    );

    /**
     * 4️⃣ Reinsert lesson_mechanics
     */
    if (payload.mechanics.length > 0) {
      await tx.insert(lessonMechanics).values(
        payload.mechanics.map((m) => ({
          lessonId,
          playerId: m.playerId,
          mechanicId: m.mechanicId,
          notes: m.notes,
        }))
      );
    }

    /**
     * 5️⃣ Reinsert lesson-type–specific data
     */
    if (payload.lesson.type === "pitching") {
      const pitchingRows: PitchingLessonPlayerInsert[] = [];

      for (const p of payload.participants) {
        if (!isPitchingLessonSpecific(p.lessonSpecific)) {
          continue;
        }

        const ls = p.lessonSpecific;

        pitchingRows.push({
          lessonPlayerId: lessonPlayerByPlayerId[p.playerId],
          phase: ls.phase,
          pitchCount: ls.pitchCount,
          intentPercent: ls.intentPercent,
        });
      }

      if (pitchingRows.length > 0) {
        await tx.insert(pitchingLessonPlayers).values(pitchingRows);
      }
    }
  });
}
