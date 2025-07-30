// src/app/api/assessments/armcare/[id]/route.ts
import { NextResponse } from "next/server";

import { AssessmentService } from "@/lib/services/assessments";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const result = await AssessmentService.getArmCareAssessmentById(id);

    if (!result || result.length === 0) {
      return NextResponse.json(
        { error: "Assessment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Error fetching assessment:", error);
    return NextResponse.json(
      { error: "Failed to fetch assessment" },
      { status: 500 }
    );
  }
}
