CREATE TABLE "player_measurements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"player_id" uuid NOT NULL,
	"height" real NOT NULL,
	"weight" real NOT NULL,
	"recorded_on" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "player_information" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "player_information" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "player_measurements" ADD CONSTRAINT "player_measurements_player_id_player_information_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."player_information"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
INSERT INTO player_measurements (player_id, height, weight, recorded_on)
SELECT id, height, weight, now()
FROM player_information;