import { NextRequest, NextResponse } from "next/server";

import { AzureBlobStorage } from "@/application/storage/azureBlobStorage";
import db from "@/db";
import { attachmentFiles, attachments } from "@/db/schema";
import { assertCanAccessAttachment, getAuthContext } from "@/lib/auth/auth-context";
import { toAuthErrorResponse } from "@/lib/auth/http";
import { eq } from "drizzle-orm";

export const runtime = "nodejs";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ attachmentId: string }> }
) {
  try {
    const ctx = await getAuthContext();

    const { attachmentId } = await context.params;
    if (!attachmentId) {
      return NextResponse.json(
        { error: "Missing attachmentId" },
        { status: 400 }
      );
    }

    await assertCanAccessAttachment(ctx, attachmentId);

    const [record] = await db
      .select({
        attachmentId: attachments.id,
        storageKey: attachmentFiles.storageKey,
      })
      .from(attachments)
      .leftJoin(
        attachmentFiles,
        eq(attachmentFiles.attachmentId, attachments.id)
      )
      .where(eq(attachments.id, attachmentId))
      .limit(1);

    if (!record?.attachmentId) {
      return NextResponse.json(
        { error: "Attachment not found" },
        { status: 404 }
      );
    }

    if (!record.storageKey) {
      return NextResponse.json(
        { error: "Attachment has no file" },
        { status: 404 }
      );
    }

    const storage = new AzureBlobStorage();
    const signedUrl = storage.getReadUrl(record.storageKey, 15);

    const blobRes = await fetch(signedUrl);
    if (!blobRes.ok) {
      return NextResponse.json(
        { error: "Failed to fetch attachment content" },
        { status: 502 }
      );
    }

    const text = await blobRes.text();

    return new NextResponse(text, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    const authResponse = toAuthErrorResponse(error);
    if (authResponse) return authResponse;
    console.error("Attachment content fetch failed:", error);
    return NextResponse.json(
      { error: "Failed to fetch attachment content" },
      { status: 500 }
    );
  }
}
