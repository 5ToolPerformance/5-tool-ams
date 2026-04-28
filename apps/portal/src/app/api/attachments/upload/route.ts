import { proxyApiRequest } from "@/app/api/_lib/proxy";

export const runtime = "nodejs";

export async function POST(request: Request) {
  return proxyApiRequest(request, "/api/v1/attachments/upload", {
    fallbackError: "Failed to upload attachment",
  });
}
