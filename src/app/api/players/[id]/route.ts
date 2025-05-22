import { NextResponse } from "next/server";

import { getPlayerInformationByUserId } from "@/lib/db/playerInformation";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const data = await getPlayerInformationByUserId(params.id);
  if (!data) return new NextResponse("Not found", { status: 404 });
  return NextResponse.json(data);
}
