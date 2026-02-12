import { NextResponse } from "next/server";

import { getInjuryTaxonomy } from "@/application/injuries/getInjuryTaxonomy";
import db from "@/db";
import { getAuthContext } from "@/lib/auth/auth-context";
import { toAuthErrorResponse } from "@/lib/auth/http";

export async function GET() {
  try {
    await getAuthContext();
    const taxonomy = await getInjuryTaxonomy(db);

    return NextResponse.json(taxonomy);
  } catch (error) {
    const authResponse = toAuthErrorResponse(error);
    if (authResponse) return authResponse;
    return NextResponse.json({ error: "Failed to fetch taxonomy" }, { status: 500 });
  }
}
