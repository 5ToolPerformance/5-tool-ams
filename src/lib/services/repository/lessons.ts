import { desc, eq } from "drizzle-orm";

import db from "@/db";
import { lesson, users } from "@/db/schema";

export const lessonRepository = {
  getLessonsByPlayerId: async (id: string) => {
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
  },
};
