import db from "@ams/db";
import { listActiveDisciplines } from "@ams/db/queries/config/listActiveDisciplines";
import { getDevelopmentPlansForPlayer } from "@ams/db/queries/development-plans/getDevelopmentPlansForPlayers";
import { getEvaluationById } from "@ams/db/queries/evaluations/getEvaluationById";
import { getEvaluationsForPlayer } from "@ams/db/queries/evaluations/getEvaluationsForPlayer";
import { getRoutinesForPlayer } from "@ams/db/queries/routines/getRoutinesForPlayer";
import { listUniversalRoutines } from "@ams/db/queries/routines/listUniversalRoutines";

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
  ReturnType<typeof getRoutinesForPlayer>
>[number];
export type UniversalRoutineRow = Awaited<
  ReturnType<typeof listUniversalRoutines>
>[number];

export type PlayerDevelopmentTabData = {
  selectedDiscipline: DevelopmentDisciplineOption | null;
  disciplineOptions: DevelopmentDisciplineOption[];
  latestEvaluation: EvaluationRow | null;
  evaluationHistory: EvaluationRow[];
  activePlan: DevelopmentPlanRow | null;
  developmentPlanHistory: DevelopmentPlanRow[];
  playerRoutines: RoutineRow[];
  universalRoutines: UniversalRoutineRow[];
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

function toTimestamp(value: Date | string | null | undefined) {
  if (!value) {
    return null;
  }

  const parsed = value instanceof Date ? value : new Date(value);
  const timestamp = parsed.getTime();

  return Number.isNaN(timestamp) ? null : timestamp;
}

function getEligibleActivePlan(plans: DevelopmentPlanRow[]) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayTimestamp = today.getTime();

  const eligiblePlans = plans.filter((plan) => {
    if (plan.status === "active") {
      return true;
    }

    if (plan.status !== "draft") {
      return false;
    }

    const startTimestamp = toTimestamp(plan.startDate);
    const endTimestamp = toTimestamp(plan.targetEndDate);

    return (
      (startTimestamp !== null && startTimestamp >= todayTimestamp) ||
      (endTimestamp !== null && endTimestamp >= todayTimestamp)
    );
  });

  if (eligiblePlans.length === 0) {
    return null;
  }

  const activePlans = eligiblePlans.filter((plan) => plan.status === "active");
  const candidatePlans = activePlans.length > 0 ? activePlans : eligiblePlans;

  return [...candidatePlans].sort((a, b) => {
    const relevantDateA =
      toTimestamp(a.startDate) ??
      toTimestamp(a.targetEndDate) ??
      toTimestamp(a.createdOn) ??
      0;
    const relevantDateB =
      toTimestamp(b.startDate) ??
      toTimestamp(b.targetEndDate) ??
      toTimestamp(b.createdOn) ??
      0;

    if (relevantDateA !== relevantDateB) {
      return relevantDateB - relevantDateA;
    }

    const createdOnA = toTimestamp(a.createdOn) ?? 0;
    const createdOnB = toTimestamp(b.createdOn) ?? 0;

    return createdOnB - createdOnA;
  })[0];
}

export async function getPlayerDevelopmentTabData(
  playerId: string,
  disciplineId?: string,
  facilityId?: string
): Promise<PlayerDevelopmentTabData> {
  const [evaluationRows, activeDisciplineRows, developmentPlans, playerRoutines] =
    await Promise.all([
    getEvaluationsForPlayer(db, { playerId, limit: MAX_READ_ROWS }),
    listActiveDisciplines(db),
    getDevelopmentPlansForPlayer(db, {
      playerId,
      limit: 50,
    }),
    getRoutinesForPlayer(db, {
      playerId,
    }),
  ]);

  const dataBackedDisciplineIds = new Set<string>([
    ...evaluationRows.map((row) => row.disciplineId),
    ...developmentPlans.map((plan) => plan.disciplineId),
    ...playerRoutines
      .map((routine) =>
        typeof routine.disciplineId === "string" ? routine.disciplineId : null
      )
      .filter((discipline): discipline is string => Boolean(discipline)),
  ]);

  const disciplineOptions = activeDisciplineRows
    .filter((discipline) =>
      dataBackedDisciplineIds.size > 0 ? dataBackedDisciplineIds.has(discipline.id) : true
    )
    .map((discipline) => ({
      id: discipline.id,
      key: discipline.key,
      label: discipline.label,
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
      universalRoutinesSupported: Boolean(facilityId),
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

  const [disciplineEvaluations, universalRoutines] = await Promise.all([
    getEvaluationsForPlayer(db, {
      playerId,
      disciplineId: selectedDiscipline.id,
      limit: 25,
    }),
    facilityId
      ? listUniversalRoutines({
          facilityId,
          disciplineId: selectedDiscipline.id,
        })
      : Promise.resolve([]),
  ]);

  const disciplinePlanHistory = developmentPlans.filter(
    (plan) => plan.disciplineId === selectedDiscipline.id
  );

  const activePlan = getEligibleActivePlan(disciplinePlanHistory);
  const developmentPlanHistory = activePlan
    ? disciplinePlanHistory.filter((plan) => plan.id !== activePlan.id)
    : disciplinePlanHistory;

  const linkedEvaluation = activePlan
    ? await getEvaluationById(db, activePlan.evaluationId).catch(() => null)
    : null;

  const latestEvaluation = disciplineEvaluations[0] ?? null;

  return {
    selectedDiscipline,
    disciplineOptions,
    latestEvaluation,
    evaluationHistory: latestEvaluation
      ? disciplineEvaluations.filter((row) => row.id !== latestEvaluation.id)
      : disciplineEvaluations,
    activePlan,
    developmentPlanHistory,
    playerRoutines,
    universalRoutines,
    universalRoutinesSupported: Boolean(facilityId),
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
