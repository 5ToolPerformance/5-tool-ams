CREATE TABLE "lesson_drills" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lesson_player_id" uuid NOT NULL,
	"drill_id" uuid NOT NULL,
	"notes" text
);
--> statement-breakpoint
ALTER TABLE "lesson_drills" ADD CONSTRAINT "lesson_drills_lesson_player_id_lesson_players_id_fk" FOREIGN KEY ("lesson_player_id") REFERENCES "public"."lesson_players"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lesson_drills" ADD CONSTRAINT "lesson_drills_drill_id_drills_id_fk" FOREIGN KEY ("drill_id") REFERENCES "public"."drills"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "lesson_drills_player_idx" ON "lesson_drills" USING btree ("lesson_player_id");--> statement-breakpoint
CREATE INDEX "lesson_drills_drill_idx" ON "lesson_drills" USING btree ("drill_id");