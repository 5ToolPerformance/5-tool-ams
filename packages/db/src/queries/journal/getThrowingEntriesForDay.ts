import { and, asc, eq } from "drizzle-orm";

import db from "@/db";
import {
  journalEntries,
  throwingArmCheckins,
  throwingJournalEntries,
  throwingWorkloadEntries,
} from "@/db/schema";

export async function getThrowingEntriesForDay(params: {
  playerId: string;
  facilityId: string;
  entryDate: string;
}) {
  const { playerId, facilityId, entryDate } = params;

  const rows = await db
    .select({
      journalEntryId: journalEntries.id,
      throwingEntryId: throwingJournalEntries.id,
      createdOn: journalEntries.createdOn,
    })
    .from(journalEntries)
    .innerJoin(throwingJournalEntries, eq(throwingJournalEntries.journalEntryId, journalEntries.id))
    .where(
      and(
        eq(journalEntries.playerId, playerId),
        eq(journalEntries.facilityId, facilityId),
        eq(journalEntries.entryType, "throwing"),
        eq(journalEntries.entryDate, entryDate)
      )
    )
    .orderBy(asc(journalEntries.createdOn));

  if (rows.length === 0) {
    return [];
  }

  return Promise.all(
    rows.map(async (row) => {
      const [entrySegments, entryArmCheckin] = await Promise.all([
        db
          .select()
          .from(throwingWorkloadEntries)
          .where(eq(throwingWorkloadEntries.throwingJournalEntryId, row.throwingEntryId))
          .orderBy(asc(throwingWorkloadEntries.createdOn)),
        db
          .select()
          .from(throwingArmCheckins)
          .where(eq(throwingArmCheckins.throwingJournalEntryId, row.throwingEntryId))
          .limit(1),
      ]);

      return {
        journalEntryId: row.journalEntryId,
        throwingEntryId: row.throwingEntryId,
        createdOn: row.createdOn,
        workloadSegments: entrySegments,
        armCheckin: entryArmCheckin[0] ?? null,
      };
    })
  );
}
