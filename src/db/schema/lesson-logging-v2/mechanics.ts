import { pgEnum, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const mechanicTypeEnum = pgEnum("mechanic_type", [
  "pitching",
  "hitting",
  "fielding",
  "catching",
  "strength",
]);

export const mechanics = pgTable("mechanics", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: varchar("description", { length: 1000 }),
  type: mechanicTypeEnum("type").notNull(),
  tags: varchar("tags", { length: 255 }).array(),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow().notNull(),
});
