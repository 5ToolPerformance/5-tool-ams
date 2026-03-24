CREATE TABLE "evaluation_blast" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"evaluation_id" uuid NOT NULL,
	"performance_session_id" uuid NOT NULL,
	"player_id" uuid NOT NULL,
	"recorded_at" timestamp with time zone NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"bat_speed_max" numeric,
	"bat_speed_avg" numeric,
	"rot_acc_max" numeric,
	"rot_acc_avg" numeric,
	"on_plane_percent" numeric,
	"attack_angle" numeric,
	"early_connection_avg" numeric,
	"connection_at_impact_avg" numeric,
	"vertical_bat_angle_avg" numeric,
	"time_to_contact_avg" numeric,
	"hand_speed_max" numeric,
	"hand_speed_avg" numeric
);
--> statement-breakpoint
CREATE TABLE "evaluation_hittrax" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"evaluation_id" uuid NOT NULL,
	"performance_session_id" uuid NOT NULL,
	"player_id" uuid NOT NULL,
	"recorded_at" timestamp with time zone NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"exit_velocity_max" numeric,
	"exit_velocity_avg" numeric,
	"hard_hit_percent" numeric,
	"launch_angle_avg" numeric,
	"line_drive_avg" numeric
);
--> statement-breakpoint
CREATE TABLE "evaluation_strength" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"evaluation_id" uuid NOT NULL,
	"performance_session_id" uuid NOT NULL,
	"player_id" uuid NOT NULL,
	"recorded_at" timestamp with time zone NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"power_rating" numeric
);
--> statement-breakpoint
ALTER TABLE "performance_session" ADD COLUMN "evaluation_id" uuid;--> statement-breakpoint
ALTER TABLE "evaluation_blast" ADD CONSTRAINT "evaluation_blast_evaluation_id_evaluations_id_fk" FOREIGN KEY ("evaluation_id") REFERENCES "public"."evaluations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evaluation_blast" ADD CONSTRAINT "evaluation_blast_performance_session_id_performance_session_id_fk" FOREIGN KEY ("performance_session_id") REFERENCES "public"."performance_session"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evaluation_blast" ADD CONSTRAINT "evaluation_blast_player_id_player_information_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."player_information"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evaluation_hittrax" ADD CONSTRAINT "evaluation_hittrax_evaluation_id_evaluations_id_fk" FOREIGN KEY ("evaluation_id") REFERENCES "public"."evaluations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evaluation_hittrax" ADD CONSTRAINT "evaluation_hittrax_performance_session_id_performance_session_id_fk" FOREIGN KEY ("performance_session_id") REFERENCES "public"."performance_session"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evaluation_hittrax" ADD CONSTRAINT "evaluation_hittrax_player_id_player_information_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."player_information"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evaluation_strength" ADD CONSTRAINT "evaluation_strength_evaluation_id_evaluations_id_fk" FOREIGN KEY ("evaluation_id") REFERENCES "public"."evaluations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evaluation_strength" ADD CONSTRAINT "evaluation_strength_performance_session_id_performance_session_id_fk" FOREIGN KEY ("performance_session_id") REFERENCES "public"."performance_session"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evaluation_strength" ADD CONSTRAINT "evaluation_strength_player_id_player_information_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."player_information"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "evaluation_blast_evaluation_idx" ON "evaluation_blast" USING btree ("evaluation_id");--> statement-breakpoint
CREATE INDEX "evaluation_blast_player_idx" ON "evaluation_blast" USING btree ("player_id");--> statement-breakpoint
CREATE INDEX "evaluation_blast_session_idx" ON "evaluation_blast" USING btree ("performance_session_id");--> statement-breakpoint
CREATE INDEX "evaluation_blast_recorded_at_idx" ON "evaluation_blast" USING btree ("recorded_at");--> statement-breakpoint
CREATE UNIQUE INDEX "evaluation_blast_evaluation_unique" ON "evaluation_blast" USING btree ("evaluation_id");--> statement-breakpoint
CREATE UNIQUE INDEX "evaluation_blast_session_unique" ON "evaluation_blast" USING btree ("performance_session_id");--> statement-breakpoint
CREATE INDEX "evaluation_hittrax_evaluation_idx" ON "evaluation_hittrax" USING btree ("evaluation_id");--> statement-breakpoint
CREATE INDEX "evaluation_hittrax_player_idx" ON "evaluation_hittrax" USING btree ("player_id");--> statement-breakpoint
CREATE INDEX "evaluation_hittrax_session_idx" ON "evaluation_hittrax" USING btree ("performance_session_id");--> statement-breakpoint
CREATE INDEX "evaluation_hittrax_recorded_at_idx" ON "evaluation_hittrax" USING btree ("recorded_at");--> statement-breakpoint
CREATE UNIQUE INDEX "evaluation_hittrax_evaluation_unique" ON "evaluation_hittrax" USING btree ("evaluation_id");--> statement-breakpoint
CREATE UNIQUE INDEX "evaluation_hittrax_session_unique" ON "evaluation_hittrax" USING btree ("performance_session_id");--> statement-breakpoint
CREATE INDEX "evaluation_strength_evaluation_idx" ON "evaluation_strength" USING btree ("evaluation_id");--> statement-breakpoint
CREATE INDEX "evaluation_strength_player_idx" ON "evaluation_strength" USING btree ("player_id");--> statement-breakpoint
CREATE INDEX "evaluation_strength_session_idx" ON "evaluation_strength" USING btree ("performance_session_id");--> statement-breakpoint
CREATE INDEX "evaluation_strength_recorded_at_idx" ON "evaluation_strength" USING btree ("recorded_at");--> statement-breakpoint
CREATE UNIQUE INDEX "evaluation_strength_evaluation_unique" ON "evaluation_strength" USING btree ("evaluation_id");--> statement-breakpoint
CREATE UNIQUE INDEX "evaluation_strength_session_unique" ON "evaluation_strength" USING btree ("performance_session_id");--> statement-breakpoint
ALTER TABLE "performance_session" ADD CONSTRAINT "performance_session_evaluation_id_evaluations_id_fk" FOREIGN KEY ("evaluation_id") REFERENCES "public"."evaluations"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "performance_session_evaluation_idx" ON "performance_session" USING btree ("evaluation_id");--> statement-breakpoint
ALTER TABLE "performance_session" ADD CONSTRAINT "performance_session_single_context_check" CHECK (NOT ("performance_session"."lesson_id" IS NOT NULL AND "performance_session"."evaluation_id" IS NOT NULL));