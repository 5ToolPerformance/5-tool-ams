CREATE TABLE "lesson_mechanics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lesson_id" uuid NOT NULL,
	"player_id" uuid NOT NULL,
	"mechanic_id" uuid NOT NULL,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "lesson_players" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lesson_id" uuid NOT NULL,
	"player_id" uuid NOT NULL,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "pitching_lesson_players" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lesson_player_id" uuid NOT NULL,
	"phase" text NOT NULL,
	"pitch_count" integer,
	"intent_percent" integer
);
--> statement-breakpoint
ALTER TABLE "lesson_mechanics" ADD CONSTRAINT "lesson_mechanics_lesson_id_lesson_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lesson"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lesson_mechanics" ADD CONSTRAINT "lesson_mechanics_player_id_player_information_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."player_information"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lesson_mechanics" ADD CONSTRAINT "lesson_mechanics_mechanic_id_mechanics_id_fk" FOREIGN KEY ("mechanic_id") REFERENCES "public"."mechanics"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lesson_players" ADD CONSTRAINT "lesson_players_lesson_id_lesson_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lesson"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lesson_players" ADD CONSTRAINT "lesson_players_player_id_player_information_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."player_information"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pitching_lesson_players" ADD CONSTRAINT "pitching_lesson_players_lesson_player_id_lesson_players_id_fk" FOREIGN KEY ("lesson_player_id") REFERENCES "public"."lesson_players"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "lesson_mechanics_lesson_idx" ON "lesson_mechanics" USING btree ("lesson_id");--> statement-breakpoint
CREATE INDEX "lesson_mechanics_player_idx" ON "lesson_mechanics" USING btree ("player_id");--> statement-breakpoint
CREATE INDEX "lesson_mechanics_mechanic_idx" ON "lesson_mechanics" USING btree ("mechanic_id");--> statement-breakpoint
CREATE INDEX "lesson_players_lesson_idx" ON "lesson_players" USING btree ("lesson_id");--> statement-breakpoint
CREATE INDEX "lesson_players_player_idx" ON "lesson_players" USING btree ("player_id");--> statement-breakpoint
CREATE INDEX "pitching_lesson_players_lp_idx" ON "pitching_lesson_players" USING btree ("lesson_player_id");