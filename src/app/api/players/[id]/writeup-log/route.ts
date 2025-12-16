// app/api/players/[id]/writeups/route.ts
import { NextRequest, NextResponse } from "next/server";

import { z } from "zod";

import { auth } from "@/auth";
import writeupRepository from "@/lib/services/repository";

const createWriteupSchema = z.object({
  writeupType: z.enum(["mid_package", "end_package", "end_of_year"]),
  writeupDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  notes: z.string().optional(),
});

// GET /api/players/[id]/writeups - fetch player's writeups
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const writeups = await writeupRepository.getPlayerWriteupLog(id);
    return NextResponse.json(writeups);
  } catch (error) {
    console.error("Error fetching writeups:", error);
    return NextResponse.json(
      { error: "Failed to fetch writeups" },
      { status: 500 }
    );
  }
}

// POST /api/players/[id]/writeups - create writeup for player
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validated = createWriteupSchema.parse(body);

    const { id } = await params;

    const writeup = await writeupRepository.createWriteupLog({
      playerId: id,
      coachId: session.user.id,
      ...validated,
    });

    return NextResponse.json(writeup, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Error creating writeup:", error);
    return NextResponse.json(
      { error: "Failed to create writeup" },
      { status: 500 }
    );
  }
}

// TODO: Dedicated /api/writeups routes for admin management
// TODO: Update and delete endpoints
