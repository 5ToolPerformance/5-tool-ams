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
    developmentPlanId: string;
    createdBy: string;
  }
) {
  validateRoutineDocument({
    developmentPlanId: input.developmentPlanId,
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
