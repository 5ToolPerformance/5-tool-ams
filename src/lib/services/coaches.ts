import { LessonSelect } from "@/types/database";

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
  static async countLessonsByLessonType(lessons: LessonSelect[]) {
    try {
      const lessonTypes = lessons.map((lesson) => lesson.lessonType);
      const uniqueLessonTypes = [...new Set(lessonTypes)];
      return uniqueLessonTypes.length;
    } catch (error) {
      console.error("Error counting lessons by lesson type:", error);
      throw new Error("Failed to count lessons by lesson type");
    }
  }
}
