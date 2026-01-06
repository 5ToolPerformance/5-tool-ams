import { NextResponse } from "next/server";

import { z } from "zod";

import { mechanicsRepository } from "@/lib/services/repository/mechanics";

const createSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  type: z.enum(["pitching", "hitting", "fielding", "catching", "strength"]),
  tags: z.array(z.string()).optional(),
});

export async function GET() {
  const mechanics = await mechanicsRepository.findAll();
  return NextResponse.json(mechanics);
}

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = createSchema.parse(body);

  const mechanic = await mechanicsRepository.create(parsed);
  return NextResponse.json(mechanic, { status: 201 });
}
