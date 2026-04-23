CREATE TABLE "player_information" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"height" real NOT NULL,
	"weight" real NOT NULL,
	"position" text NOT NULL,
	"throws" text NOT NULL,
	"hits" text NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "player_information" ADD CONSTRAINT "player_information_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;