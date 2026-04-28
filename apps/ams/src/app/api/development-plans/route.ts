import { proxyApiRequest } from "@/app/api/_lib/proxy";

export async function POST(request: Request) {
  return proxyApiRequest(request, "/api/v1/development-plans", {
    fallbackError: "Failed to create development plan.",
  });
}
