import { index, integer, pgTable, text, uuid } from "drizzle-orm/pg-core";

import lessonPlayers from "../lessonPlayers";

export const pitchingLessonPlayers = pgTable(
  "pitching_lesson_players",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    lessonPlayerId: uuid("lesson_player_id")
      .notNull()
      .references(() => lessonPlayers.id, {
        onDelete: "cascade",
      }),

    phase: text("phase").notNull(),

    pitchCount: integer("pitch_count"),

    intentPercent: integer("intent_percent"),
  },
  (table) => [index("pitching_lesson_players_lp_idx").on(table.lessonPlayerId)]
);

export default pitchingLessonPlayers;
