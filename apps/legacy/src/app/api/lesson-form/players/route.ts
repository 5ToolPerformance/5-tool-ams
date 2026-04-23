import { NextResponse } from "next/server";

import { getAuthContext, requireRole } from "@/application/auth/auth-context";
import { toAuthErrorResponse } from "@/application/auth/http";
import { createPlayerInjury, getPlayerInjuriesByPlayerId, listPlayersForLessonForm, listPlayersForLessonFormScoped, updatePlayerInjury } from "@/db/queries/players/playerInjuryAndLessonFormQueries";

export async function GET() {
  try {
    const ctx = await getAuthContext();
    requireRole(ctx, ["coach", "admin"]);

    const players = await listPlayersForLessonFormScoped(
      ctx.facilityId
    );
    return NextResponse.json(players);
  } catch (error) {
    const authResponse = toAuthErrorResponse(error);
    if (authResponse) return authResponse;
    console.error("Error fetching players:", error);
    return NextResponse.json(
      { error: "Failed to fetch players" },
      { status: 500 }
    );
  }
}
