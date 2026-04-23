import {
  index,
  jsonb,
  pgEnum,
  pgTable,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { disciplines, users } from "@/db/schema";
import { evaluations } from "@/db/schema/evaluations/evaluations";
import playerInformation from "@/db/schema/players/playerInformation";

export const developmentPlanStatusEnum = pgEnum("development_plan_status", [
  "draft",
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

    disciplineId: uuid("discipline_id")
      .notNull()
      .references(() => disciplines.id, { onDelete: "no action" }),

    evaluationId: uuid("evaluation_id")
      .notNull()
      .references(() => evaluations.id, { onDelete: "restrict" }),

    createdBy: uuid("created_by")
      .notNull()
      .references(() => users.id, { onDelete: "no action" }),

    status: developmentPlanStatusEnum("status").notNull().default("draft"),

    startDate: timestamp("start_date"),
    targetEndDate: timestamp("target_end_date"),

    createdOn: timestamp("created_on").defaultNow().notNull(),
    updatedOn: timestamp("updated_on").defaultNow().notNull(),
    documentData: jsonb("document_data"),
  },
  (t) => [
    index("development_plans_player_idx").on(t.playerId),
    index("development_plans_discipline_idx").on(t.disciplineId),
    index("development_plans_evaluation_idx").on(t.evaluationId),
    index("development_plans_status_idx").on(t.status),
  ]
);
