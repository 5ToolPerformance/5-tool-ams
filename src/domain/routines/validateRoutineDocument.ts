import { DomainError } from "@/domain/errors";

export type ValidateRoutineInput = {
  playerId?: string;
  disciplineId: string;
  createdBy: string;
  title: string;
  description?: string | null;
  routineType: "partial_lesson" | "full_lesson" | "progression";
  sortOrder?: number;
  isActive?: boolean;
  documentData?: Record<string, unknown> | null;
  developmentPlanId?: string;
  requiresPlayerId?: boolean;
};

export function validateRoutineDocument(input: ValidateRoutineInput) {
  if (!input.createdBy) {
    throw new DomainError("createdBy is required.");
  }

  if (!input.title?.trim()) {
    throw new DomainError("title is required.");
  }

  if (input.requiresPlayerId && !input.playerId) {
    throw new DomainError("playerId is required.");
  }

  if (!input.disciplineId) {
    throw new DomainError("disciplineId is required.");
  }

  if (
    input.documentData !== undefined &&
    input.documentData !== null &&
    typeof input.documentData !== "object"
  ) {
    throw new DomainError("documentData must be an object or null.");
  }
}
