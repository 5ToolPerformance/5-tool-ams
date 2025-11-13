import { and, desc, eq, gte, sql } from "drizzle-orm";

import db from "@/db";
import { lesson, playerInformation } from "@/db/schema";

/**
 * Coach repository for database operations related to coaches.
 */
export const coachRepository = {
  /**
   * Finds the lesson counts for a specific coach.
   * @param coachId - The ID of the coach to find lesson counts for
   * @returns An array of lesson counts for the coach
   * @throws Error if there is an error with the database query
   */
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

  /**
   * Gets the average submission time for a specific coach.
   * @param coachId - The ID of the coach to get the average submission time for
   * @returns The average submission time for the coach
   * @throws Error if there is an error with the database query
   */
  getAvgSubmissionTime: async (coachId: string) => {
    try {
      const sixtyDaysAgo = new Date();
      sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

      const metrics = await db
        .select({
          coachId: lesson.coachId,
          totalLessons: sql<number>`count(${lesson.id})::int`,
          averageDaysToSubmit: sql<number>`avg(extract(epoch from (${lesson.createdOn} - ${lesson.lessonDate})) / 86400)::numeric(10,2)`,
        })
        .from(lesson)
        .where(
          and(
            eq(lesson.coachId, coachId),
            gte(lesson.lessonDate, sixtyDaysAgo.toLocaleDateString())
          )
        )
        .groupBy(lesson.coachId);

      return metrics[0]?.averageDaysToSubmit || 0;
    } catch (error) {
      console.error(
        "[CoachRepo] getAvgSubmissionTime - Database error: ",
        error
      );
      throw new Error("Failed to fetch submission metrics from the database");
    }
  },

  /**
   * Gets the submission metrics for all coaches.
   * @returns An array of submission metrics for all coaches
   * @throws Error if there is an error with the database query
   */
  getAllCoachesSubmissionMetrics: async () => {
    try {
      const metrics = await db
        .select({
          coachId: lesson.coachId,
          totalLessons: sql<number>`count(${lesson.id})::int`,
          averageDaysToSubmit: sql<number>`avg(extract(epoch from (${lesson.createdOn} - ${lesson.lessonDate})) / 86400)::numeric(10,2)`,
          minDaysToSubmit: sql<number>`min(extract(epoch from (${lesson.createdOn} - ${lesson.lessonDate})) / 86400)::numeric(10,2)`,
          maxDaysToSubmit: sql<number>`max(extract(epoch from (${lesson.createdOn} - ${lesson.lessonDate})) / 86400)::numeric(10,2)`,
        })
        .from(lesson)
        .groupBy(lesson.coachId);

      return metrics;
    } catch (error) {
      console.error(
        "[CoachRepo] getAllCoachesSubmissionMetrics - Database error: ",
        error
      );
      throw new Error("Failed to fetch submission metrics from the database");
    }
  },
};
