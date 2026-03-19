export type EvaluationDocumentV1 = {
  version: 1;
  snapshot?: {
    notes?: string;
  };
  strengthProfile?: {
    notes?: string;
    strengths?: string[];
  };
  constraints?: {
    notes?: string;
    constraints?: string[];
  };
  focusAreas?: Array<{
    title: string;
    description?: string;
  }>;
  buckets?: Array<{
    bucketId: string;
    status: "strength" | "developing" | "constraint" | "not_relevant";
    notes?: string;
  }>;
  evidence?: Array<{
    performanceSessionId?: string;
    notes?: string;
  }>;
};
