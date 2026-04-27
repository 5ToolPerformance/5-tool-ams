import { NextResponse } from "next/server";

import { getAuthContext } from "@/application/auth/auth-context";
import { toAuthErrorResponse } from "@/application/auth/http";
import { fetchInternalApi } from "@/lib/server/api-client";

export async function GET() {
  try {
    const ctx = await getAuthContext();
    const response = await fetchInternalApi(ctx, "/api/v1/coaches", {
      method: "GET",
      cache: "no-store",
    });
    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    const authResponse = toAuthErrorResponse(error);
    if (authResponse) return authResponse;

    return NextResponse.json({ error: "Failed to fetch coaches" }, { status: 502 });
  }
}
