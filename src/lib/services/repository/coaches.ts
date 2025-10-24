import { desc, eq, sql } from "drizzle-orm";

import db from "@/db";
import { lesson, playerInformation } from "@/db/schema";

export const coachRepository = {
  findCoachPlayerLessonCounts: async (coachId: string) => {
    try {
      const counts = await db
        .select({
          playerId: playerInformation.id,
          playerName: sql<string>`concat(${playerInformation.firstName}, ' ', ${playerInformation.lastName})`,
          lessonCount: sql<number>`count(${lesson.id})::int`,
        })
        .from(lesson)
        .innerJoin(playerInformation, eq(lesson.playerId, playerInformation.id))
        .where(eq(lesson.coachId, coachId))
        .groupBy(playerInformation.id)
        .orderBy(desc(sql`count(${lesson.id})`));

      return counts;
    } catch (error) {
      console.error(
        "[CoachRepo] findCoachPlayerLessonCounts - Database error: ",
        error
      );
      throw new Error("Failed to fetch lesson counts from the database");
    }
  },
};
