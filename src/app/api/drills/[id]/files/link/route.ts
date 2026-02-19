import { NextRequest, NextResponse } from "next/server";

import { linkUploadedDrillFile } from "@/application/drills/linkUploadedDrillFile";
import { assertCanEditDrill, getAuthContext, requireRole } from "@/lib/auth/auth-context";
import { toAuthErrorResponse } from "@/lib/auth/http";
import { RouteParams } from "@/types/api";

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
      fileId?: string;
      storageKey?: string;
      originalName?: string;
      mimeType?: string;
      size?: number;
    };

    const media = await linkUploadedDrillFile({
      drillId: id,
      uploadedBy: ctx.userId,
      file: {
        fileId: body.fileId ?? "",
        storageKey: body.storageKey ?? "",
        originalName: body.originalName ?? "",
        mimeType: body.mimeType ?? "",
        size: body.size ?? 0,
      },
    });

    return NextResponse.json({ media }, { status: 201 });
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

    console.error("Error in POST /api/drills/[id]/files/link:", error);
    return NextResponse.json(
      { error: "Failed to link drill file" },
      { status: 500 }
    );
  }
}
