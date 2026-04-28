import { proxyApiGet } from "@/app/api/_lib/proxy";

export async function GET() {
  return proxyApiGet("/api/v1/injury-taxonomy", {
    fallbackError: "Failed to fetch taxonomy",
  });
}
