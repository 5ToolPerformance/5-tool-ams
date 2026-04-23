import { NextRequest, NextResponse } from "next/server";

import {
  assertCanAccessInjury,
  getAuthContext,
  requireRole,
} from "@/application/auth/auth-context";
import { toAuthErrorResponse } from "@/application/auth/http";
import { createPlayerInjury, getPlayerInjuriesByPlayerId, listPlayersForLessonForm, listPlayersForLessonFormScoped, updatePlayerInjury } from "@ams/db/queries/players/playerInjuryAndLessonFormQueries";
import { RouteParams } from "@/types/api";
import { PlayerInjuryInsert } from "@ams/db/types/database";

export async function PATCH(
  request: NextRequest,
  { params }: RouteParams<{ id: string; injuryId: string }>
) {
  try {
    const ctx = await getAuthContext();
    requireRole(ctx, ["coach", "admin"]);

    const body: Partial<PlayerInjuryInsert> = await request.json();
    const { injuryId } = await params;
    await assertCanAccessInjury(ctx, injuryId);
    const injury = await updatePlayerInjury(injuryId, body);

    return NextResponse.json({
      success: true,
      data: injury,
      message: "Injury Updated Successfully",
    });
  } catch (error) {
    const authResponse = toAuthErrorResponse(error);
    if (authResponse) return authResponse;
    console.error("Error in PATCH /api/player/[id]/injury/[injuryId]:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
