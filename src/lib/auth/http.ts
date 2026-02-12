import { NextResponse } from "next/server";

import { AuthError } from "./auth-context";

export function toAuthErrorResponse(error: unknown) {
  if (error instanceof AuthError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  return null;
}
