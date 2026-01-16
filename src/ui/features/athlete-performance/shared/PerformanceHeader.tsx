// ui/features/athlete-performance/shared/PerformanceHeader.tsx
import { Card, CardBody } from "@heroui/react";

import {
  DisciplineSelector,
  type DisciplineOption,
} from "./DisciplineSelector";
import {
  PerformanceFilters,
  type PerformanceFilterConfig,
} from "./PerformanceFilters";
import { CoverageIndicator, type CoverageSystem } from "./CoverageIndicator";
import { TimeRangeSelector, type TimeRangeOption } from "./TimeRangeSelector";
import { CompareToggle } from "./CompareToggle";

interface PerformanceHeaderProps {
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
  showCompareToggle?: boolean;
}

export function PerformanceHeader({
  title = "Performance",
  description,
  disciplines,
  timeRanges,
  selectedDiscipline,
  selectedRange,
  filters = [],
  filterValues,
  coverage,
  showCompareToggle = false,
}: PerformanceHeaderProps) {
  return (
    <Card shadow="sm">
      <CardBody className="space-y-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-1">
            <h1 className="text-xl font-semibold">{title}</h1>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <DisciplineSelector
              disciplines={disciplines}
              selectedKey={selectedDiscipline}
            />
            <TimeRangeSelector
              ranges={timeRanges}
              selectedKey={selectedRange}
            />
            {showCompareToggle && <CompareToggle />}
          </div>
        </div>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          {filters.length > 0 && (
            <PerformanceFilters filters={filters} values={filterValues} />
          )}
          {coverage && (
            <CoverageIndicator
              sampleSizeLabel={coverage.sampleSizeLabel}
              systems={coverage.systems}
              warnings={coverage.warnings}
            />
          )}
        </div>
      </CardBody>
    </Card>
  );
}
