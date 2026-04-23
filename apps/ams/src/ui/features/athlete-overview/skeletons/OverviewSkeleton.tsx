// ui/features/overview/skeletons/OverviewSkeleton.tsx
import { SectionSkeleton } from "@/ui/core/athletes/skeletons/SectionSkeleton";

export function OverviewSkeleton() {
  return (
    <div className="space-y-6">
      <SectionSkeleton />
      <SectionSkeleton />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SectionSkeleton />
        <SectionSkeleton />
      </div>
    </div>
  );
}
