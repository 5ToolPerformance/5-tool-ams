import {
  date,
  index,
  integer,
  jsonb,
  numeric,
  pgTable,
  text,
  time,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import playerInformation from "../players/playerInformation";
import users from "../users";
import { externalSyncLogs } from "./external-systems";

export const armcareExams = pgTable(
  "armcare_exams",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    playerId: uuid("player_id")
      .notNull()
      .references(() => playerInformation.id, { onDelete: "cascade" }),

    externalExamId: text("external_exam_id").notNull().unique(),

    examDate: date("exam_date").notNull(),
    examTime: time("exam_time"),
    examType: text("exam_type"),
    timezone: text("timezone"),

    // Normalized Key Metrics
    armScore: numeric("arm_score"),
    totalStrength: numeric("total_strength"),
    shoulderBalance: numeric("shoulder_balance"),
    velo: numeric("velo"),
    svr: numeric("svr"),
    totalStrengthPost: numeric("total_strength_post"),
    postStrengthLoss: numeric("post_strength_loss"),
    totalPercentFresh: numeric("total_percent_fresh"),

    // Complete Raw Data
    rawData: jsonb("raw_data").notNull(),

    syncedAt: timestamp("synced_at", { mode: "string" }).notNull().defaultNow(),
    syncLogId: uuid("sync_log_id").references(() => externalSyncLogs.id),

    createdAt: timestamp("created_at", { mode: "string" })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "string" })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("armcare_exams_player_idx").on(table.playerId),
    index("armcare_exams_date_idx").on(table.examDate),
  ]
);

// Unmatched Armcare Data
export const armcareExamsUnmatched = pgTable(
  "armcare_exams_unmatched",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    externalExamId: text("external_exam_id").notNull().unique(),
    externalPlayerId: text("external_player_id").notNull(),
    externalEmail: text("external_email"),
    externalFirstName: text("external_first_name"),
    externalLastName: text("external_last_name"),

    examDate: date("exam_date").notNull(),
    examTime: time("exam_time"),
    examType: text("exam_type"),
    timezone: text("timezone"),

    // Normalized Key Metrics
    armScore: numeric("arm_score"),
    totalStrength: numeric("total_strength"),
    shoulderBalance: numeric("shoulder_balance"),
    velo: numeric("velo"),
    svr: numeric("svr"),
    totalStrengthPost: numeric("total_strength_post"),
    postStrengthLoss: numeric("post_strength_loss"),
    totalPercentFresh: numeric("total_percent_fresh"),

    // Complete Raw Data
    rawData: jsonb("raw_data").notNull(),

    // Matching metadata
    matchAttempts: integer("match_attempts").default(0),
    lastMatchAttempt: timestamp("last_match_attempt"),
    matchErrors: jsonb("match_errors"),

    syncedAt: timestamp("synced_at", { mode: "string" }).notNull().defaultNow(),
    syncLogId: uuid("sync_log_id").references(() => externalSyncLogs.id),

    status: text("status").notNull().default("pending"),
    resolvedAt: timestamp("resolved_at", { mode: "string" }),
    resolvedBy: uuid("resolved_by").references(() => users.id),

    createdAt: timestamp("created_at", { mode: "string" })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "string" })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("armcare_exams_unmatched_player_idx").on(table.externalPlayerId),
    index("armcare_exams_unmatched_status_idx").on(table.status),
  ]
);
