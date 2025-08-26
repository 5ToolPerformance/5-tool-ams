/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any */
import { desc, eq } from "drizzle-orm";

import db from "@/db";
import { lesson, playerInformation, users } from "@/db/schema";

import { AssessmentService } from "./assessments";

export class LLMService {
  static async retrieveDataForReport(playerId: string, lessonCount: number) {
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
            data: this.cleanAssessmentData(assessment.data),
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
  }

  static cleanAssessmentData(data: any) {
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

    return cleanData;
  }
}
