import { NextResponse } from "next/server";

import db from "@/db";
import { getPlayerInjuries } from "@/db/queries/injuries/getPlayerInjuries";
import { assertPlayerAccess, getAuthContext } from "@/lib/auth/auth-context";
import { toAuthErrorResponse } from "@/lib/auth/http";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const ctx = await getAuthContext();
    const { id } = await params;
    await assertPlayerAccess(ctx, id);

    const injuries = await getPlayerInjuries(db, id);

    return NextResponse.json(injuries);
  } catch (error) {
    const authResponse = toAuthErrorResponse(error);
    if (authResponse) return authResponse;
    return NextResponse.json({ error: "Failed to fetch injuries" }, { status: 500 });
  }
}
