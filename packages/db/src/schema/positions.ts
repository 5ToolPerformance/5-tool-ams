import { boolean, pgTable, text, uuid } from "drizzle-orm/pg-core";

export const positions = pgTable("positions", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: text("code").notNull().unique(), // "P", "C", "1B", "SS", "OF"
  name: text("name").notNull(), // "Pitcher", "Catcher"
  group: text("group").notNull(), // "pitcher", "infield", "outfield"
  isResolvable: boolean("is_resolvable").notNull().default(true),
});
