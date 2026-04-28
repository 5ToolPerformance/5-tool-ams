import { proxyApiFile } from "@/app/api/_lib/proxy";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ attachmentId: string }>;
};

export async function GET(request: Request, context: RouteContext) {
  const { attachmentId } = await context.params;
  return proxyApiFile(
    request,
    `/api/v1/attachments/${encodeURIComponent(attachmentId)}/stream`,
    { fallbackError: "Failed to stream attachment" }
  );
}

export async function HEAD(request: Request, context: RouteContext) {
  const { attachmentId } = await context.params;
  return proxyApiFile(
    request,
    `/api/v1/attachments/${encodeURIComponent(attachmentId)}/stream`,
    { fallbackError: "Failed to read attachment metadata" }
  );
}
