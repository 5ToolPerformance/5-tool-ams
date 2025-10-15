CREATE TABLE "catching_assessment" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"player_id" uuid NOT NULL,
	"coach_id" uuid NOT NULL,
	"lesson_id" uuid NOT NULL,
	"feel" integer,
	"last_4" integer,
	"ready_by" integer,
	"catch_throw" text,
	"receiving" text,
	"blocking" text,
	"iq" text,
	"mobility" text,
	"num_throws" integer
);
--> statement-breakpoint
ALTER TABLE "catching_assessment" ADD CONSTRAINT "catching_assessment_lesson_id_lesson_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lesson"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "catching_assessment_lesson_idx" ON "catching_assessment" USING btree ("lesson_id");