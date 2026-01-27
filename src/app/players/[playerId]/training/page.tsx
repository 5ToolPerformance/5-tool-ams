import { Suspense } from "react";

import { getLessonsByPlayerId } from "@/db/queries/lessons/lessonQueries";
import { TrainingTab } from "@/ui/features/athlete-training/TrainingTab";
import { TrainingSkeleton } from "@/ui/features/athlete-training/skeletons/TrainingSkeleton";

export default async function TrainingPage({
  params,
}: {
  params: Promise<{ playerId: string }>;
}) {
  const { playerId } = await params;
  const playerLessons = await getLessonsByPlayerId(playerId);
  return (
    <Suspense fallback={<TrainingSkeleton />}>
      <TrainingTab lessons={playerLessons} />
    </Suspense>
  );
}
