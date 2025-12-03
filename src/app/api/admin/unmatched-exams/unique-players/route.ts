// app/api/admin/unmatched-exams/unique-players/route.ts
import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { armcareExamsRepository } from "@/lib/services/repository/armcare-exams";

export async function GET() {
  const session = await auth();

  if (!session?.user?.role || session.user.role !== "admin") {
    return NextResponse.json(
      {
        error: "Unauthorized",
        details: "User is not authorized to access this resource",
      },
      { status: 401 }
    );
  }

  try {
    const players = await armcareExamsRepository.getUnmatchedPlayers();
    const stats = await armcareExamsRepository.getUnmatchedExams();

    return NextResponse.json({
      success: true,
      players,
      stats,
    });
  } catch (error) {
    console.error("Failed to fetch unique unmatched players:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch data",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
