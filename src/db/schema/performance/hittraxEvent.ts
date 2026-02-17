// db/schema/performance/hittraxEvent.ts
import {
  index,
  integer,
  jsonb,
  numeric,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { performanceSession } from "./performanceSession";

export const hittraxEvent = pgTable(
  "hittrax_event",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    sessionId: uuid("session_id")
      .notNull()
      .references(() => performanceSession.id, { onDelete: "cascade" }),

    eventIndex: integer("event_index").notNull(),

    atBat: integer("at_bat"),

    eventTimestamp: timestamp("event_timestamp", {
      mode: "string",
    }),

    // Pitch context
    pitchVelocity: numeric("pitch_velocity", {
      precision: 6,
      scale: 2,
    }),

    pitchType: text("pitch_type"),

    // Batted ball metrics
    exitVelo: numeric("exit_velo", {
      precision: 6,
      scale: 2,
    }),

    launchAngle: numeric("launch_angle", {
      precision: 6,
      scale: 2,
    }),

    distance: numeric("distance", {
      precision: 8,
      scale: 2,
    }),

    horizontalAngle: numeric("horizontal_angle", {
      precision: 6,
      scale: 2,
    }),

    contactType: text("contact_type"),

    result: text("result"),

    // Spray / location
    sprayX: numeric("spray_x", {
      precision: 8,
      scale: 3,
    }),

    sprayZ: numeric("spray_z", {
      precision: 8,
      scale: 3,
    }),

    poiX: numeric("poi_x", { precision: 8, scale: 3 }),
    poiY: numeric("poi_y", { precision: 8, scale: 3 }),
    poiZ: numeric("poi_z", { precision: 8, scale: 3 }),

    verticalDistance: numeric("vertical_distance", {
      precision: 8,
      scale: 3,
    }),

    horizontalDistance: numeric("horizontal_distance", {
      precision: 8,
      scale: 3,
    }),

    rawRow: jsonb("raw_row"),

    createdAt: timestamp("created_at", { mode: "string" })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("hittrax_event_session_idx").on(table.sessionId),
    index("hittrax_event_session_event_idx").on(
      table.sessionId,
      table.eventIndex
    ),
  ]
);
