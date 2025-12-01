import {
  index,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import playerInformation from "../players/playerInformation";
import users from "../users";
import { externalSystemEnum } from "./external-systems";

export const linkingMethodEnum = pgEnum("linking_method", [
  "email_match",
  "phone",
  "manual",
  "name_match",
]);

export const linkingStatusEnum = pgEnum("linking_status", [
  "active",
  "pending",
  "inactive",
  "failed",
]);

export const externalAthleteIds = pgTable("external_athlete_ids", {
  id: uuid("id").primaryKey().defaultRandom(),

  playerId: uuid("player_id")
    .notNull()
    .references(() => playerInformation.id),

  externalSystem: externalSystemEnum("external_system").notNull(),
  externalId: text("external_id").notNull(),
  externalEmail: text("external_email"),

  linkingMethod: linkingMethodEnum("linking_method").notNull(),
  linkingStatus: linkingStatusEnum("linking_status")
    .notNull()
    .default("active"),
  confidence: numeric("confidence"),

  externalMetadata: jsonb("external_metadata"),

  linkedBy: uuid("linked_by").references(() => users.id),
  linkedAt: timestamp("linked_at", { mode: "string" }).notNull().defaultNow(),
  verifiedAt: timestamp("verified_at", { mode: "string" }),

  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).notNull().defaultNow(),
});

export const externalAthletesIdsUnique = uniqueIndex(
  "external_athlete_ids_unique_idx"
).on(externalAthleteIds.externalSystem, externalAthleteIds.externalId);

export const externalAthleteIdsPlayerIdx = index(
  "external_athlete_ids_player_idx"
).on(externalAthleteIds.playerId);
