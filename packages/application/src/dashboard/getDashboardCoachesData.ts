import { getDashboardCoachMetrics } from "@ams/db/queries/dashboard/getDashboardCoachMetrics";
import {
  DashboardCoachMetricRow,
  DashboardCoachesData,
  DashboardRangeWindow,
} from "@ams/domain/dashboard/types";

export async function getDashboardCoachesData(
  facilityId: string,
  range: DashboardRangeWindow
): Promise<DashboardCoachesData> {
  const rows = await getDashboardCoachMetrics({
    facilityId,
    startIso: range.startIso,
    endIso: range.endIso,
  });

  const coachRows: DashboardCoachMetricRow[] = rows.map((row) => ({
    coachId: row.coachId,
    coachName: row.coachName?.trim() || "Unknown Coach",
    lessonsLogged: row.lessonsLogged,
    uniquePlayers: row.uniquePlayers,
    avgLogDelayDays: Number(row.avgLogDelayDays.toFixed(2)),
  }));

  const totalLessonsLogged = coachRows.reduce((sum, row) => sum + row.lessonsLogged, 0);
  const avgLogDelayDays =
    coachRows.length > 0
      ? Number(
          (
            coachRows.reduce((sum, row) => sum + row.avgLogDelayDays, 0) / coachRows.length
          ).toFixed(2)
        )
      : 0;

  return {
    range,
    totalCoachesActive: coachRows.length,
    totalLessonsLogged,
    avgLogDelayDays,
    coachRows,
  };
}

