import { NextRequest, NextResponse } from "next/server";

import { deleteDrill } from "@/application/drills/deleteDrill";
import { getDrillForEdit } from "@/application/drills/getDrillForEdit";
import { updateDrill } from "@/application/drills/updateDrill";
import {
  assertCanEditDrill,
  assertCanReadDrill,
  getAuthContext,
  requireRole,
} from "@/application/auth/auth-context";
import { toAuthErrorResponse } from "@/application/auth/http";
import { RouteParams } from "@/types/api";

export async function GET(
  _request: NextRequest,
  { params }: RouteParams<{ id: string }>
) {
  try {
    const ctx = await getAuthContext();
    requireRole(ctx, ["coach", "admin"]);

    const { id } = await params;
    await assertCanReadDrill(ctx, id);

    const drill = await getDrillForEdit(id);

    return NextResponse.json({ drill });
  } catch (error) {
    const authResponse = toAuthErrorResponse(error);
    if (authResponse) return authResponse;

    console.error("Error in GET /api/drills/[id]:", error);
    return NextResponse.json({ error: "Failed to fetch drill" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: RouteParams<{ id: string }>
) {
  try {
    const ctx = await getAuthContext();
    requireRole(ctx, ["coach", "admin"]);

    const { id } = await params;
    await assertCanEditDrill(ctx, id);

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
      videoUrl?: string | null;
    };

    const drill = await updateDrill(id, {
      title: body.title ?? "",
      description: body.description ?? "",
      discipline: body.discipline ?? "hitting",
      tags: body.tags ?? [],
      videoUrl: body.videoUrl ?? null,
    });

    return NextResponse.json({ drill });
  } catch (error) {
    const authResponse = toAuthErrorResponse(error);
    if (authResponse) return authResponse;

    if (
      error instanceof Error &&
      (error.message.includes("required") || error.message.includes("Invalid"))
    ) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.error("Error in PATCH /api/drills/[id]:", error);
    return NextResponse.json({ error: "Failed to update drill" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: RouteParams<{ id: string }>
) {
  try {
    const ctx = await getAuthContext();
    requireRole(ctx, ["admin"]);

    const { id } = await params;
    await assertCanReadDrill(ctx, id);
    await deleteDrill(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    const authResponse = toAuthErrorResponse(error);
    if (authResponse) return authResponse;

    console.error("Error in DELETE /api/drills/[id]:", error);
    return NextResponse.json({ error: "Failed to delete drill" }, { status: 500 });
  }
}
