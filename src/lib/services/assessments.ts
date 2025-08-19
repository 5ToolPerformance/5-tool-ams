import { eq } from "drizzle-orm";

import db from "@/db";
import {
  armCare,
  hawkinsForcePlate,
  hittingAssessment,
  lessonAssessments,
  pitchingAssessment,
  smfaBoolean,
  trueStrength,
} from "@/db/schema";

/**
 * Service for managing assessments in the database.
 */
export class AssessmentService {
  /**
   * Fetch an arm care assessment by its unique ID in the database.
   * @param id - The ID of the arm care assessment to fetch
   * @returns The arm care assessment object, or null if not found
   * @throws Error if there is an error with the database query
   */
  static async getArmCareAssessmentById(id: string) {
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
  static async getSmfaAssessmentById(id: string) {
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
  static async getForcePlateAssessmentById(id: string) {
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
  static async getTrueStrengthAssessmentById(id: string) {
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
  static async getHittingAssessmentById(id: string) {
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
  static async getPitchingAssessmentById(id: string) {
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

  static async getAssessmentsByLessonId(
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

      const results: Array<{ lessonType: string; data: unknown | null }> = await Promise.all(
        assessmentRelations.map(async (relation) => {
          let rows: unknown[] | undefined;

          switch (relation.assessmentType) {
            case "arm_care":
            case "are_care": // handle enum typo
              rows = await AssessmentService.getArmCareAssessmentById(
                relation.assessmentId
              );
              break;
            case "smfa":
              rows = await AssessmentService.getSmfaAssessmentById(
                relation.assessmentId
              );
              break;
            case "force_plate":
              rows = await AssessmentService.getForcePlateAssessmentById(
                relation.assessmentId
              );
              break;
            case "true_strength":
              rows = await AssessmentService.getTrueStrengthAssessmentById(
                relation.assessmentId
              );
              break;
            case "hitting_assessment":
              rows = await AssessmentService.getHittingAssessmentById(
                relation.assessmentId
              );
              break;
            case "pitching_assessment":
              rows = await AssessmentService.getPitchingAssessmentById(
                relation.assessmentId
              );
              break;
            default:
              rows = undefined;
          }

          const data = Array.isArray(rows) ? (rows[0] as unknown) ?? null : null;

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
}
