import { pgTable, real, text, timestamp, uuid } from "drizzle-orm/pg-core";

import users from "../users";

const hawkinsForcePlate = pgTable("hawkins_force_plate", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  coachId: uuid("coachId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
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
});

export default hawkinsForcePlate;
