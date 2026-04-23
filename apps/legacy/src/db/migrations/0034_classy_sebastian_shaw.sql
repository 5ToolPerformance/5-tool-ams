CREATE TABLE "writeup_log" (
	"id" serial PRIMARY KEY NOT NULL,
	"player_id" uuid NOT NULL,
	"writeup_type" varchar(50) NOT NULL,
	"writeup_date" date NOT NULL,
	"coach_id" uuid,
	"notes" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "writeup_log" ADD CONSTRAINT "writeup_log_player_id_player_information_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."player_information"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "writeup_log" ADD CONSTRAINT "writeup_log_coach_id_user_id_fk" FOREIGN KEY ("coach_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "writeup_log_player_id_idx" ON "writeup_log" USING btree ("player_id");--> statement-breakpoint
CREATE INDEX "writeup_log_date_idx" ON "writeup_log" USING btree ("writeup_date");--> statement-breakpoint
CREATE INDEX "writeup_log_coach_id_idx" ON "writeup_log" USING btree ("coach_id");