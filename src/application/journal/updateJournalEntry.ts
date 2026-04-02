import { eq } from "drizzle-orm";

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
import type { UpdateJournalEntryInput } from "@/domain/journal/types";

import { getJournalEntryById } from "@/db/queries/journal/getJournalEntryById";
import { recomputeThrowingDailySummary } from "./recomputeThrowingDailySummary";

export async function updateJournalEntry(params: {
  input: UpdateJournalEntryInput;
  facilityId: string;
}) {
  const existing = await getJournalEntryById(params.input.id);
  if (!existing) {
    throw new Error("Journal entry not found");
  }

  if (existing.baseRow.entryType !== params.input.entryType) {
    throw new Error("Journal entry type cannot be changed");
  }

  const previousDate = existing.baseRow.entryDate;
  const previousPlayerId = existing.baseRow.playerId;

  await db.transaction(async (tx) => {
    await tx
      .update(journalEntries)
      .set({
        entryDate: params.input.entryDate,
        contextType: params.input.contextType,
        title: params.input.title,
        summaryNote: params.input.summaryNote,
        updatedOn: new Date(),
      })
      .where(eq(journalEntries.id, params.input.id));

    if (params.input.entryType === "throwing" && existing.baseRow.throwingEntryId) {
      await tx
        .update(throwingJournalEntries)
        .set({
          overallFeel: params.input.overallFeel,
          confidenceScore: params.input.confidenceScore,
          sessionNote: params.input.sessionNote,
          updatedOn: new Date(),
        })
        .where(eq(throwingJournalEntries.id, existing.baseRow.throwingEntryId));

      await tx
        .delete(throwingWorkloadEntries)
        .where(eq(throwingWorkloadEntries.throwingJournalEntryId, existing.baseRow.throwingEntryId));

      await tx.insert(throwingWorkloadEntries).values(
        params.input.workloadSegments.map((segment) => ({
          throwingJournalEntryId: existing.baseRow.throwingEntryId!,
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

      await tx
        .delete(throwingArmCheckins)
        .where(eq(throwingArmCheckins.throwingJournalEntryId, existing.baseRow.throwingEntryId));

      if (params.input.armCheckin) {
        await tx.insert(throwingArmCheckins).values({
          throwingJournalEntryId: existing.baseRow.throwingEntryId,
          armSoreness: params.input.armCheckin.armSoreness,
          bodyFatigue: params.input.armCheckin.bodyFatigue,
          armFatigue: params.input.armCheckin.armFatigue,
          recoveryScore: params.input.armCheckin.recoveryScore,
          feelsOff: params.input.armCheckin.feelsOff,
          statusNote: params.input.armCheckin.statusNote,
        });
      }
    }

    if (params.input.entryType === "hitting" && existing.baseRow.hittingEntryId) {
      const atBats = normalizeAtBats(params.input.atBats);
      await tx
        .update(hittingJournalEntries)
        .set({
          opponent: params.input.opponent,
          teamName: params.input.teamName,
          location: params.input.location,
          overallFeel: params.input.overallFeel,
          confidenceScore: params.input.confidenceScore,
          atBats: getAtBatCount(atBats),
          plateAppearances: getPlateAppearanceCount(atBats),
          summaryNote: params.input.hittingSummaryNote,
          updatedOn: new Date(),
        })
        .where(eq(hittingJournalEntries.id, existing.baseRow.hittingEntryId));

      await tx
        .delete(hittingJournalAtBats)
        .where(eq(hittingJournalAtBats.hittingJournalEntryId, existing.baseRow.hittingEntryId));

      await tx.insert(hittingJournalAtBats).values(
        atBats.map((atBat) => ({
          hittingJournalEntryId: existing.baseRow.hittingEntryId!,
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
  });

  if (existing.baseRow.entryType === "throwing") {
    await recomputeThrowingDailySummary({
      playerId: previousPlayerId,
      facilityId: params.facilityId,
      entryDate: previousDate,
    });
  }

  if (params.input.entryType === "throwing") {
    await recomputeThrowingDailySummary({
      playerId: params.input.playerId,
      facilityId: params.facilityId,
      entryDate: params.input.entryDate,
    });
  }
}
