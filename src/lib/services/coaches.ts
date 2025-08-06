import { LessonSelect } from "@/types/database";
import { LessonWithCoachAndUser } from "@/types/lessons";

/**
 * Service for coach related operations.
 */
export class CoachesService {
  /**
   * Counts the number of lessons for a specific coach.
   * @param lessons - The lessons to count
   * @returns the number of lessons
   * @throws Error if there is an error with the database query
   */
  static async countLessons(lessons: LessonSelect[]) {
    try {
      return lessons.length;
    } catch (error) {
      console.error("Error counting lessons:", error);
      throw new Error("Failed to count lessons");
    }
  }

  /**
   * Counts the number of lessons by lesson type for a specific coach.
   * @param lessons - The lessons to count
   * @returns the number of lessons
   * @throws Error if there is an error with the database query
   */
  static async countLessonsByLessonType(lessons: LessonWithCoachAndUser[]) {
    try {
      const lessonTypes = lessons.map((lesson) => lesson.lesson.lessonType);
      const uniqueLessonTypes = [...new Set(lessonTypes)];
      return uniqueLessonTypes.length;
    } catch (error) {
      console.error("Error counting lessons by lesson type:", error);
      throw new Error("Failed to count lessons by lesson type");
    }
  }

  /**
   * Counts the number of players for a specific coach.
   * @param lessons - The lessons to count
   * @returns the number of players
   * @throws Error if there is an error with the database query
   */
  static async countPlayers(lessons: LessonWithCoachAndUser[]) {
    try {
      const playerIds = lessons.map((lesson) => lesson.lesson.playerId);
      const uniquePlayerIds = [...new Set(playerIds)];
      return uniquePlayerIds.length;
    } catch (error) {
      console.error("Error counting players:", error);
      throw new Error("Failed to count players");
    }
  }

  static async getPlayerIdsFromLessons(lessons: LessonWithCoachAndUser[]) {
    try {
      const playerIds = lessons.map((lesson) => lesson.lesson.playerId);
      const uniquePlayerIds = [...new Set(playerIds)];
      return uniquePlayerIds;
    } catch (error) {
      console.error("Error getting player IDs from lessons:", error);
      throw new Error("Failed to get player IDs from lessons");
    }
  }
}
