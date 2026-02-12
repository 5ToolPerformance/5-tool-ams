// app/api/admin/unmatched-exams/unique-players/route.ts
import { NextResponse } from "next/server";

import { getAuthContext, requireRole } from "@/lib/auth/auth-context";
import { toAuthErrorResponse } from "@/lib/auth/http";
import { armcareExamsRepository } from "@/lib/services/repository/armcare-exams";

export async function GET() {
  try {
    const ctx = await getAuthContext();
    requireRole(ctx, ["admin"]);

    const players = await armcareExamsRepository.getUnmatchedPlayers();
    const stats = await armcareExamsRepository.getUnmatchedExams();

    return NextResponse.json({
      success: true,
      players,
      stats,
    });
  } catch (error) {
    const authResponse = toAuthErrorResponse(error);
    if (authResponse) return authResponse;
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
