import {
  boolean,
  date,
  index,
  integer,
  pgTable,
  real,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import { performanceSession } from "@/db/schema";
import playerInformation from "@/db/schema/players/playerInformation";

import { readinessStatusEnum, workloadQualityEnum } from "./enums";

export const throwingWorkloadDailySummaries = pgTable(
  "throwing_workload_daily_summaries",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    playerId: uuid("player_id")
      .notNull()
      .references(() => playerInformation.id),

    summaryDate: date("summary_date").notNull(),

    performanceSessionId: uuid("performance_session_id").references(
      () => performanceSession.id
    ),

    totalThrowCount: integer("total_throw_count").notNull().default(0),
    totalPitchCount: integer("total_pitch_count").notNull().default(0),

    workloadUnits: real("workload_units").notNull().default(0),

    workloadQuality: workloadQualityEnum("workload_quality")
      .notNull()
      .default("type_only"),

    workloadConfidence: integer("workload_confidence"),

    acute7Load: real("acute_7_load"),
    chronic28Load: real("chronic_28_load"),
    acuteChronicRatio: real("acute_chronic_ratio"),

    sorenessScore: integer("soreness_score"),
    fatigueScore: integer("fatigue_score"),

    readinessScore: integer("readiness_score"),
    readinessStatus: readinessStatusEnum("readiness_status"),
    readinessReason: text("readiness_reason"),

    entryCount: integer("entry_count").notNull().default(0),

    hasGameExposure: boolean("has_game_exposure").notNull().default(false),
    hasBullpen: boolean("has_bullpen").notNull().default(false),
    hasHighIntentExposure: boolean("has_high_intent_exposure")
      .notNull()
      .default(false),

    calculatedOn: timestamp("calculated_on", { withTimezone: true }),

    createdOn: timestamp("created_on", { withTimezone: true })
      .defaultNow()
      .notNull(),

    updatedOn: timestamp("updated_on", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("throwing_workload_daily_summaries_player_date_uidx").on(
      table.playerId,
      table.summaryDate
    ),
    uniqueIndex(
      "throwing_workload_daily_summaries_performance_session_uidx"
    ).on(table.performanceSessionId),
    index("throwing_workload_daily_summaries_summary_date_idx").on(
      table.summaryDate
    ),
    index("throwing_workload_daily_summaries_player_readiness_idx").on(
      table.playerId,
      table.readinessStatus
    ),
  ]
);

export default throwingWorkloadDailySummaries;
