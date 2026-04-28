import { proxyApiGet } from "@/app/api/_lib/proxy";

export async function GET() {
  return proxyApiGet("/api/v1/coaches", {
    fallbackError: "Failed to fetch coaches",
  });
}
