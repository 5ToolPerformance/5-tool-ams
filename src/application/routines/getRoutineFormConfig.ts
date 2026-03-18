import { listDrillsForLibrary } from "@/application/drills/listDrillsForLibrary";
import db from "@/db";
import { getDevelopmentPlansForPlayer } from "@/db/queries/development-plans/getDevelopmentPlansForPlayers";
import { mechanicsRepository } from "@/lib/services/repository/mechanics";

export type RoutineDevelopmentPlanOption = {
  id: string;
  playerId: string;
  disciplineId: string;
  disciplineKey: string;
  disciplineLabel: string;
  status: "draft" | "active" | "completed" | "archived";
  title: string;
};

export type RoutineMechanicOption = {
  id: string;
  name: string;
  description: string | null;
  type: "pitching" | "hitting" | "fielding" | "catching" | "strength";
  tags: string[] | null;
};

export type RoutineDrillOption = {
  id: string;
  title: string;
  description: string;
  discipline:
    | "hitting"
    | "pitching"
    | "strength"
    | "fielding"
    | "catching"
    | "arm_care";
  tags: string[];
};

export type RoutineFormConfig = {
  developmentPlanOptions: RoutineDevelopmentPlanOption[];
  mechanicOptions: RoutineMechanicOption[];
  drillOptions: RoutineDrillOption[];
};

function summarizePlan(row: {
  status: string;
  documentData: unknown;
}) {
  const summary =
    row.documentData &&
    typeof row.documentData === "object" &&
    "summary" in row.documentData &&
    typeof row.documentData.summary === "string"
      ? row.documentData.summary.trim()
      : "";

  return summary || `${row.status} development plan`;
}

export async function getRoutineFormConfig(params: {
  playerId: string;
  facilityId: string;
  disciplineId: string;
  disciplineKey: string;
  disciplineLabel: string;
  viewer: {
    role: "player" | "coach" | "admin";
    userId: string;
  };
}): Promise<RoutineFormConfig> {
  const [developmentPlans, mechanics, drills] = await Promise.all([
    getDevelopmentPlansForPlayer(db, {
      playerId: params.playerId,
      disciplineId: params.disciplineId,
      limit: 50,
    }),
    mechanicsRepository.findAllForLessonForm(),
    listDrillsForLibrary(params.facilityId, params.viewer),
  ]);

  return {
    developmentPlanOptions: developmentPlans.map((plan) => ({
      id: plan.id,
      playerId: plan.playerId,
      disciplineId: plan.disciplineId,
      disciplineKey: params.disciplineKey,
      disciplineLabel: params.disciplineLabel,
      status: plan.status,
      title: summarizePlan(plan),
    })),
    mechanicOptions: mechanics.map((mechanic) => ({
      id: mechanic.id,
      name: mechanic.name,
      description: mechanic.description ?? null,
      type: mechanic.type,
      tags: mechanic.tags ?? null,
    })),
    drillOptions: drills.map((drill) => ({
      id: drill.id,
      title: drill.title,
      description: drill.description,
      discipline: drill.discipline,
      tags: drill.tags,
    })),
  };
}
