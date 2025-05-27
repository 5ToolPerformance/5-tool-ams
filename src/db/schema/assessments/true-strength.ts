import { pgTable, real, text, timestamp, uuid } from "drizzle-orm/pg-core";

import users from "../users";

const trueStrength = pgTable("true_strength", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  coachId: uuid("coachId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  notes: text("notes"),
  seated_shoulder_er_l: real("seated_shoulder_er_l").notNull(),
  seated_shoulder_er_r: real("seated_shoulder_er_r").notNull(),
  seated_shoulder_ir_l: real("seated_shoulder_ir_l").notNull(),
  seated_shoulder_ir_r: real("seated_shoulder_ir_r").notNull(),
  shoulder_rotation_l: real("shoulder_rotation_l").notNull(),
  shoulder_rotation_r: real("shoulder_rotation_r").notNull(),
  shoulder_rotation_rfd_l: real("shoulder_rotation_rfd_l").notNull(),
  shoulder_rotation_rfd_r: real("shoulder_rotation_rfd_r").notNull(),
  hip_rotation_l: real("hip_rotation_l").notNull(),
  hip_rotation_r: real("hip_rotation_r").notNull(),
  hip_rotation_rfd_l: real("hip_rotation_rfd_l").notNull(),
  hip_rotation_rfd_r: real("hip_rotation_rfd_r").notNull(),
  lessonDate: timestamp("lesson_date", { mode: "date" }).notNull(),
  createdOn: timestamp("created_on", { mode: "date" }).notNull().defaultNow(),
});

export default trueStrength;
