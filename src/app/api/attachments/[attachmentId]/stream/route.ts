import { NextRequest, NextResponse } from "next/server";

import { AzureBlobStorage } from "@/application/storage/azureBlobStorage";
import { auth } from "@/auth";
import db from "@/db";
import { attachmentFiles, attachments } from "@/db/schema";
import { eq } from "drizzle-orm";

export const runtime = "nodejs";

function buildHeaders(
  response: Response,
  fallback: { mimeType?: string | null; fileSizeBytes?: number | null; fileName?: string | null }
) {
  const headers = new Headers();
  const contentType = response.headers.get("content-type");
  const contentLength = response.headers.get("content-length");
  const contentRange = response.headers.get("content-range");
  const acceptRanges = response.headers.get("accept-ranges");

  if (contentType) {
    headers.set("Content-Type", contentType);
  } else if (fallback.mimeType) {
    headers.set("Content-Type", fallback.mimeType);
  }

  if (contentLength) {
    headers.set("Content-Length", contentLength);
  } else if (fallback.fileSizeBytes) {
    headers.set("Content-Length", String(fallback.fileSizeBytes));
  }
  if (contentRange) headers.set("Content-Range", contentRange);
  if (acceptRanges) {
    headers.set("Accept-Ranges", acceptRanges);
  } else {
    headers.set("Accept-Ranges", "bytes");
  }

  if (fallback.fileName) {
    headers.set(
      "Content-Disposition",
      `inline; filename="${fallback.fileName}"`
    );
  }
  headers.set("Cache-Control", "no-store");

  return headers;
}

async function getAttachmentRecord(attachmentId: string) {
  const [record] = await db
    .select({
      attachmentId: attachments.id,
      storageKey: attachmentFiles.storageKey,
      mimeType: attachmentFiles.mimeType,
      fileSizeBytes: attachmentFiles.fileSizeBytes,
      fileName: attachmentFiles.originalFileName,
    })
    .from(attachments)
    .leftJoin(attachmentFiles, eq(attachmentFiles.attachmentId, attachments.id))
    .where(eq(attachments.id, attachmentId))
    .limit(1);

  return record;
}

export async function HEAD(
  _request: NextRequest,
  context: { params: Promise<{ attachmentId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { attachmentId } = await context.params;
    if (!attachmentId) {
      return NextResponse.json(
        { error: "Missing attachmentId" },
        { status: 400 }
      );
    }

    const record = await getAttachmentRecord(attachmentId);
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

    return new NextResponse(null, {
      status: 200,
      headers: buildHeaders(new Response(null), {
        mimeType: record.mimeType,
        fileSizeBytes: record.fileSizeBytes,
        fileName: record.fileName,
      }),
    });
  } catch (error) {
    console.error("Attachment stream head failed:", error);
    return NextResponse.json(
      { error: "Failed to read attachment metadata" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ attachmentId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { attachmentId } = await context.params;
    if (!attachmentId) {
      return NextResponse.json(
        { error: "Missing attachmentId" },
        { status: 400 }
      );
    }

    const record = await getAttachmentRecord(attachmentId);

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

    const rangeHeader = request.headers.get("range");
    const blobRes = await fetch(signedUrl, {
      headers: rangeHeader ? { range: rangeHeader } : undefined,
    });

    if (!blobRes.ok && blobRes.status !== 206) {
      return NextResponse.json(
        { error: "Failed to fetch attachment content" },
        { status: 502 }
      );
    }

    return new NextResponse(blobRes.body, {
      status: blobRes.status,
      headers: buildHeaders(blobRes, {
        mimeType: record.mimeType,
        fileSizeBytes: record.fileSizeBytes,
        fileName: record.fileName,
      }),
    });
  } catch (error) {
    console.error("Attachment stream failed:", error);
    return NextResponse.json(
      { error: "Failed to stream attachment" },
      { status: 500 }
    );
  }
}
