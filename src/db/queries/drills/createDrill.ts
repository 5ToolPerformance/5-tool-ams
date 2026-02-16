import db from "@/db";
import { DB } from "@/db";
import { drills } from "@/db/schema";

type CreateDrillValues = {
  title: string;
  description: string;
  discipline: "hitting" | "pitching" | "strength" | "fielding" | "catching" | "arm_care";
  createdBy: string;
};

export async function createDrill(
  values: CreateDrillValues,
  conn: DB = db
) {
  const [created] = await conn.insert(drills).values(values).returning();
  return created;
}
