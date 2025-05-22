import { relations } from "drizzle-orm";
import { pgEnum, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

import playerInformation from "./playerInformation";

export const rolesEnum = pgEnum("roles", ["player", "coach", "admin"]);

const users = pgTable("user", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }).notNull().unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: varchar("image", { length: 2048 }).notNull(),
  role: rolesEnum("role").default("player"),
});

export default users;

export const usersRelations = relations(users, ({ one }) => ({
  playerInfo: one(playerInformation, {
    fields: [users.id],
    references: [playerInformation.userId],
  }),
}));
