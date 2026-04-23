import { eq } from "drizzle-orm";

import db from "@ams/db";
import {
  hittingJournalAtBats,
  hittingJournalEntries,
  journalEntries,
  throwingArmCheckins,
  throwingJournalEntries,
  throwingWorkloadEntries,
} from "@ams/db/schema";

import { getJournalEntryById } from "@ams/db/queries/journal/getJournalEntryById";
import { recomputeThrowingDailySummary } from "./recomputeThrowingDailySummary";

export async function deleteJournalEntry(params: {
  journalEntryId: string;
  facilityId: string;
}) {
  const existing = await getJournalEntryById(params.journalEntryId);
  if (!existing) {
    throw new Error("Journal entry not found");
  }

  const { baseRow } = existing;

  await db.transaction(async (tx) => {
    if (baseRow.throwingEntryId) {
      await tx
        .delete(throwingWorkloadEntries)
        .where(eq(throwingWorkloadEntries.throwingJournalEntryId, baseRow.throwingEntryId));
      await tx
        .delete(throwingArmCheckins)
        .where(eq(throwingArmCheckins.throwingJournalEntryId, baseRow.throwingEntryId));
      await tx
        .delete(throwingJournalEntries)
        .where(eq(throwingJournalEntries.id, baseRow.throwingEntryId));
    }

    if (baseRow.hittingEntryId) {
      await tx
        .delete(hittingJournalAtBats)
        .where(eq(hittingJournalAtBats.hittingJournalEntryId, baseRow.hittingEntryId));
      await tx
        .delete(hittingJournalEntries)
        .where(eq(hittingJournalEntries.id, baseRow.hittingEntryId));
    }

    await tx.delete(journalEntries).where(eq(journalEntries.id, params.journalEntryId));
  });

  if (baseRow.entryType === "throwing") {
    await recomputeThrowingDailySummary({
      playerId: baseRow.playerId,
      facilityId: params.facilityId,
      entryDate: baseRow.entryDate,
    });
  }
}
