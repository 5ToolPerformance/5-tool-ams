import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { users } from "@/db/schema";
import { developmentPlans } from "@/db/schema/development-plans/developmentPlans";

export const routineTypeEnum = pgEnum("routine_type", [
  "partial_lesson",
  "full_lesson",
  "progression",
]);

export const developmentPlanRoutines = pgTable(
  "development_plan_routines",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    developmentPlanId: uuid("development_plan_id")
      .notNull()
      .references(() => developmentPlans.id, { onDelete: "cascade" }),

    title: text("title").notNull(),
    description: text("description"),

    routineType: routineTypeEnum("routine_type").notNull(),

    sortOrder: integer("sort_order").notNull().default(0),

    isActive: boolean("is_active").notNull().default(true),

    createdBy: uuid("created_by")
      .notNull()
      .references(() => users.id, { onDelete: "no action" }),

    createdOn: timestamp("created_on").defaultNow().notNull(),
    updatedOn: timestamp("updated_on").defaultNow().notNull(),
    documentData: jsonb("document_data"),
  },
  (t) => [
    index("development_plan_routines_plan_idx").on(t.developmentPlanId),
    index("development_plan_routines_type_idx").on(t.routineType),
  ]
);
