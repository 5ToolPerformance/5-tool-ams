ALTER TABLE "player_information" ALTER COLUMN "userId" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "player_information" ADD COLUMN "first_name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "player_information" ADD COLUMN "last_name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "player_information" ADD COLUMN "profile_picture_url" text;