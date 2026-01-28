export type PitchingSystem = "armcare" | "trackman";

export type PitchingSessionMetricSet = {
  avgVelo?: number;
  maxVelo?: number;
  spinRate?: number;
  horizBreak?: number;
  vertBreak?: number;
};

export type PitchingWorkload = {
  acute?: number;
  chronic?: number;
};

export type PitchingSession = {
  id: string;
  date: string;
  system: PitchingSystem;
  sessionType: "bullpen" | "game" | "flat";
  throws?: number;
  pitches?: number;
  metrics?: PitchingSessionMetricSet;
  workload?: PitchingWorkload;
  lessonRef?: string;
  healthRef?: string;
};

export type PitchingKpi = {
  key: string;
  label: string;
  value: number | string;
  unit?: string;
  source: "derived" | "measured" | "placeholder";
  helper?: string;
};

export type PitchingTrend = {
  key: string;
  label: string;
  description?: string;
};
