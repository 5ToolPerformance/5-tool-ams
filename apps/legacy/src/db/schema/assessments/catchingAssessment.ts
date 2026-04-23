import { index, integer, pgTable, text, uuid } from "drizzle-orm/pg-core";

import lesson from "../lesson";

const catchingAssessment = pgTable(
  "catching_assessment",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    playerId: uuid("player_id").notNull(),
    coachId: uuid("coach_id").notNull(),
    lessonId: uuid("lesson_id")
      .notNull()
      .references(() => lesson.id, { onDelete: "cascade" }),
    feel: integer("feel"),
    last4: integer("last_4"),
    readyBy: integer("ready_by"),
    catchThrow: text("catch_throw"),
    receiving: text("receiving"),
    blocking: text("blocking"),
    iq: text("iq"),
    mobility: text("mobility"),
    numThrows: integer("num_throws"),
  },
  (table) => [index("catching_assessment_lesson_idx").on(table.lessonId)]
);

export default catchingAssessment;
