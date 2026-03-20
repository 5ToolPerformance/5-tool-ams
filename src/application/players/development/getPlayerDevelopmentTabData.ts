import db from "@/db";
import { getActiveDevelopmentPlanForPlayerDiscipline } from "@/db/queries/development-plans/getActiveDevelopmentPlanForPlayerDiscipline";
import { listActiveDisciplines } from "@/db/queries/config/listActiveDisciplines";
import { getEvaluationById } from "@/db/queries/evaluations/getEvaluationById";
import { getDevelopmentPlansForPlayer } from "@/db/queries/development-plans/getDevelopmentPlansForPlayers";
import { getEvaluationsForPlayer } from "@/db/queries/evaluations/getEvaluationsForPlayer";
import { getRoutinesForDevelopmentPlan } from "@/db/queries/routines/getRoutinesForDevelopmentPlan";

const MAX_READ_ROWS = 250;

export type DevelopmentDisciplineOption = {
  id: string;
  key: string;
  label: string;
};

export type EvaluationRow = Awaited<
  ReturnType<typeof getEvaluationsForPlayer>
>[number];
export type DevelopmentPlanRow = Awaited<
  ReturnType<typeof getDevelopmentPlansForPlayer>
>[number];
export type RoutineRow = Awaited<
  ReturnType<typeof getRoutinesForDevelopmentPlan>
>[number];

export type PlayerDevelopmentTabData = {
  selectedDiscipline: DevelopmentDisciplineOption | null;
  disciplineOptions: DevelopmentDisciplineOption[];
  latestEvaluation: EvaluationRow | null;
  evaluationHistory: EvaluationRow[];
  activePlan: DevelopmentPlanRow | null;
  developmentPlanHistory: DevelopmentPlanRow[];
  playerRoutines: RoutineRow[];
  universalRoutines: RoutineRow[];
  universalRoutinesSupported: boolean;
  report: {
    linkedEvaluationId: string | null;
    canGenerate: boolean;
  };
  flags: {
    hasAnyDisciplineData: boolean;
    hasEvaluations: boolean;
    hasActivePlan: boolean;
    hasRoutines: boolean;
  };
};

export async function getPlayerDevelopmentTabData(
  playerId: string,
  disciplineId?: string
): Promise<PlayerDevelopmentTabData> {
  const [evaluationRows, developmentPlanRows, activeDisciplineRows] = await Promise.all([
    getEvaluationsForPlayer(db, { playerId, limit: MAX_READ_ROWS }),
    getDevelopmentPlansForPlayer(db, { playerId, limit: MAX_READ_ROWS }),
    listActiveDisciplines(db),
  ]);

  const disciplineOptions = activeDisciplineRows.map((row) => ({
    id: row.id,
    key: row.key,
    label: row.label,
  }));

  const selectedDiscipline =
    disciplineOptions.find((option) => option.id === disciplineId) ??
    disciplineOptions[0] ??
    null;

  if (!selectedDiscipline) {
    return {
      selectedDiscipline: null,
      disciplineOptions: [],
      latestEvaluation: null,
      evaluationHistory: [],
      activePlan: null,
      developmentPlanHistory: [],
      playerRoutines: [],
      universalRoutines: [],
      universalRoutinesSupported: false,
      report: {
        linkedEvaluationId: null,
        canGenerate: false,
      },
      flags: {
        hasAnyDisciplineData: false,
        hasEvaluations: false,
        hasActivePlan: false,
        hasRoutines: false,
      },
    };
  }

  const [disciplineEvaluations, disciplinePlanHistory, activePlan] =
    await Promise.all([
      getEvaluationsForPlayer(db, {
        playerId,
        disciplineId: selectedDiscipline.id,
        limit: 25,
      }),
      getDevelopmentPlansForPlayer(db, {
        playerId,
        disciplineId: selectedDiscipline.id,
        limit: 25,
      }),
      getActiveDevelopmentPlanForPlayerDiscipline(db, {
        playerId,
        disciplineId: selectedDiscipline.id,
      }),
    ]);

  const [playerRoutines, linkedEvaluation] = await Promise.all([
    activePlan ? getRoutinesForDevelopmentPlan(db, activePlan.id) : Promise.resolve([]),
    activePlan
      ? getEvaluationById(db, activePlan.evaluationId).catch(() => null)
      : Promise.resolve(null),
  ]);

  const latestEvaluation = disciplineEvaluations[0] ?? null;

  return {
    selectedDiscipline,
    disciplineOptions,
    latestEvaluation,
    evaluationHistory: latestEvaluation
      ? disciplineEvaluations.filter((row) => row.id !== latestEvaluation.id)
      : disciplineEvaluations,
    activePlan,
    developmentPlanHistory: disciplinePlanHistory,
    playerRoutines,
    universalRoutines: [],
    universalRoutinesSupported: false,
    report: {
      linkedEvaluationId: linkedEvaluation?.id ?? null,
      canGenerate: Boolean(activePlan && linkedEvaluation),
    },
    flags: {
      hasAnyDisciplineData: disciplineOptions.length > 0,
      hasEvaluations: disciplineEvaluations.length > 0,
      hasActivePlan: Boolean(activePlan),
      hasRoutines: playerRoutines.length > 0,
    },
  };
}
