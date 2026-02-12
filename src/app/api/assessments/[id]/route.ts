import { NextRequest, NextResponse } from "next/server";

import { assertPlayerAccess, getAuthContext } from "@/lib/auth/auth-context";
import { toAuthErrorResponse } from "@/lib/auth/http";
import { LessonService } from "@/lib/services/lessons";
import { RouteParams } from "@/types/api";

export async function GET(
  request: NextRequest,
  { params }: RouteParams<{ id: string }>
) {
  try {
    const ctx = await getAuthContext();
    const { id } = await params;
    const type = request.nextUrl.searchParams.get("type");

    if (!type) {
      return NextResponse.json(
        {
          success: false,
          error: "Type parameter is required",
        },
        { status: 400 }
      );
    }

    const assessment = await LessonService.getLessonAssessmentById(id, type);

    if (!assessment) {
      return NextResponse.json(
        {
          success: false,
          error: "Assessment not found",
        },
        { status: 404 }
      );
    }

    const assessmentPlayerId = (assessment as { playerId?: string }).playerId;
    if (assessmentPlayerId) {
      await assertPlayerAccess(ctx, assessmentPlayerId);
    } else {
      return NextResponse.json(
        {
          success: false,
          error: "Assessment access scope unavailable",
        },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      data: assessment,
    });
  } catch (error) {
    const authResponse = toAuthErrorResponse(error);
    if (authResponse) return authResponse;
    console.error("Error in GET /api/assessments/[id]:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
