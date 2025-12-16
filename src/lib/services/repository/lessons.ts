import { desc, eq } from "drizzle-orm";

import db from "@/db";
import { lesson, playerInformation, users } from "@/db/schema";
import { AssessmentDataSelect } from "@/types/database";

import { AssessmentService } from "../assessments";

export const lessonRepository = {
  getLessonsByPlayerId: async (id: string) => {
    try {
      const lessons = await db
        .select({
          lesson: lesson,
          coach: users,
        })
        .from(lesson)
        .innerJoin(users, eq(lesson.coachId, users.id))
        .where(eq(lesson.playerId, id))
        .orderBy(desc(lesson.lessonDate));

      return lessons;
    } catch (error) {
      console.error(
        "[LessonRepo] getLessonsByPlayerId - Database error: ",
        error
      );
      throw new Error("Failed to fetch lessons from the database");
    }
  },
  /**
   * Retrieves a player's lesson report from the database.
   * @param playerId - The ID of the player to retrieve lessons for.
   * @param lessonCount - The number of lessons to retrieve.
   * @returns The player's lesson report.
   */
  getLessonReportByPlayerId: async (playerId: string, lessonCount: number) => {
    try {
      const player = await db
        .select({
          player: playerInformation,
        })
        .from(playerInformation)
        .where(eq(playerInformation.id, playerId));

      const lessonsData = await db
        .select({
          lessonId: lesson.id,
          lessonDate: lesson.lessonDate,
          lessonType: lesson.lessonType,
          lessonNotes: lesson.notes,
          coachName: users.name,
        })
        .from(lesson)
        .innerJoin(users, eq(lesson.coachId, users.id))
        .where(eq(lesson.playerId, playerId))
        .orderBy(desc(lesson.lessonDate))
        .limit(lessonCount);

      const lessonsWithAssessments = await Promise.all(
        lessonsData.map(async (lessonItem) => {
          const assessments = await AssessmentService.getAssessmentsByLessonId(
            lessonItem.lessonId
          );

          const cleanedAssessments = assessments
            .map((assessment) => ({
              assessmentType: assessment.lessonType,
              data: lessonRepository.cleanAssessmentData(
                assessment.data as AssessmentDataSelect
              ),
            }))
            .filter((a) => a.data !== null);

          return {
            lessonId: lessonItem.lessonId,
            lessonDate: lessonItem.lessonDate,
            lessonType: lessonItem.lessonType,
            lessonNotes: lessonItem.lessonNotes,
            coachName: lessonItem.coachName,
            assessments: cleanedAssessments,
          };
        })
      );
      return {
        player,
        lessonsWithAssessments,
      };
    } catch (error) {
      console.error(
        "[LessonRepo] getLessonReportByPlayerId - Database error: ",
        error
      );
      throw new Error("Failed to fetch lesson report from the database");
    }
  },

  /**
   * Removes unnecessary fields from assessment data for report generation.
   * @param data - Assessment data to clean
   * @returns Cleaned assessment data
   */
  cleanAssessmentData: (data: AssessmentDataSelect) => {
    if (!data) return null;

    const {
      id,
      playerId,
      coachId,
      lessonId,
      createdOn,
      lessonDate,
      ...cleanData
    } = data;

    void (id && playerId && coachId && lessonId && createdOn && lessonDate);

    return cleanData;
  },
};
