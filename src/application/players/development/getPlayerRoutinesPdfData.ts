import db from "@/db";
import { getDisciplinesByIds } from "@/db/queries/players/getDisciplinesByIds";
import { getPlayerHeader } from "@/db/queries/players/PlayerHeader";
import { getRoutinesForPlayerDiscipline } from "@/db/queries/routines/getRoutinesForPlayerDiscipline";

import { parseRoutineReportDetails } from "./documentDataParsers";

export type PlayerRoutinesPdfData = {
  player: {
    id: string;
    name: string;
    primaryCoachName: string | null;
  };
  discipline: {
    id: string;
    key: string;
    label: string;
  };
  generatedOn: Date;
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

export async function getPlayerRoutinesPdfData(input: {
  playerId: string;
  disciplineId: string;
  routineIds: string[];
}): Promise<PlayerRoutinesPdfData | null> {
  const selectedRoutineIds = new Set(input.routineIds);
  if (selectedRoutineIds.size === 0) {
    return null;
  }

  const [player, disciplineRows, routines] = await Promise.all([
    getPlayerHeader(input.playerId),
    getDisciplinesByIds(db, [input.disciplineId]),
    getRoutinesForPlayerDiscipline(db, {
      playerId: input.playerId,
      disciplineId: input.disciplineId,
    }),
  ]);

  const discipline = disciplineRows[0];
  if (!player || !discipline) {
    return null;
  }

  const filteredRoutines = routines.filter((routine) => selectedRoutineIds.has(routine.id));
  if (filteredRoutines.length === 0) {
    return null;
  }

  return {
    player: {
      id: player.id,
      name: `${player.firstName} ${player.lastName}`.trim(),
      primaryCoachName: player.primaryCoachName ?? null,
    },
    discipline: {
      id: discipline.id,
      key: discipline.key,
      label: discipline.label,
    },
    generatedOn: new Date(),
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
