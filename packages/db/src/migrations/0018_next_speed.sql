ALTER TABLE "motor_preferences" DROP CONSTRAINT IF EXISTS "motor_preferences_player_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "motor_preferences" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "motor_preferences" ADD CONSTRAINT "motor_preferences_player_id_player_information_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."player_information"("id") ON DELETE cascade ON UPDATE no action;