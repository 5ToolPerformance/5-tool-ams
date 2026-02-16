import {
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { users } from "./";

export const drills = pgTable("drills", {
  id: uuid("id").primaryKey().defaultRandom(),

  title: text("title").notNull(),
  description: text("description").notNull(),
  discipline: text("discipline").default("hitting").notNull(),

  createdBy: uuid("created_by")
    .notNull()
    .references(() => users.id),

  createdOn: timestamp("created_on", { withTimezone: true })
    .defaultNow()
    .notNull(),

  updatedOn: timestamp("updated_on", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const drillTags = pgTable("drill_tags", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(),
  createdOn: timestamp("created_on", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const drillTagLinks = pgTable(
  "drill_tag_links",
  {
    drillId: uuid("drill_id")
      .notNull()
      .references(() => drills.id),

    tagId: uuid("tag_id")
      .notNull()
      .references(() => drillTags.id),
  },
  (table) => [primaryKey({ columns: [table.drillId, table.tagId] })]
);
