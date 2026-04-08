import { DB } from "@/db";
import {
  type UpdateRoutineRowInput,
  updateRoutine as updateRoutineQuery,
} from "@/db/queries/routines/updateRoutine";
import {
  type ValidateRoutineInput,
  validateRoutineDocument,
} from "@/domain/routines/validateRoutineDocument";

export async function updateRoutine(
  db: DB,
  routineId: string,
  input: UpdateRoutineRowInput & {
    playerId: string;
    disciplineId: string;
    developmentPlanId?: string;
    createdBy: string;
  }
) {
  validateRoutineDocument({
    playerId: input.playerId,
    disciplineId: input.disciplineId,
    developmentPlanId: input.developmentPlanId,
    requiresPlayerId: true,
    createdBy: input.createdBy,
    title: input.title,
    description: input.description,
    routineType: input.routineType,
    sortOrder: input.sortOrder,
    isActive: input.isActive,
    documentData: input.documentData,
  } as ValidateRoutineInput);

  return updateRoutineQuery(db, routineId, input);
}
