import { NextRequest, NextResponse } from "next/server";

import { prepareDrillFileUpload } from "@/application/drills/prepareDrillFileUpload";
import { assertCanEditDrill, getAuthContext, requireRole } from "@/application/auth/auth-context";
import { toAuthErrorResponse } from "@/application/auth/http";
import { RouteParams } from "@/types/api";

export const runtime = "nodejs";

export async function POST(
  request: NextRequest,
  { params }: RouteParams<{ id: string }>
) {
  try {
    const ctx = await getAuthContext();
    requireRole(ctx, ["coach", "admin"]);

    const { id } = await params;
    await assertCanEditDrill(ctx, id);

    const body = (await request.json()) as {
      originalFileName?: string;
      mimeType?: string;
      size?: number;
    };

    const upload = await prepareDrillFileUpload({
      drillId: id,
      facilityId: ctx.facilityId,
      file: {
        originalFileName: body.originalFileName ?? "",
        mimeType: body.mimeType ?? "",
        size: body.size ?? 0,
      },
    });

    return NextResponse.json({ upload }, { status: 201 });
  } catch (error) {
    const authResponse = toAuthErrorResponse(error);
    if (authResponse) return authResponse;

    if (
      error instanceof Error &&
      (error.message.includes("allowed") ||
        error.message.includes("large") ||
        error.message.includes("Missing"))
    ) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.error("Error in POST /api/drills/[id]/files:", error);
    return NextResponse.json(
      { error: "Failed to upload drill file" },
      { status: 500 }
    );
  }
}
