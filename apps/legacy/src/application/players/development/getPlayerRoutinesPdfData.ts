import db from "@/db";
import { getDisciplinesByIds } from "@/db/queries/players/getDisciplinesByIds";
import { getPlayerHeader } from "@/db/queries/players/PlayerHeader";
import { getRoutinesForPlayer } from "@/db/queries/routines/getRoutinesForPlayer";
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
  } | null;
  generatedOn: Date;
  routines: Array<{
    id: string;
    disciplineId: string;
    disciplineKey: string;
    disciplineLabel: string;
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
  disciplineId?: string | null;
  routineIds: string[];
}): Promise<PlayerRoutinesPdfData | null> {
  const selectedRoutineIds = new Set(input.routineIds);
  if (selectedRoutineIds.size === 0) {
    return null;
  }

  const [player, disciplineRows, routines] = await Promise.all([
    getPlayerHeader(input.playerId),
    input.disciplineId ? getDisciplinesByIds(db, [input.disciplineId]) : Promise.resolve([]),
    input.disciplineId
      ? getRoutinesForPlayerDiscipline(db, {
          playerId: input.playerId,
          disciplineId: input.disciplineId,
        })
      : getRoutinesForPlayer(db, {
          playerId: input.playerId,
        }),
  ]);

  const discipline = disciplineRows[0] ?? null;
  if (!player) {
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
    discipline,
    generatedOn: new Date(),
    routines: filteredRoutines.map((routine) => {
      const details = parseRoutineReportDetails(routine.documentData);
      return {
        id: routine.id,
        disciplineId: routine.disciplineId as string,
        disciplineKey: routine.disciplineKey,
        disciplineLabel: routine.disciplineLabel,
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
