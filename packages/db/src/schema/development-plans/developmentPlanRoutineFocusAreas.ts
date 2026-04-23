import { index, pgTable, uniqueIndex, uuid } from "drizzle-orm/pg-core";

import { developmentPlanItems } from "@/db/schema/development-plans/developmentPlanItems";
import { developmentPlanRoutines } from "@/db/schema/development-plans/developmentPlanRoutines";

export const developmentPlanRoutineFocusAreas = pgTable(
  "development_plan_routine_focus_areas",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    routineId: uuid("routine_id")
      .notNull()
      .references(() => developmentPlanRoutines.id, { onDelete: "cascade" }),

    developmentPlanItemId: uuid("development_plan_item_id")
      .notNull()
      .references(() => developmentPlanItems.id, { onDelete: "cascade" }),
  },
  (t) => [
    index("development_plan_routine_focus_areas_routine_idx").on(t.routineId),
    index("development_plan_routine_focus_areas_item_idx").on(
      t.developmentPlanItemId
    ),
    uniqueIndex("development_plan_routine_focus_areas_uidx").on(
      t.routineId,
      t.developmentPlanItemId
    ),
  ]
);
