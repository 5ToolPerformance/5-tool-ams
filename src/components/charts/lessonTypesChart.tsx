// components/LessonTypesPieChart.tsx
"use client";

import { Cell, Pie, PieChart } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// components/LessonTypesPieChart.tsx

interface LessonTypesPieChartProps {
  lessonTypes: Record<string, number>;
}

export function LessonTypesPieChart({ lessonTypes }: LessonTypesPieChartProps) {
  // Transform lessonTypes object into array for Recharts
  const pieData = Object.entries(lessonTypes).map(([type, count]) => ({
    name: type,
    value: count,
    fill: `var(--color-${type})`,
  }));

  // Chart configuration for shadcn
  const chartConfig: ChartConfig = Object.keys(lessonTypes).reduce(
    (acc, type, index) => {
      const colors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];
      acc[type] = {
        label: type.charAt(0).toUpperCase() + type.slice(1),
        color: colors[index % colors.length],
      };
      return acc;
    },
    {} as ChartConfig
  );

  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Pie
          data={pieData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          dataKey="value"
        >
          {pieData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Pie>
      </PieChart>
    </ChartContainer>
  );
}
