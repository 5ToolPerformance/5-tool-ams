import { proxyApiRequest } from "@/app/api/_lib/proxy";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  return proxyApiRequest(
    request,
    `/api/v1/drills/${encodeURIComponent(id)}/files/link`,
    { fallbackError: "Failed to link drill file" }
  );
}
