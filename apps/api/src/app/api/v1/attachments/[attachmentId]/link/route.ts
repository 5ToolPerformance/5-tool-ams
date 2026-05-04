import { NextRequest, NextResponse } from "next/server";

import { validateAttachmentLinkage } from "@ams/application/attachments/validateAttachmentLinkage";
import db from "@ams/db";
import { attachments } from "@ams/db/schema";
import { DomainError } from "@ams/domain/errors";
import { assertCanAccessAttachment, getAuthContext, requireRole } from "@/application/auth/auth-context";
import { toAuthErrorResponse } from "@/application/auth/http";
import { eq } from "drizzle-orm";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ attachmentId: string }> }
) {
  try {
    const ctx = await getAuthContext();
    requireRole(ctx, ["coach", "admin"]);

    const { attachmentId } = await context.params;
    if (!attachmentId) {
      return NextResponse.json({ error: "Missing attachmentId" }, { status: 400 });
    }

    await assertCanAccessAttachment(ctx, attachmentId);

    const body = (await request.json()) as {
      lessonPlayerId?: string | null;
      evaluationId?: string | null;
    };

    const [attachment] = await db
      .select({
        id: attachments.id,
        athleteId: attachments.athleteId,
        facilityId: attachments.facilityId,
        lessonPlayerId: attachments.lessonPlayerId,
        evaluationId: attachments.evaluationId,
      })
      .from(attachments)
      .where(eq(attachments.id, attachmentId))
      .limit(1);

    if (!attachment) {
      return NextResponse.json({ error: "Attachment not found" }, { status: 404 });
    }

    if (!attachment.athleteId || !attachment.facilityId) {
      return NextResponse.json(
        { error: "Attachment is missing player or facility ownership" },
        { status: 400 }
      );
    }

    const nextLessonPlayerId =
      "lessonPlayerId" in body ? body.lessonPlayerId : attachment.lessonPlayerId;
    const nextEvaluationId =
      "evaluationId" in body ? body.evaluationId : attachment.evaluationId;

    await validateAttachmentLinkage(db, {
      athleteId: attachment.athleteId,
      facilityId: attachment.facilityId,
      lessonPlayerId: nextLessonPlayerId,
      evaluationId: nextEvaluationId,
    });

    await db
      .update(attachments)
      .set({
        lessonPlayerId: nextLessonPlayerId ?? null,
        evaluationId: nextEvaluationId ?? null,
      })
      .where(eq(attachments.id, attachmentId));

    return NextResponse.json({ success: true });
  } catch (error) {
    const authResponse = toAuthErrorResponse(error);
    if (authResponse) return authResponse;
    if (error instanceof DomainError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("Attachment link update failed:", error);
    return NextResponse.json(
      { error: "Failed to update attachment link" },
      { status: 500 }
    );
  }
}
