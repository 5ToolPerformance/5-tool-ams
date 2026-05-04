import { NextRequest, NextResponse } from "next/server";

import { assertAllowedAttachmentFile } from "@ams/application/files/fileUploadPolicy";
import { uploadFileAttachment } from "@ams/application/attachments/uploadFileAttachment";
import { DomainError } from "@ams/domain/errors";
import {
  assertPlayerAccess,
  getAuthContext,
  requireRole,
} from "@/application/auth/auth-context";
import { toAuthErrorResponse } from "@/application/auth/http";

// IMPORTANT: must run in Node runtime for file uploads
export const runtime = "nodejs";

function getTodayDateString() {
  const now = new Date();
  const offsetMs = now.getTimezoneOffset() * 60000;
  return new Date(now.getTime() - offsetMs).toISOString().slice(0, 10);
}

function isValidDateString(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export async function POST(request: NextRequest) {
  try {
    // ---------------------------------------------------------------------
    // 1. Auth
    // ---------------------------------------------------------------------
    const ctx = await getAuthContext();
    requireRole(ctx, ["coach", "admin"]);

    // ---------------------------------------------------------------------
    // 2. Parse multipart form data
    // ---------------------------------------------------------------------
    const formData = await request.formData();

    const file = formData.get("file") as File | null;
    const athleteId = formData.get("athleteId") as string | null;
    const lessonPlayerId = formData.get("lessonPlayerId") as string | null;
    const evaluationId = formData.get("evaluationId") as string | null;
    const type = formData.get("type") as
      | "file_csv"
      | "file_video"
      | "file_image"
      | "file_pdf"
      | "file_docx"
      | null;
    const source = formData.get("source") as string | null;
    const notes = formData.get("notes") as string | null;
    const evidenceCategory = formData.get("evidenceCategory") as string | null;
    const visibility = formData.get("visibility") as
      | "internal"
      | "private"
      | "public"
      | null;
    const documentType = formData.get("documentType") as
      | "medical"
      | "pt"
      | "external"
      | "eval"
      | "general"
      | "other"
      | null;
    const effectiveDate = formData.get("effectiveDate") as string | null;

    if (!file || !athleteId || !type || !source) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await assertPlayerAccess(ctx, athleteId);

    const isContextType = type === "file_pdf" || type === "file_docx";
    const isMediaType = type === "file_image" || type === "file_video";

    if (isContextType && evidenceCategory !== "context") {
      return NextResponse.json(
        { error: "Context documents must use evidenceCategory=context" },
        { status: 400 }
      );
    }

    if (isMediaType && evidenceCategory !== "media") {
      return NextResponse.json(
        { error: "Media uploads must use evidenceCategory=media" },
        { status: 400 }
      );
    }

    if (evidenceCategory === "context") {
      if (!visibility || !documentType) {
        return NextResponse.json(
          { error: "Missing context document fields" },
          { status: 400 }
        );
      }
    }

    const resolvedEffectiveDate =
      evidenceCategory === "context"
        ? (effectiveDate?.trim() || getTodayDateString())
        : undefined;

    if (
      evidenceCategory === "context" &&
      resolvedEffectiveDate &&
      !isValidDateString(resolvedEffectiveDate)
    ) {
      return NextResponse.json(
        { error: "Invalid effective date" },
        { status: 400 }
      );
    }

    // ---------------------------------------------------------------------
    // 3. File validation
    // ---------------------------------------------------------------------
    try {
      assertAllowedAttachmentFile(type, {
        originalFileName: file.name,
        mimeType: file.type || "application/octet-stream",
        size: file.size,
      });
    } catch (error) {
      return NextResponse.json(
        { error: error instanceof Error ? error.message : "Invalid file" },
        { status: 400 }
      );
    }

    // ---------------------------------------------------------------------
    // 4. Convert File → Buffer
    // ---------------------------------------------------------------------
    const buffer = Buffer.from(await file.arrayBuffer());

    // ---------------------------------------------------------------------
    // 5. Call upload use case
    // ---------------------------------------------------------------------
    const attachment = await uploadFileAttachment({
      athleteId,
      facilityId: ctx.facilityId,
      createdBy: ctx.userId,
      lessonPlayerId: lessonPlayerId ?? undefined,
      evaluationId: evaluationId ?? undefined,
      type,
      source,
      evidenceCategory: evidenceCategory ?? undefined,
      visibility: visibility ?? undefined,
      documentType: documentType ?? undefined,
      effectiveDate: resolvedEffectiveDate,
      notes: notes ?? undefined,
      file: {
        buffer,
        originalFileName: file.name,
        mimeType: file.type || "application/octet-stream",
        fileSizeBytes: file.size,
      },
    });

    // ---------------------------------------------------------------------
    // 6. Return response
    // ---------------------------------------------------------------------
    return NextResponse.json({ attachment }, { status: 201 });
  } catch (error) {
    const authResponse = toAuthErrorResponse(error);
    if (authResponse) return authResponse;
    if (error instanceof DomainError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("Attachment upload failed:", error);

    return NextResponse.json(
      { error: "Failed to upload attachment" },
      { status: 500 }
    );
  }
}
