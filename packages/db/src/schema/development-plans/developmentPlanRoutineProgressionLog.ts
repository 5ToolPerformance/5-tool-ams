import { index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { users } from "@/db/schema";
import { developmentPlanRoutineAssignments } from "@/db/schema/development-plans/developmentPlanRoutineAssignments";
import { routineProgressionStages } from "@/db/schema/routines/routineProgressionStages";

export const developmentPlanRoutineProgressLog = pgTable(
  "development_plan_routine_progress_log",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    assignmentId: uuid("assignment_id")
      .notNull()
      .references(() => developmentPlanRoutineAssignments.id, {
        onDelete: "cascade",
      }),

    fromStageId: uuid("from_stage_id").references(
      () => routineProgressionStages.id,
      {
        onDelete: "set null",
      }
    ),

    toStageId: uuid("to_stage_id")
      .notNull()
      .references(() => routineProgressionStages.id, { onDelete: "no action" }),

    changedBy: uuid("changed_by")
      .notNull()
      .references(() => users.id, { onDelete: "no action" }),

    changedOn: timestamp("changed_on").defaultNow().notNull(),

    notes: text("notes"),
  },
  (t) => [
    index("development_plan_routine_progress_log_assignment_idx").on(
      t.assignmentId
    ),
  ]
);
