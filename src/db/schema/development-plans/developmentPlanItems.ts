import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  uuid,
} from "drizzle-orm/pg-core";

import { developmentPlans } from "@/db/schema/development-plans/developmentPlans";

export const developmentPlanItemTypeEnum = pgEnum(
  "development_plan_item_type",
  ["short_term_goal", "long_term_goal", "focus_area", "measurable_indicator"]
);

export const developmentPlanItems = pgTable(
  "development_plan_items",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    developmentPlanId: uuid("development_plan_id")
      .notNull()
      .references(() => developmentPlans.id, { onDelete: "cascade" }),

    type: developmentPlanItemTypeEnum("type").notNull(),

    title: text("title").notNull(),
    description: text("description"),

    sortOrder: integer("sort_order").notNull().default(0),

    isPrimary: boolean("is_primary").notNull().default(false),
  },
  (t) => [
    index("development_plan_items_plan_idx").on(t.developmentPlanId),
    index("development_plan_items_type_idx").on(t.type),
    check("development_plan_items_sort_order_check", sql`${t.sortOrder} >= 0`),
  ]
);
