import { index, jsonb, pgEnum, pgTable, text, uuid } from "drizzle-orm/pg-core";

import { lessonPlayers } from "@/db/schema";

export const lessonRoutineSourceEnum = pgEnum("lesson_routine_source", [
  "player",
  "universal",
]);

export const lessonPlayerRoutines = pgTable(
  "lesson_player_routines",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    lessonPlayerId: uuid("lesson_player_id")
      .notNull()
      .references(() => lessonPlayers.id, { onDelete: "cascade" }),
    sourceRoutineId: uuid("source_routine_id").notNull(),
    sourceRoutineSource: lessonRoutineSourceEnum("source_routine_source").notNull(),
    sourceRoutineType: text("source_routine_type").notNull(),
    sourceRoutineTitle: text("source_routine_title").notNull(),
    sourceRoutineDocument: jsonb("source_routine_document").notNull(),
  },
  (table) => [
    index("lesson_player_routines_lesson_player_idx").on(table.lessonPlayerId),
    index("lesson_player_routines_source_routine_idx").on(table.sourceRoutineId),
  ]
);
