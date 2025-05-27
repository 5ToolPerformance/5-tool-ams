import { pgEnum, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";

import armCare from "./assessments/arm-care";
import users from "./users";

export const lessonTypes = pgEnum("lesson_types", [
  "strength",
  "hitting",
  "pithing",
  "fielding",
]);

const lesson = pgTable("lesson", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  coachId: uuid("coachId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  type: lessonTypes("type").notNull(),
  armCare: uuid("armCare").references(() => armCare.id, {
    onDelete: "cascade",
  }),
  createdOn: timestamp("created_on", { mode: "date" }).notNull().defaultNow(),
  lessonDate: timestamp("lesson_date", { mode: "date" }).notNull(),
});
export default lesson;
