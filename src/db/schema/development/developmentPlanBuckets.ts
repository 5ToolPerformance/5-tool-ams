import { index, pgEnum, pgTable, text, uuid } from "drizzle-orm/pg-core";

import { buckets } from "@/db/schema/config/buckets";

import { developmentPlans } from "./developmentPlans";

export const developmentPlanPriorityEnum = pgEnum("development_plan_priority", [
  "high",
  "medium",
  "low",
]);

export const developmentPlanBuckets = pgTable(
  "development_plan_buckets",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    planId: uuid("plan_id")
      .notNull()
      .references(() => developmentPlans.id, { onDelete: "cascade" }),

    bucketId: uuid("bucket_id")
      .notNull()
      .references(() => buckets.id),

    priority: developmentPlanPriorityEnum("priority").notNull(),

    notes: text("notes"),
  },
  (t) => ({
    planIdx: index("development_plan_bucket_idx").on(t.planId),
  })
);
