import db from "@/db";
import {
  lesson,
  lessonMechanics,
  lessonPlayerFatigue,
  lessonPlayerRoutines,
  lessonPlayers,
  manualTsIso,
  pitchingLessonPlayers,
} from "@/db/schema";
import { lessonDrills } from "@/db/schema/lesson-logging-v2/lessonDrills";
import {
  FatigueReportInsert,
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
        const lessonSpecific = p.lessonSpecific as
          | { pitching?: unknown }
          | undefined;
        const pitching = lessonSpecific?.pitching;

        if (!isPitchingLessonSpecific(pitching)) {
          continue;
        }

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
     * 5️⃣ Insert lesson_drills
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
     * 6️⃣ Insert fatigue report (if provided)
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

    return {
      lessonId,
      lessonPlayerByPlayerId,
    };
  });
}
