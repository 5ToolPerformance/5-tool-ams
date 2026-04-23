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

export const externalSystemEnum = pgEnum("external_system", [
  "armcare",
  "trackman",
  "hittrax",
  "hawkin",
]);

// External System Configuration
export const externalSystemsConfig = pgTable("external_systems_config", {
  id: uuid("id").primaryKey().defaultRandom(),
  system: externalSystemEnum("system").notNull().unique(),

  // Tracking and status
  syncEnabled: boolean("sync_enabled").default(true),
  syncFrequency: text("sync_frequency").default("daily"),
  lastSyncAt: timestamp("last_sync_at", { mode: "string" }),
  lastSyncStatus: text("last_sync_status"),

  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).notNull().defaultNow(),
});

// Token Storage for caching OAuth tokens
export const externalSystemsTokens = pgTable("external_systems_tokens", {
  id: uuid("id").primaryKey().defaultRandom(),
  system: externalSystemEnum("system").notNull().unique(),

  accessToken: text("access_token").notNull(),
  refreshToken: text("refresh_token"),
  expiresAt: timestamp("expires_at", { mode: "string" }).notNull(),

  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).notNull().defaultNow(),
});

export const syncStatusEnum = pgEnum("sync_status", [
  "running",
  "success",
  "partial_success",
  "failed",
]);

export const externalSyncLogs = pgTable(
  "external_sync_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    system: externalSystemEnum("system").notNull(),
    status: syncStatusEnum("status").notNull(),

    recordsCreated: integer("records_created").default(0),
    recordsUpdated: integer("records_updated").default(0),
    recordsSkipped: integer("records_skipped").default(0),
    recordsFailed: integer("records_failed").default(0),

    playersMatched: integer("players_matched").default(0),
    playersUnmatched: integer("players_unmatched").default(0),
    newMatchSuggestions: integer("new_match_suggestions").default(0),

    startedAt: timestamp("started_at", { mode: "string" }).notNull(),
    completedAt: timestamp("completed_at", { mode: "string" }),
    duration: integer("duration"),

    errors: jsonb("errors"),

    triggeredBy: text("triggered_by"),
    triggeredByUserId: uuid("triggered_by_user_id").references(() => users.id),
  },
  (table) => [index("sync_logs_system_idx").on(table.system)]
);
