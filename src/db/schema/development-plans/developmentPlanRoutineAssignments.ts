import {
  boolean,
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { users } from "@/db/schema";
import { developmentPlanRoutines } from "@/db/schema/development-plans/developmentPlanRoutines";
import { developmentPlans } from "@/db/schema/development-plans/developmentPlans";
import { routineProgressionStages } from "@/db/schema/routines/routineProgressionStages";

export const routineAssignmentTypeEnum = pgEnum("routine_assignment_type", [
  "pre_lesson",
  "full_lesson",
  "homework",
  "recovery",
  "checkpoint",
]);

export const routineAssignmentStatusEnum = pgEnum("routine_assignment_status", [
  "active",
  "paused",
  "completed",
  "archived",
]);

export const developmentPlanRoutineAssignments = pgTable(
  "development_plan_routine_assignments",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    developmentPlanId: uuid("development_plan_id")
      .notNull()
      .references(() => developmentPlans.id, { onDelete: "cascade" }),

    routineId: uuid("routine_id")
      .notNull()
      .references(() => developmentPlanRoutines.id, { onDelete: "cascade" }),

    assignmentType: routineAssignmentTypeEnum("assignment_type").notNull(),

    status: routineAssignmentStatusEnum("status").notNull().default("active"),

    isPrimary: boolean("is_primary").notNull().default(false),

    currentStageId: uuid("current_stage_id").references(
      () => routineProgressionStages.id,
      { onDelete: "set null" }
    ),

    assignedBy: uuid("assigned_by")
      .notNull()
      .references(() => users.id, { onDelete: "no action" }),

    assignedOn: timestamp("assigned_on").defaultNow().notNull(),
    startedOn: timestamp("started_on"),
    lastProgressedOn: timestamp("last_progressed_on"),
    completedOn: timestamp("completed_on"),

    notes: text("notes"),
  },
  (t) => [
    index("development_plan_routine_assignments_plan_idx").on(
      t.developmentPlanId
    ),
    index("development_plan_routine_assignments_routine_idx").on(t.routineId),
    index("development_plan_routine_assignments_type_idx").on(t.assignmentType),
    index("development_plan_routine_assignments_status_idx").on(t.status),
  ]
);
