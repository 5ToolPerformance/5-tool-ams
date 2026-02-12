import { NextResponse } from "next/server";

import { z } from "zod";

import { getAuthContext, requireRole } from "@/lib/auth/auth-context";
import { toAuthErrorResponse } from "@/lib/auth/http";
import { mechanicsRepository } from "@/lib/services/repository/mechanics";

const createSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  type: z.enum(["pitching", "hitting", "fielding", "catching", "strength"]),
  tags: z.array(z.string()).optional(),
});

export async function GET() {
  try {
    const ctx = await getAuthContext();
    requireRole(ctx, ["coach", "admin"]);

    const mechanics = await mechanicsRepository.findAll();
    return NextResponse.json(mechanics);
  } catch (error) {
    const authResponse = toAuthErrorResponse(error);
    if (authResponse) return authResponse;
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
}

export async function POST(req: Request) {
  try {
    const ctx = await getAuthContext();
    requireRole(ctx, ["coach", "admin"]);

    const body = await req.json();
    const parsed = createSchema.parse(body);

    const mechanic = await mechanicsRepository.create(parsed);
    return NextResponse.json(mechanic, { status: 201 });
  } catch (error) {
    const authResponse = toAuthErrorResponse(error);
    if (authResponse) return authResponse;
    return NextResponse.json({ error: "Failed to create mechanic" }, { status: 400 });
  }
}
