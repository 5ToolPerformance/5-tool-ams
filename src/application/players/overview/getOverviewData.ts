// application/overview/getOverviewData.ts
import { getLessonsByPlayerId } from "@/db/queries/lessons/lessonQueries";
import { getRecentPlayerNotes } from "@/db/queries/players/notes/getRecentPlayerNotes";
import {
  buildCurrentFocus,
  buildRecentActivity,
} from "@/domain/player/overview";

export async function getOverviewData(playerId: string) {
  const [lessons, rawNotes] = await Promise.all([
    getLessonsByPlayerId(playerId),
    getRecentPlayerNotes(playerId),
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
  };
}
