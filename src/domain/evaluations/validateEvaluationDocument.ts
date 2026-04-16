import { DomainError } from "@/domain/errors";

export type ValidateEvaluationInput = {
  playerId: string;
  disciplineId: string;
  createdBy: string;
  evaluationDate: Date;
  evaluationType:
    | "baseline"
    | "monthly"
    | "season_review"
    | "injury_return"
    | "general"
    | "tests_only";
  phase:
    | "offseason"
    | "preseason"
    | "inseason"
    | "postseason"
    | "rehab"
    | "return_to_play"
    | "general";
  snapshotSummary: string;
  strengthProfileSummary: string;
  keyConstraintsSummary: string;
  injuryConsiderations?: string | null;
  documentData?: Record<string, unknown> | null;
};

export function validateEvaluationDocument(input: ValidateEvaluationInput) {
  if (!input.playerId) throw new DomainError("playerId is required.");
  if (!input.disciplineId) throw new DomainError("disciplineId is required.");
  if (!input.createdBy) throw new DomainError("createdBy is required.");
  if (!input.evaluationDate)
    throw new DomainError("evaluationDate is required.");

  if (!input.snapshotSummary?.trim()) {
    throw new DomainError("snapshotSummary is required.");
  }

  if (!input.strengthProfileSummary?.trim()) {
    throw new DomainError("strengthProfileSummary is required.");
  }

  if (!input.keyConstraintsSummary?.trim()) {
    throw new DomainError("keyConstraintsSummary is required.");
  }

  if (
    input.documentData !== undefined &&
    input.documentData !== null &&
    typeof input.documentData !== "object"
  ) {
    throw new DomainError("documentData must be an object or null.");
  }
}
