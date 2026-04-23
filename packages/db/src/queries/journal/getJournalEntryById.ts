import { asc, eq } from "drizzle-orm";

import db from "@/db";
import {
  hittingJournalAtBats,
  hittingJournalEntries,
  journalEntries,
  throwingArmCheckins,
  throwingJournalEntries,
  throwingWorkloadEntries,
} from "@/db/schema";

export async function getJournalEntryById(journalEntryId: string) {
  const [baseRow] = await db
    .select({
      id: journalEntries.id,
      playerId: journalEntries.playerId,
      facilityId: journalEntries.facilityId,
      entryDate: journalEntries.entryDate,
      entryType: journalEntries.entryType,
      contextType: journalEntries.contextType,
      title: journalEntries.title,
      summaryNote: journalEntries.summaryNote,
      createdOn: journalEntries.createdOn,
      updatedOn: journalEntries.updatedOn,
      throwingEntryId: throwingJournalEntries.id,
      throwingOverallFeel: throwingJournalEntries.overallFeel,
      throwingConfidenceScore: throwingJournalEntries.confidenceScore,
      throwingSessionNote: throwingJournalEntries.sessionNote,
      hittingEntryId: hittingJournalEntries.id,
      hittingOpponent: hittingJournalEntries.opponent,
      hittingTeamName: hittingJournalEntries.teamName,
      hittingLocation: hittingJournalEntries.location,
      hittingOverallFeel: hittingJournalEntries.overallFeel,
      hittingConfidenceScore: hittingJournalEntries.confidenceScore,
      hittingAtBats: hittingJournalEntries.atBats,
      hittingPlateAppearances: hittingJournalEntries.plateAppearances,
      hittingSummaryNote: hittingJournalEntries.summaryNote,
    })
    .from(journalEntries)
    .leftJoin(throwingJournalEntries, eq(throwingJournalEntries.journalEntryId, journalEntries.id))
    .leftJoin(hittingJournalEntries, eq(hittingJournalEntries.journalEntryId, journalEntries.id))
    .where(eq(journalEntries.id, journalEntryId))
    .limit(1);

  if (!baseRow) {
    return null;
  }

  const [workloadSegments, armCheckin, atBats] = await Promise.all([
    baseRow.throwingEntryId
      ? db
          .select()
          .from(throwingWorkloadEntries)
          .where(eq(throwingWorkloadEntries.throwingJournalEntryId, baseRow.throwingEntryId))
          .orderBy(asc(throwingWorkloadEntries.createdOn))
      : Promise.resolve([]),
    baseRow.throwingEntryId
      ? db
          .select()
          .from(throwingArmCheckins)
          .where(eq(throwingArmCheckins.throwingJournalEntryId, baseRow.throwingEntryId))
          .limit(1)
      : Promise.resolve([]),
    baseRow.hittingEntryId
      ? db
          .select()
          .from(hittingJournalAtBats)
          .where(eq(hittingJournalAtBats.hittingJournalEntryId, baseRow.hittingEntryId))
          .orderBy(asc(hittingJournalAtBats.atBatNumber), asc(hittingJournalAtBats.createdOn))
      : Promise.resolve([]),
  ]);

  return {
    baseRow,
    workloadSegments,
    armCheckin: armCheckin[0] ?? null,
    atBats,
  };
}
