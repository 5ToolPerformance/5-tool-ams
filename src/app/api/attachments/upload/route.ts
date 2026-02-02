import { NextRequest, NextResponse } from "next/server";

import { uploadFileAttachment } from "@/application/attachments/uploadFileAttachment";
import { auth } from "@/auth";

// IMPORTANT: must run in Node runtime for file uploads
export const runtime = "nodejs";

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
    const type = formData.get("type") as "file_csv" | "file_video" | null;
    const source = formData.get("source") as string | null;
    const notes = formData.get("notes") as string | null;

    if (!file || !athleteId || !type || !source) {
      return NextResponse.json(
        { error: "Missing required fields" },
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
