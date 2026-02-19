// src/db/schema/development/evaluations.ts
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import users from "@/db/schema/users";

import { disciplines } from "../config/disciplines";
import { playerInformation } from "../players/playerInformation";

export const evaluations = pgTable("evaluations", {
  id: uuid("id").defaultRandom().primaryKey(),
  playerId: uuid("player_id")
    .notNull()
    .references(() => playerInformation.id, { onDelete: "cascade" }),
  disciplineId: uuid("discipline_id")
    .notNull()
    .references(() => disciplines.id, { onDelete: "restrict" }),

  phase: text("phase").notNull(), // "pre_season" | "in_season" | ...
  strengthProfile: text("strength_profile").notNull().default(""),
  constraintSummary: text("constraint_summary").notNull().default(""),

  createdByUserId: uuid("created_by_user_id")
    .notNull()
    .references(() => users.id, { onDelete: "restrict" }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
