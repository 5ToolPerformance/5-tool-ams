// src/db/schema/development/developmentPlanRoutines.ts
import {
  index,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import { routines } from "../routines/routines";
import { developmentPlans } from "./developmentPlans";

export const developmentPlanRoutines = pgTable(
  "development_plan_routines",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    planId: uuid("plan_id")
      .notNull()
      .references(() => developmentPlans.id, { onDelete: "cascade" }),

    routineId: uuid("routine_id")
      .notNull()
      .references(() => routines.id, { onDelete: "cascade" }),

    // Optional: guidance like "use 2x/week" or "use on machine days"
    notes: text("notes"),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("development_plan_routines_plan_idx").on(t.planId),
    index("development_plan_routines_routine_idx").on(t.routineId),
    uniqueIndex("development_plan_routines_unique").on(t.planId, t.routineId),
  ]
);
