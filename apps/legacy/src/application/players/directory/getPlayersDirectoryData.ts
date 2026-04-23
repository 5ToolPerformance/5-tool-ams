import { listPlayersForDirectory } from "@/db/queries/players/listPlayersForDirectory";
import { normalizePlayersForDirectory } from "@/domain/player/directory";

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

