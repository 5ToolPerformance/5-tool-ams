import db from "@/db";
import { armCare, hawkinsForcePlate, smfa, trueStrength } from "@/db/schema";
import { eq } from "drizzle-orm";

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
      return await db.select().from(smfa).where(eq(smfa.id, id));
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
      return await db.select().from(hawkinsForcePlate).where(eq(hawkinsForcePlate.id, id));
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
      return await db.select().from(trueStrength).where(eq(trueStrength.id, id));
    } catch (error) {
      console.error("Error fetching true strength assessment by ID:", error);
      throw new Error("Failed to fetch true strength assessment");
    }
  }
}