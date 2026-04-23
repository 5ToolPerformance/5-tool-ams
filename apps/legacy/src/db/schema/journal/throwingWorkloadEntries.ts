import {
  boolean,
  index,
  integer,
  pgTable,
  real,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { throwIntentEnum, throwTypeEnum } from "./enums";
import throwingJournalEntries from "./throwingJournalEntries";

export const throwingWorkloadEntries = pgTable(
  "throwing_workload_entries",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    throwingJournalEntryId: uuid("throwing_journal_entry_id")
      .notNull()
      .references(() => throwingJournalEntries.id),

    throwType: throwTypeEnum("throw_type").notNull(),

    throwCount: integer("throw_count").notNull(),
    pitchCount: integer("pitch_count"),

    intentLevel: throwIntentEnum("intent_level"),

    velocityAvg: real("velocity_avg"),
    velocityMax: real("velocity_max"),

    pitchType: text("pitch_type"),
    durationMinutes: integer("duration_minutes"),

    notes: text("notes"),

    isEstimated: boolean("is_estimated").notNull().default(false),

    createdOn: timestamp("created_on", { withTimezone: true })
      .defaultNow()
      .notNull(),

    updatedOn: timestamp("updated_on", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("throwing_workload_entries_throwing_entry_idx").on(
      table.throwingJournalEntryId
    ),
    index("throwing_workload_entries_throw_type_idx").on(table.throwType),
    index("throwing_workload_entries_intent_idx").on(table.intentLevel),
  ]
);

export default throwingWorkloadEntries;
