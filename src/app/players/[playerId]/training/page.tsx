import { Suspense } from "react";

import { TrainingTab } from "@/ui/features/athlete-training/TrainingTab";
import { TrainingSkeleton } from "@/ui/features/athlete-training/skeletons/TrainingSkeleton";

export default function TrainingPage() {
  return (
    <Suspense fallback={<TrainingSkeleton />}>
      <TrainingTab />
    </Suspense>
  );
}
