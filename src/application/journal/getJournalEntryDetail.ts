import { createHittingDetail, createThrowingDetail } from "@/domain/journal/serializers";

import { getJournalEntryById } from "@/db/queries/journal/getJournalEntryById";
import type { JournalEntryDetail } from "@/domain/journal/types";

export async function getJournalEntryDetail(journalEntryId: string): Promise<JournalEntryDetail | null> {
  const result = await getJournalEntryById(journalEntryId);

  if (!result) {
    return null;
  }

  const { baseRow, workloadSegments, armCheckin, atBats } = result;

  if (baseRow.entryType === "throwing" && baseRow.throwingEntryId) {
    return createThrowingDetail({
      id: baseRow.id,
      playerId: baseRow.playerId,
      entryType: "throwing",
      entryDate: baseRow.entryDate,
      contextType: baseRow.contextType,
      title: baseRow.title,
      summaryNote: baseRow.summaryNote,
      createdOn: baseRow.createdOn.toISOString(),
      updatedOn: baseRow.updatedOn.toISOString(),
      overallFeel: baseRow.throwingOverallFeel,
      confidenceScore: baseRow.throwingConfidenceScore,
      sessionNote: baseRow.throwingSessionNote,
      workloadSegments: workloadSegments.map((segment) => ({
        id: segment.id,
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
      })),
      armCheckin: armCheckin
        ? {
            armSoreness: armCheckin.armSoreness,
            bodyFatigue: armCheckin.bodyFatigue,
            armFatigue: armCheckin.armFatigue,
            recoveryScore: armCheckin.recoveryScore,
            feelsOff: armCheckin.feelsOff,
            statusNote: armCheckin.statusNote,
          }
        : null,
    });
  }

  if (baseRow.entryType === "hitting" && baseRow.hittingEntryId) {
    return createHittingDetail({
      id: baseRow.id,
      playerId: baseRow.playerId,
      entryType: "hitting",
      entryDate: baseRow.entryDate,
      contextType: baseRow.contextType,
      title: baseRow.title,
      summaryNote: baseRow.summaryNote,
      createdOn: baseRow.createdOn.toISOString(),
      updatedOn: baseRow.updatedOn.toISOString(),
      opponent: baseRow.hittingOpponent,
      teamName: baseRow.hittingTeamName,
      location: baseRow.hittingLocation,
      overallFeel: baseRow.hittingOverallFeel,
      confidenceScore: baseRow.hittingConfidenceScore,
      hittingSummaryNote: baseRow.hittingSummaryNote,
      atBats: atBats.map((atBat) => ({
        id: atBat.id,
        atBatNumber: atBat.atBatNumber,
        outcome: atBat.outcome,
        resultCategory: atBat.resultCategory,
        pitchTypeSeen: atBat.pitchTypeSeen,
        pitchLocation: atBat.pitchLocation,
        countAtResult: atBat.countAtResult,
        runnersInScoringPosition: atBat.runnersInScoringPosition,
        rbi: atBat.rbi,
        notes: atBat.notes,
      })),
    });
  }

  return null;
}
