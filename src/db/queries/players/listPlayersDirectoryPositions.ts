import { eq, inArray } from "drizzle-orm";

import db, { DB } from "@/db";
import { playerPositions, positions } from "@/db/schema";

export interface PlayerDirectoryPositionRow {
  playerId: string;
  positionId: string;
  code: string;
  name: string;
  isPrimary: boolean;
}

export async function listPlayersDirectoryPositions(
  playerIds: string[],
  conn: DB = db
) {
  if (playerIds.length === 0) {
    return [] as PlayerDirectoryPositionRow[];
  }

  return conn
    .select({
      playerId: playerPositions.playerId,
      positionId: positions.id,
      code: positions.code,
      name: positions.name,
      isPrimary: playerPositions.isPrimary,
    })
    .from(playerPositions)
    .innerJoin(positions, eq(playerPositions.positionId, positions.id))
    .where(inArray(playerPositions.playerId, playerIds));
}

