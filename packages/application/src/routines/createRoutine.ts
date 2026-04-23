import { DB } from "@ams/db";
import {
  type CreateRoutineRowInput,
  createRoutine as createRoutineQuery,
} from "@ams/db/queries/routines/createRoutine";
import {
  type ValidateRoutineInput,
  validateRoutineDocument,
} from "@ams/domain/routines/validateRoutineDocument";

export async function createRoutine(db: DB, input: CreateRoutineRowInput) {
  validateRoutineDocument({ ...input, requiresPlayerId: true } as ValidateRoutineInput);
  return createRoutineQuery(db, input);
}
