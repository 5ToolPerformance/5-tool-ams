import { eq } from "drizzle-orm";

import db from "@ams/db";
import {
  armCare,
  hawkinsForcePlate,
  hitTraxAssessment,
  hittingAssessment,
  lessonAssessments,
  pitchingAssessment,
  smfaBoolean,
  trueStrength,
  veloAssessment,
} from "@ams/db/schema";

/**
 * Service for managing assessments in the database.
 */
  /**
   * Fetch an arm care assessment by its unique ID in the database.
   * @param id - The ID of the arm care assessment to fetch
   * @returns The arm care assessment object, or null if not found
   * @throws Error if there is an error with the database query
   */
export async function getArmCareAssessmentById(id: string) {
    try {
      return await db.select().from(armCare).where(eq(armCare.id, id));
    } catch (error) {
      console.error("Error fetching arm care assessment by ID:", error);
      throw new Error("Failed to fetch arm care assessment");
    }
  }

  /**
   * Fetch an SMFA assessment by its unique ID in the database.
   * @param id - The ID of the SMFA assessment to fetch
   * @returns The SMFA assessment object, or null if not found
   * @throws Error if there is an error with the database query
   */
export async function getSmfaAssessmentById(id: string) {
    try {
      return await db.select().from(smfaBoolean).where(eq(smfaBoolean.id, id));
    } catch (error) {
      console.error("Error fetching smfa assessment by ID:", error);
      throw new Error("Failed to fetch smfa assessment");
    }
  }

  /**
   * Fetch a force plate assessment by its unique ID in the database.
   * @param id - The ID of the force plate assessment to fetch
   * @returns The force plate assessment object, or null if not found
   * @throws Error if there is an error with the database query
   */
export async function getForcePlateAssessmentById(id: string) {
    try {
      return await db
        .select()
        .from(hawkinsForcePlate)
        .where(eq(hawkinsForcePlate.id, id));
    } catch (error) {
      console.error("Error fetching force plate assessment by ID:", error);
      throw new Error("Failed to fetch force plate assessment");
    }
  }

  /**
   * Fetch a true strength assessment by its unique ID in the database.
   * @param id - The ID of the true strength assessment to fetch
   * @returns The true strength assessment object, or null if not found
   * @throws Error if there is an error with the database query
   */
export async function getTrueStrengthAssessmentById(id: string) {
    try {
      return await db
        .select()
        .from(trueStrength)
        .where(eq(trueStrength.id, id));
    } catch (error) {
      console.error("Error fetching true strength assessment by ID:", error);
      throw new Error("Failed to fetch true strength assessment");
    }
  }

  /**
   * Fetch a hitting assessment by its unique ID in the database.
   * @param id - The ID of the hitting assessment to fetch
   * @returns The hitting assessment object, or null if not found
   * @throws Error if there is an error with the database query
   */
export async function getHittingAssessmentById(id: string) {
    try {
      return await db
        .select()
        .from(hittingAssessment)
        .where(eq(hittingAssessment.id, id));
    } catch (error) {
      console.error("Error fetching hitting assessment by ID:", error);
      throw new Error("Failed to fetch hitting assessment");
    }
  }

  /**
   * Fetch a pitching assessment by its unique ID in the database.
   * @param id - The ID of the pitching assessment to fetch
   * @returns The pitching assessment object, or null if not found
   * @throws Error if there is an error with the database query
   */
export async function getPitchingAssessmentById(id: string) {
    try {
      return await db
        .select()
        .from(pitchingAssessment)
        .where(eq(pitchingAssessment.id, id));
    } catch (error) {
      console.error("Error fetching pitching assessment by ID:", error);
      throw new Error("Failed to fetch pitching assessment");
    }
  }

  /**
   * Fetch a velo assessment by its unique ID in the database.
   * @param id - The ID of the velo assessment to fetch
   * @returns The velo assessment object, or null if not found
   * @throws Error if there is an error with the database query
   */
export async function getVeloAssessmentById(id: string) {
    try {
      return await db
        .select()
        .from(veloAssessment)
        .where(eq(veloAssessment.id, id));
    } catch (error) {
      console.error("Error fetching pitching assessment by ID:", error);
      throw new Error("Failed to fetch pitching assessment");
    }
  }

export async function getHittraxAssessmentById(id: string) {
    try {
      return await db
        .select()
        .from(hitTraxAssessment)
        .where(eq(hitTraxAssessment.id, id));
    } catch (error) {
      console.error("Error fetching hittrax assessment by ID:", error);
      throw new Error("Failed to fetch hittrax assessment");
    }
  }

  /**
   * Fetch assessments for a specific lesson from the database.
   * @param lessonId - The ID of the lesson to fetch assessments for
   * @returns the assessments for the specified lesson
   * @throws Error if there is an error with the database query
   */
export async function getAssessmentsByLessonId(
    lessonId: string
  ): Promise<Array<{ lessonType: string; data: unknown | null }>> {
    try {
      const assessmentRelations = await db
        .select()
        .from(lessonAssessments)
        .where(eq(lessonAssessments.lessonId, lessonId));

      if (assessmentRelations.length === 0) {
        return [];
      }

      const results: Array<{ lessonType: string; data: unknown | null }> =
        await Promise.all(
          assessmentRelations.map(async (relation) => {
            let rows: unknown[] | undefined;

            switch (relation.assessmentType) {
              case "arm_care":
              case "are_care": // handle enum typo
                rows = await getArmCareAssessmentById(
                  relation.assessmentId
                );
                break;
              case "smfa":
                rows = await getSmfaAssessmentById(
                  relation.assessmentId
                );
                break;
              case "force_plate":
                rows = await getForcePlateAssessmentById(
                  relation.assessmentId
                );
                break;
              case "true_strength":
                rows = await getTrueStrengthAssessmentById(
                  relation.assessmentId
                );
                break;
              case "hitting_assessment":
                rows = await getHittingAssessmentById(
                  relation.assessmentId
                );
                break;
              case "pitching_assessment":
                rows = await getPitchingAssessmentById(
                  relation.assessmentId
                );
                break;
              case "velo_assessment":
                rows = await getVeloAssessmentById(
                  relation.assessmentId
                );
                break;
              case "hit_trax_assessment":
                rows = await getHittraxAssessmentById(
                  relation.assessmentId
                );
                break;
              default:
                rows = undefined;
            }

            const data = Array.isArray(rows)
              ? ((rows[0] as unknown) ?? null)
              : null;

            return {
              lessonType: relation.assessmentType,
              data,
            };
          })
        );

      return results;
    } catch (error) {
      console.error("Error fetching assessments by lesson ID:", error);
      throw new Error("Failed to fetch assessments");
    }
  }