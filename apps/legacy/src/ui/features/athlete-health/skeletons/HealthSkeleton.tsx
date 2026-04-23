import { SectionSkeleton } from "@/ui/core/athletes/skeletons/SectionSkeleton";

export function HealthSkeleton() {
  return (
    <div className="space-y-6">
      <SectionSkeleton />
      <SectionSkeleton />
      <SectionSkeleton />
    </div>
  );
}
