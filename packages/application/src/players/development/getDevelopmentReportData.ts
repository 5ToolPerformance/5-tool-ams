import db from "@ams/db";
import { getActiveDevelopmentPlanForPlayerDiscipline } from "@ams/db/queries/development-plans/getActiveDevelopmentPlanForPlayerDiscipline";
import { getEvaluationById } from "@ams/db/queries/evaluations/getEvaluationById";
import { getDisciplinesByIds } from "@ams/db/queries/players/getDisciplinesByIds";
import { getPlayerHeader } from "@ams/db/queries/players/PlayerHeader";
import { getRoutinesForDevelopmentPlan } from "@ams/db/queries/routines/getRoutinesForDevelopmentPlan";

import {
  parseDevelopmentPlanReportDetails,
  parseEvaluationReportDetails,
  parseRoutineReportDetails,
} from "./documentDataParsers";

export type DevelopmentReportOptions = {
  playerId: string;
  disciplineId: string;
  includeEvidence: boolean;
  routineIds?: string[];
};

export type DevelopmentReportData = {
  player: {
    id: string;
    name: string;
    age: number | null;
    positions: string[];
    handedness: {
      bat: string;
      throw: string;
    } | null;
    primaryCoachName: string | null;
  };
  discipline: {
    id: string;
    key: string;
    label: string;
  };
  generatedOn: Date;
  evaluation: {
    id: string;
    date: Date;
    type: string;
    phase: string;
    snapshotSummary: string;
    strengthProfileSummary: string;
    keyConstraintsSummary: string;
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
  };
  plan: {
    id: string;
    status: string;
    startDate: Date | null;
    targetEndDate: Date | null;
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
  };
  routines: Array<{
    id: string;
    title: string;
    description: string | null;
    routineType: string;
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
  }>;
};

export async function getDevelopmentReportData(
  options: DevelopmentReportOptions
): Promise<DevelopmentReportData | null> {
  const [player, activePlan, disciplineRows] = await Promise.all([
    getPlayerHeader(options.playerId),
    getActiveDevelopmentPlanForPlayerDiscipline(db, {
      playerId: options.playerId,
      disciplineId: options.disciplineId,
    }),
    getDisciplinesByIds(db, [options.disciplineId]),
  ]);

  if (!player || !activePlan) {
    return null;
  }

  const discipline = disciplineRows[0];
  if (!discipline) {
    return null;
  }

  let evaluation;
  try {
    evaluation = await getEvaluationById(db, activePlan.evaluationId);
  } catch {
    return null;
  }

  if (
    evaluation.playerId !== options.playerId ||
    evaluation.disciplineId !== options.disciplineId
  ) {
    return null;
  }

  const routines = await getRoutinesForDevelopmentPlan(db, activePlan.id);
  const selectedRoutineIds = new Set(options.routineIds ?? []);
  const filteredRoutines =
    selectedRoutineIds.size > 0
      ? routines.filter((routine) => selectedRoutineIds.has(routine.id))
      : [];

  const evaluationDetails = parseEvaluationReportDetails(evaluation.documentData);
  const planDetails = parseDevelopmentPlanReportDetails(activePlan.documentData);

  return {
    player: {
      id: player.id,
      name: `${player.firstName} ${player.lastName}`.trim(),
      age: player.age ?? null,
      positions: player.positions.map((position) => position.name),
      handedness: player.handedness
        ? {
            bat: player.handedness.bat,
            throw: player.handedness.throw,
          }
        : null,
      primaryCoachName: player.primaryCoachName ?? null,
    },
    discipline: {
      id: discipline.id,
      key: discipline.key,
      label: discipline.label,
    },
    generatedOn: new Date(),
    evaluation: {
      id: evaluation.id,
      date: evaluation.evaluationDate,
      type: evaluation.evaluationType,
      phase: evaluation.phase,
      snapshotSummary: evaluation.snapshotSummary,
      strengthProfileSummary: evaluation.strengthProfileSummary,
      keyConstraintsSummary: evaluation.keyConstraintsSummary,
      strengths: evaluationDetails.strengths,
      focusAreas: evaluationDetails.focusAreas,
      constraints: evaluationDetails.constraints,
      evidence: options.includeEvidence ? evaluationDetails.evidence : [],
    },
    plan: {
      id: activePlan.id,
      status: activePlan.status,
      startDate: activePlan.startDate,
      targetEndDate: activePlan.targetEndDate,
      summary: planDetails.summary,
      currentPriority: planDetails.currentPriority,
      shortTermGoals: planDetails.shortTermGoals,
      longTermGoals: planDetails.longTermGoals,
      focusAreas: planDetails.focusAreas,
      measurableIndicators: planDetails.measurableIndicators,
    },
    routines: filteredRoutines.map((routine) => {
      const details = parseRoutineReportDetails(routine.documentData);
      return {
        id: routine.id,
        title: routine.title,
        description: routine.description,
        routineType: routine.routineType,
        summary: details.summary,
        usageNotes: details.usageNotes,
        mechanics: details.mechanics,
        blocks: details.blocks,
      };
    }),
  };
}
