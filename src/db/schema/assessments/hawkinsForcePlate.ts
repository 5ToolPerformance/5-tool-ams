import {
  index,
  pgTable,
  real,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import lesson from "../lesson";

const hawkinsForcePlate = pgTable(
  "hawkins_force_plate",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    playerId: uuid("player_id").notNull(),
    coachId: uuid("coach_id").notNull(),
    lessonId: uuid("lesson_id")
      .notNull()
      .references(() => lesson.id, { onDelete: "cascade" }),
    notes: text("notes"),
    cmj: real("cmj").notNull(),
    drop_jump: real("drop_jump").notNull(),
    pogo: real("pogo").notNull(),
    mid_thigh_pull: real("mid_thigh_pull").notNull(),
    mtp_time: real("mtp_time").notNull(),
    cop_ml_l: real("cop_ml_l").notNull(),
    cop_ml_r: real("cop_ml_r").notNull(),
    cop_ap_l: real("cop_ap_l").notNull(),
    cop_ap_r: real("cop_ap_r").notNull(),
    lessonDate: timestamp("lesson_date", { mode: "date" }).notNull(),
    createdOn: timestamp("created_on", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => [index("hawkins_force_plate_lesson_idx").on(table.lessonId)]
);

export default hawkinsForcePlate;
