import { proxyApiGet } from "@/app/api/_lib/proxy";

export async function GET() {
  return proxyApiGet("/api/v1/lesson-form/players", {
    fallbackError: "Failed to fetch players",
  });
}
