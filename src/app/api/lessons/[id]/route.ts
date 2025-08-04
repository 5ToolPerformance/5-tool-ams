import { NextRequest, NextResponse } from "next/server";

import { LessonService } from "@/lib/services/lessons";
import { RouteParams } from "@/types/api";

export async function GET(
  request: NextRequest,
  { params }: RouteParams<{ id: string }>
) {
  try {
    const { id } = await params;
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
  { params }: { params: { id: string } }
) {
  try {
    const deletedLesson = await LessonService.deleteLessonById(params.id);

    return NextResponse.json({
      success: true,
      data: deletedLesson,
      message: "Lesson deleted successfully",
    });
  } catch (error) {
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
