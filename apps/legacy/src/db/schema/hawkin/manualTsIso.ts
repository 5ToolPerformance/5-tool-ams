// db/schema/tsIsoLessonPlayers.ts
import { pgTable, real, timestamp, uuid } from "drizzle-orm/pg-core";

import { lessonPlayers } from "@/db/schema";

export const manualTsIso = pgTable("manual_ts_iso", {
  id: uuid("id").defaultRandom().primaryKey(),

  lessonPlayerId: uuid("lesson_player_id")
    .notNull()
    .references(() => lessonPlayers.id, { onDelete: "cascade" }),

  // Shoulder ER
  shoulderErL: real("shoulder_er_l"),
  shoulderErR: real("shoulder_er_r"),
  shoulderErTtpfL: real("shoulder_er_ttpf_l"),
  shoulderErTtpfR: real("shoulder_er_ttpf_r"),

  // Shoulder IR
  shoulderIrL: real("shoulder_ir_l"),
  shoulderIrR: real("shoulder_ir_r"),
  shoulderIrTtpfL: real("shoulder_ir_ttpf_l"),
  shoulderIrTtpfR: real("shoulder_ir_ttpf_r"),

  // Shoulder Rotation
  shoulderRotL: real("shoulder_rot_l"),
  shoulderRotR: real("shoulder_rot_r"),
  shoulderRotRfdL: real("shoulder_rot_rfd_l"),
  shoulderRotRfdR: real("shoulder_rot_rfd_r"),

  // Hip Rotation
  hipRotL: real("hip_rot_l"),
  hipRotR: real("hip_rot_r"),
  hipRotRfdL: real("hip_rot_rfd_l"),
  hipRotRfdR: real("hip_rot_rfd_r"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});
