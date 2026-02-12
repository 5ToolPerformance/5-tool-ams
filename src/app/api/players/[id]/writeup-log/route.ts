// app/api/players/[id]/writeups/route.ts
import { NextRequest, NextResponse } from "next/server";

import { z } from "zod";

import {
  assertPlayerAccess,
  getAuthContext,
  requireRole,
} from "@/lib/auth/auth-context";
import { toAuthErrorResponse } from "@/lib/auth/http";
import writeupRepository from "@/lib/services/repository";

const createWriteupSchema = z.object({
  writeupType: z.enum(["mid_package", "end_package", "end_of_year"]),
  writeupDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  notes: z.string().optional(),
});

// GET /api/players/[id]/writeups - fetch player's writeups
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const ctx = await getAuthContext();

    const { id } = await params;
    await assertPlayerAccess(ctx, id);

    const writeups = await writeupRepository.getPlayerWriteupLog(id);
    return NextResponse.json(writeups);
  } catch (error) {
    const authResponse = toAuthErrorResponse(error);
    if (authResponse) return authResponse;
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const ctx = await getAuthContext();
    requireRole(ctx, ["coach", "admin"]);

    const body = await request.json();
    const validated = createWriteupSchema.parse(body);

    const { id } = await params;
    await assertPlayerAccess(ctx, id);

    const writeup = await writeupRepository.createWriteupLog({
      playerId: id,
      coachId: ctx.userId,
      ...validated,
    });

    return NextResponse.json(writeup, { status: 201 });
  } catch (error) {
    const authResponse = toAuthErrorResponse(error);
    if (authResponse) return authResponse;
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
