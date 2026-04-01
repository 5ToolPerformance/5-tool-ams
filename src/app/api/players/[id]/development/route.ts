import { NextRequest, NextResponse } from "next/server";

import { assertPlayerAccess, getAuthContext } from "@/lib/auth/auth-context";
import { toAuthErrorResponse } from "@/lib/auth/http";
import { loadPlayerDevelopmentPageData } from "@/application/players/development/loadPlayerDevelopmentPageData";
import type { RouteParams } from "@/types/api";

export async function GET(
  request: NextRequest,
  { params }: RouteParams<{ id: string }>
) {
  try {
    const ctx = await getAuthContext();
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Player ID is required." },
        { status: 400 }
      );
    }

    await assertPlayerAccess(ctx, id);

    const discipline = request.nextUrl.searchParams.get("discipline") ?? undefined;
    const payload = await loadPlayerDevelopmentPageData({
      playerId: id,
      discipline,
      authContext: ctx,
    });

    return NextResponse.json(payload);
  } catch (error) {
    const authResponse = toAuthErrorResponse(error);
    if (authResponse) return authResponse;

    console.error("Error in GET /api/players/[id]/development:", error);

    return NextResponse.json(
      { error: "Failed to load player development data." },
      { status: 500 }
    );
  }
}
