// application/overview/getOverviewData.ts
import { getPlayerAttachmentOverviews } from "@ams/db/queries/attachments/getPlayerAttachmentOverviews";
import { getLessonsByPlayerId } from "@ams/db/queries/lessons/lessonQueries";
import { getRecentPlayerNotes } from "@ams/db/queries/players/notes/getRecentPlayerNotes";
import {
  buildCurrentFocus,
  buildRecentActivity,
} from "@ams/domain/player/overview";

export async function getOverviewData(playerId: string) {
  const [lessons, rawNotes, attachments] = await Promise.all([
    getLessonsByPlayerId(playerId),
    getRecentPlayerNotes(playerId),
    getPlayerAttachmentOverviews(playerId),
  ]);

  const notes = rawNotes.map((n) => ({
    id: n.id,
    content: n.content,
    createdAt: n.createdAt,
    type: n.type ?? "general",
    author: {
      id: n.author?.id ?? "unknown",
      name: n.author?.name ?? "Unknown",
      role: n.author?.role ?? undefined,
    },
  }));

  return {
    currentFocus: buildCurrentFocus(lessons),
    recentActivity: buildRecentActivity(lessons, notes),
    notes,
    attachments,
  };
}
