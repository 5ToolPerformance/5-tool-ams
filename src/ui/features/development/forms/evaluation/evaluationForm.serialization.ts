import { EvaluationDocumentV1 } from "@/domain/evaluations/types";
import type { EvaluationEvidenceWriteInput } from "@/domain/evaluations/evidence";

import type {
  EvaluationCreateContext,
  EvaluationFormSubmitPayload,
  EvaluationFormValues,
} from "./evaluationForm.types";

const TESTS_ONLY_PLACEHOLDER_SUMMARY = "Tests-only evaluation";
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

function parseDateTimeInput(value: string): Date {
  return new Date(value);
}

function emptyMetricToNull(value: string | null | undefined): string | null {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

export function serializeEvaluationEvidenceForms(
  values: EvaluationFormValues
): EvaluationEvidenceWriteInput[] {
  return values.evidence
    .filter((item) => item.recordedAt)
    .map((item) => {
      const base = {
        type: item.type,
        recordedAt: parseDateTimeInput(item.recordedAt),
        notes: emptyToNull(item.notes),
        performanceSessionId: item.performanceSessionId,
        evidenceId: item.evidenceId,
      };

      switch (item.type) {
        case "hittrax":
          return {
            ...base,
            type: "hittrax" as const,
            exitVelocityMax: emptyMetricToNull(item.exitVelocityMax),
            exitVelocityAvg: emptyMetricToNull(item.exitVelocityAvg),
            hardHitPercent: emptyMetricToNull(item.hardHitPercent),
            launchAngleAvg: emptyMetricToNull(item.launchAngleAvg),
            lineDriveAvg: emptyMetricToNull(item.lineDriveAvg),
          };
        case "blast":
          return {
            ...base,
            type: "blast" as const,
            batSpeedMax: emptyMetricToNull(item.batSpeedMax),
            batSpeedAvg: emptyMetricToNull(item.batSpeedAvg),
            rotAccMax: emptyMetricToNull(item.rotAccMax),
            rotAccAvg: emptyMetricToNull(item.rotAccAvg),
            onPlanePercent: emptyMetricToNull(item.onPlanePercent),
            attackAngleAvg: emptyMetricToNull(item.attackAngleAvg),
            earlyConnAvg: emptyMetricToNull(item.earlyConnAvg),
            connAtImpactAvg: emptyMetricToNull(item.connAtImpactAvg),
            verticalBatAngleAvg: emptyMetricToNull(item.verticalBatAngleAvg),
            timeToContactAvg: emptyMetricToNull(item.timeToContactAvg),
            handSpeedMax: emptyMetricToNull(item.handSpeedMax),
            handSpeedAvg: emptyMetricToNull(item.handSpeedAvg),
          };
        case "strength":
          return {
            ...base,
            type: "strength" as const,
            powerRating: emptyMetricToNull(item.powerRating),
          };
      }
    });
}

export function serializeEvaluationFormToDocumentData(
  values: EvaluationFormValues
): EvaluationDocumentV1 {
  const buckets = values.buckets
    .filter(
      (
        item
      ): item is typeof item & {
        status: Exclude<typeof item.status, "">;
      } => Boolean(item.bucketId && item.status)
    )
    .map((item) => ({
      bucketId: item.bucketId,
      status: item.status,
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
  };
}

export function serializeEvaluationFormToPayload(
  values: EvaluationFormValues,
  context: EvaluationCreateContext
): EvaluationFormSubmitPayload {
  const summaryFallback =
    values.evaluationType === "tests_only"
      ? TESTS_ONLY_PLACEHOLDER_SUMMARY
      : "";

  return {
    playerId: context.playerId,
    disciplineId: values.disciplineId,
    createdBy: context.createdBy,
    evaluationDate: parseDateInput(values.evaluationDate),
    evaluationType: values.evaluationType,
    phase: values.phase,
    injuryConsiderations: emptyToNull(values.injuryConsiderations),
    snapshotSummary: values.snapshotSummary.trim() || summaryFallback,
    strengthProfileSummary:
      values.strengthProfileSummary.trim() || summaryFallback,
    keyConstraintsSummary: values.keyConstraintsSummary.trim() || summaryFallback,
    documentData: serializeEvaluationFormToDocumentData(values),
    evidenceForms: serializeEvaluationEvidenceForms(values),
  };
}
