import { eq } from "drizzle-orm";

import db from "@/db";
import { notes } from "@/db/schema";

export const getNotesByUserId = async (userId: string) => {
  const result = await db.select().from(notes).where(eq(notes.userId, userId));
  return result;
};

export const createLessonNote = async ({
  userId, // player
  coachId,
  lessonDate,
  notesText,
}: {
  userId: string;
  coachId: string;
  lessonDate: Date;
  notesText: string;
}) => {
  return db.insert(notes).values({
    userId,
    coachId,
    notes: notesText,
    lessonDate,
  });
};
