import { asc } from "drizzle-orm";

import { DB } from "@/db";
import { injuryFocusArea } from "@/db/schema";

export function getInjuryFocusAreas(db: DB) {
  return db.select().from(injuryFocusArea).orderBy(asc(injuryFocusArea.name));
}
