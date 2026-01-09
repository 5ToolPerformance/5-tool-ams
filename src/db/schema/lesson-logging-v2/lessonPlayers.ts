import { index, pgTable, text, uuid } from "drizzle-orm/pg-core";

import { lesson, playerInformation } from "@/db/schema";

export const lessonPlayers = pgTable(
  "lesson_players",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    lessonId: uuid("lesson_id")
      .notNull()
      .references(() => lesson.id, { onDelete: "cascade" }),

    playerId: uuid("player_id")
      .notNull()
      .references(() => playerInformation.id, {
        onDelete: "cascade",
      }),

    notes: text("notes"),
  },
  (table) => [
    index("lesson_players_lesson_idx").on(table.lessonId),
    index("lesson_players_player_idx").on(table.playerId),
  ]
);

export default lessonPlayers;
