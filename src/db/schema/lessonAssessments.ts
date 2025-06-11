import { index, pgEnum, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";

import lesson from "./lesson";

export const assessmentTypeEnum = pgEnum("assessment_type", [
  "are_care",
  "smfa",
  "force_plate",
  "true_strength",
]);

const lessonAssessments = pgTable(
  "lesson_assessments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    lessonId: uuid("lesson_id")
      .notNull()
      .references(() => lesson.id, { onDelete: "cascade" }),
    assessmentType: assessmentTypeEnum("assessment_type").notNull(),
    assessmentId: uuid("assessment_id").notNull(),
    createdOn: timestamp("created_on", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    lessonIdx: index("lesson_assessments_lesson_idx").on(table.lessonId),
    typeIdx: index("lesson_assessments_type_idx").on(table.assessmentType),
    uniqueAssessment: index("lesson_assessments_unique_idx").on(
      table.assessmentType,
      table.assessmentId
    ),
  })
);
export default lessonAssessments;
