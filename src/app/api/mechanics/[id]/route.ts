import { NextResponse } from "next/server";

import { z } from "zod";

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
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  const body = await req.json();
  const parsed = updateSchema.parse(body);

  const mechanic = await mechanicsRepository.update(id, parsed);
  return NextResponse.json(mechanic);
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  await mechanicsRepository.delete(id);
  return NextResponse.json({ success: true });
}
