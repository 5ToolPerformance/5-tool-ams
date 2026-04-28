import { proxyApiRequest } from "@/app/api/_lib/proxy";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ attachmentId: string }> }
) {
  const { attachmentId } = await context.params;
  return proxyApiRequest(
    request,
    `/api/v1/attachments/${encodeURIComponent(attachmentId)}/link`,
    { fallbackError: "Failed to update attachment link" }
  );
}
