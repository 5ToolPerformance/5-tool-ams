import { NextResponse } from "next/server";

import db from "@/db";
import { getPlayerInjuries } from "@/db/queries/injuries/getPlayerInjuries";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const injuries = await getPlayerInjuries(db, id);

  return NextResponse.json(injuries);
}
