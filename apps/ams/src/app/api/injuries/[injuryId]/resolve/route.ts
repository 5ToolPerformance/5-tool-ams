import { proxyApiRequest } from "@/app/api/_lib/proxy";

type RouteParams = {
  params: Promise<{ injuryId: string }>;
};

export async function PATCH(request: Request, { params }: RouteParams) {
  const { injuryId } = await params;

  return proxyApiRequest(
    request,
    `/api/v1/injuries/${encodeURIComponent(injuryId)}/resolve`,
    {
      fallbackError: "Failed to resolve injury",
    }
  );
}
