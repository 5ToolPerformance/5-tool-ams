export const JOURNAL_ENTRY_TYPES = [
  "throwing",
  "hitting",
  "strength",
  "wellness",
  "other",
] as const;
export const JOURNAL_CONTEXT_TYPES = [
  "game",
  "practice",
  "home",
  "gym",
  "facility",
  "lesson",
  "other",
] as const;
export const THROW_TYPES = [
  "recovery_catch",
  "catch_play",
  "long_toss",
  "flat_ground",
  "bullpen",
  "game",
  "pulldown",
  "other",
] as const;
export const THROW_INTENTS = ["low", "moderate", "high", "max"] as const;
export const HITTING_OUTCOMES = [
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
] as const;
export const WORKLOAD_QUALITIES = [
  "type_only",
  "intent_based",
  "velocity_based",
  "mixed",
] as const;
