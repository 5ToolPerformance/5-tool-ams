import { index, pgTable, uniqueIndex, uuid } from "drizzle-orm/pg-core";

import { developmentPlanRoutines, mechanics } from "@/db/schema";

export const developmentPlanRoutineMechanics = pgTable(
  "development_plan_routine_mechanics",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    routineId: uuid("routine_id")
      .notNull()
      .references(() => developmentPlanRoutines.id, { onDelete: "cascade" }),

    mechanicId: uuid("mechanic_id")
      .notNull()
      .references(() => mechanics.id, { onDelete: "no action" }),
  },
  (t) => [
    index("development_plan_routine_mechanics_routine_idx").on(t.routineId),
    index("development_plan_routine_mechanics_mechanic_idx").on(t.mechanicId),
    uniqueIndex("development_plan_routine_mechanics_uidx").on(
      t.routineId,
      t.mechanicId
    ),
  ]
);
