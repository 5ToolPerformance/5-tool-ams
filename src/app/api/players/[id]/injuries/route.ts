import { NextResponse } from "next/server";

import db from "@/db";
import { getPlayerInjuries } from "@/db/queries/injuries/getPlayerInjuries";

export async function GET(
  _req: Request,
  { params }: { params: { playerId: string } }
) {
  const injuries = await getPlayerInjuries(db, params.playerId);

  return NextResponse.json(injuries);
}
