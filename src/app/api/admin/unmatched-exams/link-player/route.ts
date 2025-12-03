import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/auth";
import { armcareExamsRepository } from "@/lib/services/repository/armcare-exams";

export async function POST(request: NextRequest) {
  const session = await auth();

  if (session?.user.role !== "admin" || !session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session?.user.id; // Replace with actual session user ID

  try {
    const body = await request.json();
    const { externalPlayerId, pathPlayerId } = body;

    if (!externalPlayerId || !pathPlayerId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const result = await armcareExamsRepository.linkArmcarePlayer(
      externalPlayerId,
      pathPlayerId,
      userId
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
