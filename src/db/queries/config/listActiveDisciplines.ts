import { asc, eq } from "drizzle-orm";

import db, { DB } from "@/db";
import { disciplines } from "@/db/schema";

export async function listActiveDisciplines(conn: DB = db) {
  return conn
    .select({
      id: disciplines.id,
      key: disciplines.key,
      label: disciplines.label,
    })
    .from(disciplines)
    .where(eq(disciplines.active, true))
    .orderBy(asc(disciplines.label));
}
