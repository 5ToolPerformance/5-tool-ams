import { NextRequest, NextResponse } from "next/server";

import { desc, eq } from "drizzle-orm";
import { getSession } from "next-auth/react";

import db from "@/db";
import { externalAthleteIds } from "@/db/schema";

export async function GET() {
  const session = await getSession();

  if (session?.user.role !== "admin") {
    return NextResponse.json(
      {
        error: "Unauthorized",
        details: "User is not authorized to perform this action",
        timestamp: new Date().toISOString(),
      },
      {
        status: 401,
      }
    );
  }

  const mappings = await db.query.externalAthleteIds.findMany({
    with: {
      player: true,
    },
    orderBy: desc(externalAthleteIds.linkedAt),
  });

  return NextResponse.json({ mappings });
}

export async function POST(request: NextRequest) {
  const session = await getSession();

  if (session?.user.role !== "admin") {
    return NextResponse.json(
      {
        error: "Unauthorized",
        details: "User is not authorized to perform this action",
        timestamp: new Date().toISOString(),
      },
      {
        status: 401,
      }
    );
  }

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
      linkedBy: session.user.id,
      verifiedAt: new Date().toISOString(),
    })
    .returning();

  return NextResponse.json({ mapping });
}

export async function PATCH(request: NextRequest) {
  const session = await getSession();

  if (session?.user.role !== "admin") {
    return NextResponse.json(
      {
        error: "Unauthorized",
        details: "User is not authorized to perform this action",
        timestamp: new Date().toISOString(),
      },
      {
        status: 401,
      }
    );
  }

  const { id, status } = await request.json();

  await db
    .update(externalAthleteIds)
    .set({
      linkingStatus: status,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(externalAthleteIds.id, id));

  return NextResponse.json({ success: true });
}
