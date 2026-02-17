import { index, pgEnum, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";

import lesson from "../lesson";
import playerInformation from "../players/playerInformation";

export const performanceSource = pgEnum("performance_source", [
  "hittrax",
  "blast",
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

    source: performanceSource("source").notNull(),

    sessionDate: timestamp("session_date", { mode: "string" }).notNull(),

    rawUploadId: uuid("raw_upload_id"), // link to attachment if desired

    status: performanceSessionStatus("status").notNull().default("pending"),

    createdAt: timestamp("created_at", { mode: "string" })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("performance_session_player_idx").on(table.playerId),
    index("performance_session_lesson_idx").on(table.lessonId),
    index("performance_session_source_idx").on(table.source),
    index("performance_session_date_idx").on(table.sessionDate),
  ]
);
