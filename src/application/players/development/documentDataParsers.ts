import type { DevelopmentPlanDocumentV1 } from "@/domain/development-plans/types";
import type { EvaluationDocumentV1 } from "@/domain/evaluations/types";
import type { RoutineDocumentV1 } from "@/domain/routines/types";

type LooseObject = Record<string, unknown>;

function asObject(value: unknown): LooseObject | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  return value as LooseObject;
}

function getString(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0 ? value : null;
}

function getArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

export interface EvaluationDerivedSummary {
  phaseNote: string | null;
  focusAreaTitles: string[];
  constraints: string[];
}

export interface PlanDerivedSummary {
  summary: string | null;
  currentPriority: string | null;
  shortTermGoalTitles: string[];
  longTermGoalTitles: string[];
}

export interface RoutineDerivedSummary {
  summary: string | null;
  mechanicPreview: string[];
  blockCount: number;
}

export function parseEvaluationSummary(
  documentData: unknown
): EvaluationDerivedSummary {
  const data = asObject(documentData) as EvaluationDocumentV1 | null;
  if (!data) {
    return {
      phaseNote: null,
      focusAreaTitles: [],
      constraints: [],
    };
  }

  const focusAreaTitles = getArray(data.focusAreas)
    .map((area) => asObject(area))
    .map((area) => getString(area?.title))
    .filter((value): value is string => Boolean(value))
    .slice(0, 3);

  const constraints = getArray(data.constraints?.constraints)
    .map((item) => getString(item))
    .filter((value): value is string => Boolean(value))
    .slice(0, 3);

  return {
    phaseNote: getString(data.snapshot?.notes),
    focusAreaTitles,
    constraints,
  };
}

export function parseDevelopmentPlanSummary(
  documentData: unknown
): PlanDerivedSummary {
  const data = asObject(documentData) as DevelopmentPlanDocumentV1 | null;
  if (!data) {
    return {
      summary: null,
      currentPriority: null,
      shortTermGoalTitles: [],
      longTermGoalTitles: [],
    };
  }

  const shortTermGoalTitles = getArray(data.shortTermGoals)
    .map((goal) => asObject(goal))
    .map((goal) => getString(goal?.title))
    .filter((value): value is string => Boolean(value))
    .slice(0, 3);

  const longTermGoalTitles = getArray(data.longTermGoals)
    .map((goal) => asObject(goal))
    .map((goal) => getString(goal?.title))
    .filter((value): value is string => Boolean(value))
    .slice(0, 3);

  return {
    summary: getString(data.summary),
    currentPriority: getString(data.currentPriority),
    shortTermGoalTitles,
    longTermGoalTitles,
  };
}

export function parseRoutineSummary(documentData: unknown): RoutineDerivedSummary {
  const data = asObject(documentData) as RoutineDocumentV1 | null;
  if (!data) {
    return {
      summary: null,
      mechanicPreview: [],
      blockCount: 0,
    };
  }

  const mechanicPreview = getArray(data.mechanics)
    .map((mechanic) => asObject(mechanic))
    .map((mechanic) => getString(mechanic?.title) ?? getString(mechanic?.mechanicId))
    .filter((value): value is string => Boolean(value))
    .slice(0, 3);

  return {
    summary: getString(data.overview?.summary) ?? getString(data.overview?.usageNotes),
    mechanicPreview,
    blockCount: getArray(data.blocks).length,
  };
}
