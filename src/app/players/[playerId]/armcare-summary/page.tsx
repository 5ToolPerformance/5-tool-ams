// app/(app)/players/[id]/armcare-summary/page.tsx
import { notFound } from "next/navigation";

import { ArmCareSummaryView } from "@/components/players/ArmCareSummaryView";
import { armcareExamsRepository } from "@/lib/services/repository/armcare-exams";

export default async function PlayerArmCareSummaryPage({
  params,
}: {
  params: Promise<{ playerId: string }>;
}) {
  try {
    const { playerId } = await params;
    const summary = await armcareExamsRepository.getPlayerSummary(playerId);

    if (!summary.latestExam) {
      return (
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="mb-4 text-2xl font-bold">No ArmCare Data</h1>
            <p className="text-default-500">
              This player doesn&apos;t have any ArmCare exams yet.
            </p>
          </div>
        </div>
      );
    }

    return <ArmCareSummaryView playerId={playerId} data={summary} />;
  } catch (error) {
    console.error("Error loading ArmCare summary:", error);
    notFound();
  }
}
