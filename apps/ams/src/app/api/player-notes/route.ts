import { proxyApiGet, proxyApiRequest } from "@/app/api/_lib/proxy";

export async function GET(request: Request) {
  return proxyApiGet("/api/v1/player-notes", {
    request,
    fallbackError: "Failed to fetch notes",
  });
}

export async function POST(request: Request) {
  return proxyApiRequest(request, "/api/v1/player-notes", {
    fallbackError: "Failed to create note",
  });
}
