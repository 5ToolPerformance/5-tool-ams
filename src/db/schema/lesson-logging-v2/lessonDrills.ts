import { index, pgTable, text, uuid } from "drizzle-orm/pg-core";

import { drills, lessonPlayers } from "@/db/schema";

export const lessonDrills = pgTable(
  "lesson_drills",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    lessonPlayerId: uuid("lesson_player_id")
      .notNull()
      .references(() => lessonPlayers.id, { onDelete: "cascade" }),

    drillId: uuid("drill_id")
      .notNull()
      .references(() => drills.id, { onDelete: "cascade" }),

    notes: text("notes"),
  },
  (t) => [
    index("lesson_drills_player_idx").on(t.lessonPlayerId),
    index("lesson_drills_drill_idx").on(t.drillId),
  ]
);
