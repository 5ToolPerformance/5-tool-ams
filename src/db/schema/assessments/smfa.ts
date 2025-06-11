import {
  index,
  pgTable,
  real,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import lesson from "../lesson";

const smfa = pgTable(
  "smfa",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    playerId: uuid("player_id").notNull(),
    coachId: uuid("coach_id").notNull(),
    lessonId: uuid("lesson_id")
      .notNull()
      .references(() => lesson.id, { onDelete: "cascade" }),
    notes: text("notes"),
    pelvic_rotation_l: real("pelvic_rotation_l").notNull(),
    pelvic_rotation_r: real("pelvic_rotation_r").notNull(),
    seated_trunk_rotation_l: real("seated_trunk_rotation_l").notNull(),
    seated_trunk_rotation_r: real("seated_trunk_rotation_r").notNull(),
    ankle_test_l: real("ankle_test_l").notNull(),
    ankle_test_r: real("ankle_test_r").notNull(),
    forearm_test_l: real("forearm_test_l").notNull(),
    forearm_test_r: real("forearm_test_r").notNull(),
    cervical_rotation_l: real("cervical_rotation_l").notNull(),
    cervical_rotation_r: real("cervical_rotation_r").notNull(),
    msf_l: real("msf_l").notNull(),
    msf_r: real("msf_r").notNull(),
    mse_l: real("mse_l").notNull(),
    mse_r: real("mse_r").notNull(),
    msr_l: real("msr_l").notNull(),
    msr_r: real("msr_r").notNull(),
    pelvic_tilt: real("pelvic_tilt").notNull(),
    squat_test: real("squat_test").notNull(),
    cervical_flexion: real("cervical_flexion").notNull(),
    cervical_extension: real("cervical_extension").notNull(),
    lessonDate: timestamp("lesson_date", { mode: "date" }).notNull(),
    createdOn: timestamp("created_on", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => [
    index("smfa_lesson_idx").on(table.lessonId),
    index("smfa_coach_idx").on(table.coachId),
    index("smfa_player_idx").on(table.playerId),
  ]
);

export default smfa;
