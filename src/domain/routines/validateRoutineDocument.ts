import { DomainError } from "@/lib/errors";

export type RoutineDocument = Record<string, unknown> | null;

export type ValidateRoutineInput = {
  developmentPlanId: string;
  createdBy: string;
  title: string;
  description?: string | null;
  routineType: "partial_lesson" | "full_lesson" | "progression";
  sortOrder?: number;
  isActive?: boolean;
  documentData?: RoutineDocument;
};

export function validateRoutineDocument(input: ValidateRoutineInput) {
  if (!input.developmentPlanId) {
    throw new DomainError("developmentPlanId is required.");
  }

  if (!input.createdBy) {
    throw new DomainError("createdBy is required.");
  }

  if (!input.title?.trim()) {
    throw new DomainError("title is required.");
  }

  if (
    input.documentData !== undefined &&
    input.documentData !== null &&
    typeof input.documentData !== "object"
  ) {
    throw new DomainError("documentData must be an object or null.");
  }
}
