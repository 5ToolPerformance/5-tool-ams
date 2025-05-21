CREATE TYPE "public"."roles" AS ENUM('player', 'coach', 'admin');--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "role" "roles" DEFAULT 'player';