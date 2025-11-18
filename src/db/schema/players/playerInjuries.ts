import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import playerInformation from "./playerInformation";

export const injuryStatusEnum = pgEnum("injury_status", [
  "active",
  "resolved",
  "recurring",
  "monitoring",
]);

export const injurySeverityEnum = pgEnum("injury_severity", [
  "mild",
  "moderate",
  "severe",
  "unknown",
]);

export const playerInjuries = pgTable("player_injuries", {
  id: uuid("id").primaryKey().defaultRandom(),
  playerId: uuid("player_id").references(() => playerInformation.id, {
    onDelete: "cascade",
  }),
  injury: text("injury_type").notNull(),
  injuryDate: timestamp("injury_date", { mode: "string" }).notNull(),
  status: injuryStatusEnum("status").notNull().default("active"),
  severity: injurySeverityEnum("severity").notNull().default("unknown"),
  description: text("description"),
  notes: text("notes"),
  created_at: timestamp("created_at", { mode: "string" })
    .notNull()
    .defaultNow(),
  updated_at: timestamp("updated_at", { mode: "string" })
    .notNull()
    .defaultNow(),
});

export default playerInjuries;
