import { NextResponse } from "next/server";

import { assertPlayerAccess, getAuthContext, requireRole } from "@/lib/auth/auth-context";
import { toAuthErrorResponse } from "@/lib/auth/http";
import writeupRepository from "@/lib/services/repository";

export async function POST(req: Request) {
  try {
    const ctx = await getAuthContext();
    requireRole(ctx, ["coach", "admin"]);

    const body = await req.json();
    if (body?.player_id) {
      await assertPlayerAccess(ctx, String(body.player_id));
    }
    body.coach_id = ctx.userId;

    const writeup = await writeupRepository.createWriteup(body);

    return NextResponse.json({ success: true, data: writeup }, { status: 201 });
  } catch (error) {
    const authResponse = toAuthErrorResponse(error);
    if (authResponse) return authResponse;
    console.error("[WriteupRoute] POST - Error: ", error);
    return NextResponse.json(
      { success: false, error: "Failed to create writeup" },
      { status: 500 }
    );
  }
}
