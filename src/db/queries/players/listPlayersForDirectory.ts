import db, { DB } from "@/db";

import {
  listPlayersDirectoryBase,
  PlayerDirectoryBaseRow,
} from "./listPlayersDirectoryBase";
import {
  listPlayersDirectoryInjurySummary,
  PlayerDirectoryInjurySummaryRow,
} from "./listPlayersDirectoryInjurySummary";
import {
  listPlayersDirectoryPositions,
  PlayerDirectoryPositionRow,
} from "./listPlayersDirectoryPositions";

export interface PlayersForDirectoryQueryResult {
  baseRows: PlayerDirectoryBaseRow[];
  positionRows: PlayerDirectoryPositionRow[];
  injurySummaryRows: PlayerDirectoryInjurySummaryRow[];
}

export async function listPlayersForDirectory(
  facilityId: string,
  conn: DB = db
): Promise<PlayersForDirectoryQueryResult> {
  const baseRows = await listPlayersDirectoryBase(facilityId, conn);
  const playerIds = baseRows.map((row) => row.id);

  const [positionRows, injurySummaryRows] = await Promise.all([
    listPlayersDirectoryPositions(playerIds, conn),
    listPlayersDirectoryInjurySummary(playerIds, conn),
  ]);

  return {
    baseRows,
    positionRows,
    injurySummaryRows,
  };
}

