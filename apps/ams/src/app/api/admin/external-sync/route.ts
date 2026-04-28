import { proxyApiRequest } from "@/app/api/_lib/proxy";

export async function POST(request: Request) {
  return proxyApiRequest(request, "/api/v1/admin/external-sync", {
    fallbackError: "Failed to sync external data",
  });
}
