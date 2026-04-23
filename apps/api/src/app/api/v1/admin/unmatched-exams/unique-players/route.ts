// app/api/admin/unmatched-exams/unique-players/route.ts
import { NextResponse } from "next/server";

import { getAuthContext, requireRole } from "@/application/auth/auth-context";
import { toAuthErrorResponse } from "@/application/auth/http";
import { getLatestPlayerArmScore, getPlayerSummary, getUnmatchedExams, getUnmatchedPlayers, linkArmcarePlayer } from "@ams/db/queries/external-systems/armcare/armcareExamsRepository";

export async function GET() {
  try {
    const ctx = await getAuthContext();
    requireRole(ctx, ["admin"]);

    const players = await getUnmatchedPlayers();
    const stats = await getUnmatchedExams();

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
