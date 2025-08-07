import { LessonSelect } from "@/types/database";
import {
  LessonCounts,
  LessonWithCoachAndUser,
  WeeklyChartData,
} from "@/types/lessons";

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

  static countLessonsByDateRange(lessons: LessonSelect[]): LessonCounts {
    try {
      if (!lessons || lessons.length === 0) {
        return { total: 0, last30Days: 0, last7Days: 0 };
      }

      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      let last30Days = 0;
      let last7Days = 0;

      lessons.forEach((lesson) => {
        const lessonDate = new Date(lesson.lessonDate);

        // Skip invalid dates
        if (isNaN(lessonDate.getTime())) return;

        // Count lessons in last 30 days
        if (lessonDate >= thirtyDaysAgo) {
          last30Days++;
        }

        // Count lessons in last 7 days
        if (lessonDate >= sevenDaysAgo) {
          last7Days++;
        }
      });

      return {
        total: lessons.length,
        last30Days,
        last7Days,
      };
    } catch (error) {
      console.error("Error counting lessons by date range:", error);
      throw new Error("Failed to count lessons by date range");
    }
  }

  static getLessonsByCurrentWeek(lessons: LessonSelect[]): WeeklyChartData[] {
    const weeklyData: WeeklyChartData[] = [
      { day: "Mon", lessons: 0 },
      { day: "Tue", lessons: 0 },
      { day: "Wed", lessons: 0 },
      { day: "Thu", lessons: 0 },
      { day: "Fri", lessons: 0 },
      { day: "Sat", lessons: 0 },
      { day: "Sun", lessons: 0 },
    ];

    if (!lessons || lessons.length === 0) {
      return weeklyData;
    }

    // Get the start of the current week (Monday) in UTC
    const today = new Date();
    const currentDay = today.getUTCDay(); // Use UTC day
    const daysFromMonday = currentDay === 0 ? 6 : currentDay - 1;

    const startOfWeek = new Date(today);
    startOfWeek.setUTCDate(today.getUTCDate() - daysFromMonday);
    startOfWeek.setUTCHours(0, 0, 0, 0);

    // Get the end of the current week (Sunday) in UTC
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setUTCDate(startOfWeek.getUTCDate() + 6);
    endOfWeek.setUTCHours(23, 59, 59, 999);

    lessons.forEach((lesson) => {
      const lessonDate = new Date(lesson.lessonDate);

      // Skip invalid dates
      if (isNaN(lessonDate.getTime())) return;

      // Check if lesson is in current week
      if (lessonDate >= startOfWeek && lessonDate <= endOfWeek) {
        const dayOfWeek = lessonDate.getUTCDay(); // ✅ Use UTC day instead of local day

        // Map UTC day (0-6) to our array index (0-6)
        let dayIndex;
        switch (dayOfWeek) {
          case 1:
            dayIndex = 0;
            break; // Monday -> index 0
          case 2:
            dayIndex = 1;
            break; // Tuesday -> index 1
          case 3:
            dayIndex = 2;
            break; // Wednesday -> index 2
          case 4:
            dayIndex = 3;
            break; // Thursday -> index 3
          case 5:
            dayIndex = 4;
            break; // Friday -> index 4
          case 6:
            dayIndex = 5;
            break; // Saturday -> index 5
          case 0:
            dayIndex = 6;
            break; // Sunday -> index 6
          default:
            return;
        }

        weeklyData[dayIndex].lessons++;
      }
    });

    return weeklyData;
  }
}
