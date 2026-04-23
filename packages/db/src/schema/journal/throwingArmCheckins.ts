import {
  boolean,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import throwingJournalEntries from "./throwingJournalEntries";

export const throwingArmCheckins = pgTable(
  "throwing_arm_checkins",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    throwingJournalEntryId: uuid("throwing_journal_entry_id")
      .notNull()
      .references(() => throwingJournalEntries.id),

    armSoreness: integer("arm_soreness"),
    bodyFatigue: integer("body_fatigue"),
    armFatigue: integer("arm_fatigue"),
    recoveryScore: integer("recovery_score"),

    feelsOff: boolean("feels_off"),

    statusNote: text("status_note"),

    createdOn: timestamp("created_on", { withTimezone: true })
      .defaultNow()
      .notNull(),

    updatedOn: timestamp("updated_on", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("throwing_arm_checkins_throwing_entry_uidx").on(
      table.throwingJournalEntryId
    ),
    index("throwing_arm_checkins_arm_soreness_idx").on(table.armSoreness),
  ]
);

export default throwingArmCheckins;
