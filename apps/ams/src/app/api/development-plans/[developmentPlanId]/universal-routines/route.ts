import { proxyApiRequest } from "@/app/api/_lib/proxy";

type RouteParams = {
  params: Promise<{ developmentPlanId: string }>;
};

export async function POST(request: Request, { params }: RouteParams) {
  const { developmentPlanId } = await params;

  return proxyApiRequest(
    request,
    `/api/v1/development-plans/${encodeURIComponent(developmentPlanId)}/universal-routines`,
    {
      fallbackError: "Failed to assign universal routine.",
    }
  );
}
