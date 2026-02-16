import { NextRequest, NextResponse } from "next/server";

import { createDrill } from "@/application/drills/createDrill";
import { listDrillsForLibrary } from "@/application/drills/listDrillsForLibrary";
import { getAuthContext, requireRole } from "@/lib/auth/auth-context";
import { toAuthErrorResponse } from "@/lib/auth/http";

export async function GET() {
  try {
    const ctx = await getAuthContext();
    requireRole(ctx, ["coach", "admin"]);

    const drills = await listDrillsForLibrary(ctx.facilityId, {
      role: ctx.role,
      userId: ctx.userId,
    });

    return NextResponse.json({ drills });
  } catch (error) {
    const authResponse = toAuthErrorResponse(error);
    if (authResponse) return authResponse;

    console.error("Error in GET /api/drills:", error);
    return NextResponse.json({ error: "Failed to list drills" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const ctx = await getAuthContext();
    requireRole(ctx, ["coach", "admin"]);

    const body = (await request.json()) as {
      title?: string;
      description?: string;
      discipline?:
        | "hitting"
        | "pitching"
        | "strength"
        | "fielding"
        | "catching"
        | "arm_care";
      tags?: string[];
    };

    const drill = await createDrill(
      {
        title: body.title ?? "",
        description: body.description ?? "",
        discipline: body.discipline ?? "hitting",
        tags: body.tags ?? [],
      },
      ctx.userId
    );

    return NextResponse.json({ drill }, { status: 201 });
  } catch (error) {
    const authResponse = toAuthErrorResponse(error);
    if (authResponse) return authResponse;

    if (
      error instanceof Error &&
      (error.message.includes("required") || error.message.includes("Invalid"))
    ) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.error("Error in POST /api/drills:", error);
    return NextResponse.json({ error: "Failed to create drill" }, { status: 500 });
  }
}
