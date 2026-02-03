import db from "@/db";
import {
  lesson,
  lessonMechanics,
  lessonPlayers,
  manualTsIso,
  pitchingLessonPlayers,
} from "@/db/schema";
import {
  type LessonWritePayload,
  PitchingLessonInsert,
  TsIsoInsert,
  isPitchingLessonSpecific,
} from "@/domain/lessons/types";
import { StrengthLessonSpecific } from "@/hooks/lessons/lessonForm.types";

export async function createLesson(
  payload: LessonWritePayload,
  coachId: string
) {
  return db.transaction(async (tx) => {
    /**
     * 1️⃣ Insert lesson row (LEGACY COMPATIBLEILATION)
     * playerId is required — use first participant
     */
    const [createdLesson] = await tx
      .insert(lesson)
      .values({
        coachId,
        lessonType: payload.lesson.type,
        lessonDate: payload.lesson.date,
        notes: payload.lesson.sharedNotes,
        playerId: payload.participants[0].playerId,
      })
      .returning();

    const lessonId = createdLesson.id;

    /**
     * 2️⃣ Insert lesson_players
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

    /**
     * Build lookup for lessonPlayerId by playerId
     */
    const lessonPlayerByPlayerId = Object.fromEntries(
      insertedLessonPlayers.map((lp) => [lp.playerId, lp.id])
    );

    /**
     * 3️⃣ Insert lesson_mechanics
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
     * 4️⃣ Insert lesson-type–specific data
     */
    if (payload.lesson.type === "pitching") {
      const pitchingRows: PitchingLessonInsert[] = [];

      for (const p of payload.participants) {
        if (!isPitchingLessonSpecific(p.lessonSpecific)) {
          continue;
        }

        const ls = p.lessonSpecific; // ✅ now correctly narrowed

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
    if (payload.lesson.type === "strength") {
      const tsIsoRows: TsIsoInsert[] = [];

      for (const p of payload.participants) {
        const lessonSpecific = p.lessonSpecific as
          | { strength?: StrengthLessonSpecific }
          | undefined;

        const tsIso = lessonSpecific?.strength?.tsIso;
        if (!tsIso) continue;

        tsIsoRows.push({
          lessonPlayerId: lessonPlayerByPlayerId[p.playerId],
          ...tsIso,
        });
      }

      if (tsIsoRows.length > 0) {
        await tx.insert(manualTsIso).values(tsIsoRows);
      }
    }

    return {
      lessonId,
      lessonPlayerByPlayerId,
    };
  });
}
