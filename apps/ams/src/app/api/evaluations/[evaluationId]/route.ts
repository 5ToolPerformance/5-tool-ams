import { proxyApiGet, proxyApiRequest } from "@/app/api/_lib/proxy";

type RouteParams = {
  params: Promise<{ evaluationId: string }>;
};

export async function GET(_request: Request, { params }: RouteParams) {
  const { evaluationId } = await params;

  return proxyApiGet(`/api/v1/evaluations/${encodeURIComponent(evaluationId)}`, {
    fallbackError: "Failed to load evaluation.",
  });
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const { evaluationId } = await params;

  return proxyApiRequest(
    request,
    `/api/v1/evaluations/${encodeURIComponent(evaluationId)}`,
    {
      fallbackError: "Failed to update evaluation.",
    }
  );
}
