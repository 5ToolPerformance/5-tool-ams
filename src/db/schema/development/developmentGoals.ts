import {
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { developmentPlans } from "./developmentPlans";

export const developmentGoalTypeEnum = pgEnum("development_goal_type", [
  "short_term",
  "long_term",
]);

export const developmentGoalStatusEnum = pgEnum("development_goal_status", [
  "active",
  "achieved",
  "dropped",
]);

export const developmentGoals = pgTable(
  "development_goals",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    planId: uuid("plan_id")
      .notNull()
      .references(() => developmentPlans.id, { onDelete: "cascade" }),

    goalType: developmentGoalTypeEnum("goal_type").notNull(),

    title: text("title").notNull(),

    description: text("description"),

    targetDate: timestamp("target_date"),

    status: developmentGoalStatusEnum("status").default("active").notNull(),

    createdOn: timestamp("created_on").defaultNow().notNull(),
  },
  (t) => [index("development_goal_plan_idx").on(t.planId)]
);
