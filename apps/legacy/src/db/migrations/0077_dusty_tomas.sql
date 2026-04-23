ALTER TABLE "development_plan_routines" DROP CONSTRAINT "development_plan_routines_development_plan_id_development_plans_id_fk";
--> statement-breakpoint
ALTER TABLE "development_plan_routines" ALTER COLUMN "development_plan_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "development_plan_routines" ADD COLUMN "player_id" uuid;--> statement-breakpoint
ALTER TABLE "development_plan_routines" ADD COLUMN "discipline_id" uuid;--> statement-breakpoint
ALTER TABLE "development_plan_routines" ADD CONSTRAINT "development_plan_routines_player_id_player_information_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."player_information"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "development_plan_routines" ADD CONSTRAINT "development_plan_routines_discipline_id_disciplines_id_fk" FOREIGN KEY ("discipline_id") REFERENCES "public"."disciplines"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "development_plan_routines" ADD CONSTRAINT "development_plan_routines_development_plan_id_development_plans_id_fk" FOREIGN KEY ("development_plan_id") REFERENCES "public"."development_plans"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "development_plan_routines_player_idx" ON "development_plan_routines" USING btree ("player_id");--> statement-breakpoint
CREATE INDEX "development_plan_routines_discipline_idx" ON "development_plan_routines" USING btree ("discipline_id");