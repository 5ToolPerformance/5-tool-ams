import { eq } from "drizzle-orm";

import db from "@ams/db";
import { journalEntries } from "@ams/db/schema";
import { getClientAccessForPlayer } from "@/application/client-portal/service";

export async function assertCanViewPortalJournalPlayer(params: {
  userId: string;
  facilityId: string;
  playerId: string;
}) {
  const access = await getClientAccessForPlayer(params.userId, params.facilityId, params.playerId);

  if (!access || access.status !== "active" || !access.permissions.canView) {
    throw new Error("You do not have access to this player");
  }

  return access;
}

export async function assertCanLogPortalJournalForPlayer(params: {
  userId: string;
  facilityId: string;
  playerId: string;
}) {
  const access = await assertCanViewPortalJournalPlayer(params);

  if (!access.permissions.canLogActivity) {
    throw new Error("You do not have permission to log journal activity for this player");
  }

  return access;
}

export async function assertCanAccessJournalEntry(params: {
  userId: string;
  facilityId: string;
  journalEntryId: string;
  requireWrite?: boolean;
}) {
  const [entry] = await db
    .select({
      id: journalEntries.id,
      playerId: journalEntries.playerId,
      facilityId: journalEntries.facilityId,
    })
    .from(journalEntries)
    .where(eq(journalEntries.id, params.journalEntryId))
    .limit(1);

  if (!entry || entry.facilityId !== params.facilityId) {
    throw new Error("Journal entry not found");
  }

  if (params.requireWrite) {
    await assertCanLogPortalJournalForPlayer({
      userId: params.userId,
      facilityId: params.facilityId,
      playerId: entry.playerId,
    });
  } else {
    await assertCanViewPortalJournalPlayer({
      userId: params.userId,
      facilityId: params.facilityId,
      playerId: entry.playerId,
    });
  }

  return entry;
}
