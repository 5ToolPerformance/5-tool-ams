// ui/features/training/TrainingTab.tsx
import { Suspense } from "react";

import { SectionSkeleton } from "@/ui/core/athletes/skeletons/SectionSkeleton";

import { LessonTimeline } from "./LessonTimeline";
import { TrainingSummary } from "./TrainingSummary";

export async function TrainingTab() {
  return (
    <div className="space-y-6">
      <Suspense fallback={<SectionSkeleton />}>
        <TrainingSummary />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <LessonTimeline />
      </Suspense>
    </div>
  );
}
