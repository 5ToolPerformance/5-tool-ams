import { NextRequest, NextResponse } from "next/server";

import { uploadDrillFile } from "@/application/drills/uploadDrillFile";
import { assertCanEditDrill, getAuthContext, requireRole } from "@/lib/auth/auth-context";
import { toAuthErrorResponse } from "@/lib/auth/http";
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

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Missing file" }, { status: 400 });
    }

    const media = await uploadDrillFile({
      drillId: id,
      facilityId: ctx.facilityId,
      uploadedBy: ctx.userId,
      file: {
        buffer: Buffer.from(await file.arrayBuffer()),
        originalFileName: file.name,
        mimeType: file.type || "application/octet-stream",
        size: file.size,
      },
    });

    return NextResponse.json({ media }, { status: 201 });
  } catch (error) {
    const authResponse = toAuthErrorResponse(error);
    if (authResponse) return authResponse;

    if (
      error instanceof Error &&
      (error.message.includes("allowed") || error.message.includes("large"))
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
