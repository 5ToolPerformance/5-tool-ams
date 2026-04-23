-- Create injury_status enum
CREATE TYPE "injury_status" AS ENUM('active', 'resolved', 'recurring', 'monitoring');
-- Create injury_severity enum
CREATE TYPE "injury_severity" AS ENUM('mild', 'moderate', 'severe', 'unknown');
--> statement-breakpoint
CREATE TABLE "player_injuries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"player_id" uuid,
	"injury_type" text NOT NULL,
	"injury_date" timestamp NOT NULL,
	"status" "injury_status" DEFAULT 'active' NOT NULL,
	"severity" "injury_severity" DEFAULT 'unknown' NOT NULL,
	"description" text,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "player_injuries" ADD CONSTRAINT "player_injuries_player_id_player_information_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."player_information"("id") ON DELETE cascade ON UPDATE no action;