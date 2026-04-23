import { pgEnum } from "drizzle-orm/pg-core";

export const journalEntryTypeEnum = pgEnum("journal_entry_type", [
  "throwing",
  "hitting",
  "strength",
  "wellness",
  "other",
]);

export const journalLogSourceEnum = pgEnum("journal_log_source", [
  "player",
  "parent",
  "coach",
  "import",
]);

export const journalContextTypeEnum = pgEnum("journal_context_type", [
  "game",
  "practice",
  "home",
  "gym",
  "facility",
  "lesson",
  "other",
]);

export const throwTypeEnum = pgEnum("throw_type", [
  "recovery_catch",
  "catch_play",
  "long_toss",
  "flat_ground",
  "bullpen",
  "game",
  "pulldown",
  "other",
]);

export const throwIntentEnum = pgEnum("throw_intent", [
  "low",
  "moderate",
  "high",
  "max",
]);

export const workloadQualityEnum = pgEnum("workload_quality", [
  "type_only",
  "intent_based",
  "velocity_based",
  "mixed",
]);

export const readinessStatusEnum = pgEnum("readiness_status", [
  "green",
  "yellow",
  "red",
]);

export const hittingOutcomeEnum = pgEnum("hitting_outcome", [
  "single",
  "double",
  "triple",
  "home_run",
  "walk",
  "strikeout",
  "hit_by_pitch",
  "sac_fly",
  "sac_bunt",
  "line_out",
  "ground_out",
  "fly_out",
  "reach_on_error",
  "fielder_choice",
  "other",
]);
