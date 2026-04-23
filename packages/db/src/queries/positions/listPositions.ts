import { asc } from "drizzle-orm";

import type { PositionOption } from "@ams/domain/positions/types";

import type { DB } from "@/db";
import { positions } from "@/db/schema";

export function listPositions(db: DB): Promise<PositionOption[]> {
  return db
    .select({
      id: positions.id,
      code: positions.code,
      name: positions.name,
      group: positions.group,
    })
    .from(positions)
    .orderBy(asc(positions.group), asc(positions.code));
}
