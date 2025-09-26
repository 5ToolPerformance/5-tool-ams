import { date, index, integer, pgTable, real, uuid } from "drizzle-orm/pg-core";

import { lesson } from "..";

const veloAssessment = pgTable(
  "velo_assessment",
  {
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
    createdOn: date("created_on", { mode: "string" }).notNull().defaultNow(),
  },
  (table) => [index("velo_assessment_lesson_idx").on(table.lessonId)]
);

export default veloAssessment;
