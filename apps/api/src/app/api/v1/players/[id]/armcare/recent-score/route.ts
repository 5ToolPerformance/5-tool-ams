import { NextRequest, NextResponse } from "next/server";

import { assertPlayerAccess, getAuthContext } from "@/application/auth/auth-context";
import { toAuthErrorResponse } from "@/application/auth/http";
import { getLatestPlayerArmScore, getPlayerSummary, getUnmatchedExams, getUnmatchedPlayers, linkArmcarePlayer } from "@ams/db/queries/external-systems/armcare/armcareExamsRepository";
import { RouteParams } from "@/types/api";

export async function GET(
  request: NextRequest,
  { params }: RouteParams<{ id: string }>
) {
  try {
    const ctx = await getAuthContext();
    const { id } = await params;
    await assertPlayerAccess(ctx, id);

    const armscore = await getLatestPlayerArmScore(id);

    if (!armscore) {
      return NextResponse.json({
        success: true,
        data: [],
        message: "No armscore found for player",
      });
    }

    return NextResponse.json({
      success: true,
      data: armscore,
      message: "ArmScore Fetched Successfully",
    });
  } catch (error) {
    const authResponse = toAuthErrorResponse(error);
    if (authResponse) return authResponse;
    console.error("Error fetching lessons for player:", error);

    return NextResponse.json(
      { error: "Failed to fetch lessons" },
      { status: 500 }
    );
  }
}
