import { asc, inArray } from "drizzle-orm";

import { DB } from "@/db";
import { disciplines } from "@/db/schema";

export async function getDisciplinesByIds(db: DB, disciplineIds: string[]) {
  if (disciplineIds.length === 0) {
    return [];
  }

  return db
    .select({
      id: disciplines.id,
      key: disciplines.key,
      label: disciplines.label,
      active: disciplines.active,
    })
    .from(disciplines)
    .where(inArray(disciplines.id, disciplineIds))
    .orderBy(asc(disciplines.label));
}
