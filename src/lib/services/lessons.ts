import { desc, eq } from "drizzle-orm";

import db from "@/db";
import {
  armCare,
  hawkinsForcePlate,
  hittingAssessment,
  lesson,
  lessonAssessments,
  pitchingAssessment,
  smfaBoolean,
  trueStrength,
  users,
} from "@/db/schema";
import { AssessmentType } from "@/types/assessments";
import {
  ArmCareInsert,
  ForcePlateInsert,
  HittingAssessmentInsert,
  PitchingAssessmentInsert,
  SmfaInsert,
  TrueStrengthInsert,
} from "@/types/database";
import { LessonCreateData, LessonType } from "@/types/lessons";

import { AssessmentService } from "./assessments";

/**
 * Service for managing lessons in the database.
 */
export class LessonService {
  /**
   * Create a new lesson in the database.
   * @param data - Data for creating a new lesson
   * @returns The newly created lesson object
   */
  static async createLesson(data: LessonCreateData) {
    try {
      return await db.transaction(async (tx) => {
        const [newLesson] = await tx
          .insert(lesson)
          .values({
            coachId: data.coachId,
            playerId: data.playerId,
            lessonType: data.type,
            lessonDate: new Date(data.lessonDate),
            notes: data.notes || null,
          })
          .returning({ id: lesson.id });

        const lessonId = newLesson.id;
        const assessmentIds: { type: string; id: string }[] = [];

        if (data.armCare) {
          const [armCareAssessment] = await tx
            .insert(armCare)
            .values({
              lessonId: lessonId,
              playerId: data.playerId,
              coachId: data.coachId,
              notes: data.armCare.notes,
              shoulder_er_l: data.armCare.shoulder_er_l,
              shoulder_er_r: data.armCare.shoulder_er_r,
              shoulder_ir_l: data.armCare.shoulder_ir_l,
              shoulder_ir_r: data.armCare.shoulder_ir_r,
              shoulder_flexion_l: data.armCare.shoulder_flexion_l,
              shoulder_flexion_r: data.armCare.shoulder_flexion_r,
              supine_hip_er_l: data.armCare.supine_hip_er_l,
              supine_hip_er_r: data.armCare.supine_hip_er_r,
              supine_hip_ir_l: data.armCare.supine_hip_ir_l,
              supine_hip_ir_r: data.armCare.supine_hip_ir_r,
              straight_leg_l: data.armCare.straight_leg_l,
              straight_leg_r: data.armCare.straight_leg_r,
              lessonDate: new Date(data.lessonDate),
            } as ArmCareInsert)
            .returning({ id: armCare.id });

          assessmentIds.push({ type: "arm_care", id: armCareAssessment.id });
        }

        if (data.smfa) {
          const [smfaAssessment] = await tx
            .insert(smfaBoolean)
            .values({
              lessonId: lessonId,
              playerId: data.playerId,
              coachId: data.coachId,
              notes: data.smfa.notes,
              pelvic_rotation_l: data.smfa.pelvic_rotation_l,
              pelvic_rotation_r: data.smfa.pelvic_rotation_r,
              seated_trunk_rotation_l: data.smfa.seated_trunk_rotation_l,
              seated_trunk_rotation_r: data.smfa.seated_trunk_rotation_r,
              ankle_test_l: data.smfa.ankle_test_l,
              ankle_test_r: data.smfa.ankle_test_r,
              forearm_test_l: data.smfa.forearm_test_l,
              forearm_test_r: data.smfa.forearm_test_r,
              cervical_rotation_l: data.smfa.cervical_rotation_l,
              cervical_rotation_r: data.smfa.cervical_rotation_r,
              msf_l: data.smfa.msf_l,
              msf_r: data.smfa.msf_r,
              mse_l: data.smfa.mse_l,
              mse_r: data.smfa.mse_r,
              msr_l: data.smfa.msr_l,
              msr_r: data.smfa.msr_r,
              pelvic_tilt: data.smfa.pelvic_tilt,
              squat_test: data.smfa.squat_test,
              cervical_flexion: data.smfa.cervical_flexion,
              cervical_extension: data.smfa.cervical_extension,
              lessonDate: new Date(data.lessonDate),
            } as SmfaInsert)
            .returning({ id: smfaBoolean.id });

          assessmentIds.push({ type: "smfa", id: smfaAssessment.id });
        }

        if (data.forcePlate) {
          const [forcePlateAssessment] = await tx
            .insert(hawkinsForcePlate)
            .values({
              playerId: data.playerId,
              coachId: data.coachId,
              lessonId: lessonId,
              notes: data.forcePlate.notes,
              cmj: data.forcePlate.cmj,
              drop_jump: data.forcePlate.drop_jump,
              pogo: data.forcePlate.pogo,
              mid_thigh_pull: data.forcePlate.mid_thigh_pull,
              mtp_time: data.forcePlate.mtp_time,
              cop_ml_l: data.forcePlate.cop_ml_l,
              cop_ml_r: data.forcePlate.cop_ml_r,
              cop_ap_l: data.forcePlate.cop_ap_l,
              cop_ap_r: data.forcePlate.cop_ap_r,
              lessonDate: new Date(data.lessonDate),
            } as ForcePlateInsert)
            .returning({ id: hawkinsForcePlate.id });

          assessmentIds.push({
            type: "force_plate",
            id: forcePlateAssessment.id,
          });
        }

        if (data.trueStrength) {
          const [trueStrengthAssessment] = await tx
            .insert(trueStrength)
            .values({
              playerId: data.playerId,
              coachId: data.coachId,
              lessonId: lessonId,
              notes: data.trueStrength.notes,
              seated_shoulder_er_l: data.trueStrength.seated_shoulder_er_l,
              seated_shoulder_er_r: data.trueStrength.seated_shoulder_er_r,
              seated_shoulder_ir_l: data.trueStrength.seated_shoulder_ir_l,
              seated_shoulder_ir_r: data.trueStrength.seated_shoulder_ir_r,
              shoulder_rotation_l: data.trueStrength.shoulder_rotation_l,
              shoulder_rotation_r: data.trueStrength.shoulder_rotation_r,
              shoulder_rotation_rfd_l:
                data.trueStrength.shoulder_rotation_rfd_l,
              shoulder_rotation_rfd_r:
                data.trueStrength.shoulder_rotation_rfd_r,
              hip_rotation_l: data.trueStrength.hip_rotation_l,
              hip_rotation_r: data.trueStrength.hip_rotation_r,
              hip_rotation_rfd_l: data.trueStrength.hip_rotation_rfd_l,
              hip_rotation_rfd_r: data.trueStrength.hip_rotation_rfd_r,
              lessonDate: new Date(data.lessonDate),
            } as TrueStrengthInsert)
            .returning({ id: trueStrength.id });

          assessmentIds.push({
            type: "true_strength",
            id: trueStrengthAssessment.id,
          });
        }

        if (data.hittingAssessment) {
          const [hittingAssessmentForm] = await tx
            .insert(hittingAssessment)
            .values({
              lessonId: lessonId,
              playerId: data.playerId,
              coachId: data.coachId,
              notes: data.hittingAssessment.notes,
              upper: data.hittingAssessment.upper,
              lower: data.hittingAssessment.lower,
              head: data.hittingAssessment.head,
              load: data.hittingAssessment.load,
              max_ev: data.hittingAssessment.max_ev,
              line_drive_pct: data.hittingAssessment.line_drive_pct,
              lessonDate: new Date(data.lessonDate),
            } as HittingAssessmentInsert)
            .returning({ id: hittingAssessment.id });

          assessmentIds.push({
            type: "hitting_assessment",
            id: hittingAssessmentForm.id,
          });
        }

        if (data.pitchingAssessment) {
          const [pitchingAssessmentForm] = await tx
            .insert(pitchingAssessment)
            .values({
              lessonId: lessonId,
              playerId: data.playerId,
              coachId: data.coachId,
              notes: data.pitchingAssessment.notes,
              upper: data.pitchingAssessment.upper,
              mid: data.pitchingAssessment.mid,
              lower: data.pitchingAssessment.lower,
              velo_mound_2oz: data.pitchingAssessment.velo_mound_2oz,
              velo_mound_4oz: data.pitchingAssessment.velo_mound_4oz,
              velo_mound_5oz: data.pitchingAssessment.velo_mound_5oz,
              velo_mound_6oz: data.pitchingAssessment.velo_mound_6oz,
              velo_pull_down_2oz: data.pitchingAssessment.velo_pull_down_2oz,
              velo_pull_down_4oz: data.pitchingAssessment.velo_pull_down_4oz,
              velo_pull_down_5oz: data.pitchingAssessment.velo_pull_down_5oz,
              velo_pull_down_6oz: data.pitchingAssessment.velo_pull_down_6oz,
              strike_pct: data.pitchingAssessment.strike_pct,
              goals: data.pitchingAssessment.goals,
              last_time_pitched: data.pitchingAssessment.last_time_pitched,
              next_time_pitched: data.pitchingAssessment.next_time_pitched,
              feel: data.pitchingAssessment.feel,
              concerns: data.pitchingAssessment.concerns,
              lessonDate: new Date(data.lessonDate),
            } as PitchingAssessmentInsert)
            .returning({ id: pitchingAssessment.id });

          assessmentIds.push({
            type: "pitching_assessment",
            id: pitchingAssessmentForm.id,
          });
        }

        if (assessmentIds.length > 0) {
          await tx.insert(lessonAssessments).values(
            assessmentIds.map(({ type, id }) => ({
              lessonId,
              assessmentType: type as AssessmentType, // Cast to your enum type
              assessmentId: id,
            }))
          );
        }
      });
    } catch (error) {
      console.error("Error creating lesson:", error);
      throw new Error("Failed to create lesson");
    }
  }

