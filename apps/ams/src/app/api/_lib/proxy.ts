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

async function buildProxyRequestInit(request: Request): Promise<RequestInit> {
  const headers = new Headers();
  const contentType = request.headers.get("content-type");
  if (contentType) {
    headers.set("Content-Type", contentType);
  }

  const init: RequestInit = {
    method: request.method,
    headers,
    cache: "no-store",
  };

  if (request.method !== "GET" && request.method !== "HEAD") {
    const body = await request.arrayBuffer();
    init.body = body.byteLength > 0 ? body : undefined;
  }

  return init;
}

export async function proxyApiRequest(
  request: Request,
  apiPath: string,
  options: {
    fallbackError: string;
  }
) {
  try {
    const ctx = await getAuthContext();
    const response = await fetchInternalApi(
      ctx,
      withRequestSearch(apiPath, request),
      await buildProxyRequestInit(request)
    );
    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    const authResponse = toAuthErrorResponse(error);
    if (authResponse) return authResponse;

    return NextResponse.json({ error: options.fallbackError }, { status: 502 });
  }
}

const FILE_RESPONSE_HEADERS = [
  "Content-Type",
  "Content-Length",
  "Content-Disposition",
  "Cache-Control",
  "Accept-Ranges",
  "Content-Range",
] as const;

function buildFileProxyResponseHeaders(response: Response) {
  const headers = new Headers();

  for (const header of FILE_RESPONSE_HEADERS) {
    const value = response.headers.get(header);
    if (value) {
      headers.set(header, value);
    }
  }

  return headers;
}

function buildFileProxyRequestHeaders(request: Request) {
  const headers = new Headers();
  const range = request.headers.get("range");

  if (range) {
    headers.set("Range", range);
  }

  return headers;
}

export async function proxyApiFile(
  request: Request,
  apiPath: string,
  options: {
    fallbackError: string;
  }
) {
  try {
    const ctx = await getAuthContext();
    const response = await fetchInternalApi(ctx, withRequestSearch(apiPath, request), {
      method: request.method,
      headers: buildFileProxyRequestHeaders(request),
      cache: "no-store",
    });

    return new Response(request.method === "HEAD" ? null : response.body, {
      status: response.status,
      headers: buildFileProxyResponseHeaders(response),
    });
  } catch (error) {
    const authResponse = toAuthErrorResponse(error);
    if (authResponse) return authResponse;

    return NextResponse.json({ error: options.fallbackError }, { status: 502 });
  }
}
