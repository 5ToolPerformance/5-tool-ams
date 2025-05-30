import { NextResponse } from "next/server";

import { UserService } from "@/lib/services/users";

export async function GET() {
  try {
    const coaches = await UserService.getAllCoaches();
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
