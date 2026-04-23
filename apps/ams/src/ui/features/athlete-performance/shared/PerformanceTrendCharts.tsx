"use client";

import { useMemo, useState } from "react";

import { Select, SelectItem } from "@heroui/react";
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/ui/core/primitives/chart";
import type { PerformanceTrend } from "@ams/application/players/performance/getPlayerPerformanceData.types";

interface PerformanceTrendChartsProps {
  trends: PerformanceTrend[];
  featuredTrendKeys?: string[];
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function formatValue(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function getTrendLabel(trend: PerformanceTrend) {
  return `${trend.sourceGroup} - ${trend.label}`;
}

function getDefaultTrendKeys(
  trends: PerformanceTrend[],
  featuredTrendKeys?: string[]
) {
  const trendKeys = new Set(trends.map((trend) => trend.key));
  const featuredKeys =
    featuredTrendKeys?.filter((key) => trendKeys.has(key)) ?? [];
  const remainingKeys = trends
    .map((trend) => trend.key)
    .filter((key) => !featuredKeys.includes(key));

  return [...featuredKeys, ...remainingKeys];
}

type TrendChartPanelProps = {
  ariaLabel: string;
  onSelect: (key: string) => void;
  selectedTrend: PerformanceTrend;
  trends: PerformanceTrend[];
};

function TrendChartPanel({
  ariaLabel,
  onSelect,
  selectedTrend,
  trends,
}: TrendChartPanelProps) {
  const data = selectedTrend.points.map((point) => ({
    date: formatDate(point.date),
    value: point.value,
  }));

  return (
    <div className="space-y-3 rounded-lg border border-divider p-4">
      <div className="space-y-1">
        <Select
          aria-label={ariaLabel}
          size="sm"
          selectedKeys={new Set([selectedTrend.key])}
          onSelectionChange={(keys) => {
            const [first] = Array.from(keys);
            if (first != null) {
              onSelect(String(first));
            }
          }}
          className="max-w-sm"
          classNames={{
            trigger: "h-9 min-h-9 px-0 shadow-none",
            value: "text-sm font-semibold text-foreground",
          }}
          renderValue={() => <span>{getTrendLabel(selectedTrend)}</span>}
          variant="underlined"
        >
          {trends.map((trend) => (
            <SelectItem key={trend.key} textValue={getTrendLabel(trend)}>
              {getTrendLabel(trend)}
            </SelectItem>
          ))}
        </Select>
        <p className="text-xs text-muted-foreground">
          {selectedTrend.sourceGroup}
          {selectedTrend.unit ? ` - ${selectedTrend.unit}` : ""}
        </p>
      </div>
      <ChartContainer
        config={{
          value: {
            label: selectedTrend.label,
            color: "hsl(var(--primary))",
          },
        }}
        className="h-56"
      >
        <LineChart data={data}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            width={36}
            tickFormatter={(value) =>
              typeof value === "number" ? formatValue(value) : value
            }
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                hideLabel
                formatter={(value) => {
                  const label =
                    typeof value === "number"
                      ? formatValue(value)
                      : String(value);
                  return (
                    <span className="font-mono text-foreground">
                      {label}
                      {selectedTrend.unit ? ` ${selectedTrend.unit}` : ""}
                    </span>
                  );
                }}
              />
            }
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="var(--color-value)"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        </LineChart>
      </ChartContainer>
    </div>
  );
}

export function PerformanceTrendCharts({
  trends,
  featuredTrendKeys,
}: PerformanceTrendChartsProps) {
  const defaultTrendKeys = useMemo(() => {
    return getDefaultTrendKeys(trends, featuredTrendKeys);
  }, [featuredTrendKeys, trends]);
  const [primaryTrendKey, setPrimaryTrendKey] = useState<string | null>(
    defaultTrendKeys[0] ?? null
  );
  const [comparisonTrendKey, setComparisonTrendKey] = useState<string | null>(
    defaultTrendKeys[1] ?? null
  );

  if (trends.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-divider p-4 text-sm text-muted-foreground">
        No time-series metrics are available yet.
      </div>
    );
  }

  const primaryTrend =
    trends.find((trend) => trend.key === primaryTrendKey) ?? trends[0];
  const comparisonTrend =
    trends.find((trend) => trend.key === comparisonTrendKey) ??
    trends.find((trend) => trend.key !== primaryTrend.key);
  const primaryOptions =
    trends.length > 1 && comparisonTrend
      ? trends.filter((trend) => trend.key !== comparisonTrend.key)
      : trends;
  const comparisonOptions =
    trends.length > 1
      ? trends.filter((trend) => trend.key !== primaryTrend.key)
      : trends;

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      <TrendChartPanel
        ariaLabel="Primary trend metric"
        onSelect={setPrimaryTrendKey}
        selectedTrend={primaryTrend}
        trends={primaryOptions}
      />
      {comparisonTrend && (
        <TrendChartPanel
          ariaLabel="Comparison trend metric"
          onSelect={setComparisonTrendKey}
          selectedTrend={comparisonTrend}
          trends={comparisonOptions}
        />
      )}
    </div>
  );
}
