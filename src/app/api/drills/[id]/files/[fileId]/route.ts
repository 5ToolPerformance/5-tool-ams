import { NextRequest, NextResponse } from "next/server";

import { removeDrillFile } from "@/application/drills/removeDrillFile";
import { assertCanEditDrill, getAuthContext, requireRole } from "@/lib/auth/auth-context";
import { toAuthErrorResponse } from "@/lib/auth/http";
import { RouteParams } from "@/types/api";

export async function DELETE(
  _request: NextRequest,
  { params }: RouteParams<{ id: string; fileId: string }>
) {
  try {
    const ctx = await getAuthContext();
    requireRole(ctx, ["coach", "admin"]);

    const { id, fileId } = await params;
    await assertCanEditDrill(ctx, id);

    const result = await removeDrillFile(id, fileId);

    if (!result.removed) {
      return NextResponse.json({ error: "File link not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const authResponse = toAuthErrorResponse(error);
    if (authResponse) return authResponse;

    console.error("Error in DELETE /api/drills/[id]/files/[fileId]:", error);
    return NextResponse.json(
      { error: "Failed to delete drill file" },
      { status: 500 }
    );
  }
}
