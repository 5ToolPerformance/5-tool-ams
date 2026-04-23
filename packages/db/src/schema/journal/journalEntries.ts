import {
  date,
  index,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { facilities, playerInformation, users } from "@/db/schema";

import {
  journalContextTypeEnum,
  journalEntryTypeEnum,
  journalLogSourceEnum,
} from "./enums";

export const journalEntries = pgTable(
  "journal_entries",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    playerId: uuid("player_id")
      .notNull()
      .references(() => playerInformation.id),

    loggedByUserId: uuid("logged_by_user_id").references(() => users.id),

    entryDate: date("entry_date").notNull(),

    entryType: journalEntryTypeEnum("entry_type").notNull(),

    source: journalLogSourceEnum("source").notNull().default("player"),

    contextType: journalContextTypeEnum("context_type"),

    title: text("title"),
    summaryNote: text("summary_note"),

    createdOn: timestamp("created_on", { withTimezone: true })
      .defaultNow()
      .notNull(),

    updatedOn: timestamp("updated_on", { withTimezone: true })
      .defaultNow()
      .notNull(),

    facilityId: uuid("facility_id")
      .notNull()
      .references(() => facilities.id),
  },
  (table) => [
    index("journal_entries_player_idx").on(table.playerId),
    index("journal_entries_entry_date_idx").on(table.entryDate),
    index("journal_entries_player_date_idx").on(
      table.playerId,
      table.entryDate
    ),
    index("journal_entries_entry_type_idx").on(table.entryType),
    index("journal_entries_logged_by_idx").on(table.loggedByUserId),
  ]
);

export default journalEntries;
