import { InferInsertModel, eq, inArray } from "drizzle-orm";

import db from "@/db";
import {
  attachments,
  lesson,
  lessonMechanics,
  lessonPlayers,
  manualTsIso,
  pitchingLessonPlayers,
} from "@/db/schema";
import type { LessonWritePayload, TsIsoInsert } from "@/domain/lessons/types";
import { isPitchingLessonSpecific } from "@/domain/lessons/types";
import { StrengthLessonSpecific } from "@/hooks/lessons/lessonForm.types";

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
     * 0️⃣ Fetch existing lesson_players FIRST
     */
    const existingLessonPlayers = await tx.query.lessonPlayers.findMany({
      where: eq(lessonPlayers.lessonId, lessonId),
    });

    const existingLessonPlayerIds = existingLessonPlayers.map((lp) => lp.id);
    const existingByPlayerId = Object.fromEntries(
      existingLessonPlayers.map((lp) => [lp.playerId, lp])
    );
    const desiredPlayerIds = payload.participants.map((p) => p.playerId);

    /**
     * 1️⃣ Update lesson row (legacy-compatible)
     */
    await tx
      .update(lesson)
      .set({
        coachId,
        lessonType: payload.lesson.type,
        lessonDate: payload.lesson.date,
        notes: payload.lesson.sharedNotes,
        playerId: payload.participants[0].playerId,
      })
      .where(eq(lesson.id, lessonId));

    /**
     * 2️⃣ Delete lesson-type–specific child rows (USING OLD IDs)
     */
    if (existingLessonPlayerIds.length > 0) {
      if (payload.lesson.type === "pitching") {
        await tx
          .delete(pitchingLessonPlayers)
          .where(
            inArray(
              pitchingLessonPlayers.lessonPlayerId,
              existingLessonPlayerIds
            )
          );
      }

      if (payload.lesson.type === "strength") {
        await tx
          .delete(manualTsIso)
          .where(inArray(manualTsIso.lessonPlayerId, existingLessonPlayerIds));
      }
    }

    /**
     * 3️⃣ Update lesson_players without deleting attachments
     */
    const toRemove = existingLessonPlayers.filter(
      (lp) => !desiredPlayerIds.includes(lp.playerId)
    );
    const toInsert = payload.participants.filter(
      (p) => !existingByPlayerId[p.playerId]
    );

    // Update notes for existing players
    for (const participant of payload.participants) {
      const existing = existingByPlayerId[participant.playerId];
      if (!existing) continue;

      if (existing.notes !== participant.notes) {
        await tx
          .update(lessonPlayers)
          .set({ notes: participant.notes })
          .where(eq(lessonPlayers.id, existing.id));
      }
    }

    // Detach attachments before removing lesson players
    if (toRemove.length > 0) {
      const removedIds = toRemove.map((lp) => lp.id);
      await tx
        .update(attachments)
        .set({ lessonPlayerId: null })
        .where(inArray(attachments.lessonPlayerId, removedIds));

      await tx
        .delete(lessonPlayers)
        .where(inArray(lessonPlayers.id, removedIds));
    }

    // Insert new lesson players
    const insertedLessonPlayers =
      toInsert.length > 0
        ? await tx
            .insert(lessonPlayers)
            .values(
              toInsert.map((p) => ({
                lessonId,
                playerId: p.playerId,
                notes: p.notes,
              }))
            )
            .returning()
        : [];

    const lessonPlayerByPlayerId = {
      ...Object.fromEntries(
        existingLessonPlayers
          .filter((lp) => desiredPlayerIds.includes(lp.playerId))
          .map((lp) => [lp.playerId, lp.id])
      ),
      ...Object.fromEntries(
        insertedLessonPlayers.map((lp) => [lp.playerId, lp.id])
      ),
    };

    /**
     * 4️⃣ Reinsert lesson_mechanics
     */
    await tx
      .delete(lessonMechanics)
      .where(eq(lessonMechanics.lessonId, lessonId));

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
        if (!isPitchingLessonSpecific(p.lessonSpecific)) continue;

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
  });
}
