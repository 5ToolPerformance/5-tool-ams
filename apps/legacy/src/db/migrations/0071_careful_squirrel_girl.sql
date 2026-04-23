CREATE TABLE "universal_routines" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"facility_id" uuid NOT NULL,
	"created_by" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"routine_type" "routine_type" NOT NULL,
	"discipline_id" uuid NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"document_data" jsonb,
	"created_on" timestamp DEFAULT now() NOT NULL,
	"updated_on" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "universal_routines" ADD CONSTRAINT "universal_routines_facility_id_facilities_id_fk" FOREIGN KEY ("facility_id") REFERENCES "public"."facilities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "universal_routines" ADD CONSTRAINT "universal_routines_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "universal_routines" ADD CONSTRAINT "universal_routines_discipline_id_disciplines_id_fk" FOREIGN KEY ("discipline_id") REFERENCES "public"."disciplines"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "universal_routines_facility_idx" ON "universal_routines" USING btree ("facility_id");--> statement-breakpoint
CREATE INDEX "universal_routines_discipline_idx" ON "universal_routines" USING btree ("discipline_id");--> statement-breakpoint
CREATE INDEX "universal_routines_type_idx" ON "universal_routines" USING btree ("routine_type");--> statement-breakpoint
CREATE INDEX "universal_routines_active_idx" ON "universal_routines" USING btree ("is_active");