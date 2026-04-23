import db from "@/db";
import { getUniversalRoutineById } from "@/db/queries/routines/getUniversalRoutineById";

import { parseRoutineReportDetails } from "@/application/players/development/documentDataParsers";

export type UniversalRoutinePdfData = {
  generatedOn: Date;
  routine: {
    id: string;
    title: string;
    description: string | null;
    routineType: string;
    createdByName: string | null;
    discipline: {
      id: string;
      key: string;
      label: string;
    };
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
  };
};

export async function getUniversalRoutinePdfData(
  routineId: string
): Promise<UniversalRoutinePdfData | null> {
  const routine = await getUniversalRoutineById(db, routineId).catch(() => null);
  if (!routine) {
    return null;
  }

  const details = parseRoutineReportDetails(routine.documentData);

  return {
    generatedOn: new Date(),
    routine: {
      id: routine.id,
      title: routine.title,
      description: routine.description,
      routineType: routine.routineType,
      createdByName: routine.createdByName ?? null,
      discipline: {
        id: routine.disciplineId,
        key: routine.disciplineKey,
        label: routine.disciplineLabel,
      },
      summary: details.summary,
      usageNotes: details.usageNotes,
      mechanics: details.mechanics,
      blocks: details.blocks,
    },
  };
}
