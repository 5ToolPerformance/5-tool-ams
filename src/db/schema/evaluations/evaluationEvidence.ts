import {
  index,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import { performanceSession } from "@/db/schema";
import { evaluations } from "@/db/schema/evaluations/evaluations";

export const evaluationEvidence = pgTable(
  "evaluation_evidence",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    evaluationId: uuid("evaluation_id")
      .notNull()
      .references(() => evaluations.id, { onDelete: "cascade" }),

    performanceSessionId: uuid("performance_session_id")
      .notNull()
      .references(() => performanceSession.id, { onDelete: "no action" }),

    notes: text("notes"),

    createdOn: timestamp("created_on").defaultNow().notNull(),
  },
  (t) => [
    index("evaluation_evidence_evaluation_idx").on(t.evaluationId),
    uniqueIndex("evaluation_evidence_eval_perf_uidx").on(
      t.evaluationId,
      t.performanceSessionId
    ),
  ]
);
