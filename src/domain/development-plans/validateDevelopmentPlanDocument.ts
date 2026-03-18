import { DomainError } from "@/lib/errors";

export type ValidateDevelopmentPlanInput = {
  playerId: string;
  disciplineId: string;
  evaluationId: string;
  createdBy: string;
  status?: "draft" | "active" | "completed" | "archived";
  startDate?: Date | null;
  targetEndDate?: Date | null;
  documentData?: Record<string, unknown> | null;
};

export function validateDevelopmentPlanDocument(
  input: ValidateDevelopmentPlanInput
) {
  if (!input.playerId) throw new DomainError("playerId is required.");
  if (!input.disciplineId) throw new DomainError("disciplineId is required.");
  if (!input.evaluationId) throw new DomainError("evaluationId is required.");
  if (!input.createdBy) throw new DomainError("createdBy is required.");

  if (
    input.documentData !== undefined &&
    input.documentData !== null &&
    typeof input.documentData !== "object"
  ) {
    throw new DomainError("documentData must be an object or null.");
  }
}
