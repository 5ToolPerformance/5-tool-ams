import { date, index, pgTable, real, text, uuid } from "drizzle-orm/pg-core";

import { lesson } from "..";

const hitTraxAssessment = pgTable(
  "hittrax_assessment",
  {
    id: uuid("id").defaultRandom().notNull().primaryKey(),
    playerId: uuid("player_id").notNull(),
    coachId: uuid("coach_id").notNull(),
    lessonId: uuid("lesson_id")
      .notNull()
      .references(() => lesson.id, { onDelete: "cascade" }),
    pitchType: text("pitch_type"),
    avgExitVelo: real("avg_exit_velo"),
    avgHardHit: real("avg_hard_hit"),
    maxVelo: real("max_velo"),
    maxDist: real("max_dist"),
    fbAndGbPct: real("fb_and_gb_pct"),
    lineDrivePct: real("line_drive_pct"),
    createdOn: date("created_on", { mode: "string" }).notNull().defaultNow(),
  },
  (table) => [index("hittrax_assessment_lesson_idx").on(table.lessonId)]
);

export default hitTraxAssessment;
