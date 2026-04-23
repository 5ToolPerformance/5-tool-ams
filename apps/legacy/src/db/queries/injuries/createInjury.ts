import { DB } from "@/db";
import { injury } from "@/db/schema";
import { InjuryInsert } from "@/domain/injuries/injury.types";

export async function createInjury(db: DB, values: InjuryInsert) {
  return db.insert(injury).values(values);
}
