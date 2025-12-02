import { NextRequest, NextResponse } from "next/server";

import { desc, eq } from "drizzle-orm";
import { getSession } from "next-auth/react";

import db from "@/db";
import { externalSyncLogs } from "@/db/schema";

export async function GET(request: NextRequest) {
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

  const { searchParams } = new URL(request.url);
  const system = searchParams.get("system");
  const limit = parseInt(searchParams.get("limit") || "50");

  try {
    const logs = await db.query.externalSyncLogs.findMany({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      where: system ? eq(externalSyncLogs.system, system as any) : undefined,
      orderBy: desc(externalSyncLogs.startedAt),
      limit,
    });
    return NextResponse.json(logs);
  } catch (error) {
    console.error("[sync-logs] Failed to retrieve sync logs from db", error);
    return NextResponse.json(
      {
        error: "Failed to retrieve sync logs from db",
        details: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      {
        status: 500,
      }
    );
  }
}
