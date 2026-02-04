import { and, desc, eq, isNull } from "drizzle-orm";

import db from "@/db";
import {
  attachmentFiles,
  attachments,
  lesson,
  lessonPlayers,
  users,
} from "@/db/schema";

export async function getPlayerAttachmentsForDocumentsTab(athleteId: string) {
  return db
    .select({
      id: attachments.id,
      type: attachments.type,
      source: attachments.source,
      evidenceCategory: attachments.evidenceCategory,
      visibility: attachments.visibility,
      documentType: attachments.documentType,
      notes: attachments.notes,
      createdAt: attachments.createdAt,
      lessonPlayerId: attachments.lessonPlayerId,
      file: {
        originalFileName: attachmentFiles.originalFileName,
        mimeType: attachmentFiles.mimeType,
        fileSizeBytes: attachmentFiles.fileSizeBytes,
        storageKey: attachmentFiles.storageKey,
      },
      lesson: {
        id: lesson.id,
        lessonDate: lesson.lessonDate,
        lessonType: lesson.lessonType,
        coachName: users.name,
      },
    })
    .from(attachments)
    .leftJoin(
      attachmentFiles,
      eq(attachmentFiles.attachmentId, attachments.id)
    )
    .leftJoin(lessonPlayers, eq(lessonPlayers.id, attachments.lessonPlayerId))
    .leftJoin(lesson, eq(lesson.id, lessonPlayers.lessonId))
    .leftJoin(users, eq(users.id, lesson.coachId))
    .where(
      and(eq(attachments.athleteId, athleteId), isNull(attachments.deletedAt))
    )
    .orderBy(desc(attachments.createdAt));
}
