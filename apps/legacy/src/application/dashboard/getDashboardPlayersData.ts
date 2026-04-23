import { getIncompletePlayerProfiles } from "@/db/queries/dashboard/getIncompletePlayerProfiles";
import { getDashboardPlayerMetrics } from "@/db/queries/dashboard/getDashboardPlayerMetrics";
import { buildIncompletePlayerProfiles } from "@/domain/dashboard/players/incompleteProfile";
import { DashboardPlayersData, DashboardRangeWindow } from "@/domain/dashboard/types";

export async function getDashboardPlayersData(
  facilityId: string,
  range: DashboardRangeWindow
): Promise<DashboardPlayersData> {
  const [playerRowsRaw, incompleteRaw] = await Promise.all([
    getDashboardPlayerMetrics({
      facilityId,
      startIso: range.startIso,
      endIso: range.endIso,
    }),
    getIncompletePlayerProfiles(facilityId),
  ]);

  const playerRows = playerRowsRaw.map((row) => ({
    playerId: row.playerId,
    firstName: row.firstName,
    lastName: row.lastName,
    lessons: row.lessons,
    uniqueCoaches: row.uniqueCoaches,
    latestLessonDate: row.latestLessonDate,
  }));

  const totalLessons = playerRows.reduce((sum, row) => sum + row.lessons, 0);
  const activePlayers = playerRows.length;
  const avgLessonsPerPlayer =
    activePlayers > 0 ? Number((totalLessons / activePlayers).toFixed(2)) : 0;

  const incompleteProfiles = buildIncompletePlayerProfiles(
    incompleteRaw.map((row) => ({
      playerId: row.playerId,
      firstName: row.firstName,
      lastName: row.lastName,
      primaryCoachId: row.primaryCoachId,
      throws: row.throws,
      hits: row.hits,
      dateOfBirth: row.dateOfBirth,
    }))
  );

  return {
    range,
    activePlayers,
    totalLessons,
    avgLessonsPerPlayer,
    playerRows,
    incompleteProfiles,
  };
}

