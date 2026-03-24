import { sql } from "drizzle-orm";
import {
  check,
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { evaluations } from "../evaluations/evaluations";
import lesson from "../lesson";
import playerInformation from "../players/playerInformation";

export const performanceSource = pgEnum("performance_source", [
  "hittrax",
  "blast",
  "strength",
  "trackman",
]);

export const performanceSessionStatus = pgEnum("performance_session_status", [
  "pending",
  "processing",
  "completed",
  "failed",
]);

export const performanceSession = pgTable(
  "performance_session",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    playerId: uuid("player_id")
      .notNull()
      .references(() => playerInformation.id, { onDelete: "cascade" }),

    lessonId: uuid("lesson_id").references(() => lesson.id, {
      onDelete: "set null",
    }),

    evaluationId: uuid("evaluation_id").references(() => evaluations.id, {
      onDelete: "set null",
    }),

    source: performanceSource("source").notNull(),

    sessionDate: timestamp("session_date", { mode: "string" }).notNull(),

    rawUploadId: uuid("raw_upload_id"),

    status: performanceSessionStatus("status").notNull().default("pending"),

    errorMessage: text("error_message"),

    createdAt: timestamp("created_at", { mode: "string" })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("performance_session_player_idx").on(table.playerId),
    index("performance_session_lesson_idx").on(table.lessonId),
    index("performance_session_evaluation_idx").on(table.evaluationId),
    index("performance_session_source_idx").on(table.source),
    index("performance_session_date_idx").on(table.sessionDate),

    check(
      "performance_session_single_context_check",
      sql`NOT (${table.lessonId} IS NOT NULL AND ${table.evaluationId} IS NOT NULL)`
    ),
  ]
);
