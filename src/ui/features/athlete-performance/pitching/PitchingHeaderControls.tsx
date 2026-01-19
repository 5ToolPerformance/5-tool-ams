// ui/features/athlete-performance/pitching/PitchingHeaderControls.tsx
import { PerformanceHeader } from "@/ui/features/athlete-performance/shared/PerformanceHeader";
import type { DisciplineOption } from "@/ui/features/athlete-performance/shared/DisciplineSelector";
import type { TimeRangeOption } from "@/ui/features/athlete-performance/shared/TimeRangeSelector";
import type { PerformanceFilterConfig } from "@/ui/features/athlete-performance/shared/PerformanceFilters";
import type { CoverageSystem } from "@/ui/features/athlete-performance/shared/CoverageIndicator";

interface PitchingHeaderControlsProps {
  title?: string;
  description?: string;
  disciplines?: DisciplineOption[];
  timeRanges?: TimeRangeOption[];
  selectedDiscipline?: string;
  selectedRange?: string;
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
  timeRanges,
  selectedDiscipline,
  selectedRange,
  filters,
  filterValues,
  coverage,
}: PitchingHeaderControlsProps) {
  return (
    <PerformanceHeader
      title={title}
      description={description}
      disciplines={disciplines}
      timeRanges={timeRanges}
      selectedDiscipline={selectedDiscipline}
      selectedRange={selectedRange}
      filters={filters}
      filterValues={filterValues}
      coverage={coverage}
    />
  );
}
