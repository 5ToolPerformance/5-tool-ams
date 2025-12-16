import {
  index,
  pgEnum,
  pgTable,
  real,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import lesson from "../lesson";

export const dateRangeEnum = pgEnum("date_range", [
  "1-2",
  "3-4",
  "5-6",
  "7+",
  "na",
]);

const pitchingAssessment = pgTable(
  "pitching_assessment",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    playerId: uuid("player_id").notNull(),
    coachId: uuid("coach_id").notNull(),
    lessonId: uuid("lesson_id")
      .notNull()
      .references(() => lesson.id, { onDelete: "cascade" }),
    notes: text("notes"),
    upper: text("upper"),
    mid: text("mid"),
    lower: text("lower"),
    velo_mound_2oz: real("velo_mound_2oz"),
    velo_mound_4oz: real("velo_mound_4oz"),
    velo_mound_5oz: real("velo_mound_5oz"),
    velo_mound_6oz: real("velo_mound_6oz"),
    velo_pull_down_2oz: real("velo_pull_down_2oz"),
    velo_pull_down_4oz: real("velo_pull_down_4oz"),
    velo_pull_down_5oz: real("velo_pull_down_5oz"),
    velo_pull_down_6oz: real("velo_pull_down_6oz"),
    strike_pct: real("strike_pct"),
    goals: text("goals"),
    last_time_pitched: dateRangeEnum("last_time_pitched"),
    next_time_pitched: dateRangeEnum("next_time_pitched"),
    feel: real("feel"),
    concerns: text("concerns"),
    lessonDate: timestamp("lesson_date", { mode: "date" }),
    createdOn: timestamp("created_on", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => [index("pitching_assessment_lesson_idx").on(table.lessonId)]
);

export default pitchingAssessment;
