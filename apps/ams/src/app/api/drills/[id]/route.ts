import { proxyApiGet, proxyApiRequest } from "@/app/api/_lib/proxy";

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, { params }: RouteParams) {
  const { id } = await params;

  return proxyApiGet(`/api/v1/drills/${encodeURIComponent(id)}`, {
    fallbackError: "Failed to fetch drill",
  });
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const { id } = await params;

  return proxyApiRequest(request, `/api/v1/drills/${encodeURIComponent(id)}`, {
    fallbackError: "Failed to update drill",
  });
}

export async function DELETE(request: Request, { params }: RouteParams) {
  const { id } = await params;

  return proxyApiRequest(request, `/api/v1/drills/${encodeURIComponent(id)}`, {
    fallbackError: "Failed to delete drill",
  });
}
