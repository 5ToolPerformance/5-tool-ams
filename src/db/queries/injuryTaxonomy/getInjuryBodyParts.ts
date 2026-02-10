import { asc } from "drizzle-orm";

import { DB } from "@/db";
import { injuryBodyPart } from "@/db/schema";

export function getInjuryBodyParts(db: DB) {
  return db.select().from(injuryBodyPart).orderBy(asc(injuryBodyPart.name));
}
