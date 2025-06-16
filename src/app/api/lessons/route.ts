import { NextRequest, NextResponse } from "next/server";

import { LessonService } from "@/lib/services/lessons";
import { LessonCreateData } from "@/types/lessons";

export async function POST(request: NextRequest) {
  try {
    const body: LessonCreateData = await request.json();

    // Validate the request data
    const validationErrors = LessonService.validateLessonData(body);
    if (validationErrors.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: validationErrors,
        },
        { status: 400 }
      );
    }

    // Create the lesson
    const lesson = await LessonService.createLesson(body);

    return NextResponse.json({
      success: true,
      data: lesson,
      message: "Lesson created successfully",
    });
  } catch (error) {
    console.error("Error in POST /api/lessons:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const coachId = searchParams.get("coachId");
    const userId = searchParams.get("userId");

    if (coachId) {
      const lessons = await LessonService.getLessonsByCoach(coachId);
      return NextResponse.json({
        success: true,
        data: lessons,
      });
    }

    if (userId) {
      const lessons = await LessonService.getLessonsByUser(userId);
      return NextResponse.json({
        success: true,
        data: lessons,
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: "Either coachId or userId is required",
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error in GET /api/lessons:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
