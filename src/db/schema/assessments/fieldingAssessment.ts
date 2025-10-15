import {
  index,
  pgTable,
  real,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import lesson from "../lesson";

const fieldingAssessment = pgTable(
  "fielding_assessment",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    playerId: uuid("player_id").notNull(),
    coachId: uuid("coach_id").notNull(),
    lessonId: uuid("lesson_id")
      .notNull()
      .references(() => lesson.id, { onDelete: "cascade" }),
    glovework: text("glovework"),
    footwork: text("footwork"),
    throwing: text("throwing"),
    throwdown_counter: real("throwdown_counter").notNull(),
    live: text("live"),
    consistency: text("consistency"),
    situational: text("situational"),
    createdOn: timestamp("created_on", { mode: "string" })
      .notNull()
      .defaultNow(),
    lessonDate: timestamp("lesson_date", { mode: "string" }).notNull(),
  },
  (table) => [index("fielding_assessment_lesson_idx").on(table.lessonId)]
);

export default fieldingAssessment;
