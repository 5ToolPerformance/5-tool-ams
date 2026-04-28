import { proxyApiRequest } from "@/app/api/_lib/proxy";

export const runtime = "nodejs";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  return proxyApiRequest(
    request,
    `/api/v1/drills/${encodeURIComponent(id)}/files`,
    { fallbackError: "Failed to upload drill file" }
  );
}
