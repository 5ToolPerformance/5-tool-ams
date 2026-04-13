"use client";

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
} from "@/components/ui/chart";
import type { PerformanceTrend } from "@/application/players/performance/getPlayerPerformanceData.types";

interface PerformanceTrendChartsProps {
  trends: PerformanceTrend[];
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

export function PerformanceTrendCharts({
  trends,
}: PerformanceTrendChartsProps) {
  if (trends.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-divider p-4 text-sm text-muted-foreground">
        No time-series metrics are available yet.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {trends.map((trend) => {
        const data = trend.points.map((point) => ({
          date: formatDate(point.date),
          value: point.value,
        }));

        return (
          <div
            key={trend.key}
            className="space-y-3 rounded-lg border border-divider p-4"
          >
            <div>
              <p className="text-sm font-semibold">{trend.label}</p>
              <p className="text-xs text-muted-foreground">
                {trend.sourceGroup}
                {trend.unit ? ` - ${trend.unit}` : ""}
              </p>
            </div>
            <ChartContainer
              config={{
                value: {
                  label: trend.label,
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
                            {trend.unit ? ` ${trend.unit}` : ""}
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
      })}
    </div>
  );
}
