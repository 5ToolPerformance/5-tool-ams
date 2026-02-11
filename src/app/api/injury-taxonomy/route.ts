import { NextResponse } from "next/server";

import { getInjuryTaxonomy } from "@/application/injuries/getInjuryTaxonomy";
import db from "@/db";

export async function GET() {
  const taxonomy = await getInjuryTaxonomy(db);

  return NextResponse.json(taxonomy);
}
