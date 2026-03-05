import {
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { users } from "@/db/schema";
import { evaluations } from "@/db/schema/evaluations/evaluations";
import playerInformation from "@/db/schema/players/playerInformation";

export const developmentPlanStatusEnum = pgEnum("development_plan_status", [
  "active",
  "completed",
  "archived",
]);

export const developmentPlans = pgTable(
  "development_plans",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    playerId: uuid("player_id")
      .notNull()
      .references(() => playerInformation.id, { onDelete: "cascade" }),

    createdBy: uuid("created_by")
      .notNull()
      .references(() => users.id),

    evaluationId: uuid("evaluation_id").references(() => evaluations.id),

    startDate: timestamp("start_date").notNull(),

    endDate: timestamp("end_date"),

    status: developmentPlanStatusEnum("status").default("active").notNull(),

    notes: text("notes"),

    createdOn: timestamp("created_on").defaultNow().notNull(),
  },
  (t) => [index("development_plan_player_idx").on(t.playerId)]
);
