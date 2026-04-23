CREATE TYPE "public"."mechanic_type" AS ENUM('pitching', 'hitting', 'fielding', 'catching', 'strength');--> statement-breakpoint
CREATE TABLE "mechanics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" varchar(1000),
	"type" "mechanic_type" NOT NULL,
	"tags" varchar(255)[],
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
