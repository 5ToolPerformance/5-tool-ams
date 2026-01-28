import { Suspense } from "react";

import { getTrainingTabData } from "@/application/players/training";
import { TrainingTab } from "@/ui/features/athlete-training/TrainingTab";
import { TrainingSkeleton } from "@/ui/features/athlete-training/skeletons/TrainingSkeleton";

export default async function TrainingPage({
  params,
}: {
  params: Promise<{ playerId: string }>;
}) {
  const { playerId } = await params;
  const { lessons, summary } = await getTrainingTabData(playerId);
  return (
    <Suspense fallback={<TrainingSkeleton />}>
      <TrainingTab lessons={lessons} summary={summary} playerId={playerId} />
    </Suspense>
  );
}
