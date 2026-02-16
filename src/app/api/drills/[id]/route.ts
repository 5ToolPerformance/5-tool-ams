import { NextRequest, NextResponse } from "next/server";

import { getDrillForEdit } from "@/application/drills/getDrillForEdit";
import { updateDrill } from "@/application/drills/updateDrill";
import {
  assertCanEditDrill,
  assertCanReadDrill,
  getAuthContext,
  requireRole,
} from "@/lib/auth/auth-context";
import { toAuthErrorResponse } from "@/lib/auth/http";
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
      tags?: string[];
    };

    const drill = await updateDrill(id, {
      title: body.title ?? "",
      description: body.description ?? "",
      tags: body.tags ?? [],
    });

    return NextResponse.json({ drill });
  } catch (error) {
    const authResponse = toAuthErrorResponse(error);
    if (authResponse) return authResponse;

    if (error instanceof Error && error.message.includes("required")) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.error("Error in PATCH /api/drills/[id]:", error);
    return NextResponse.json({ error: "Failed to update drill" }, { status: 500 });
  }
}
