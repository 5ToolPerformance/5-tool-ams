// src/app/api/mechanics/import/commit/route.ts
import { NextResponse } from "next/server";

import { z } from "zod";

import { mechanicsRepository } from "@/lib/services/repository/mechanics";

const commitSchema = z.object({
  rows: z.array(
    z.object({
      name: z.string(),
      description: z.string().optional(),
      type: z.enum(["pitching", "hitting", "fielding", "catching", "strength"]),
      tags: z.string().optional(),
    })
  ),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = commitSchema.parse(body);

  await Promise.all(
    parsed.rows.map((row) =>
      mechanicsRepository.create({
        name: row.name,
        description: row.description,
        type: row.type,
        tags: row.tags ? row.tags.split(",").map((t) => t.trim()) : [],
      })
    )
  );

  return NextResponse.json({
    created: parsed.rows.length,
  });
}
