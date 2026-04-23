ALTER TABLE "public"."lesson" ALTER COLUMN "type" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."lesson_types";--> statement-breakpoint
CREATE TYPE "public"."lesson_types" AS ENUM('strength', 'hitting', 'pitching', 'fielding');--> statement-breakpoint
ALTER TABLE "public"."lesson" ALTER COLUMN "type" SET DATA TYPE "public"."lesson_types" USING "type"::"public"."lesson_types";