import { NextResponse } from "next/server";

import writeupRepository from "@/lib/services/repository";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const writeup = await writeupRepository.createWriteup(body);

    return NextResponse.json({ success: true, data: writeup }, { status: 201 });
  } catch (error) {
    console.error("[WriteupRoute] POST - Error: ", error);
    return NextResponse.json(
      { success: false, error: "Failed to create writeup" },
      { status: 500 }
    );
  }
}
