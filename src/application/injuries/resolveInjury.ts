import { DB } from "@/db";
import { resolveInjury } from "@/db/queries/injuries/resolveInjury";

export async function resolveInjuryUseCase(db: DB, injuryId: string) {
  const resolvedAt = new Date().toISOString();
  return resolveInjury(db, injuryId, resolvedAt);
}
