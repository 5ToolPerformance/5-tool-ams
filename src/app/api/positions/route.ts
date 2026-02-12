import { NextResponse } from "next/server";

import db from "@/db";
import { positions } from "@/db/schema";
import { getAuthContext } from "@/lib/auth/auth-context";
import { toAuthErrorResponse } from "@/lib/auth/http";

export async function GET() {
  try {
    await getAuthContext();
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
  } catch (error) {
    const authResponse = toAuthErrorResponse(error);
    if (authResponse) return authResponse;
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
