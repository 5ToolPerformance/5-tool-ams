// db/queries/playerNotes.ts
import { desc, eq } from "drizzle-orm";

import db from "@/db";
import { playerNotes, users } from "@/db/schema";

export async function getRecentPlayerNotes(playerId: string, limit = 5) {
  return db
    .select({
      id: playerNotes.id,
      content: playerNotes.content,
      createdAt: playerNotes.createdAt,
      type: playerNotes.type,
      author: {
        id: users.id,
        name: users.name,
        role: users.role,
      },
    })
    .from(playerNotes)
    .leftJoin(users, eq(playerNotes.authorId, users.id))
    .where(eq(playerNotes.playerId, playerId))
    .orderBy(desc(playerNotes.createdAt))
    .limit(limit);
}
