import { NextResponse } from "next/server";

import { z } from "zod";

import { getAuthContext, requireRole } from "@/lib/auth/auth-context";
import { toAuthErrorResponse } from "@/lib/auth/http";
import { mechanicsRepository } from "@/lib/services/repository/mechanics";

const updateSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  type: z
    .enum(["pitching", "hitting", "fielding", "catching", "strength"])
    .optional(),
  tags: z.array(z.string()).optional(),
});

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const ctx = await getAuthContext();
    requireRole(ctx, ["coach", "admin"]);

    const { id } = await params;
    const body = await req.json();
    const parsed = updateSchema.parse(body);

    const mechanic = await mechanicsRepository.update(id, parsed);
    return NextResponse.json(mechanic);
  } catch (error) {
    const authResponse = toAuthErrorResponse(error);
    if (authResponse) return authResponse;
    return NextResponse.json({ error: "Failed to update mechanic" }, { status: 400 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const ctx = await getAuthContext();
    requireRole(ctx, ["coach", "admin"]);

    const { id } = await params;
    await mechanicsRepository.delete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    const authResponse = toAuthErrorResponse(error);
    if (authResponse) return authResponse;
    return NextResponse.json({ error: "Failed to delete mechanic" }, { status: 400 });
  }
}
