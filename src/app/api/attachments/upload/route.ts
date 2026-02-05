import { NextRequest, NextResponse } from "next/server";

import { uploadFileAttachment } from "@/application/attachments/uploadFileAttachment";
import { auth } from "@/auth";

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
    const session = await auth();

    // Example placeholders:
    const userId = session?.user?.id;
    const facilityId = "fc3369cb-4218-4701-ae20-68426f23b9e0"; // REPLACE WITH REAL FACILITY ID FROM SESSION/CONTEXT

    if (!userId || !facilityId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ---------------------------------------------------------------------
    // 2. Parse multipart form data
    // ---------------------------------------------------------------------
    const formData = await request.formData();

    const file = formData.get("file") as File | null;
    const athleteId = formData.get("athleteId") as string | null;
    const lessonPlayerId = formData.get("lessonPlayerId") as string | null;
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
    const MAX_FILE_SIZE_BYTES = 500 * 1024 * 1024; // 500MB

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json({ error: "File too large" }, { status: 400 });
    }

    if (
      type === "file_csv" &&
      !file.type.includes("csv") &&
      !file.name.endsWith(".csv")
    ) {
      return NextResponse.json({ error: "Invalid CSV file" }, { status: 400 });
    }

    if (type === "file_video" && !file.type.startsWith("video/")) {
      return NextResponse.json(
        { error: "Invalid video file" },
        { status: 400 }
      );
    }

    if (type === "file_image" && !file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Invalid image file" },
        { status: 400 }
      );
    }

    if (
      type === "file_pdf" &&
      file.type !== "application/pdf" &&
      !file.name.endsWith(".pdf")
    ) {
      return NextResponse.json(
        { error: "Invalid PDF file" },
        { status: 400 }
      );
    }

    if (
      type === "file_docx" &&
      file.type !==
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" &&
      !file.name.endsWith(".docx")
    ) {
      return NextResponse.json(
        { error: "Invalid DOCX file" },
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
      facilityId,
      createdBy: userId,
      lessonPlayerId: lessonPlayerId ?? undefined,
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
    console.error("Attachment upload failed:", error);

    return NextResponse.json(
      { error: "Failed to upload attachment" },
      { status: 500 }
    );
  }
}
