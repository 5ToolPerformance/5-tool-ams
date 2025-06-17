import {
  index,
  pgTable,
  real,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import lesson from "../lesson";

const armCare = pgTable(
  "arm_care",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    playerId: uuid("player_id").notNull(),
    coachId: uuid("coach_id").notNull(),
    lessonId: uuid("lesson_id")
      .notNull()
      .references(() => lesson.id, { onDelete: "cascade" }),
    notes: text("notes"),
    shoulder_er_l: real("shoulder_er_l").notNull(),
    shoulder_er_r: real("shoulder_er_r").notNull(),
    shoulder_ir_l: real("shoulder_ir_l").notNull(),
    shoulder_ir_r: real("shoulder_ir_r").notNull(),
    shoulder_flexion_l: real("shoulder_flexion_l").notNull(),
    shoulder_flexion_r: real("shoulder_flexion_r").notNull(),
    supine_hip_er_l: real("supine_hip_er_l").notNull(),
    supine_hip_er_r: real("supine_hip_er_r").notNull(),
    supine_hip_ir_l: real("supine_hip_ir_l").notNull(),
    supine_hip_ir_r: real("supine_hip_ir_r").notNull(),
    straight_leg_l: real("straight_leg_l").notNull(),
    straight_leg_r: real("straight_leg_r").notNull(),
    lessonDate: timestamp("lesson_date", { mode: "date" }).notNull(),
    createdOn: timestamp("created_on", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => [
    index("arm_care_lesson_idx").on(table.lessonId),
    index("arm_care_coach_idx").on(table.coachId),
    index("arm_care_player_idx").on(table.playerId),
  ]
);

export default armCare;
