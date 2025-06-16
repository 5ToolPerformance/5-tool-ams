import {
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import users from "./users";

export const lessonTypes = pgEnum("lesson_types", [
  "strength",
  "hitting",
  "pitching",
  "fielding",
  "catching",
]);

const lesson = pgTable(
  "lesson",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    playerId: uuid("player_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    coachId: uuid("coach_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    lessonType: lessonTypes("lesson_type").notNull(),
    notes: text("notes"),
    createdOn: timestamp("created_on", { mode: "date" }).notNull().defaultNow(),
    lessonDate: timestamp("lesson_date", { mode: "date" }).notNull(),
  },
  (table) => [
    index("lesson_coach_idx").on(table.coachId),
    index("lesson_player_idx").on(table.playerId),
    index("lesson_type_idx").on(table.lessonType),
    index("lesson_date_idx").on(table.lessonDate),
  ]
);
export default lesson;
