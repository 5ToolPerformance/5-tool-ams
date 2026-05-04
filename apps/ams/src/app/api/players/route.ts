import { proxyApiGet, proxyApiRequest } from "@/app/api/_lib/proxy";

export async function GET() {
  return proxyApiGet("/api/v1/players", {
    fallbackError: "Failed to fetch players",
  });
}

export async function POST(request: Request) {
  return proxyApiRequest(request, "/api/v1/players", {
    fallbackError: "Failed to create player",
  });
}
