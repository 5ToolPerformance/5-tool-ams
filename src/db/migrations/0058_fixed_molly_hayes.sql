CREATE TABLE "lesson_player_fatigue" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lesson_player_id" uuid NOT NULL,
	"report" text NOT NULL,
	"severity" integer,
	"body_part_id" text
);
--> statement-breakpoint
ALTER TABLE "pitching_lesson_players" ADD COLUMN "summary" text;--> statement-breakpoint
ALTER TABLE "pitching_lesson_players" ADD COLUMN "focus" text;--> statement-breakpoint
ALTER TABLE "performance_session" ADD COLUMN "error_message" text;--> statement-breakpoint
ALTER TABLE "lesson_player_fatigue" ADD CONSTRAINT "lesson_player_fatigue_lesson_player_id_lesson_players_id_fk" FOREIGN KEY ("lesson_player_id") REFERENCES "public"."lesson_players"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pitching_lesson_players" DROP COLUMN "phase";--> statement-breakpoint
ALTER TABLE "pitching_lesson_players" DROP COLUMN "pitch_count";--> statement-breakpoint
ALTER TABLE "pitching_lesson_players" DROP COLUMN "intent_percent";