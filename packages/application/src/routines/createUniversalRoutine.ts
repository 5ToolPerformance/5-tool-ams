import { DB } from "@ams/db";
import {
  type CreateUniversalRoutineRowInput,
  createUniversalRoutine as createUniversalRoutineQuery,
} from "@ams/db/queries/routines/createUniversalRoutine";
import {
  type ValidateRoutineInput,
  validateRoutineDocument,
} from "@ams/domain/routines/validateRoutineDocument";

export async function createUniversalRoutine(
  db: DB,
  input: CreateUniversalRoutineRowInput
) {
  validateRoutineDocument(input as ValidateRoutineInput);
  return createUniversalRoutineQuery(db, input);
}
