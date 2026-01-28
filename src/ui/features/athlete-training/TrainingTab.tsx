// ui/features/training/TrainingTab.tsx
import { Suspense } from "react";

import { LessonCardData } from "@/db/queries/lessons/lessonQueries.types";
import { TrainingSummaryData } from "@/domain/player/training";
import { SectionSkeleton } from "@/ui/core/athletes/skeletons/SectionSkeleton";
import { InteractiveLessonList } from "@/ui/features/lessons/lessonCard";

import { TrainingSummary } from "./TrainingSummary";

interface TrainingTabProps {
  lessons: LessonCardData[];
  summary: TrainingSummaryData;
}

export async function TrainingTab({ lessons, summary }: TrainingTabProps) {
  return (
    <div className="space-y-6">
      <Suspense fallback={<SectionSkeleton />}>
        <TrainingSummary data={summary} />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <InteractiveLessonList lessons={lessons} viewContext="player" />
      </Suspense>
    </div>
  );
}