  /**
   * Fetch a lesson by its unique ID in the database.
   * @param id - The ID of the lesson to fetch
   * @returns The lesson object with player and coach data, or null if not found
   * @throws Error if there is an error with the database query
   */
  static async getLessonById(id: string) {
    try {
      // Get the lesson
      const lessonData = await db
        .select()
        .from(lesson)
        .where(eq(lesson.id, id))
        .limit(1);

      if (lessonData.length === 0) {
        return null;
      }

      const foundLesson = lessonData[0];

      // Get user (player) data
      const playerData = await db
        .select()
        .from(users)
        .where(eq(users.id, foundLesson.playerId))
        .limit(1);

      // Get coach data
      const coachData = await db
        .select()
        .from(users)
        .where(eq(users.id, foundLesson.coachId))
        .limit(1);

      const assessmentData = await db
        .select({
          assessmentType: lessonAssessments.assessmentType,
          assessmentId: lessonAssessments.assessmentId,
        })
        .from(lessonAssessments)
        .where(eq(lessonAssessments.lessonId, id));

      return {
        ...foundLesson,
        user: playerData[0] || null,
        coach: coachData[0] || null,
        assessments: assessmentData || null,
      };
    } catch (error) {
      console.error("Error fetching lesson:", error);
      throw new Error("Failed to fetch lesson");
    }
  }

