// ui/features/athlete-performance/hitting/HittingHeaderControls.tsx
import { PerformanceHeader } from "@/ui/features/athlete-performance/shared/PerformanceHeader";
import type { DisciplineOption } from "@/ui/features/athlete-performance/shared/DisciplineSelector";
import type { TimeRangeOption } from "@/ui/features/athlete-performance/shared/TimeRangeSelector";
import type { PerformanceFilterConfig } from "@/ui/features/athlete-performance/shared/PerformanceFilters";
import type { CoverageSystem } from "@/ui/features/athlete-performance/shared/CoverageIndicator";

interface HittingHeaderControlsProps {
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

export function HittingHeaderControls({
  title = "Hitting Performance",
  description = "Trends, lesson context, and session detail in one view.",
  disciplines,
  timeRanges,
  selectedDiscipline,
  selectedRange,
  filters,
  filterValues,
  coverage,
}: HittingHeaderControlsProps) {
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
