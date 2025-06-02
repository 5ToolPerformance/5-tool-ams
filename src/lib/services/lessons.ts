import { desc, eq } from "drizzle-orm";

import db from "@/db";
import lesson from "@/db/schema/lesson";
import users from "@/db/schema/users";
import { CreateLessonRequest, LessonType } from "@/types/lessons";

/**
 * Service for managing lessons in the database.
 */
export class LessonService {
  static async getUsers() {
    try {
      return await db.select().from(users).where(eq(users.role, "player"));
    } catch (error) {
      console.error("Error fetching users:", error);
      throw new Error("Failed to fetch users");
    }
  }

  static async getCoaches() {
    try {
      return await db.select().from(users).where(eq(users.role, "coach"));
    } catch (error) {
      console.error("Error fetching coaches:", error);
      throw new Error("Failed to fetch coaches");
    }
  }

  /**
   * Create a new lesson in the database.
   * @param data - Data for creating a new lesson
   * @returns The newly created lesson object
   */
  static async createLesson(data: CreateLessonRequest) {
    try {
      const [newLesson] = await db
        .insert(lesson)
        .values({
          userId: data.userId,
          coachId: data.coachId,
          type: data.type,
          lessonDate: new Date(data.lessonDate),
          notes: data.notes,
        })
        .returning();

      return newLesson;
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
        .where(eq(users.id, foundLesson.userId))
        .limit(1);

      // Get coach data
      const coachData = await db
        .select()
        .from(users)
        .where(eq(users.id, foundLesson.coachId))
        .limit(1);

      return {
        ...foundLesson,
        user: playerData[0] || null,
        coach: coachData[0] || null,
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
        .where(eq(lesson.userId, userId))
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
            .where(eq(users.id, lessonItem.userId))
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

  static validateLessonData(data: CreateLessonRequest): string[] {
    const errors: string[] = [];

    if (!data.userId) {
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
  static async updateLesson(id: string, data: Partial<CreateLessonRequest>) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const updateData: any = {};

      if (data.userId) updateData.userId = data.userId;
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
        .innerJoin(users, eq(lesson.userId, users.id))
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
        .where(eq(lesson.userId, userId))
        .orderBy(desc(lesson.lessonDate));
    } catch (error) {
      console.error("Error fetching lessons by user with join:", error);
      throw new Error("Failed to fetch lessons");
    }
  }

  static async getNumberOfLessonsByPlayer(userId: string) {
    try {
      const lessons = await db
        .select({
          lesson: lesson,
          coach: users,
        })
        .from(lesson)
        .innerJoin(users, eq(lesson.coachId, users.id))
        .where(eq(lesson.userId, userId));

      return lessons.length;
    } catch (error) {
      console.error("Error fetching number of lessons by player:", error);
      throw new Error("Failed to fetch number of lessons");
    }
  }
}
