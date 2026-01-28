import { LessonCardData } from "@/db/queries/lessons/lessonQueries.types";
import { TrainingSummaryData } from "@/domain/player/training";

const DAY_MS = 1000 * 60 * 60 * 24;

function daysAgo(date: string) {
  return (Date.now() - new Date(date).getTime()) / DAY_MS;
}

export function buildTrainingSummary(
  lessons: LessonCardData[]
): TrainingSummaryData {
  const last14: LessonCardData[] = [];
  const last30: LessonCardData[] = [];

  const disciplineCounts: Record<LessonCardData["lessonType"], number> = {
    strength: 0,
    hitting: 0,
    pitching: 0,
    fielding: 0,
    catching: 0,
  };

  const mechanicCounts: Record<
    string,
    { id: string; name: string; count: number }
  > = {};

  for (const lesson of lessons) {
    const age = daysAgo(lesson.lessonDate);

    if (age <= 14) last14.push(lesson);
    if (age <= 30) {
      last30.push(lesson);

      // Discipline frequency
      disciplineCounts[lesson.lessonType]++;

      // Mechanics frequency
      for (const mech of lesson.mechanics ?? []) {
        if (!mechanicCounts[mech.id]) {
          mechanicCounts[mech.id] = {
            id: mech.id,
            name: mech.name,
            count: 0,
          };
        }
        mechanicCounts[mech.id].count++;
      }
    }
  }

  const disciplineBreakdown = Object.entries(disciplineCounts)
    .filter(([, count]) => count > 0)
    .map(([discipline, count]) => ({
      discipline: discipline as LessonCardData["lessonType"],
      count,
    }))
    .sort((a, b) => b.count - a.count);

  const topMechanics = Object.values(mechanicCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    volume: {
      lessons14d: last14.length,
      lessons30d: last30.length,
      avgPerWeek30d: Number((last30.length / (30 / 7)).toFixed(1)),
    },
    focus: {
      primaryDiscipline: disciplineBreakdown[0]?.discipline ?? null,
      secondaryDiscipline: disciplineBreakdown[1]?.discipline ?? null,
      breakdown: disciplineBreakdown,
    },
    mechanics: {
      top: topMechanics,
    },
  };
}
