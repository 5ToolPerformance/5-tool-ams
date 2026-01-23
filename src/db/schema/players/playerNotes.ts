import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { playerInformation, users } from "..";

export const playerNotes = pgTable("player_notes", {
    id: uuid("id").primaryKey().defaultRandom(),
    playerId: uuid("player_id").references(() => playerInformation.id),
    authorId: uuid("author_id").references(() => users.id),
    content: text("content").notNull(),
    visibility: text("visibility").notNull().default("private"),
    createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
});

import { relations } from "drizzle-orm";

export const playerNotesRelations = relations(playerNotes, ({ one }) => ({
    author: one(users, {
        fields: [playerNotes.authorId],
        references: [users.id],
    }),

    player: one(playerInformation, {
        fields: [playerNotes.playerId],
        references: [playerInformation.id],
    }),
}));
