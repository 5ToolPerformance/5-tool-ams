import { DB } from "@/db";
import { injury } from "@/db/schema";
import type { InjuryInsert } from "@ams/domain/injuries/injury.types";

export async function createInjury(db: DB, values: InjuryInsert) {
  return db.insert(injury).values(values);
}
