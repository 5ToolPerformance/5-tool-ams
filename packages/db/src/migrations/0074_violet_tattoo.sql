CREATE TYPE "public"."lesson_routine_source" AS ENUM('player', 'universal');--> statement-breakpoint
CREATE TABLE "lesson_player_routines" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lesson_player_id" uuid NOT NULL,
	"source_routine_id" uuid NOT NULL,
	"source_routine_source" "lesson_routine_source" NOT NULL,
	"source_routine_type" text NOT NULL,
	"source_routine_title" text NOT NULL,
	"source_routine_document" jsonb NOT NULL
);
--> statement-breakpoint
ALTER TABLE "lesson_player_routines" ADD CONSTRAINT "lesson_player_routines_lesson_player_id_lesson_players_id_fk" FOREIGN KEY ("lesson_player_id") REFERENCES "public"."lesson_players"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "lesson_player_routines_lesson_player_idx" ON "lesson_player_routines" USING btree ("lesson_player_id");--> statement-breakpoint
CREATE INDEX "lesson_player_routines_source_routine_idx" ON "lesson_player_routines" USING btree ("source_routine_id");