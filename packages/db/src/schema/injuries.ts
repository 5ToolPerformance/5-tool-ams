import {
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { playerInformation, users } from "@/db/schema";

export const injuryStatus = pgEnum("injury_status", [
  "active",
  "limited",
  "resolved",
]);

export const injuryLevel = pgEnum("injury_level", [
  "soreness",
  "injury",
  "diagnosis",
]);

export const injurySide = pgEnum("injury_side", [
  "left",
  "right",
  "bilateral",
  "none",
]);

export const injuryReportedByRole = pgEnum("injury_reported_by_role", [
  "coach",
  "trainer",
  "medical",
  "athlete",
]);

export const injuryConfidence = pgEnum("injury_confidence", [
  "self_reported",
  "observed",
  "assessed",
  "diagnosed",
]);

export const injuryBodyPart = pgTable("injury_body_part", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(), // Shoulder, Elbow, Hip, Hamstring, etc.
});

export const injuryFocusArea = pgTable("injury_focus_area", {
  id: uuid("id").primaryKey().defaultRandom(),
  bodyPartId: uuid("body_part_id")
    .notNull()
    .references(() => injuryBodyPart.id, { onDelete: "cascade" }),
  name: text("name").notNull(), // UCL, Rotator Cuff, Labrum, etc.
});

export const injury = pgTable(
  "injury",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    playerId: uuid("player_id")
      .notNull()
      .references(() => playerInformation.id, { onDelete: "cascade" }),
    reportedByUserId: uuid("reported_by_user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    reportedByRole: injuryReportedByRole("reported_by_role").notNull(),

    level: injuryLevel("level").notNull(),
    bodyPartId: uuid("body_part_id")
      .notNull()
      .references(() => injuryBodyPart.id),
    focusAreaId: uuid("focus_area_id").references(() => injuryFocusArea.id),
    side: injurySide("side").notNull(),
    status: injuryStatus("status").notNull(),
    confidence: injuryConfidence("confidence").notNull(),
    notes: text("notes"),

    startDate: timestamp("start_date", { mode: "string" }).notNull(),
    endDate: timestamp("end_date", { mode: "string" }),
    createdOn: timestamp("created_on", { mode: "string" })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("injury_player_idx").on(table.playerId),
    index("injury_body_part_idx").on(table.bodyPartId),
    index("injury_focus_area_idx").on(table.focusAreaId),
    index("injury_status_idx").on(table.status),
    index("injury_start_date_idx").on(table.startDate),
  ]
);
