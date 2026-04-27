import { proxyApiGet } from "@/app/api/_lib/proxy";

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, { params }: RouteParams) {
  const { id } = await params;

  return proxyApiGet(`/api/v1/players/${encodeURIComponent(id)}/motor-preference`, {
    fallbackError: "Failed to fetch motor preference",
  });
}
