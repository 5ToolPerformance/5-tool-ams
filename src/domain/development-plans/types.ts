export type DevelopmentPlanDocumentV1 = {
  version: 1;
  summary?: string;
  currentPriority?: string;
  shortTermGoals?: Array<{
    title: string;
    description?: string;
  }>;
  longTermGoals?: Array<{
    title: string;
    description?: string;
  }>;
  focusAreas?: Array<{
    title: string;
    description?: string;
  }>;
  measurableIndicators?: Array<{
    title: string;
    description?: string;
    metricType?: string;
  }>;
};
