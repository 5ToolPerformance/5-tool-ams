import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import users from "./users";

export const notes = pgTable("notes", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  coachId: uuid("coachId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  notes: text("notes"),
  lessonDate: timestamp("lesson_date", { mode: "date" }).notNull(),
  createdOn: timestamp("created_on", { mode: "date" }).notNull().defaultNow(),
});

export default notes;
