CREATE TYPE "public"."archetypes" AS ENUM('aerial', 'terrestrial');--> statement-breakpoint
CREATE TYPE "public"."left-right" AS ENUM('left', 'right', 'switch');--> statement-breakpoint
CREATE TABLE "motor_preferences" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"player_id" uuid NOT NULL,
	"coach_id" uuid NOT NULL,
	"archetype" "archetypes" NOT NULL,
	"extension_leg" "left-right" NOT NULL,
	"breath" boolean NOT NULL,
	"association" boolean NOT NULL,
	"created_on" timestamp DEFAULT now() NOT NULL,
	"assessment_date" timestamp DEFAULT now() NOT NULL
);
