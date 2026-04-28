import { proxyApiGet } from "@/app/api/_lib/proxy";

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, { params }: RouteParams) {
  const { id } = await params;

  return proxyApiGet(`/api/v1/users/${encodeURIComponent(id)}`, {
    fallbackError: "Failed to fetch user",
  });
}
