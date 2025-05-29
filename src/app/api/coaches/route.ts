import { NextResponse } from "next/server";

import { LessonService } from "@/lib/services/lessons";

export async function GET() {
  try {
    const coaches = await LessonService.getCoaches();
    console.log("Coaches retrieved successfully:", coaches);
    return NextResponse.json({
      success: true,
      data: coaches,
    });
  } catch (error) {
    console.error("Error in GET /api/coaches:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
