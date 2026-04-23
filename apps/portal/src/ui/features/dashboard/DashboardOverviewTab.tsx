"use client";

import {
  Card,
  CardBody,
  ScrollShadow,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/ui/core/primitives/chart";
import { DashboardOverviewData } from "@ams/domain/dashboard/types";

const chartConfig = {
  lessons: {
    label: "Lessons",
    color: "hsl(var(--primary))",
  },
};

function formatLessonType(type: string) {
  return type.charAt(0).toUpperCase() + type.slice(1);
}

export function DashboardOverviewTab({ data }: { data: DashboardOverviewData }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card shadow="sm">
          <CardBody>
            <p className="text-sm text-default-500">Total Lessons</p>
            <p className="text-2xl font-semibold">{data.totalLessons.toLocaleString()}</p>
          </CardBody>
        </Card>
        <Card shadow="sm">
          <CardBody>
            <p className="text-sm text-default-500">Active Coaches</p>
            <p className="text-2xl font-semibold">{data.activeCoaches.toLocaleString()}</p>
          </CardBody>
        </Card>
        <Card shadow="sm">
          <CardBody>
            <p className="text-sm text-default-500">Active Players</p>
            <p className="text-2xl font-semibold">{data.activePlayers.toLocaleString()}</p>
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card shadow="sm">
          <CardBody>
            <h2 className="mb-3 text-lg font-semibold">Lessons by Type</h2>
            <ChartContainer config={chartConfig} className="h-[280px]">
              <BarChart data={data.lessonTypeBreakdown}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="lessonType" tickFormatter={formatLessonType} />
                <YAxis allowDecimals={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="var(--color-lessons)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardBody>
        </Card>

        <Card shadow="sm">
          <CardBody>
            <h2 className="mb-3 text-lg font-semibold">Daily Activity</h2>
            <ChartContainer config={chartConfig} className="h-[280px]">
              <LineChart data={data.dailyLessons}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis allowDecimals={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="lessons"
                  stroke="var(--color-lessons)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ChartContainer>
          </CardBody>
        </Card>
      </div>

      <Card shadow="sm">
        <CardBody>
          <h2 className="mb-3 text-lg font-semibold">Lesson Type Breakdown</h2>
          <ScrollShadow hideScrollBar className="max-h-80 rounded-md bg-transparent">
            <Table
              aria-label="Lesson type breakdown"
              removeWrapper
              classNames={{ table: "bg-transparent" }}
            >
              <TableHeader>
                <TableColumn>LESSON TYPE</TableColumn>
                <TableColumn className="text-right">COUNT</TableColumn>
                <TableColumn className="text-right">PERCENT</TableColumn>
              </TableHeader>
              <TableBody emptyContent="No lesson data for this date range">
                {data.lessonTypeBreakdown.map((row) => (
                  <TableRow key={row.lessonType}>
                    <TableCell>{formatLessonType(row.lessonType)}</TableCell>
                    <TableCell className="text-right">{row.count}</TableCell>
                    <TableCell className="text-right">{row.percentage}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollShadow>
        </CardBody>
      </Card>
    </div>
  );
}
