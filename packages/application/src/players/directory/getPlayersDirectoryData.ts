import { listPlayersForDirectory } from "@ams/db/queries/players/listPlayersForDirectory";
import { normalizePlayersForDirectory } from "@ams/domain/player/directory";

export async function getPlayersDirectoryData(
  facilityId: string,
  currentUserId: string
) {
  const queryData = await listPlayersForDirectory(facilityId);
  const players = normalizePlayersForDirectory(queryData);

  return {
    players,
    currentUserId,
  };
}

