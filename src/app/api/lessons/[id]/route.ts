import { LessonService } from "@/lib/db/lessons";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const lesson = await LessonService.getLessonById(params.id);
    
    if (!lesson) {
      return NextResponse.json(
        { 
          success: false,
          error: "Lesson not found" 
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: lesson
    });
  } catch (error) {
    console.error("Error in GET /api/lessons/[id]:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Internal server error" 
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
      message: "Lesson deleted successfully"
    });
  } catch (error) {
    console.error("Error in DELETE /api/lessons/[id]:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Internal server error" 
      },
      { status: 500 }
    );
  }
}