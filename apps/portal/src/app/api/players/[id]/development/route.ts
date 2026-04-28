import { proxyApiGet } from "@/app/api/_lib/proxy";

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function GET(request: Request, { params }: RouteParams) {
  const { id } = await params;

  return proxyApiGet(`/api/v1/players/${encodeURIComponent(id)}/development`, {
    request,
    fallbackError: "Failed to fetch development data",
  });
}
