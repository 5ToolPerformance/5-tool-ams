import { proxyApiRequest } from "@/app/api/_lib/proxy";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ attachmentId: string }> }
) {
  const { attachmentId } = await context.params;
  return proxyApiRequest(
    request,
    `/api/v1/attachments/${encodeURIComponent(attachmentId)}/effective-date`,
    { fallbackError: "Failed to update effective date" }
  );
}
