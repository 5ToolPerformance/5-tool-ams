import { NextRequest, NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";

import db from "@/db";
import { lesson, playerInformation, users } from "@/db/schema";
import { getAuthContext, requireRole } from "@/lib/auth/auth-context";
import { toAuthErrorResponse } from "@/lib/auth/http";
import { RouteParams } from "@/types/api";

export async function GET(
  request: NextRequest,
  { params }: RouteParams<{ id: string }>
) {
  try {
    const ctx = await getAuthContext();
    requireRole(ctx, ["coach", "admin"]);

    const { id } = await params;

    // Validate player ID
    if (!id) {
      return NextResponse.json(
        { error: "Player ID is required" },
        { status: 400 }
      );
    }

    if (ctx.role === "coach" && id !== ctx.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get lessons for the player
    const lessons = await db
      .select({
        lesson,
        coach: users,
      })
      .from(lesson)
      .innerJoin(users, eq(lesson.coachId, users.id))
      .innerJoin(playerInformation, eq(lesson.playerId, playerInformation.id))
      .where(
        and(
          eq(lesson.coachId, id),
          eq(playerInformation.facilityId, ctx.facilityId)
        )
      );

    return NextResponse.json({ lessons });
  } catch (error) {
    const authResponse = toAuthErrorResponse(error);
    if (authResponse) return authResponse;
    console.error("Error fetching lessons for player:", error);

    return NextResponse.json(
      { error: "Failed to fetch lessons" },
      { status: 500 }
    );
  }
}
