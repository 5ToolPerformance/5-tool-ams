import { EvaluationDocumentV1 } from "@/domain/evaluations/types";

import type {
  EvaluationCreateContext,
  EvaluationFormSubmitPayload,
  EvaluationFormValues,
} from "./evaluationForm.types";

const EMPTY_FOCUS_AREAS = Array.from({ length: 3 }, () => ({
  title: "",
  description: "",
}));

function emptyToUndefined(value: string): string | undefined {
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}

function emptyToNull(value: string): string | null {
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function compactStrings(values: string[]): string[] | undefined {
  const cleaned = values.map((value) => value.trim()).filter(Boolean);
  return cleaned.length ? cleaned : undefined;
}

function parseDateInput(value: string): Date {
  const parsed = new Date(`${value}T00:00:00`);
  return parsed;
}

export function serializeEvaluationFormToDocumentData(
  values: EvaluationFormValues
): EvaluationDocumentV1 {
  const buckets = values.buckets
    .filter((item) => item.bucketId && item.status)
    .map((item) => ({
      bucketId: item.bucketId,
      status: item.status!,
      notes: emptyToUndefined(item.notes),
    }));

  const evidence = values.evidence
    .filter((item) => item.performanceSessionId)
    .map((item) => ({
      performanceSessionId: item.performanceSessionId,
      notes: emptyToUndefined(item.notes),
    }));

  return {
    version: 1,
    snapshot: {
      notes: emptyToUndefined(values.snapshotNotes),
    },
    strengthProfile: {
      notes: emptyToUndefined(values.strengthProfileNotes),
      strengths: compactStrings(values.strengths),
    },
    constraints: {
      notes: emptyToUndefined(values.constraintsNotes),
      constraints: compactStrings(values.constraints),
    },
    focusAreas: EMPTY_FOCUS_AREAS.map((item) => ({ ...item })),
    buckets: buckets.length ? buckets : undefined,
    evidence: evidence.length ? evidence : undefined,
  };
}

export function serializeEvaluationFormToPayload(
  values: EvaluationFormValues,
  context: EvaluationCreateContext
): EvaluationFormSubmitPayload {
  return {
    playerId: context.playerId,
    disciplineId: values.disciplineId,
    createdBy: context.createdBy,
    evaluationDate: parseDateInput(values.evaluationDate),
    evaluationType: values.evaluationType,
    phase: values.phase,
    injuryConsiderations: emptyToNull(values.injuryConsiderations),
    snapshotSummary: values.snapshotSummary.trim(),
    strengthProfileSummary: values.strengthProfileSummary.trim(),
    keyConstraintsSummary: values.keyConstraintsSummary.trim(),
    documentData: serializeEvaluationFormToDocumentData(values),
  };
}
