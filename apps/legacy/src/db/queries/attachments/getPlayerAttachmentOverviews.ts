import { and, desc, eq, isNull } from "drizzle-orm";

import db from "@/db";
import { attachmentFiles, attachments } from "@/db/schema";

export async function getPlayerAttachmentOverviews(athleteId: string) {
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
    })
    .from(attachments)
    .leftJoin(
      attachmentFiles,
      eq(attachmentFiles.attachmentId, attachments.id)
    )
    .where(
      and(eq(attachments.athleteId, athleteId), isNull(attachments.deletedAt))
    )
    .orderBy(desc(attachments.createdAt));
}
