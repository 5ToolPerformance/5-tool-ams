import { and, inArray, ne, sql } from "drizzle-orm";

import db, { DB } from "@/db";
import { injury } from "@/db/schema";

export interface PlayerDirectoryInjurySummaryRow {
  playerId: string;
  hasActive: boolean;
  hasLimited: boolean;
  activeCount: number;
}

export async function listPlayersDirectoryInjurySummary(
  playerIds: string[],
  conn: DB = db
) {
  if (playerIds.length === 0) {
    return [] as PlayerDirectoryInjurySummaryRow[];
  }

  return conn
    .select({
      playerId: injury.playerId,
      hasActive: sql<boolean>`bool_or(${injury.status} = 'active')`,
      hasLimited: sql<boolean>`bool_or(${injury.status} = 'limited')`,
      activeCount: sql<number>`count(*)`.mapWith(Number),
    })
    .from(injury)
    .where(
      and(inArray(injury.playerId, playerIds), ne(injury.status, "resolved"))
    )
    .groupBy(injury.playerId);
}

