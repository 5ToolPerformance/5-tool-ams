import { index, integer, pgTable, text, uuid } from "drizzle-orm/pg-core";

import { developmentPlanRoutines } from "@/db/schema/development-plans/developmentPlanRoutines";

export const routineProgressionStages = pgTable(
  "routine_progression_stages",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    routineId: uuid("routine_id")
      .notNull()
      .references(() => developmentPlanRoutines.id, { onDelete: "cascade" }),

    title: text("title").notNull(),
    description: text("description"),

    stageOrder: integer("stage_order").notNull().default(0),
  },
  (t) => [index("routine_progression_stages_routine_idx").on(t.routineId)]
);
