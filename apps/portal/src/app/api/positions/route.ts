import { proxyApiGet } from "@/app/api/_lib/proxy";

export async function GET() {
  return proxyApiGet("/api/v1/positions", {
    fallbackError: "Failed to fetch positions",
  });
}
