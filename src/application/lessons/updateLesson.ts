import { InferInsertModel, eq, inArray } from "drizzle-orm";

import db from "@/db";
import {
  attachments,
  lesson,
  lessonDrills,
  lessonMechanics,
  lessonPlayerFatigue,
  lessonPlayerRoutines,
  lessonPlayers,
  manualTsIso,
  pitchingLessonPlayers,
} from "@/db/schema";
import type {
  FatigueReportInsert,
  LessonWritePayload,
  TsIsoInsert,
} from "@/domain/lessons/types";
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

      await tx
        .delete(lessonPlayerFatigue)
        .where(
          inArray(lessonPlayerFatigue.lessonPlayerId, existingLessonPlayerIds)
        );

      await tx
        .delete(lessonDrills)
        .where(inArray(lessonDrills.lessonPlayerId, existingLessonPlayerIds));

      await tx
        .delete(lessonPlayerRoutines)
        .where(inArray(lessonPlayerRoutines.lessonPlayerId, existingLessonPlayerIds));
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

    const routineRows = payload.participants.flatMap((participant) =>
      (participant.routineSelections ?? []).map((selection) => ({
        lessonPlayerId: lessonPlayerByPlayerId[participant.playerId],
        sourceRoutineId: selection.routineId,
        sourceRoutineSource: selection.source,
        sourceRoutineType: selection.routineType,
        sourceRoutineTitle: selection.title,
        sourceRoutineDocument: selection.document,
      }))
    );

    if (routineRows.length > 0) {
      await tx.insert(lessonPlayerRoutines).values(routineRows);
    }

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
        const lessonSpecific = p.lessonSpecific as
          | { pitching?: unknown }
          | undefined;
        const pitching = lessonSpecific?.pitching;

        if (!isPitchingLessonSpecific(pitching)) continue;

        const ls = pitching;

        pitchingRows.push({
          lessonPlayerId: lessonPlayerByPlayerId[p.playerId],
          summary: ls.summary,
          focus: ls.focus,
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

    /**
     * 6 Insert lesson_drills
     */
    if (payload.drills.length > 0) {
      await tx.insert(lessonDrills).values(
        payload.drills.map((d) => ({
          lessonPlayerId: lessonPlayerByPlayerId[d.playerId],
          drillId: d.drillId,
          notes: d.notes,
        }))
      );
    }

    /**
     * 7 Insert fatigue report (if provided)
     */
    if (payload.participants.some((p) => p.fatigueReport)) {
      const fatigueRows: FatigueReportInsert[] = [];

      for (const p of payload.participants) {
        if (
          !p.fatigueReport ||
          p.fatigueReport.report === "none" ||
          !p.fatigueReport.bodyPartId
        )
          continue;

        fatigueRows.push({
          lessonPlayerId: lessonPlayerByPlayerId[p.playerId],
          report: p.fatigueReport.report as string,
          bodyPartId: p.fatigueReport.bodyPartId,
          severity: p.fatigueReport.severity,
        });
      }

      if (fatigueRows.length > 0) {
        await tx.insert(lessonPlayerFatigue).values(fatigueRows);
      }
    }
  });
}
