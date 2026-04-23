import { index, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";

import {
  evaluations,
  performanceSession,
  playerInformation,
} from "@/db/schema";

export function createEvaluationMetricBaseColumns() {
  return {
    id: uuid("id").primaryKey().defaultRandom(),

    evaluationId: uuid("evaluation_id")
      .notNull()
      .references(() => evaluations.id, { onDelete: "cascade" }),

    performanceSessionId: uuid("performance_session_id")
      .notNull()
      .references(() => performanceSession.id, { onDelete: "cascade" }),

    playerId: uuid("player_id")
      .notNull()
      .references(() => playerInformation.id, { onDelete: "cascade" }),

    recordedAt: timestamp("recorded_at", { withTimezone: true }).notNull(),

    notes: text("notes"),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),

    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  };
}

export function createEvaluationMetricBaseIndexes(
  table: {
    evaluationId: any;
    playerId: any;
    performanceSessionId: any;
    recordedAt: any;
  },
  prefix: string
) {
  return [
    index(`${prefix}_evaluation_idx`).on(table.evaluationId),
    index(`${prefix}_player_idx`).on(table.playerId),
    index(`${prefix}_session_idx`).on(table.performanceSessionId),
    index(`${prefix}_recorded_at_idx`).on(table.recordedAt),
    uniqueIndex(`${prefix}_evaluation_unique`).on(table.evaluationId),
    uniqueIndex(`${prefix}_session_unique`).on(table.performanceSessionId),
  ];
}
