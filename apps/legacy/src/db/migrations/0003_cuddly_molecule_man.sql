CREATE TABLE "athletic_development" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"notes" text,
	"weight" real NOT NULL,
	"position" text NOT NULL,
	"throws" text NOT NULL,
	"hits" text NOT NULL,
	"lesson_date" timestamp NOT NULL,
	"created_on" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "player_information" RENAME COLUMN "expires" TO "date_of_birth";--> statement-breakpoint
ALTER TABLE "athletic_development" ADD CONSTRAINT "athletic_development_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;