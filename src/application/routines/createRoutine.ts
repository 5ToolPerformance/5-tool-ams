import { DB } from "@/db";
import {
  type CreateRoutineRowInput,
  createRoutine as createRoutineQuery,
} from "@/db/queries/routines/createRoutine";
import { validateRoutineDocument } from "@/domain/routines/validateRoutineDocument";

export async function createRoutine(db: DB, input: CreateRoutineRowInput) {
  validateRoutineDocument(input);
  return createRoutineQuery(db, input);
}
