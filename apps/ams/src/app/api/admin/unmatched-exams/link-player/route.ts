import { proxyApiRequest } from "@/app/api/_lib/proxy";

export async function POST(request: Request) {
  return proxyApiRequest(request, "/api/v1/admin/unmatched-exams/link-player", {
    fallbackError: "Failed to link ArmCare player",
  });
}