  /**
   * Fetch all lessons in the database.
   * @param userId - The ID of the user to fetch lessons for
   * @returns An array of all lessons with player and coach data
   * @throws Error if there is an error with the database query
   */
  static async getLessonsByUser(userId: string) {
    try {
      // Get lessons for the user
      const lessons = await db
        .select()
        .from(lesson)
        .where(eq(lesson.playerId, userId))
        .orderBy(desc(lesson.lessonDate));

      // Get coach data for each lesson
      const lessonsWithCoaches = await Promise.all(
        lessons.map(async (lessonItem) => {
          const coachData = await db
            .select()
            .from(users)
            .where(eq(users.id, lessonItem.coachId))
            .limit(1);

          return {
            ...lessonItem,
            coach: coachData[0] || null,
          };
        })
      );

      return lessonsWithCoaches;
    } catch (error) {
      console.error("Error fetching lessons by user:", error);
      throw new Error("Failed to fetch lessons");
    }
  }

  static async getLessonsByCoach(coachId: string) {
    try {
      // Get lessons for the coach
      const lessons = await db
        .select()
        .from(lesson)
        .where(eq(lesson.coachId, coachId))
        .orderBy(desc(lesson.lessonDate));

      // Get user (player) data for each lesson
      const lessonsWithUsers = await Promise.all(
        lessons.map(async (lessonItem) => {
          const userData = await db
            .select()
            .from(users)
            .where(eq(users.id, lessonItem.playerId))
            .limit(1);

          return {
            ...lessonItem,
            user: userData[0] || null,
          };
        })
      );

      return lessonsWithUsers;
    } catch (error) {
      console.error("Error fetching lessons by coach:", error);
      throw new Error("Failed to fetch lessons");
    }
  }

  static validateLessonData(data: LessonCreateData): string[] {
    const errors: string[] = [];

    if (!data.playerId) {
      errors.push("Player is required");
    }

    if (!data.coachId) {
      errors.push("Coach is required");
    }

    if (!data.type) {
      errors.push("Lesson type is required");
    }

    const validTypes: LessonType[] = [
      "strength",
      "hitting",
      "pitching",
      "fielding",
    ];
    if (data.type && !validTypes.includes(data.type)) {
      errors.push("Invalid lesson type");
    }

    if (!data.lessonDate) {
      errors.push("Lesson date is required");
    } else {
      const lessonDate = new Date(data.lessonDate);
      if (isNaN(lessonDate.getTime())) {
        errors.push("Invalid lesson date");
      }
    }

    return errors;
  }

  static async deleteLessonById(id: string) {
    try {
      const [deletedLesson] = await db
        .delete(lesson)
        .where(eq(lesson.id, id))
        .returning();

      return deletedLesson;
    } catch (error) {
      console.error("Error deleting lesson:", error);
      throw new Error("Failed to delete lesson");
    }
  }

