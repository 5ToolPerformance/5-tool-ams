CREATE TABLE "writeups" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"coach_id" uuid NOT NULL,
	"player_id" uuid NOT NULL,
	"writeup_type" text NOT NULL,
	"content" jsonb NOT NULL,
	"created_on" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "writeups" ADD CONSTRAINT "writeups_coach_id_user_id_fk" FOREIGN KEY ("coach_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "writeups" ADD CONSTRAINT "writeups_player_id_player_information_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."player_information"("id") ON DELETE no action ON UPDATE no action;