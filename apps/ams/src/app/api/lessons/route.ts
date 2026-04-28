import { proxyApiGet, proxyApiRequest } from "@/app/api/_lib/proxy";

export async function GET(request: Request) {
  return proxyApiGet("/api/v1/lessons", {
    request,
    fallbackError: "Failed to fetch lessons",
  });
}

export async function POST(request: Request) {
  return proxyApiRequest(request, "/api/v1/lessons", {
    fallbackError: "Failed to create lesson",
  });
}
