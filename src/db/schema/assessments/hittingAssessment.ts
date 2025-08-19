import {
  index,
  pgTable,
  real,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import lesson from "../lesson";

const hittingAssessment = pgTable(
  "hitting_assessment",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    playerId: uuid("player_id").notNull(),
    coachId: uuid("coach_id").notNull(),
    lessonId: uuid("lesson_id")
      .notNull()
      .references(() => lesson.id, { onDelete: "cascade" }),
    notes: text("notes"),
    upper: text("upper"),
    lower: text("lower"),
    head: text("head"),
    load: text("load"),
    max_ev: real("max_ev"),
    line_drive_pct: real("line_drive_pct"),
    lessonDate: timestamp("lesson_date", { mode: "string" }).notNull(),
    createdOn: timestamp("created_on", { mode: "string" })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("hitting_assessment_lesson_idx").on(table.lessonId)]
);

export default hittingAssessment;
