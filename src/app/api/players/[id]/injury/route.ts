import { NextRequest, NextResponse } from "next/server";

import {
  assertPlayerAccess,
  getAuthContext,
  requireRole,
} from "@/lib/auth/auth-context";
import { toAuthErrorResponse } from "@/lib/auth/http";
import { playerRepository } from "@/lib/services/repository/players";
import { RouteParams } from "@/types/api";
import { PlayerInjuryInsert } from "@/types/database";

export async function GET(
  request: NextRequest,
  { params }: RouteParams<{ id: string }>
) {
  try {
    const ctx = await getAuthContext();
    const { id } = await params;
    await assertPlayerAccess(ctx, id);
    const injury = await playerRepository.findPlayerInjuryByPlayerId(id);

    return NextResponse.json({
      success: true,
      data: injury,
      message: "Injury Fetched Successfully",
    });
  } catch (error) {
    const authResponse = toAuthErrorResponse(error);
    if (authResponse) return authResponse;
    console.error("Error in GET /api/player/[id]/injury:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const ctx = await getAuthContext();
    requireRole(ctx, ["coach", "admin"]);

    const body: PlayerInjuryInsert = await request.json();
    if (!body.playerId) {
      return NextResponse.json(
        { success: false, error: "Player ID is required" },
        { status: 400 }
      );
    }
    await assertPlayerAccess(ctx, body.playerId);
    const injury = await playerRepository.createPlayerInjury(body);

    return NextResponse.json({
      success: true,
      data: injury,
      message: "Injury Created Successfully",
    });
  } catch (error) {
    const authResponse = toAuthErrorResponse(error);
    if (authResponse) return authResponse;
    console.error("Error in POST /api/player/[id]/injury:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
