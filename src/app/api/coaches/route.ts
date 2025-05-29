import { LessonService } from "@/lib/db/lessons";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const coaches = await LessonService.getCoaches();
    console.log("Coaches retrieved successfully:", coaches);
    return NextResponse.json({ 
      success: true,
      data: coaches 
    });
  } catch (error) {
    console.error("Error in GET /api/coaches:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Internal server error" 
      },
      { status: 500 }
    );
  }
}