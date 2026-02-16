import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

import { AzureBlobStorage } from "@/application/storage/azureBlobStorage";
import db from "@/db";
import { fileLinks, files } from "@/db/schema";
import { assertCanReadDrill, getAuthContext, requireRole } from "@/lib/auth/auth-context";
import { toAuthErrorResponse } from "@/lib/auth/http";
import { RouteParams } from "@/types/api";

export const runtime = "nodejs";

function buildHeaders(
  response: Response,
  fallback: {
    mimeType?: string | null;
    size?: number | null;
    fileName?: string | null;
  }
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
  } else if (fallback.size) {
    headers.set("Content-Length", String(fallback.size));
  }

  if (contentRange) headers.set("Content-Range", contentRange);
  if (acceptRanges) {
    headers.set("Accept-Ranges", acceptRanges);
  } else {
    headers.set("Accept-Ranges", "bytes");
  }

  if (fallback.fileName) {
    headers.set("Content-Disposition", `inline; filename="${fallback.fileName}"`);
  }

  headers.set("Cache-Control", "no-store");
  return headers;
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams<{ id: string; fileId: string }>
) {
  try {
    const ctx = await getAuthContext();
    requireRole(ctx, ["coach", "admin"]);

    const { id, fileId } = await params;
    await assertCanReadDrill(ctx, id);

    const [record] = await db
      .select({
        storageKey: files.storageKey,
        mimeType: files.mimeType,
        size: files.size,
        originalName: files.originalName,
      })
      .from(fileLinks)
      .innerJoin(files, eq(fileLinks.fileId, files.id))
      .where(
        and(
          eq(fileLinks.entityType, "drill"),
          eq(fileLinks.entityId, id),
          eq(fileLinks.fileId, fileId)
        )
      )
      .limit(1);

    if (!record) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const storage = new AzureBlobStorage();
    const signedUrl = storage.getReadUrl(record.storageKey, 15);
    const rangeHeader = request.headers.get("range");

    const blobRes = await fetch(signedUrl, {
      headers: rangeHeader ? { range: rangeHeader } : undefined,
    });

    if (!blobRes.ok && blobRes.status !== 206) {
      return NextResponse.json({ error: "Failed to stream file" }, { status: 502 });
    }

    return new NextResponse(blobRes.body, {
      status: blobRes.status,
      headers: buildHeaders(blobRes, {
        mimeType: record.mimeType,
        size: record.size,
        fileName: record.originalName,
      }),
    });
  } catch (error) {
    const authResponse = toAuthErrorResponse(error);
    if (authResponse) return authResponse;

    console.error("Error in GET /api/drills/[id]/files/[fileId]/stream:", error);
    return NextResponse.json({ error: "Failed to stream file" }, { status: 500 });
  }
}
