import { proxyApiFile } from "@/app/api/_lib/proxy";

export const runtime = "nodejs";

export async function GET(
  request: Request,
  context: { params: Promise<{ attachmentId: string }> }
) {
  const { attachmentId } = await context.params;
  return proxyApiFile(
    request,
    `/api/v1/attachments/${encodeURIComponent(attachmentId)}/view`,
    { fallbackError: "Failed to generate view link" }
  );
}
