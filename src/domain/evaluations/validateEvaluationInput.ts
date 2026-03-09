export type EvaluationBucketInput = {
  bucketId: string;
  status: "strength" | "developing" | "constraint" | "not_relevant";
  notes?: string | null;
};

export type EvaluationFocusAreaInput = {
  title: string;
  description?: string | null;
  sortOrder?: number;
};

export type EvaluationEvidenceInput = {
  performanceSessionId: string;
  notes?: string | null;
};

export type EvaluationInput = {
  playerId: string;
  disciplineId: string;
  createdBy: string;
  evaluationDate: Date;
  evaluationType:
    | "baseline"
    | "monthly"
    | "season_review"
    | "injury_return"
    | "general";
  phase:
    | "offseason"
    | "preseason"
    | "inseason"
    | "postseason"
    | "rehab"
    | "return_to_play"
    | "general";
  injuryConsiderations?: string | null;
  snapshotSummary: string;
  strengthProfileSummary: string;
  keyConstraintsSummary: string;
  buckets: EvaluationBucketInput[];
  focusAreas: EvaluationFocusAreaInput[];
  evidence: EvaluationEvidenceInput[];
};

export function validateEvaluationInput(input: EvaluationInput) {
  if (!input.playerId) throw new Error("playerId is required.");
  if (!input.disciplineId) throw new Error("disciplineId is required.");
  if (!input.createdBy) throw new Error("createdBy is required.");
  if (!input.evaluationDate) throw new Error("evaluationDate is required.");

  if (!input.snapshotSummary?.trim()) {
    throw new Error("snapshotSummary is required.");
  }

  if (!input.strengthProfileSummary?.trim()) {
    throw new Error("strengthProfileSummary is required.");
  }

  if (!input.keyConstraintsSummary?.trim()) {
    throw new Error("keyConstraintsSummary is required.");
  }
}
