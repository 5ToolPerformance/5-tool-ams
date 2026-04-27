import { proxyApiGet } from "@/app/api/_lib/proxy";

export async function GET(request: Request) {
  return proxyApiGet("/api/v1/reports/retrieve-data", {
    request,
    fallbackError: "Failed to fetch report data",
  });
}
