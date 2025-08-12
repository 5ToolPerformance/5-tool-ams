import { NextRequest, NextResponse } from "next/server";

import { AssessmentService } from "@/lib/services/assessments";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lessonId = searchParams.get("lessonId");

    if (!lessonId) {
      return NextResponse.json({
        success: false,
        error: "lessonId is required",
      });
    }

    const assessments =
      await AssessmentService.getAssessmentsByLessonId(lessonId);

    return NextResponse.json({
      success: true,
      data: assessments,
    });
  } catch (error) {
    console.error("Error in GET /api/assessments:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
