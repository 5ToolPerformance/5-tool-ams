import { DB } from "@/db";
import {
  type CreateUniversalRoutineRowInput,
  createUniversalRoutine as createUniversalRoutineQuery,
} from "@/db/queries/routines/createUniversalRoutine";
import {
  type ValidateRoutineInput,
  validateRoutineDocument,
} from "@/domain/routines/validateRoutineDocument";

export async function createUniversalRoutine(
  db: DB,
  input: CreateUniversalRoutineRowInput
) {
  validateRoutineDocument(input as ValidateRoutineInput);
  return createUniversalRoutineQuery(db, input);
}
