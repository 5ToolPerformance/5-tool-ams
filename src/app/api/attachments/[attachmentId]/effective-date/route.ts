import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/auth";
import db from "@/db";
import { attachments } from "@/db/schema";
import { eq } from "drizzle-orm";

function isValidDateString(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export async function PATCH(
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

    const { effectiveDate } = (await request.json()) as {
      effectiveDate?: string | null;
    };

    if (!effectiveDate || !isValidDateString(effectiveDate)) {
      return NextResponse.json(
        { error: "Invalid effective date" },
        { status: 400 }
      );
    }

    const [attachment] = await db
      .select({
        id: attachments.id,
        evidenceCategory: attachments.evidenceCategory,
      })
      .from(attachments)
      .where(eq(attachments.id, attachmentId))
      .limit(1);

    if (!attachment) {
      return NextResponse.json({ error: "Attachment not found" }, { status: 404 });
    }

    if (attachment.evidenceCategory !== "context") {
      return NextResponse.json(
        { error: "Effective date can only be updated for context documents" },
        { status: 400 }
      );
    }

    await db
      .update(attachments)
      .set({ effectiveDate })
      .where(eq(attachments.id, attachmentId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Attachment effective date update failed:", error);
    return NextResponse.json(
      { error: "Failed to update effective date" },
      { status: 500 }
    );
  }
}
