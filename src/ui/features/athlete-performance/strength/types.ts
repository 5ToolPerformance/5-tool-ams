export type NormalizedMetric = {
  key: string;
  label: string;
  value: number;
  unit: string;
  percentile: number;
  delta?: number;
  sampleSize?: number;
};

export type PowerRating = {
  score: number;
  percentile: number;
  delta?: number;
  isRollingAverage?: boolean;
  components: {
    key: string;
    weight: number;
    contribution: number;
  }[];
};

export type StrengthSession = {
  date: string;
  testType: string;
  metrics: NormalizedMetric[];
  powerRating: PowerRating;
  notesRef?: string;
};
