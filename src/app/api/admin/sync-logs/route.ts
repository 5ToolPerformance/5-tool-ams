import { NextRequest, NextResponse } from "next/server";

import { desc, eq } from "drizzle-orm";

import db from "@/db";
import { externalSyncLogs } from "@/db/schema";
import { getAuthContext, requireRole } from "@/lib/auth/auth-context";
import { toAuthErrorResponse } from "@/lib/auth/http";

export async function GET(request: NextRequest) {
  try {
    const ctx = await getAuthContext();
    requireRole(ctx, ["admin"]);

    const { searchParams } = new URL(request.url);
    const system = searchParams.get("system");
    const limit = parseInt(searchParams.get("limit") || "50");

    const logs = await db.query.externalSyncLogs.findMany({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      where: system ? eq(externalSyncLogs.system, system as any) : undefined,
      orderBy: desc(externalSyncLogs.startedAt),
      limit,
    });
    return NextResponse.json(logs);
  } catch (error) {
    const authResponse = toAuthErrorResponse(error);
    if (authResponse) return authResponse;
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
