import { proxyApiGet, proxyApiRequest } from "@/app/api/_lib/proxy";

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, { params }: RouteParams) {
  const { id } = await params;

  return proxyApiGet(`/api/v1/players/${encodeURIComponent(id)}`, {
    fallbackError: "Failed to fetch player",
  });
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const { id } = await params;

  return proxyApiRequest(
    request,
    `/api/v1/players/${encodeURIComponent(id)}`,
    {
      fallbackError: "Failed to update player",
    }
  );
}
