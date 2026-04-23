import { DB } from "@ams/db";
import {
  type UpdateUniversalRoutineRowInput,
  updateUniversalRoutine as updateUniversalRoutineQuery,
} from "@ams/db/queries/routines/updateUniversalRoutine";
import {
  type ValidateRoutineInput,
  validateRoutineDocument,
} from "@ams/domain/routines/validateRoutineDocument";

export async function updateUniversalRoutine(
  db: DB,
  routineId: string,
  input: UpdateUniversalRoutineRowInput & { createdBy: string }
) {
  validateRoutineDocument(input as ValidateRoutineInput);
  return updateUniversalRoutineQuery(db, routineId, input);
}
