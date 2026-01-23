import { auth } from "@/auth";
import db from "@/db";
import { playerNotes } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { playerId, content, visibility = "internal" } = await req.json();

        if (!playerId || !content) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        const [note] = await db
            .insert(playerNotes)
            .values({
                playerId,
                authorId: session.user.id,
                content,
                visibility,
            })
            .returning();

        return NextResponse.json({ success: true, data: note });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Failed to create note" },
            { status: 500 }
        );
    }
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const playerId = searchParams.get("playerId");

    if (!playerId) {
        return NextResponse.json(
            { error: "playerId required" },
            { status: 400 }
        );
    }

    const notes = await db.query.playerNotes.findMany({
        where: (notes, { eq }) => eq(notes.playerId, playerId),
        orderBy: (notes, { desc }) => desc(notes.createdAt),
        with: {
            author: true,
        },
    });

    return NextResponse.json({ success: true, data: notes });
}

