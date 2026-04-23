import { integer, pgTable, text, uuid } from "drizzle-orm/pg-core";

import { injuryBodyPart, lessonPlayers } from "@/db/schema";

export const lessonPlayerFatigue = pgTable("lesson_player_fatigue", {
  id: uuid("id").defaultRandom().primaryKey(),
  lessonPlayerId: uuid("lesson_player_id")
    .notNull()
    .references(() => lessonPlayers.id, {
      onDelete: "cascade",
    }),
  report: text("report").notNull(),
  severity: integer("severity"),
  bodyPartId: uuid("body_part_id")
    .notNull()
    .references(() => injuryBodyPart.id),
});
