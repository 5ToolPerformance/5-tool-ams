import db from "@/db";
import {
  hittingJournalAtBats,
  hittingJournalEntries,
  journalEntries,
  throwingArmCheckins,
  throwingJournalEntries,
  throwingWorkloadEntries,
} from "@/db/schema";
import { getAtBatCount, getPlateAppearanceCount, normalizeAtBats } from "@/domain/journal/hitting";
import { serializeCreateJournalEntryInput } from "@/domain/journal/serializers";
import type { CreateJournalEntryInput } from "@/domain/journal/types";

import { recomputeThrowingDailySummary } from "./recomputeThrowingDailySummary";

export async function createJournalEntry(params: {
  input: CreateJournalEntryInput;
  facilityId: string;
  userId: string;
}) {
  const input = serializeCreateJournalEntryInput(params.input);

  const created = await db.transaction(async (tx) => {
    const [parent] = await tx
      .insert(journalEntries)
      .values({
        playerId: input.playerId,
        loggedByUserId: params.userId,
        entryDate: input.entryDate,
        entryType: input.entryType,
        source: "player",
        contextType: input.contextType,
        title: input.title,
        summaryNote: input.summaryNote,
        facilityId: params.facilityId,
      })
      .returning({ id: journalEntries.id });

    if (input.entryType === "throwing") {
      const [throwingEntry] = await tx
        .insert(throwingJournalEntries)
        .values({
          journalEntryId: parent.id,
          overallFeel: input.overallFeel,
          confidenceScore: input.confidenceScore,
          sessionNote: input.sessionNote,
        })
        .returning({ id: throwingJournalEntries.id });

      await tx.insert(throwingWorkloadEntries).values(
        input.workloadSegments.map((segment) => ({
          throwingJournalEntryId: throwingEntry.id,
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
      );

      if (input.armCheckin) {
        await tx.insert(throwingArmCheckins).values({
          throwingJournalEntryId: throwingEntry.id,
          armSoreness: input.armCheckin.armSoreness,
          bodyFatigue: input.armCheckin.bodyFatigue,
          armFatigue: input.armCheckin.armFatigue,
          recoveryScore: input.armCheckin.recoveryScore,
          feelsOff: input.armCheckin.feelsOff,
          statusNote: input.armCheckin.statusNote,
        });
      }
    } else {
      const atBats = normalizeAtBats(input.atBats);
      const [hittingEntry] = await tx
        .insert(hittingJournalEntries)
        .values({
          journalEntryId: parent.id,
          opponent: input.opponent,
          teamName: input.teamName,
          location: input.location,
          overallFeel: input.overallFeel,
          confidenceScore: input.confidenceScore,
          atBats: getAtBatCount(atBats),
          plateAppearances: getPlateAppearanceCount(atBats),
          summaryNote: input.hittingSummaryNote,
          facilityId: params.facilityId,
        })
        .returning({ id: hittingJournalEntries.id });

      await tx.insert(hittingJournalAtBats).values(
        atBats.map((atBat) => ({
          hittingJournalEntryId: hittingEntry.id,
          atBatNumber: atBat.atBatNumber,
          outcome: atBat.outcome,
          resultCategory: atBat.resultCategory,
          pitchTypeSeen: atBat.pitchTypeSeen,
          pitchLocation: atBat.pitchLocation,
          countAtResult: atBat.countAtResult,
          runnersInScoringPosition: atBat.runnersInScoringPosition,
          rbi: atBat.rbi,
          notes: atBat.notes,
          facilityId: params.facilityId,
        }))
      );
    }

    return parent;
  });

  if (input.entryType === "throwing") {
    await recomputeThrowingDailySummary({
      playerId: input.playerId,
      facilityId: params.facilityId,
      entryDate: input.entryDate,
    });
  }

  return created;
}
