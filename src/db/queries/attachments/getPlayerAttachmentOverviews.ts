import { and, desc, eq, isNull } from "drizzle-orm";

import db from "@/db";
import { attachments } from "@/db/schema";

export async function getPlayerAttachmentOverviews(athleteId: string) {
  return db
    .select({
      id: attachments.id,
      type: attachments.type,
      source: attachments.source,
      notes: attachments.notes,
      createdAt: attachments.createdAt,
      lessonPlayerId: attachments.lessonPlayerId,
    })
    .from(attachments)
    .where(
      and(eq(attachments.athleteId, athleteId), isNull(attachments.deletedAt))
    )
    .orderBy(desc(attachments.createdAt));
}
