import { desc, eq } from "drizzle-orm";

import { DB } from "@/db";
import { injury, injuryBodyPart, injuryFocusArea } from "@/db/schema";

export async function getPlayerInjuries(db: DB, playerId: string) {
  return db
    .select({
      id: injury.id,
      status: injury.status,
      level: injury.level,
      side: injury.side,
      startDate: injury.startDate,
      endDate: injury.endDate,
      notes: injury.notes,

      bodyPart: injuryBodyPart.name,
      focusArea: injuryFocusArea.name,
    })
    .from(injury)
    .leftJoin(injuryBodyPart, eq(injury.bodyPartId, injuryBodyPart.id))
    .leftJoin(injuryFocusArea, eq(injury.focusAreaId, injuryFocusArea.id))
    .where(eq(injury.playerId, playerId))
    .orderBy(desc(injury.startDate));
}
