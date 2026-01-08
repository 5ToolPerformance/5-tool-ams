import { jsonb, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const baseHawkinsColumns = {
  id: uuid("id").defaultRandom().primaryKey(),
  timestamp: timestamp("timestamp", { withTimezone: true }).notNull(),
  externalUniqueId: text("external_uniqueId").notNull(),
  athleteId: text("athlete_id").notNull(),
  athleteName: text("athlete_name"),
  testTypeName: text("testType_name").notNull(),
  testTypeCanonicalId: text("testType_canonicalId").notNull(),
  rawData: jsonb("rawData").notNull(),
  ingestedAt: timestamp("ingested_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
};
