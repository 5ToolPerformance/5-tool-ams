// db/schema/performance/performanceIngestJob.ts
import {
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { performanceSession } from "./performanceSession";

export const performanceIngestStatus = pgEnum("performance_ingest_status", [
  "pending",
  "processing",
  "completed",
  "failed",
]);

export const performanceIngestJob = pgTable(
  "performance_ingest_job",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    sessionId: uuid("session_id")
      .notNull()
      .references(() => performanceSession.id, {
        onDelete: "cascade",
      }),

    status: performanceIngestStatus("status").notNull().default("pending"),

    attemptCount: integer("attempt_count").notNull().default(0),

    errorMessage: text("error_message"),

    lockedAt: timestamp("locked_at", { mode: "string" }),
    lockedBy: text("locked_by"),

    createdAt: timestamp("created_at", { mode: "string" })
      .notNull()
      .defaultNow(),

    updatedAt: timestamp("updated_at", { mode: "string" })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("performance_ingest_status_idx").on(table.status),
    index("performance_ingest_session_idx").on(table.sessionId),
  ]
);
