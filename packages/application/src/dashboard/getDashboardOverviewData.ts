import { getDashboardOverviewMetrics } from "@ams/db/queries/dashboard/getDashboardOverviewMetrics";
import {
  DashboardLessonType,
  DashboardOverviewData,
  DashboardRangeWindow,
} from "@ams/domain/dashboard/types";

const LESSON_TYPES: DashboardLessonType[] = [
  "strength",
  "hitting",
  "pitching",
  "fielding",
  "catching",
];

export async function getDashboardOverviewData(
  facilityId: string,
  range: DashboardRangeWindow
): Promise<DashboardOverviewData> {
  const metrics = await getDashboardOverviewMetrics({
    facilityId,
    startIso: range.startIso,
    endIso: range.endIso,
  });

  const countsByType = new Map(metrics.lessonsByType.map((row) => [row.lessonType, row.count]));

  const lessonTypeBreakdown = LESSON_TYPES.map((lessonType) => {
    const count = countsByType.get(lessonType) ?? 0;
    return {
      lessonType,
      count,
      percentage:
        metrics.totalLessons > 0
          ? Number(((count / metrics.totalLessons) * 100).toFixed(1))
          : 0,
    };
  });

  return {
    range,
    totalLessons: metrics.totalLessons,
    activeCoaches: metrics.activeCoaches,
    activePlayers: metrics.activePlayers,
    lessonTypeBreakdown,
    dailyLessons: metrics.dailyLessons,
  };
}

