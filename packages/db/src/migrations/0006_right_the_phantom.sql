ALTER TABLE "user" ADD COLUMN "username" varchar(25);--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_username_unique" UNIQUE("username");