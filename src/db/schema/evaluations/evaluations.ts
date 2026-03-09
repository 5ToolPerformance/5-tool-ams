import {
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { disciplines, playerInformation, users } from "@/db/schema";

export const evaluationTypeEnum = pgEnum("evaluation_type", [
  "baseline",
  "monthly",
  "season_review",
  "injury_return",
  "general",
]);

export const athletePhaseEnum = pgEnum("athlete_phase", [
  "offseason",
  "preseason",
  "inseason",
  "postseason",
  "rehab",
  "return_to_play",
  "general",
]);

export const evaluations = pgTable(
  "evaluations",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    playerId: uuid("player_id")
      .notNull()
      .references(() => playerInformation.id, { onDelete: "cascade" }),

    disciplineId: uuid("discipline_id")
      .notNull()
      .references(() => disciplines.id, { onDelete: "no action" }),

    createdBy: uuid("created_by")
      .notNull()
      .references(() => users.id, { onDelete: "no action" }),

    evaluationDate: timestamp("evaluation_date").notNull(),

    evaluationType: evaluationTypeEnum("evaluation_type").notNull(),

    phase: athletePhaseEnum("phase").notNull().default("general"),

    injuryConsiderations: text("injury_considerations"),

    snapshotSummary: text("snapshot_summary").notNull(),

    strengthProfileSummary: text("strength_profile_summary").notNull(),

    keyConstraintsSummary: text("key_constraints_summary").notNull(),

    createdOn: timestamp("created_on").defaultNow().notNull(),
    updatedOn: timestamp("updated_on").defaultNow().notNull(),
  },
  (t) => [
    index("evaluations_player_idx").on(t.playerId),
    index("evaluations_discipline_idx").on(t.disciplineId),
    index("evaluations_eval_date_idx").on(t.evaluationDate),
  ]
);
