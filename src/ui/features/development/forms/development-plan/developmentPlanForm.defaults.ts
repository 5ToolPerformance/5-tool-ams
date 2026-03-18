import type {
  DevelopmentPlanFormListItem,
  DevelopmentPlanFormMeasurableIndicator,
  DevelopmentPlanFormRecord,
  DevelopmentPlanFormValues,
} from "./developmentPlanForm.types";

function createId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

function toDateInputValue(date: Date | string | null | undefined): string {
  if (!date) return "";

  const parsed = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(parsed.getTime())) return "";

  const year = parsed.getFullYear();
  const month = `${parsed.getMonth() + 1}`.padStart(2, "0");
  const day = `${parsed.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function createEmptyDevelopmentPlanFormValues(
  initialEvaluationId = ""
): DevelopmentPlanFormValues {
  return {
    evaluationId: initialEvaluationId,
    status: "draft",
    startDate: "",
    targetEndDate: "",
    summary: "",
    currentPriority: "",
    shortTermGoals: [],
    longTermGoals: [],
    focusAreas: [],
    measurableIndicators: [],
  };
}

export function createDevelopmentPlanFormValuesFromRecord(
  developmentPlan: DevelopmentPlanFormRecord
): DevelopmentPlanFormValues {
  const doc = developmentPlan.documentData;

  return {
    evaluationId: developmentPlan.evaluationId,
    status: developmentPlan.status,
    startDate: toDateInputValue(developmentPlan.startDate),
    targetEndDate: toDateInputValue(developmentPlan.targetEndDate),
    summary: doc?.summary ?? "",
    currentPriority: doc?.currentPriority ?? "",
    shortTermGoals: (doc?.shortTermGoals ?? []).map((item) => ({
      id: createId("stg"),
      title: item.title ?? "",
      description: item.description ?? "",
    })),
    longTermGoals: (doc?.longTermGoals ?? []).map((item) => ({
      id: createId("ltg"),
      title: item.title ?? "",
      description: item.description ?? "",
    })),
    focusAreas: (doc?.focusAreas ?? []).map((item) => ({
      id: createId("focus"),
      title: item.title ?? "",
      description: item.description ?? "",
    })),
    measurableIndicators: (doc?.measurableIndicators ?? []).map((item) => ({
      id: createId("metric"),
      title: item.title ?? "",
      description: item.description ?? "",
      metricType: item.metricType ?? "",
    })),
  };
}

export function cloneDevelopmentPlanFormValues(
  values: DevelopmentPlanFormValues
): DevelopmentPlanFormValues {
  return {
    ...values,
    shortTermGoals: values.shortTermGoals.map((item) => ({ ...item })),
    longTermGoals: values.longTermGoals.map((item) => ({ ...item })),
    focusAreas: values.focusAreas.map((item) => ({ ...item })),
    measurableIndicators: values.measurableIndicators.map((item) => ({
      ...item,
    })),
  };
}

export function createEmptyDevelopmentPlanListItem(
  prefix = "item"
): DevelopmentPlanFormListItem {
  return {
    id: createId(prefix),
    title: "",
    description: "",
  };
}

export function createEmptyMeasurableIndicator(): DevelopmentPlanFormMeasurableIndicator {
  return {
    id: createId("metric"),
    title: "",
    description: "",
    metricType: "",
  };
}
