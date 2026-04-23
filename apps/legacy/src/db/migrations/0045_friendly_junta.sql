CREATE TABLE "player_notes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"player_id" uuid,
	"author_id" uuid,
	"content" text NOT NULL,
	"visibility" text DEFAULT 'private' NOT NULL,
	"created_at" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "player_information" ADD COLUMN "primary_coach_id" uuid;--> statement-breakpoint
ALTER TABLE "player_notes" ADD CONSTRAINT "player_notes_player_id_player_information_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."player_information"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "player_notes" ADD CONSTRAINT "player_notes_author_id_user_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "player_information" ADD CONSTRAINT "player_information_primary_coach_id_user_id_fk" FOREIGN KEY ("primary_coach_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;