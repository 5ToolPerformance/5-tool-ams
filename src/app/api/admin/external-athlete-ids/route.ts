import { NextRequest, NextResponse } from "next/server";

import { and, eq } from "drizzle-orm";

import { auth } from "@/auth";
import db from "@/db";
import { externalAthleteIds } from "@/db/schema";

export async function GET() {
  const session = await auth();

  if (session?.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const mappings = await db.query.externalAthleteIds.findMany({
    with: {
      player: true,
    },
    orderBy: (table, { desc }) => [desc(table.linkedAt)],
  });

  return NextResponse.json({ mappings });
}

export async function POST(request: NextRequest) {
  const session = await auth();

  if (session?.user.role !== "admin" || !session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { playerId, externalSystem, externalId } = body;

  if (!playerId || !externalSystem || !externalId) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  // Prevent duplicate links
  const existing = await db
    .select()
    .from(externalAthleteIds)
    .where(
      and(
        eq(externalAthleteIds.externalSystem, externalSystem),
        eq(externalAthleteIds.externalId, externalId)
      )
    )
    .limit(1);

  if (existing.length > 0) {
    return NextResponse.json(
      { error: "External athlete already linked" },
      { status: 409 }
    );
  }

  const [mapping] = await db
    .insert(externalAthleteIds)
    .values({
      playerId,
      externalSystem,
      externalId,
      linkingMethod: "manual",
      linkingStatus: "active",
      confidence: "1.0",
      linkedBy: session.user.id,
      verifiedAt: new Date().toISOString(),
    })
    .returning();

  return NextResponse.json({ mapping });
}

export async function PATCH(request: NextRequest) {
  const session = await auth();

  if (session?.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, status } = await request.json();

  if (!id || !status) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  await db
    .update(externalAthleteIds)
    .set({
      linkingStatus: status,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(externalAthleteIds.id, id));

  return NextResponse.json({ success: true });
}
