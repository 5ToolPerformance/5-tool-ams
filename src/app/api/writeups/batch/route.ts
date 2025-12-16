import { NextRequest, NextResponse } from "next/server";

import { z } from "zod";

import { auth } from "@/auth";
import writeupRepository from "@/lib/services/repository";

const batchWriteupSchema = z.object({
  playerIds: z.array(z.string()).min(1, "Must select at least one player"),
  writeupType: z.enum(["mid_package", "end_package", "end_of_year"]),
  writeupDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  notes: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validated = batchWriteupSchema.parse(body);

    // Create writeup for each player
    const writeups = await Promise.all(
      validated.playerIds.map((playerId) =>
        writeupRepository.createWriteupLog({
          playerId,
          coachId: session.user.id,
          writeupType: validated.writeupType,
          writeupDate: validated.writeupDate,
          notes: validated.notes,
        })
      )
    );

    return NextResponse.json(
      {
        success: true,
        count: writeups.length,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Error creating batch writeups:", error);
    return NextResponse.json(
      { error: "Failed to create writeups" },
      { status: 500 }
    );
  }
}
