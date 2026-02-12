import { NextRequest, NextResponse } from "next/server";

import { z } from "zod";

import {
  assertPlayerAccess,
  getAuthContext,
  requireRole,
} from "@/lib/auth/auth-context";
import { toAuthErrorResponse } from "@/lib/auth/http";
import writeupRepository from "@/lib/services/repository";

const batchWriteupSchema = z.object({
  playerIds: z.array(z.string()).min(1, "Must select at least one player"),
  writeupType: z.enum(["mid_package", "end_package", "end_of_year"]),
  writeupDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  notes: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const ctx = await getAuthContext();
    requireRole(ctx, ["coach", "admin"]);

    const body = await request.json();
    const validated = batchWriteupSchema.parse(body);

    await Promise.all(
      validated.playerIds.map((playerId) => assertPlayerAccess(ctx, playerId))
    );

    // Create writeup for each player
    const writeups = await Promise.all(
      validated.playerIds.map((playerId) =>
        writeupRepository.createWriteupLog({
          playerId,
          coachId: ctx.userId,
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
    const authResponse = toAuthErrorResponse(error);
    if (authResponse) return authResponse;
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
