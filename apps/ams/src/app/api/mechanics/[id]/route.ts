import { proxyApiRequest } from "@/app/api/_lib/proxy";

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: Request, { params }: RouteParams) {
  const { id } = await params;

  return proxyApiRequest(request, `/api/v1/mechanics/${encodeURIComponent(id)}`, {
    fallbackError: "Failed to update mechanic",
  });
}

export async function DELETE(request: Request, { params }: RouteParams) {
  const { id } = await params;

  return proxyApiRequest(request, `/api/v1/mechanics/${encodeURIComponent(id)}`, {
    fallbackError: "Failed to delete mechanic",
  });
}
