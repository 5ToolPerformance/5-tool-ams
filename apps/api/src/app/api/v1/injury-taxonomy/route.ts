import { NextResponse } from "next/server";

import { getInjuryTaxonomy } from "@ams/application/injuries/getInjuryTaxonomy";
import db from "@ams/db";
import { getAuthContext } from "@/application/auth/auth-context";
import { toAuthErrorResponse } from "@/application/auth/http";

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
