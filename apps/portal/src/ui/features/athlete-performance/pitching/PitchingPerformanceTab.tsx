import { PerformanceEmptyState } from "@/ui/features/athlete-performance/shared/PerformanceEmptyState";

export function PitchingPerformanceTab() {
  return (
    <PerformanceEmptyState
      title="Pitching evidence is not configured yet"
      description="Pitching remains available in the performance area, but this pass only surfaces evaluation evidence from the existing strength, HitTrax, and Blast tables."
    />
  );
}
