import { pgTable, uuid } from "drizzle-orm/pg-core";

import users from "./users";

const lesson = pgTable("lesson", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  coachId: uuid("coachId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});
export default lesson;
