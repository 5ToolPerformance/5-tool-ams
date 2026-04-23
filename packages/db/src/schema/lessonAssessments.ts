import { index, pgEnum, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";

import lesson from "./lesson";

export const assessmentTypeEnum = pgEnum("assessment_type", [
  "are_care",
  "smfa",
  "force_plate",
  "true_strength",
  "arm_care",
  "hitting_assessment",
  "pitching_assessment",
  "hit_trax_assessment",
  "velo_assessment",
  "fielding_assessment",
  "catching_assessment",
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
    createdOn: timestamp("created_on", { mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("lesson_assessments_lesson_idx").on(table.lessonId),
    index("lesson_assessments_type_idx").on(table.assessmentType),
    index("lesson_assessments_unique_idx").on(
      table.assessmentType,
      table.assessmentId
    ),
  ]
);
export default lessonAssessments;
