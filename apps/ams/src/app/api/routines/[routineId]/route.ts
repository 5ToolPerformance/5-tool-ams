import { proxyApiRequest } from "@/app/api/_lib/proxy";

type RouteParams = {
  params: Promise<{ routineId: string }>;
};

export async function PATCH(request: Request, { params }: RouteParams) {
  const { routineId } = await params;

  return proxyApiRequest(
    request,
    `/api/v1/routines/${encodeURIComponent(routineId)}`,
    {
      fallbackError: "Failed to update routine.",
    }
  );
}
