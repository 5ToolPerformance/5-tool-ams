import { DB } from "@/db";
import {
  type UpdateUniversalRoutineRowInput,
  updateUniversalRoutine as updateUniversalRoutineQuery,
} from "@/db/queries/routines/updateUniversalRoutine";
import {
  type ValidateRoutineInput,
  validateRoutineDocument,
} from "@/domain/routines/validateRoutineDocument";

export async function updateUniversalRoutine(
  db: DB,
  routineId: string,
  input: UpdateUniversalRoutineRowInput & { createdBy: string }
) {
  validateRoutineDocument(input as ValidateRoutineInput);
  return updateUniversalRoutineQuery(db, routineId, input);
}
