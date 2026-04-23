import { and, desc, eq } from "drizzle-orm";

import db from "@/db";
import {
  armCare,
  hawkinsForcePlate,
  hitTraxAssessment,
  hittingAssessment,
  lesson,
  lessonAssessments,
  pitchingAssessment,
  playerInformation,
  smfaBoolean,
  trueStrength,
  users,
  veloAssessment,
} from "@/db/schema";
import type { AssessmentDataSelect } from "../../types/database";

async function getAssessmentsByLessonId(
  lessonId: string
): Promise<Array<{ lessonType: string; data: unknown | null }>> {
  const assessmentRelations = await db
    .select()
    .from(lessonAssessments)
    .where(eq(lessonAssessments.lessonId, lessonId));

  if (assessmentRelations.length === 0) {
    return [];
  }

  return Promise.all(
    assessmentRelations.map(async (relation) => {
      let rows: unknown[] | undefined;

      switch (relation.assessmentType) {
        case "arm_care":
        case "are_care":
          rows = await db.select().from(armCare).where(eq(armCare.id, relation.assessmentId));
          break;
        case "smfa":
          rows = await db
            .select()
            .from(smfaBoolean)
            .where(eq(smfaBoolean.id, relation.assessmentId));
          break;
        case "force_plate":
          rows = await db
            .select()
            .from(hawkinsForcePlate)
            .where(eq(hawkinsForcePlate.id, relation.assessmentId));
          break;
        case "true_strength":
          rows = await db
            .select()
            .from(trueStrength)
            .where(eq(trueStrength.id, relation.assessmentId));
          break;
        case "hitting_assessment":
          rows = await db
            .select()
            .from(hittingAssessment)
            .where(eq(hittingAssessment.id, relation.assessmentId));
          break;
        case "pitching_assessment":
          rows = await db
            .select()
            .from(pitchingAssessment)
            .where(eq(pitchingAssessment.id, relation.assessmentId));
          break;
        case "velo_assessment":
          rows = await db
            .select()
            .from(veloAssessment)
            .where(eq(veloAssessment.id, relation.assessmentId));
          break;
        case "hit_trax_assessment":
          rows = await db
            .select()
            .from(hitTraxAssessment)
            .where(eq(hitTraxAssessment.id, relation.assessmentId));
          break;
        default:
          rows = undefined;
      }

      return {
        lessonType: relation.assessmentType,
        data: Array.isArray(rows) && rows.length > 0 ? rows[0] : null,
      };
    })
  );
}

export async function getLessonsByPlayerId(id: string) {
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
}
export async function getLessonsByPlayerIdScoped(id: string, facilityId: string) {
    try {
      const lessons = await db
        .select({
          lesson: lesson,
          coach: users,
        })
        .from(lesson)
        .innerJoin(users, eq(lesson.coachId, users.id))
        .innerJoin(playerInformation, eq(lesson.playerId, playerInformation.id))
        .where(
          and(
            eq(lesson.playerId, id),
            eq(playerInformation.facilityId, facilityId)
          )
        )
        .orderBy(desc(lesson.lessonDate));

      return lessons;
    } catch (error) {
      console.error(
        "[LessonRepo] getLessonsByPlayerIdScoped - Database error: ",
        error
      );
      throw new Error("Failed to fetch lessons from the database");
    }
}
  /**
   * Retrieves a player's lesson report from the database.
   * @param playerId - The ID of the player to retrieve lessons for.
   * @param lessonCount - The number of lessons to retrieve.
   * @returns The player's lesson report.
   */
export async function getLessonReportByPlayerId(playerId: string, lessonCount: number) {
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
          const assessments = await getAssessmentsByLessonId(
            lessonItem.lessonId
          );

          const cleanedAssessments = assessments
            .map((assessment) => ({
              assessmentType: assessment.lessonType,
              data: cleanAssessmentData(
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
}
export async function getLessonReportByPlayerIdScoped(
    playerId: string,
    lessonCount: number,
    facilityId: string
) {
    const player = await db
      .select({
        player: playerInformation,
      })
      .from(playerInformation)
      .where(
        and(
          eq(playerInformation.id, playerId),
          eq(playerInformation.facilityId, facilityId)
        )
      );

    if (player.length === 0) {
      return null;
    }

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
      .innerJoin(playerInformation, eq(lesson.playerId, playerInformation.id))
      .where(
        and(
          eq(lesson.playerId, playerId),
          eq(playerInformation.facilityId, facilityId)
        )
      )
      .orderBy(desc(lesson.lessonDate))
      .limit(lessonCount);

    const lessonsWithAssessments = await Promise.all(
      lessonsData.map(async (lessonItem) => {
        const assessments = await getAssessmentsByLessonId(
          lessonItem.lessonId
        );

        const cleanedAssessments = assessments
          .map((assessment) => ({
            assessmentType: assessment.lessonType,
            data: cleanAssessmentData(
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
}

  /**
   * Removes unnecessary fields from assessment data for report generation.
   * @param data - Assessment data to clean
   * @returns Cleaned assessment data
   */
export function cleanAssessmentData(data: AssessmentDataSelect) {
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
}
