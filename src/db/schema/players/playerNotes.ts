import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { playerInformation, users } from "..";

export const playerNotes = pgTable("player_notes", {
    id: uuid("id").primaryKey().defaultRandom(),
    playerId: uuid("player_id").references(() => playerInformation.id),
    authorId: uuid("author_id").references(() => users.id),
    content: text("content").notNull(),
    visibility: text("visibility").notNull().default("private"),
    createdAt: text("created_at").notNull(),
});