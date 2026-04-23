import { index, integer, pgTable, text, uuid } from "drizzle-orm/pg-core";

import { drills } from "@/db/schema";
import { routineItemTypeEnum } from "@/db/schema/routines/routineItems";

export const routineProgressionStageItems = pgTable(
  "routine_progression_stage_items",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    progressionStageId: uuid("progression_stage_id")
      .notNull()
      .references(() => routineProgressionStageItems.id, {
        onDelete: "cascade",
      }),

    title: text("title").notNull(),
    description: text("description"),

    itemType: routineItemTypeEnum("item_type").notNull(),

    drillId: uuid("drill_id").references(() => drills.id, {
      onDelete: "no action",
    }),

    sortOrder: integer("sort_order").notNull().default(0),

    targetValue: text("target_value"),
    targetUnit: text("target_unit"),
    notes: text("notes"),
  },
  (t) => [
    index("routine_progression_stage_items_stage_idx").on(t.progressionStageId),
    index("routine_progression_stage_items_drill_idx").on(t.drillId),
  ]
);
