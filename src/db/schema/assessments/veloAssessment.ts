import { integer, pgTable, real, uuid } from "drizzle-orm/pg-core";

import { lesson } from "..";

const veloAssessment = pgTable("velo_assessment", {
  id: uuid("id").defaultRandom().notNull().primaryKey(),
  playerId: uuid("player_id").notNull(),
  coachId: uuid("coach_id").notNull(),
  lessonId: uuid("lesson_id")
    .notNull()
    .references(() => lesson.id, { onDelete: "cascade" }),
  intent: integer("intent"),
  avgVelo: real("avg_velo"),
  topVelo: real("top_velo"),
  strikePct: real("strike_pct"),
});

export default veloAssessment;
