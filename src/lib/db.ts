import { eq } from "drizzle-orm";

import db from "@/db";
import { users } from "@/db/schema";

export async function getUserById(id: string) {
  const res = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return res[0];
}
