import { NextRequest, NextResponse } from "next/server";

import { desc, eq } from "drizzle-orm";

import db from "@/db";
import { externalAthleteIds } from "@/db/schema";
import { getAuthContext, requireRole } from "@/lib/auth/auth-context";
import { toAuthErrorResponse } from "@/lib/auth/http";

export async function GET() {
  try {
    const ctx = await getAuthContext();
    requireRole(ctx, ["admin"]);

    const mappings = await db.query.externalAthleteIds.findMany({
      with: {
        player: true,
      },
      orderBy: desc(externalAthleteIds.linkedAt),
    });

    return NextResponse.json({ mappings });
  } catch (error) {
    const authResponse = toAuthErrorResponse(error);
    if (authResponse) return authResponse;
    return NextResponse.json({ error: "Failed to fetch mappings" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const ctx = await getAuthContext();
    requireRole(ctx, ["admin"]);

    const { playerId, externalSystem, externalId, externalEmail } =
      await request.json();

    const [mapping] = await db
      .insert(externalAthleteIds)
      .values({
        playerId,
        externalSystem,
        externalId,
        externalEmail,
        linkingMethod: "manual",
        linkingStatus: "active",
        confidence: "1.0",
        linkedBy: ctx.userId,
        verifiedAt: new Date().toISOString(),
      })
      .returning();

    return NextResponse.json({ mapping });
  } catch (error) {
    const authResponse = toAuthErrorResponse(error);
    if (authResponse) return authResponse;
    return NextResponse.json({ error: "Failed to create mapping" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const ctx = await getAuthContext();
    requireRole(ctx, ["admin"]);

    const { id, status } = await request.json();

    await db
      .update(externalAthleteIds)
      .set({
        linkingStatus: status,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(externalAthleteIds.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    const authResponse = toAuthErrorResponse(error);
    if (authResponse) return authResponse;
    return NextResponse.json({ error: "Failed to update mapping" }, { status: 500 });
  }
}
