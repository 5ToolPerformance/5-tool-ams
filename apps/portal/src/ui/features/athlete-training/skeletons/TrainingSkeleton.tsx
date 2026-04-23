// ui/features/training/skeletons/TrainingSkeleton.tsx
import { SectionSkeleton } from "@/ui/core/athletes/skeletons/SectionSkeleton";

export function TrainingSkeleton() {
  return (
    <div className="space-y-6">
      <SectionSkeleton />
      <SectionSkeleton />
    </div>
  );
}
