import { proxyApiGet, proxyApiRequest } from "@/app/api/_lib/proxy";

export async function GET() {
  return proxyApiGet("/api/v1/mechanics", {
    fallbackError: "Failed to fetch mechanics",
  });
}

export async function POST(request: Request) {
  return proxyApiRequest(request, "/api/v1/mechanics", {
    fallbackError: "Failed to create mechanic",
  });
}
