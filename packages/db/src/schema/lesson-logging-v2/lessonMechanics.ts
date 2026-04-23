import { index, pgTable, text, uuid } from "drizzle-orm/pg-core";

import { lesson, mechanics, playerInformation } from "@/db/schema";

export const lessonMechanics = pgTable(
  "lesson_mechanics",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    lessonId: uuid("lesson_id")
      .notNull()
      .references(() => lesson.id, { onDelete: "cascade" }),
    playerId: uuid("player_id")
      .notNull()
      .references(() => playerInformation.id, { onDelete: "cascade" }),
    mechanicId: uuid("mechanic_id")
      .notNull()
      .references(() => mechanics.id, { onDelete: "cascade" }),

    notes: text("notes"),
  },
  (t) => [
    index("lesson_mechanics_lesson_idx").on(t.lessonId),
    index("lesson_mechanics_player_idx").on(t.playerId),
    index("lesson_mechanics_mechanic_idx").on(t.mechanicId),
  ]
);
