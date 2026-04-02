import { and, desc, eq } from "drizzle-orm";

import db from "@/db";
import {
  hittingJournalEntries,
  journalEntries,
  throwingJournalEntries,
} from "@/db/schema";
import type { JournalFeedFilter } from "@/domain/journal/types";

export async function getJournalEntriesForPlayer(params: {
  playerId: string;
  facilityId: string;
  filter?: JournalFeedFilter;
  limit?: number;
}) {
  const { playerId, facilityId, filter = "all", limit = 20 } = params;

  const conditions = [
    eq(journalEntries.playerId, playerId),
    eq(journalEntries.facilityId, facilityId),
  ];

  if (filter !== "all") {
    conditions.push(eq(journalEntries.entryType, filter));
  }

  return db
    .select({
      id: journalEntries.id,
      playerId: journalEntries.playerId,
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
      hittingSummaryNote: hittingJournalEntries.summaryNote,
      hittingAtBats: hittingJournalEntries.atBats,
      hittingPlateAppearances: hittingJournalEntries.plateAppearances,
    })
    .from(journalEntries)
    .leftJoin(throwingJournalEntries, eq(throwingJournalEntries.journalEntryId, journalEntries.id))
    .leftJoin(hittingJournalEntries, eq(hittingJournalEntries.journalEntryId, journalEntries.id))
    .where(and(...conditions))
    .orderBy(desc(journalEntries.entryDate), desc(journalEntries.createdOn))
    .limit(limit);
}
