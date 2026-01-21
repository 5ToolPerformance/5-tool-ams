CREATE TABLE "manual_ts_iso" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lesson_player_id" uuid NOT NULL,
	"shoulder_er_l" real,
	"shoulder_er_r" real,
	"shoulder_er_ttpf_l" real,
	"shoulder_er_ttpf_r" real,
	"shoulder_ir_l" real,
	"shoulder_ir_r" real,
	"shoulder_ir_ttpf_l" real,
	"shoulder_ir_ttpf_r" real,
	"shoulder_rot_l" real,
	"shoulder_rot_r" real,
	"shoulder_rot_rfd_l" real,
	"shoulder_rot_rfd_r" real,
	"hip_rot_l" real,
	"hip_rot_r" real,
	"hip_rot_rfd_l" real,
	"hip_rot_rfd_r" real,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "manual_ts_iso" ADD CONSTRAINT "manual_ts_iso_lesson_player_id_lesson_players_id_fk" FOREIGN KEY ("lesson_player_id") REFERENCES "public"."lesson_players"("id") ON DELETE cascade ON UPDATE no action;