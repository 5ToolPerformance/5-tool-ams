import { proxyApiGet, proxyApiRequest } from "@/app/api/_lib/proxy";

export async function GET() {
  return proxyApiGet("/api/v1/drills", {
    fallbackError: "Failed to list drills",
  });
}

export async function POST(request: Request) {
  return proxyApiRequest(request, "/api/v1/drills", {
    fallbackError: "Failed to create drill",
  });
}
