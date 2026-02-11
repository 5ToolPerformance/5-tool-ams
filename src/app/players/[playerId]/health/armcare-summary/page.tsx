import Link from "next/link";
import { notFound } from "next/navigation";

import { Button } from "@heroui/react";
import { ArrowLeft } from "lucide-react";

import { ArmCareSummaryView } from "@/components/players/ArmCareSummaryView";
import { armcareExamsRepository } from "@/lib/services/repository/armcare-exams";

export default async function PlayerHealthArmCareSummaryPage({
  params,
}: {
  params: Promise<{ playerId: string }>;
}) {
  try {
    const { playerId } = await params;
    const summary = await armcareExamsRepository.getPlayerSummary(playerId);

    if (!summary.latestExam) {
      return (
        <div className="space-y-6">
          <Button
            as={Link}
            href={`/players/${playerId}/health`}
            variant="flat"
            startContent={<ArrowLeft className="h-4 w-4" />}
          >
            Back to Health
          </Button>

          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <h1 className="mb-4 text-2xl font-bold">No ArmCare Data</h1>
              <p className="text-default-500">
                This player doesn&apos;t have any ArmCare exams yet.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <Button
          as={Link}
          href={`/players/${playerId}/health`}
          variant="flat"
          startContent={<ArrowLeft className="h-4 w-4" />}
        >
          Back to Health
        </Button>

        <ArmCareSummaryView playerId={playerId} data={summary} />
      </div>
    );
  } catch (error) {
    console.error("Error loading ArmCare summary:", error);
    notFound();
  }
}
