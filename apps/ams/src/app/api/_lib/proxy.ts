import { NextResponse } from "next/server";

import { getAuthContext } from "@/application/auth/auth-context";
import { toAuthErrorResponse } from "@/application/auth/http";
import { fetchInternalApi } from "@/lib/server/api-client";

function withRequestSearch(apiPath: string, request?: Request) {
  if (!request) {
    return apiPath;
  }

  const { search } = new URL(request.url);
  return `${apiPath}${search}`;
}

export async function proxyApiGet(
  apiPath: string,
  options: {
    request?: Request;
    fallbackError: string;
  }
) {
  try {
    const ctx = await getAuthContext();
    const response = await fetchInternalApi(ctx, withRequestSearch(apiPath, options.request), {
      method: "GET",
      cache: "no-store",
    });
    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    const authResponse = toAuthErrorResponse(error);
    if (authResponse) return authResponse;

    return NextResponse.json({ error: options.fallbackError }, { status: 502 });
  }
}
