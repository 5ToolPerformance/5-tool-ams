import { NextRequest, NextResponse } from "next/server";

import { assertCanAccessLesson, getAuthContext } from "@/lib/auth/auth-context";
import { toAuthErrorResponse } from "@/lib/auth/http";
import { AssessmentService } from "@/lib/services/assessments";

export async function GET(request: NextRequest) {
  try {
    const ctx = await getAuthContext();
    const { searchParams } = new URL(request.url);
    const lessonId = searchParams.get("lessonId");

    if (!lessonId) {
      return NextResponse.json({
        success: false,
        error: "lessonId is required",
      });
    }

    await assertCanAccessLesson(ctx, lessonId);

    const assessments =
      await AssessmentService.getAssessmentsByLessonId(lessonId);

    return NextResponse.json({
      success: true,
      data: assessments,
    });
  } catch (error) {
    const authResponse = toAuthErrorResponse(error);
    if (authResponse) return authResponse;
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
