import { and, eq } from "drizzle-orm";

import db from "@/db";
import { throwingWorkloadDailySummaries } from "@/db/schema";
import { getThrowingEntriesForDay } from "@/db/queries/journal/getThrowingEntriesForDay";
import { buildThrowingDailySummaryFromInputs } from "@/domain/journal/serializers";

export async function recomputeThrowingDailySummary(params: {
  playerId: string;
  facilityId: string;
  entryDate: string;
}) {
  const rows = await getThrowingEntriesForDay(params);

  if (rows.length === 0) {
    await db
      .delete(throwingWorkloadDailySummaries)
      .where(
        and(
          eq(throwingWorkloadDailySummaries.playerId, params.playerId),
          eq(throwingWorkloadDailySummaries.summaryDate, params.entryDate)
        )
      );
    return null;
  }

  const snapshot = buildThrowingDailySummaryFromInputs({
    playerId: params.playerId,
    summaryDate: params.entryDate,
    entryCount: rows.length,
    segments: rows.flatMap((row) =>
      row.workloadSegments.map((segment) => ({
        throwType: segment.throwType,
        throwCount: segment.throwCount,
        pitchCount: segment.pitchCount,
        intentLevel: segment.intentLevel,
        velocityAvg: segment.velocityAvg,
        velocityMax: segment.velocityMax,
        pitchType: segment.pitchType,
        durationMinutes: segment.durationMinutes,
        notes: segment.notes,
        isEstimated: segment.isEstimated,
      }))
    ),
    armCheckins: rows.map((row) =>
      row.armCheckin
        ? {
            armSoreness: row.armCheckin.armSoreness,
            bodyFatigue: row.armCheckin.bodyFatigue,
            armFatigue: row.armCheckin.armFatigue,
            recoveryScore: row.armCheckin.recoveryScore,
            feelsOff: row.armCheckin.feelsOff,
            statusNote: row.armCheckin.statusNote,
          }
        : null
    ),
  });

  await db
    .insert(throwingWorkloadDailySummaries)
    .values({
      playerId: snapshot.playerId,
      summaryDate: snapshot.summaryDate,
      totalThrowCount: snapshot.totalThrowCount,
      totalPitchCount: snapshot.totalPitchCount,
      workloadUnits: snapshot.workloadUnits,
      workloadQuality: snapshot.workloadQuality,
      workloadConfidence: snapshot.workloadConfidence,
      sorenessScore: snapshot.sorenessScore,
      fatigueScore: snapshot.fatigueScore,
      entryCount: snapshot.entryCount,
      hasGameExposure: snapshot.hasGameExposure,
      hasBullpen: snapshot.hasBullpen,
      hasHighIntentExposure: snapshot.hasHighIntentExposure,
      calculatedOn: new Date(),
      updatedOn: new Date(),
    })
    .onConflictDoUpdate({
      target: [
        throwingWorkloadDailySummaries.playerId,
        throwingWorkloadDailySummaries.summaryDate,
      ],
      set: {
        totalThrowCount: snapshot.totalThrowCount,
        totalPitchCount: snapshot.totalPitchCount,
        workloadUnits: snapshot.workloadUnits,
        workloadQuality: snapshot.workloadQuality,
        workloadConfidence: snapshot.workloadConfidence,
        sorenessScore: snapshot.sorenessScore,
        fatigueScore: snapshot.fatigueScore,
        entryCount: snapshot.entryCount,
        hasGameExposure: snapshot.hasGameExposure,
        hasBullpen: snapshot.hasBullpen,
        hasHighIntentExposure: snapshot.hasHighIntentExposure,
        calculatedOn: new Date(),
        updatedOn: new Date(),
      },
    });

  return snapshot;
}
