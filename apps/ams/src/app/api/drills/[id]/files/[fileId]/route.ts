import { proxyApiRequest } from "@/app/api/_lib/proxy";

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string; fileId: string }> }
) {
  const { id, fileId } = await context.params;
  return proxyApiRequest(
    request,
    `/api/v1/drills/${encodeURIComponent(id)}/files/${encodeURIComponent(
      fileId
    )}`,
    { fallbackError: "Failed to delete drill file" }
  );
}
