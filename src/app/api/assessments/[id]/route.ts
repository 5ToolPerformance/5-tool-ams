import { NextRequest, NextResponse } from "next/server";

import { LessonService } from "@/lib/services/lessons";
import { RouteParams } from "@/types/api";

export async function GET(
  request: NextRequest,
  { params }: RouteParams<{ id: string }>
) {
  try {
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

    return NextResponse.json({
      success: true,
      data: assessment,
    });
  } catch (error) {
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
