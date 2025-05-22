import { relations } from "drizzle-orm";
import { pgTable, real, text, timestamp, uuid } from "drizzle-orm/pg-core";

import users from "./users";

export const playerInformation = pgTable("player_information", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  height: real("height").notNull(),
  weight: real("weight").notNull(),
  position: text("position").notNull(),
  throws: text("throws").notNull(),
  hits: text("hits").notNull(),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export default playerInformation;

// Define relations
export const playerInformationRelations = relations(
  playerInformation,
  ({ one }) => ({
    user: one(users, {
      fields: [playerInformation.userId],
      references: [users.id],
    }),
  })
);
