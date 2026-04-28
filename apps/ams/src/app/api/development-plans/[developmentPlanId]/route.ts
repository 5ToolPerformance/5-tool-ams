import { proxyApiGet, proxyApiRequest } from "@/app/api/_lib/proxy";

type RouteParams = {
  params: Promise<{ developmentPlanId: string }>;
};

export async function GET(_request: Request, { params }: RouteParams) {
  const { developmentPlanId } = await params;

  return proxyApiGet(
    `/api/v1/development-plans/${encodeURIComponent(developmentPlanId)}`,
    {
      fallbackError: "Failed to load development plan.",
    }
  );
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const { developmentPlanId } = await params;

  return proxyApiRequest(
    request,
    `/api/v1/development-plans/${encodeURIComponent(developmentPlanId)}`,
    {
      fallbackError: "Failed to update development plan.",
    }
  );
}
