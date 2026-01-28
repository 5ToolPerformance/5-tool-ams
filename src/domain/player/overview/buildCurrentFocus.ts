import { LessonCardData } from "@/db/queries/lessons/lessonQueries.types";

export function buildCurrentFocus(lessons: LessonCardData[]) {
  const mechanicCounts: Record<
    string,
    { id: string; name: string; count: number }
  > = {};

  for (const lesson of lessons) {
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

  return {
    mechanics: Object.values(mechanicCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
      .map(({ id, name }) => ({ id, name })),
  };
}
