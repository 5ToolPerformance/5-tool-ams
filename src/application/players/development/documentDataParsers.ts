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

export interface EvaluationReportDetails {
  strengths: string[];
  focusAreas: Array<{
    title: string;
    description: string | null;
  }>;
  constraints: string[];
  evidence: Array<{
    performanceSessionId: string | null;
    notes: string | null;
  }>;
}

export interface PlanDerivedSummary {
  summary: string | null;
  currentPriority: string | null;
  shortTermGoalTitles: string[];
  longTermGoalTitles: string[];
}

export interface DevelopmentPlanReportDetails {
  summary: string | null;
  currentPriority: string | null;
  shortTermGoals: Array<{
    title: string;
    description: string | null;
  }>;
  longTermGoals: Array<{
    title: string;
    description: string | null;
  }>;
  focusAreas: Array<{
    title: string;
    description: string | null;
  }>;
  measurableIndicators: Array<{
    title: string;
    description: string | null;
    metricType: string | null;
  }>;
}

export interface RoutineDerivedSummary {
  summary: string | null;
  mechanicPreview: string[];
  blockCount: number;
}

export interface RoutineReportDetails {
  summary: string | null;
  usageNotes: string | null;
  mechanics: string[];
  blocks: Array<{
    id: string;
    title: string;
      notes: string | null;
      drills: Array<{
        drillId: string | null;
        title: string | null;
        notes: string | null;
      }>;
  }>;
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

export function parseEvaluationReportDetails(
  documentData: unknown
): EvaluationReportDetails {
  const data = asObject(documentData) as EvaluationDocumentV1 | null;
  if (!data) {
    return {
      strengths: [],
      focusAreas: [],
      constraints: [],
      evidence: [],
    };
  }

  const strengths = getArray(data.strengthProfile?.strengths)
    .map((item) => getString(item))
    .filter((value): value is string => Boolean(value));

  const focusAreas = getArray(data.focusAreas)
    .map((area) => asObject(area))
    .map((area) => ({
      title: getString(area?.title),
      description: getString(area?.description),
    }))
    .filter(
      (
        area
      ): area is {
        title: string;
        description: string | null;
      } => Boolean(area.title)
    );

  const constraints = getArray(data.constraints?.constraints)
    .map((item) => getString(item))
    .filter((value): value is string => Boolean(value));

  const evidence = getArray(data.evidence)
    .map((item) => asObject(item))
    .map((item) => ({
      performanceSessionId: getString(item?.performanceSessionId),
      notes: getString(item?.notes),
    }))
    .filter((item) => item.performanceSessionId || item.notes);

  return {
    strengths,
    focusAreas,
    constraints,
    evidence,
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

export function parseDevelopmentPlanReportDetails(
  documentData: unknown
): DevelopmentPlanReportDetails {
  const data = asObject(documentData) as DevelopmentPlanDocumentV1 | null;
  if (!data) {
    return {
      summary: null,
      currentPriority: null,
      shortTermGoals: [],
      longTermGoals: [],
      focusAreas: [],
      measurableIndicators: [],
    };
  }

  const parseGoalArray = (
    value: unknown
  ): Array<{ title: string; description: string | null }> =>
    getArray(value)
      .map((goal) => asObject(goal))
      .map((goal) => ({
        title: getString(goal?.title),
        description: getString(goal?.description),
      }))
      .filter(
        (
          goal
        ): goal is {
          title: string;
          description: string | null;
        } => Boolean(goal.title)
      );

  const measurableIndicators = getArray(data.measurableIndicators)
    .map((indicator) => asObject(indicator))
    .map((indicator) => ({
      title: getString(indicator?.title),
      description: getString(indicator?.description),
      metricType: getString(indicator?.metricType),
    }))
    .filter(
      (
        indicator
      ): indicator is {
        title: string;
        description: string | null;
        metricType: string | null;
      } => Boolean(indicator.title)
    );

  return {
    summary: getString(data.summary),
    currentPriority: getString(data.currentPriority),
    shortTermGoals: parseGoalArray(data.shortTermGoals),
    longTermGoals: parseGoalArray(data.longTermGoals),
    focusAreas: parseGoalArray(data.focusAreas),
    measurableIndicators,
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

export function parseRoutineReportDetails(
  documentData: unknown
): RoutineReportDetails {
  const data = asObject(documentData) as RoutineDocumentV1 | null;
  if (!data) {
    return {
      summary: null,
      usageNotes: null,
      mechanics: [],
      blocks: [],
    };
  }

  const mechanics = getArray(data.mechanics)
    .map((mechanic) => asObject(mechanic))
    .map((mechanic) => getString(mechanic?.title) ?? getString(mechanic?.mechanicId))
    .filter((value): value is string => Boolean(value));

  const blocks = getArray(data.blocks)
    .map((block, index) => ({ block: asObject(block), index }))
    .map(({ block, index }) => ({
      id: getString(block?.id) ?? `block-${index}`,
      title: getString(block?.title),
      notes: getString(block?.notes),
      drills: getArray(block?.drills)
        .map((drill) => asObject(drill))
        .map((drill) => ({
          drillId: getString(drill?.drillId),
          title: getString(drill?.title),
          notes: getString(drill?.notes),
        }))
        .filter((drill) => drill.drillId || drill.title || drill.notes),
    }))
    .filter(
      (
        block
      ): block is {
        id: string;
        title: string;
        notes: string | null;
        drills: Array<{
          drillId: string | null;
          title: string | null;
          notes: string | null;
        }>;
      } => Boolean(block.title)
    );

  return {
    summary: getString(data.overview?.summary),
    usageNotes: getString(data.overview?.usageNotes),
    mechanics,
    blocks,
  };
}
