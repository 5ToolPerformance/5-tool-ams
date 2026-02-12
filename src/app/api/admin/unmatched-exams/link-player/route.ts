import { NextRequest, NextResponse } from "next/server";

import { assertPlayerAccess, getAuthContext, requireRole } from "@/lib/auth/auth-context";
import { toAuthErrorResponse } from "@/lib/auth/http";
import { armcareExamsRepository } from "@/lib/services/repository/armcare-exams";

export async function POST(request: NextRequest) {
  try {
    const ctx = await getAuthContext();
    requireRole(ctx, ["admin"]);

    const body = await request.json();
    const { externalPlayerId, pathPlayerId } = body;

    if (!externalPlayerId || !pathPlayerId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    await assertPlayerAccess(ctx, pathPlayerId);

    const result = await armcareExamsRepository.linkArmcarePlayer(
      externalPlayerId,
      pathPlayerId,
      ctx.userId
    );

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to link player" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error) {
    const authResponse = toAuthErrorResponse(error);
    if (authResponse) return authResponse;
    console.error("Link player API error:", error);
    return NextResponse.json(
      {
        error: "Failed to link player",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
