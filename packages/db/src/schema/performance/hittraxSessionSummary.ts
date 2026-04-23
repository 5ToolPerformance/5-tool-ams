// db/schema/performance/hittraxSessionSummary.ts
import { index, integer, numeric, pgTable, uuid } from "drizzle-orm/pg-core";

import { performanceSession } from "./performanceSession";

export const hittraxSessionSummary = pgTable(
  "hittrax_session_summary",
  {
    sessionId: uuid("session_id")
      .primaryKey()
      .references(() => performanceSession.id, {
        onDelete: "cascade",
      }),

    totalEvents: integer("total_events").notNull(),

    // Exit velo
    avgExitVelo: numeric("avg_exit_velo", {
      precision: 6,
      scale: 2,
    }),

    maxExitVelo: numeric("max_exit_velo", {
      precision: 6,
      scale: 2,
    }),

    // Launch angle
    avgLaunchAngle: numeric("avg_launch_angle", {
      precision: 6,
      scale: 2,
    }),

    // Distance
    avgDistance: numeric("avg_distance", {
      precision: 8,
      scale: 2,
    }),

    // Contact breakdown
    hardHitPercentage: numeric("hard_hit_percentage", {
      precision: 5,
      scale: 2,
    }),

    lineDrivePercentage: numeric("line_drive_percentage", {
      precision: 5,
      scale: 2,
    }),

    groundBallPercentage: numeric("ground_ball_percentage", {
      precision: 5,
      scale: 2,
    }),

    flyBallPercentage: numeric("fly_ball_percentage", {
      precision: 5,
      scale: 2,
    }),

    // Results
    totalAB: integer("total_ab").notNull(),
    totalHits: integer("total_hits").notNull(),

    battingAverage: numeric("batting_average", {
      precision: 5,
      scale: 3,
    }),
  },
  (table) => [index("hittrax_summary_session_idx").on(table.sessionId)]
);