  /**
   * Update an existing lesson in the database.
   * @param id - The is of the lesson to update
   * @param data - The data to update the lesson with
   * @returns The updated lesson object
   * @throws Error if there is an error with the database query
   */
  static async updateLesson(id: string, data: Partial<LessonCreateData>) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const updateData: any = {};

      if (data.playerId) updateData.userId = data.playerId;
      if (data.coachId) updateData.coachId = data.coachId;
      if (data.type) updateData.type = data.type;
      if (data.lessonDate) updateData.lessonDate = new Date(data.lessonDate);
      if (data.notes !== undefined) updateData.notes = data.notes;

      const [updatedLesson] = await db
        .update(lesson)
        .set(updateData)
        .where(eq(lesson.id, id))
        .returning();

      return updatedLesson;
    } catch (error) {
      console.error("Error updating lesson:", error);
      throw new Error("Failed to update lesson");
    }
  }

  // Alternative method using joins for better performance
  /**
   * Fetch lessons for a specific coach with user data using joins.
   * @param coachId - The ID of the coach to fetch lessons for
   * @returns the lessons with user data for the specified coach
   * @throws Error if there is an error with the database query
   */
  static async getLessonsByCoachWithJoin(coachId: string) {
    try {
      return await db
        .select({
          lesson: lesson,
          player: users,
        })
        .from(lesson)
        .innerJoin(users, eq(lesson.playerId, users.id))
        .where(eq(lesson.coachId, coachId))
        .orderBy(desc(lesson.lessonDate));
    } catch (error) {
      console.error("Error fetching lessons by coach with join:", error);
      throw new Error("Failed to fetch lessons");
    }
  }

  /**
   * Fetch lessons for a specific player with user data using joins.
   * @param coachId - The ID of the coach to fetch lessons for
   * @returns the lessons with user data for the specified coach
   * @throws Error if there is an error with the database query
   */
  static async getLessonsByPlayerWithJoin(userId: string) {
    try {
      return await db
        .select({
          lesson: lesson,
          coach: users,
        })
        .from(lesson)
        .innerJoin(users, eq(lesson.coachId, users.id))
        .where(eq(lesson.playerId, userId))
        .orderBy(desc(lesson.lessonDate));
    } catch (error) {
      console.error("Error fetching lessons by user with join:", error);
      throw new Error("Failed to fetch lessons");
    }
  }

  /**
   * Fetch the number of lessons that a player has completed
   * @param userId - The ID of the player to get lesson count for
   * @returns The number of lessons completed
   */
  static async getNumberOfLessonsByPlayer(userId: string) {
    try {
      const lessons = await db
        .select({
          lesson: lesson,
          coach: users,
        })
        .from(lesson)
        .innerJoin(users, eq(lesson.coachId, users.id))
        .where(eq(lesson.playerId, userId));

      return lessons.length;
    } catch (error) {
      console.error("Error fetching number of lessons by player:", error);
      throw new Error("Failed to fetch number of lessons");
    }
  }

  /**
   * Fetch all lessons for a player with join and assessments
   * @param userId - The ID of the player to get lessons for
   * @returns An array of lessons with player and coach data
   * @throws Error if there is an error with the database query
   */
  static async getLessonsByPlayerWithJoinAndAssessments(userId: string) {
    try {
      return await db
        .select({
          lesson: lesson,
          coach: users,
          assessments: lessonAssessments,
        })
        .from(lesson)
        .innerJoin(users, eq(lesson.coachId, users.id))
        .innerJoin(lessonAssessments, eq(lesson.id, lessonAssessments.lessonId))
        .where(eq(lesson.playerId, userId))
        .orderBy(desc(lesson.lessonDate));
    } catch (error) {
      console.error(
        "Error fetching lessons by user with join and assessments:",
        error
      );
      throw new Error("Failed to fetch lessons");
    }
  }

  /**
   * Fetch a lesson assessment by its unique ID in the database.
   * @param id - The ID of the lesson assessment to fetch
   * @param type - The type of the lesson assessment to fetch
   * @returns The lesson assessment object, or null if not found
   * @throws Error if there is an error with the database query
   */
  static async getLessonAssessmentById(id: string, type: string) {
    if (type === "force_plate") {
      return await AssessmentService.getForcePlateAssessmentById(id);
    } else if (type === "true_strength") {
      return await AssessmentService.getTrueStrengthAssessmentById(id);
    } else if (type === "arm_care") {
      return await AssessmentService.getArmCareAssessmentById(id);
    } else if (type === "smfa") {
      return await AssessmentService.getSmfaAssessmentById(id);
    } else if (type === "hitting") {
      return await AssessmentService.getHittingAssessmentById(id);
    } else if (type === "pitching") {
      return await AssessmentService.getPitchingAssessmentById(id);
    } else {
      throw new Error("Invalid assessment type");
    }
  }
}
