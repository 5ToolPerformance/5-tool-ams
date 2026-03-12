import { DomainError } from "@/lib/errors";

import { RoutineDocumentV1 } from "./types";

export type RoutineDocument = RoutineDocumentV1 | null;

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
