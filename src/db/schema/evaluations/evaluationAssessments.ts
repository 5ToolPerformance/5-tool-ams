import { index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { performanceSession } from "@/db/schema";

import { evaluations } from "./evaluations";

export const evaluationAssessments = pgTable(
  "evaluation_assessments",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    evaluationId: uuid("evaluation_id")
      .notNull()
      .references(() => evaluations.id, { onDelete: "cascade" }),

    performanceSessionId: uuid("performance_session_id")
      .notNull()
      .references(() => performanceSession.id),

    notes: text("notes"),

    createdOn: timestamp("created_on").defaultNow().notNull(),
  },
  (t) => ({
    evalIdx: index("evaluation_assessment_eval_idx").on(t.evaluationId),
  })
);
