import { NextRequest, NextResponse } from "next/server";

import { assertPlayerAccess, getAuthContext } from "@/lib/auth/auth-context";
import { toAuthErrorResponse } from "@/lib/auth/http";
import { lessonRepository } from "@/lib/services/repository/lessons";

export async function GET(request: NextRequest) {
  try {
    const ctx = await getAuthContext();
    const { searchParams } = new URL(request.url);
    const playerId = searchParams.get("playerId");
    const lessonCount = parseInt(searchParams.get("lessonCount") || "1");

    if (!playerId) {
      return NextResponse.json({
        success: false,
        error: "playerId is required",
      });
    }

    await assertPlayerAccess(ctx, playerId);

    const data = await lessonRepository.getLessonReportByPlayerIdScoped(
      playerId,
      lessonCount,
      ctx.facilityId
    );

    if (!data) {
      return NextResponse.json(
        {
          success: false,
          error: "Player not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    const authResponse = toAuthErrorResponse(error);
    if (authResponse) return authResponse;
    console.error("Error in GET /api/reports/retrieve-data:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
