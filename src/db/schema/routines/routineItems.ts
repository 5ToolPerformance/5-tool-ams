import {
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  uuid,
} from "drizzle-orm/pg-core";

import { drills } from "@/db/schema";
import { developmentPlanRoutines } from "@/db/schema/development-plans/developmentPlanRoutines";

export const routineItemTypeEnum = pgEnum("routine_item_type", [
  "drill",
  "instruction",
  "checkpoint",
  "recovery",
  "assessment",
  "block",
]);

export const routineItems = pgTable(
  "routine_items",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    routineId: uuid("routine_id")
      .notNull()
      .references(() => developmentPlanRoutines.id, { onDelete: "cascade" }),

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
    index("routine_items_routine_idx").on(t.routineId),
    index("routine_items_drill_idx").on(t.drillId),
  ]
);
