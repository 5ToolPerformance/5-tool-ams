import { NextResponse } from "next/server";

import db from "@/db";
import { positions } from "@/db/schema";

export async function GET() {
  const rows = await db
    .select({
      id: positions.id,
      code: positions.code,
      name: positions.name,
      group: positions.group,
    })
    .from(positions)
    .orderBy(positions.group, positions.code);

  return NextResponse.json(rows);
}
