import { proxyApiRequest } from "@/app/api/_lib/proxy";

export async function POST(request: Request) {
  return proxyApiRequest(request, "/api/v1/admin/weekly-usage-reports", {
    fallbackError: "Failed to generate weekly usage report",
  });
}
