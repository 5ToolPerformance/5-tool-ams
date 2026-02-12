import { NextRequest, NextResponse } from "next/server";

import db from "@/db";
import { attachments, lessonPlayers } from "@/db/schema";
import { assertCanAccessAttachment, getAuthContext, requireRole } from "@/lib/auth/auth-context";
import { toAuthErrorResponse } from "@/lib/auth/http";
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

    const { lessonPlayerId } = (await request.json()) as {
      lessonPlayerId?: string | null;
    };

    const [attachment] = await db
      .select({
        id: attachments.id,
        athleteId: attachments.athleteId,
      })
      .from(attachments)
      .where(eq(attachments.id, attachmentId))
      .limit(1);

    if (!attachment) {
      return NextResponse.json({ error: "Attachment not found" }, { status: 404 });
    }

    if (lessonPlayerId) {
      const [lessonPlayer] = await db
        .select({
          id: lessonPlayers.id,
          playerId: lessonPlayers.playerId,
        })
        .from(lessonPlayers)
        .where(eq(lessonPlayers.id, lessonPlayerId))
        .limit(1);

      if (!lessonPlayer || lessonPlayer.playerId !== attachment.athleteId) {
        return NextResponse.json(
          { error: "Invalid lessonPlayerId for attachment" },
          { status: 400 }
        );
      }
    }

    await db
      .update(attachments)
      .set({ lessonPlayerId: lessonPlayerId ?? null })
      .where(eq(attachments.id, attachmentId));

    return NextResponse.json({ success: true });
  } catch (error) {
    const authResponse = toAuthErrorResponse(error);
    if (authResponse) return authResponse;
    console.error("Attachment link update failed:", error);
    return NextResponse.json(
      { error: "Failed to update attachment link" },
      { status: 500 }
    );
  }
}
