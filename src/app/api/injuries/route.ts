import { NextResponse } from "next/server";

import { logInjury } from "@/application/injuries/logInjury";
import db from "@/db";
import { assertPlayerAccess, getAuthContext, requireRole } from "@/lib/auth/auth-context";
import { toAuthErrorResponse } from "@/lib/auth/http";

export async function POST(req: Request) {
  try {
    const ctx = await getAuthContext();
    requireRole(ctx, ["coach", "admin"]);

    const body = await req.json();
    await assertPlayerAccess(ctx, body.playerId);

    const injury = await logInjury(db, body, {
      reportedByUserId: ctx.userId,
      reportedByRole: "coach", // "coach" | "trainer" | etc
    });

    return NextResponse.json(injury, { status: 201 });
  } catch (error) {
    const authResponse = toAuthErrorResponse(error);
    if (authResponse) return authResponse;
    return NextResponse.json({ error: "Failed to log injury" }, { status: 500 });
  }
}
