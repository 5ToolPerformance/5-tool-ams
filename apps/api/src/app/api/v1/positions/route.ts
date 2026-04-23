import { NextResponse } from "next/server";

import db from "@ams/db";
import { listPositions } from "@ams/db/queries/positions/listPositions";
import { getAuthContext } from "@/application/auth/auth-context";
import { toAuthErrorResponse } from "@/application/auth/http";

export async function GET() {
  try {
    await getAuthContext();
    const rows = await listPositions(db);

    return NextResponse.json(rows);
  } catch (error) {
    const authResponse = toAuthErrorResponse(error);
    if (authResponse) return authResponse;
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
