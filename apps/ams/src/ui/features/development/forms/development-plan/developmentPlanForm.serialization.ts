import { DevelopmentPlanDocumentV1 } from "@ams/domain/development-plans/types";

import type {
  DevelopmentPlanCreateContext,
  DevelopmentPlanFormSubmitPayload,
  DevelopmentPlanFormValues,
} from "./developmentPlanForm.types";

function emptyToUndefined(value: string): string | undefined {
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}

function parseOptionalDateInput(value: string): Date | null {
  if (!value) return null;
  const parsed = new Date(`${value}T00:00:00`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function serializeDevelopmentPlanFormToDocumentData(
  values: DevelopmentPlanFormValues
): DevelopmentPlanDocumentV1 {
  const shortTermGoals = values.shortTermGoals
    .map((item) => ({
      title: item.title.trim(),
      description: emptyToUndefined(item.description),
    }))
    .filter((item) => item.title);

  const longTermGoals = values.longTermGoals
    .map((item) => ({
      title: item.title.trim(),
      description: emptyToUndefined(item.description),
    }))
    .filter((item) => item.title);

  const focusAreas = values.focusAreas
    .map((item) => ({
      title: item.title.trim(),
      description: emptyToUndefined(item.description),
    }))
    .filter((item) => item.title);

  const measurableIndicators = values.measurableIndicators
    .map((item) => ({
      title: item.title.trim(),
      description: emptyToUndefined(item.description),
      metricType: emptyToUndefined(item.metricType),
    }))
    .filter((item) => item.title);

  return {
    version: 1,
    summary: emptyToUndefined(values.summary),
    currentPriority: emptyToUndefined(values.currentPriority),
    shortTermGoals: shortTermGoals.length ? shortTermGoals : undefined,
    longTermGoals: longTermGoals.length ? longTermGoals : undefined,
    focusAreas: focusAreas.length ? focusAreas : undefined,
    measurableIndicators: measurableIndicators.length
      ? measurableIndicators
      : undefined,
  };
}

export function serializeDevelopmentPlanFormToPayload(
  values: DevelopmentPlanFormValues,
  context: DevelopmentPlanCreateContext
): DevelopmentPlanFormSubmitPayload {
  return {
    playerId: context.playerId,
    disciplineId: context.evaluation.disciplineId,
    evaluationId: context.evaluation.id,
    createdBy: context.createdBy,
    status: values.status,
    startDate: parseOptionalDateInput(values.startDate),
    targetEndDate: parseOptionalDateInput(values.targetEndDate),
    documentData: serializeDevelopmentPlanFormToDocumentData(values),
  };
}
