import { jsonb, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const baseHawkinsColumns = {
  id: uuid("id").defaultRandom().primaryKey(),
  timestamp: timestamp("timestamp", { withTimezone: true }).notNull(),
  externalUniqueId: text("external_unique_id").notNull(),
  athleteId: text("athlete_id").notNull(),
  athleteName: text("athlete_name"),
  testTypeName: text("test_type_name").notNull(),
  testTypeCanonicalId: text("test_type_canonical_id").notNull(),
  rawData: jsonb("raw_data").notNull(),
  ingestedAt: timestamp("ingested_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  attemptKey: text("attempt_key"),
};
