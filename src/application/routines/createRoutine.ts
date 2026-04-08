import { DB } from "@/db";
import {
  type CreateRoutineRowInput,
  createRoutine as createRoutineQuery,
} from "@/db/queries/routines/createRoutine";
import {
  type ValidateRoutineInput,
  validateRoutineDocument,
} from "@/domain/routines/validateRoutineDocument";

export async function createRoutine(db: DB, input: CreateRoutineRowInput) {
  validateRoutineDocument({ ...input, requiresPlayerId: true } as ValidateRoutineInput);
  return createRoutineQuery(db, input);
}
