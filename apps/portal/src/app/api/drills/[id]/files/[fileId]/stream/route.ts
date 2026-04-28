import { proxyApiFile } from "@/app/api/_lib/proxy";

export const runtime = "nodejs";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string; fileId: string }> }
) {
  const { id, fileId } = await context.params;
  return proxyApiFile(
    request,
    `/api/v1/drills/${encodeURIComponent(id)}/files/${encodeURIComponent(
      fileId
    )}/stream`,
    { fallbackError: "Failed to stream drill file" }
  );
}
