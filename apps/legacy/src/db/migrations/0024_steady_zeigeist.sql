ALTER TABLE "user" ALTER COLUMN "role" SET DEFAULT 'coach';--> statement-breakpoint
CREATE TYPE sports AS ENUM ('baseball', 'softball');--> statement-breakpoint
ALTER TABLE "player_information" ADD COLUMN "sport" sports DEFAULT 'baseball' NOT NULL;--> statement-breakpoint
CREATE TYPE access AS ENUM ('read/write', 'read-only', 'write-only');--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "access" access DEFAULT 'read/write';--> statement-breakpoint