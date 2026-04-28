import { proxyApiRequest } from "@/app/api/_lib/proxy";

export async function POST(request: Request) {
  return proxyApiRequest(request, "/api/v1/universal-routines", {
    fallbackError: "Failed to create universal routine.",
  });
}
