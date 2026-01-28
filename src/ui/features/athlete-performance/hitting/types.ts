export type HittingSystem = "hittrax" | "blast" | "lesson";

export type HittingSessionMetricSet = {
  avgEV?: number;
  maxEV?: number;
  avgLA?: number;
  batSpeed?: number;
  attackAngle?: number;
};

export type HittingSprayPoint = {
  x: number;
  y: number;
  result?: string;
};

export type HittingSession = {
  id: string;
  date: string;
  system: HittingSystem;
  swings?: number;
  metrics?: HittingSessionMetricSet;
  sprayChart?: HittingSprayPoint[];
  lessonRef?: string;
};

export type HittingKpi = {
  key: string;
  label: string;
  value: number | string;
  unit?: string;
  source: "derived" | "measured" | "placeholder";
  helper?: string;
};

export type HittingTrend = {
  key: string;
  label: string;
  description?: string;
};
