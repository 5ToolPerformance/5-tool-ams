import { NextRequest, NextResponse } from "next/server";

import { assertCanAccessLesson, getAuthContext, requireRole } from "@/lib/auth/auth-context";
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
    await assertCanAccessLesson(ctx, id);
    const lesson = await LessonService.getLessonById(id);

    if (!lesson) {
      return NextResponse.json(
        {
          success: false,
          error: "Lesson not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: lesson,
    });
  } catch (error) {
    const authResponse = toAuthErrorResponse(error);
    if (authResponse) return authResponse;
    console.error("Error in GET /api/lessons/[id]:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams<{ id: string }>
) {
  try {
    const ctx = await getAuthContext();
    requireRole(ctx, ["coach", "admin"]);
    const { id } = await params;
    await assertCanAccessLesson(ctx, id);
    const deletedLesson = await LessonService.deleteLessonById(id);

    return NextResponse.json({
      success: true,
      data: deletedLesson,
      message: "Lesson deleted successfully",
    });
  } catch (error) {
    const authResponse = toAuthErrorResponse(error);
    if (authResponse) return authResponse;
    console.error("Error in DELETE /api/lessons/[id]:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
