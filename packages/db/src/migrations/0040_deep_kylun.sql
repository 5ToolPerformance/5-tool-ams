DROP INDEX "hawkins_cmj_unique_attempt";--> statement-breakpoint
DROP INDEX "hawkins_drop_jump_unique_attempt";--> statement-breakpoint
DROP INDEX "hawkins_iso_unique_attempt";--> statement-breakpoint
DROP INDEX "hawkins_multi_unique_attempt";--> statement-breakpoint
DROP INDEX "hawkins_ts_iso_unique_attempt";--> statement-breakpoint
ALTER TABLE "hawkins_cmj" ADD COLUMN "attempt_key" text;--> statement-breakpoint
ALTER TABLE "hawkins_drop_jump" ADD COLUMN "attempt_key" text;--> statement-breakpoint
ALTER TABLE "hawkins_iso" ADD COLUMN "attempt_key" text;--> statement-breakpoint
ALTER TABLE "hawkins_multi" ADD COLUMN "attempt_key" text;--> statement-breakpoint
ALTER TABLE "hawkins_ts_iso" ADD COLUMN "attempt_key" text;--> statement-breakpoint
CREATE UNIQUE INDEX "hawkins_cmj_unique_attempt" ON "hawkins_cmj" USING btree ("athlete_id","timestamp","attempt_key");--> statement-breakpoint
CREATE UNIQUE INDEX "hawkins_drop_jump_unique_attempt" ON "hawkins_drop_jump" USING btree ("athlete_id","timestamp","attempt_key");--> statement-breakpoint
CREATE UNIQUE INDEX "hawkins_iso_unique_attempt" ON "hawkins_iso" USING btree ("athlete_id","timestamp","attempt_key");--> statement-breakpoint
CREATE UNIQUE INDEX "hawkins_multi_unique_attempt" ON "hawkins_multi" USING btree ("athlete_id","timestamp","attempt_key");--> statement-breakpoint
CREATE UNIQUE INDEX "hawkins_ts_iso_unique_attempt" ON "hawkins_ts_iso" USING btree ("athlete_id","timestamp","attempt_key");