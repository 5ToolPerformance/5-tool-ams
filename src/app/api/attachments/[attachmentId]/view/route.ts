import { NextRequest, NextResponse } from "next/server";

import { AzureBlobStorage } from "@/application/storage/azureBlobStorage";
import db from "@/db";
import { attachmentFiles, attachments } from "@/db/schema";
import { assertCanAccessAttachment, getAuthContext } from "@/lib/auth/auth-context";
import { toAuthErrorResponse } from "@/lib/auth/http";
import { eq } from "drizzle-orm";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ attachmentId: string }> }
) {
  try {
    const ctx = await getAuthContext();

    const { attachmentId } = await context.params;
    if (!attachmentId) {
      return NextResponse.json({ error: "Missing attachmentId" }, { status: 400 });
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
      return NextResponse.json({ error: "Attachment not found" }, { status: 404 });
    }

    if (!record.storageKey) {
      return NextResponse.json({ error: "Attachment has no file" }, { status: 404 });
    }

    const storage = new AzureBlobStorage();
    const url = storage.getReadUrl(record.storageKey, 15);

    return NextResponse.json({ url });
  } catch (error) {
    const authResponse = toAuthErrorResponse(error);
    if (authResponse) return authResponse;
    console.error("Attachment view failed:", error);
    return NextResponse.json({ error: "Failed to generate view link" }, { status: 500 });
  }
}
