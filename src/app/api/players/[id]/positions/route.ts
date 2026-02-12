import { NextRequest, NextResponse } from "next/server";

import { and, eq, inArray } from "drizzle-orm";

import db from "@/db";
import { playerPositions, positions } from "@/db/schema";
import {
  assertPlayerAccess,
  getAuthContext,
  requireRole,
} from "@/lib/auth/auth-context";
import { toAuthErrorResponse } from "@/lib/auth/http";
import { RouteParams } from "@/types/api";

interface PatchPlayerPositionsPayload {
  primaryPositionId: string;
  secondaryPositionIds: string[];
}

export async function PATCH(
  req: NextRequest,
  { params }: RouteParams<{ playerId: string }>
) {
  try {
    const ctx = await getAuthContext();
    requireRole(ctx, ["coach", "admin"]);

    const { playerId } = await params;
    await assertPlayerAccess(ctx, playerId);

    const body = (await req.json()) as PatchPlayerPositionsPayload;
    const { primaryPositionId, secondaryPositionIds } = body;

    // ---------- validation ----------
    if (!primaryPositionId) {
      return NextResponse.json(
        { error: "Primary position is required" },
        { status: 400 }
      );
    }

    if (secondaryPositionIds.includes(primaryPositionId)) {
      return NextResponse.json(
        { error: "Primary position cannot be secondary" },
        { status: 400 }
      );
    }

    // Ensure all position IDs exist & are resolvable
    const allIds = [primaryPositionId, ...secondaryPositionIds];

    const validPositions = await db
      .select({ id: positions.id })
      .from(positions)
      .where(
        and(inArray(positions.id, allIds), eq(positions.isResolvable, true))
      );

    if (validPositions.length !== allIds.length) {
      return NextResponse.json(
        { error: "One or more invalid positions" },
        { status: 400 }
      );
    }

    // ---------- transactional replace ----------
    await db.transaction(async (tx) => {
      // Delete existing positions
      await tx
        .delete(playerPositions)
        .where(eq(playerPositions.playerId, playerId));

      // Insert primary
      await tx.insert(playerPositions).values({
        playerId,
        positionId: primaryPositionId,
        isPrimary: true,
      });

      // Insert secondaries
      if (secondaryPositionIds.length > 0) {
        await tx.insert(playerPositions).values(
          secondaryPositionIds.map((positionId) => ({
            playerId,
            positionId,
            isPrimary: false,
          }))
        );
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    const authResponse = toAuthErrorResponse(error);
    if (authResponse) return authResponse;
    console.error("PATCH /players/[id]/positions error:", error);
    return NextResponse.json(
      { error: "Failed to update player positions" },
      { status: 500 }
    );
  }
}
