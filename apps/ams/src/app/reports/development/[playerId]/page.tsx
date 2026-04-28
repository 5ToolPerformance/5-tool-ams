import Link from "next/link";

import { Button } from "@heroui/react";

import { getDevelopmentReportData } from "@ams/application/players/development";
import { requirePlayerRouteAccess } from "@/application/auth/page-guards";
import { DevelopmentReportPreview } from "@/ui/features/athlete-development/DevelopmentReportPreview";
import { DevelopmentReportPrintActions } from "@/ui/features/athlete-development/DevelopmentReportPrintActions";

interface DevelopmentReportPageProps {
  params: Promise<{ playerId: string }>;
  searchParams: Promise<{
    discipline?: string | string[];
    includeEvidence?: string | string[];
    routineIds?: string | string[];
  }>;
}

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function parseRoutineIds(value: string | string[] | undefined) {
  if (!value) return [];

  const parts = (Array.isArray(value) ? value : [value])
    .flatMap((item) => item.split(","))
    .map((item) => item.trim())
    .filter(Boolean);

  return Array.from(new Set(parts));
}

export const dynamic = "force-dynamic";

export default async function DevelopmentReportPage({
  params,
  searchParams,
}: DevelopmentReportPageProps) {
  const { playerId } = await params;
  await requirePlayerRouteAccess(playerId);

  const resolvedSearchParams = await searchParams;
  const disciplineId = firstValue(resolvedSearchParams.discipline);
  const includeEvidence =
    firstValue(resolvedSearchParams.includeEvidence) === "1";
  const routineIds = parseRoutineIds(resolvedSearchParams.routineIds);

  if (!disciplineId) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <div className="mb-6 print:hidden">
          <Button
            as={Link}
            href={`/players/${playerId}/development`}
            variant="flat"
          >
            Back to Development
          </Button>
        </div>
        <div className="rounded-2xl border border-default-200 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-semibold">Report unavailable</h1>
          <p className="mt-2 text-sm text-default-600">
            A discipline is required before a development report can be generated.
          </p>
        </div>
      </div>
    );
  }

  const data = await getDevelopmentReportData({
    playerId,
    disciplineId,
    includeEvidence,
    routineIds,
  });

  if (!data) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <div className="mb-6 print:hidden">
          <Button
            as={Link}
            href={`/players/${playerId}/development?discipline=${disciplineId}`}
            variant="flat"
          >
            Back to Development
          </Button>
        </div>
        <div className="rounded-2xl border border-default-200 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-semibold">Report unavailable</h1>
          <p className="mt-2 text-sm text-default-600">
            The active development plan or its linked evaluation could not be loaded for this discipline.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="development-report-page bg-[#f4f1ea] px-4 py-8 print:bg-white sm:px-6">
      <div className="mx-auto max-w-5xl">
        <DevelopmentReportPrintActions />
        <DevelopmentReportPreview data={data} />
      </div>
    </div>
  );
}
