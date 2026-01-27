import { eq } from "drizzle-orm";

import db from "@/db";
import { positions } from "@/db/schema";

export async function getAllPositions() {
  return db
    .select({
      id: positions.id,
      code: positions.code,
      name: positions.name,
      group: positions.group,
    })
    .from(positions)
    .where(eq(positions.isResolvable, true))
    .orderBy(positions.group, positions.code);
}
