import { NextRequest, NextResponse } from "next/server";

import db from "@/db";
import { playerNotes } from "@/db/schema";
import { assertPlayerAccess, getAuthContext } from "@/lib/auth/auth-context";
import { toAuthErrorResponse } from "@/lib/auth/http";

export async function POST(req: NextRequest) {
  try {
    const ctx = await getAuthContext();

    const {
      playerId,
      content,
      visibility = "internal",
      type,
    } = await req.json();

    if (!playerId || !content) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await assertPlayerAccess(ctx, playerId);

    const [note] = await db
      .insert(playerNotes)
      .values({
        playerId,
        authorId: ctx.userId,
        content,
        visibility,
        type,
      })
      .returning();

    return NextResponse.json({ success: true, data: note });
  } catch (error) {
    const authResponse = toAuthErrorResponse(error);
    if (authResponse) return authResponse;
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create note" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const ctx = await getAuthContext();
    const { searchParams } = new URL(req.url);
    const playerId = searchParams.get("playerId");

    if (!playerId) {
      return NextResponse.json({ error: "playerId required" }, { status: 400 });
    }

    await assertPlayerAccess(ctx, playerId);

    const notes = await db.query.playerNotes.findMany({
      where: (notes, { eq }) => eq(notes.playerId, playerId),
      orderBy: (notes, { desc }) => desc(notes.createdAt),
      with: {
        author: true,
      },
    });

    return NextResponse.json({ success: true, data: notes });
  } catch (error) {
    const authResponse = toAuthErrorResponse(error);
    if (authResponse) return authResponse;
    return NextResponse.json({ error: "Failed to fetch notes" }, { status: 500 });
  }
}
