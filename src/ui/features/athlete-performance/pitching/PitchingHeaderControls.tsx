// ui/features/athlete-performance/pitching/PitchingHeaderControls.tsx
import { PerformanceHeader } from "@/ui/features/athlete-performance/shared/PerformanceHeader";
import type { DisciplineOption } from "@/ui/features/athlete-performance/shared/DisciplineSelector";
import type { PerformanceFilterConfig } from "@/ui/features/athlete-performance/shared/PerformanceFilters";
import type { CoverageSystem } from "@/ui/features/athlete-performance/shared/CoverageIndicator";

interface PitchingHeaderControlsProps {
  title?: string;
  description?: string;
  disciplines?: DisciplineOption[];
  selectedDiscipline?: string;
  filters?: PerformanceFilterConfig[];
  filterValues?: Record<string, string>;
  coverage?: {
    sampleSizeLabel?: string;
    systems: CoverageSystem[];
    warnings?: string[];
  };
}

export function PitchingHeaderControls({
  title = "Pitching Performance",
  description = "Velocity, workload, and session context together.",
  disciplines,
  selectedDiscipline,
  filters,
  filterValues,
  coverage,
}: PitchingHeaderControlsProps) {
  return (
    <PerformanceHeader
      title={title}
      description={description}
      disciplines={disciplines}
      selectedDiscipline={selectedDiscipline}
      filters={filters}
      filterValues={filterValues}
      coverage={coverage}
    />
  );
}
