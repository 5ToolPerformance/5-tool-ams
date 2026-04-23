"use client";

import Link from "next/link";

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
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/ui/core/primitives/chart";
import { DashboardCoachesData } from "@ams/domain/dashboard/types";

const chartConfig = {
  lessons: {
    label: "Lessons",
    color: "hsl(var(--primary))",
  },
};

export function DashboardCoachesTab({ data }: { data: DashboardCoachesData }) {
  const topRows = data.coachRows.slice(0, 10).map((row) => ({
    coachName: row.coachName,
    lessons: row.lessonsLogged,
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card shadow="sm">
          <CardBody>
            <p className="text-sm text-default-500">Active Coaches</p>
            <p className="text-2xl font-semibold">{data.totalCoachesActive}</p>
          </CardBody>
        </Card>
        <Card shadow="sm">
          <CardBody>
            <p className="text-sm text-default-500">Lessons Logged</p>
            <p className="text-2xl font-semibold">{data.totalLessonsLogged}</p>
          </CardBody>
        </Card>
        <Card shadow="sm">
          <CardBody>
            <p className="text-sm text-default-500">Avg Log Delay (days)</p>
            <p className="text-2xl font-semibold">{data.avgLogDelayDays}</p>
          </CardBody>
        </Card>
      </div>

      <Card shadow="sm">
        <CardBody>
          <h2 className="mb-3 text-lg font-semibold">Top Coaches by Lessons</h2>
          <ChartContainer config={chartConfig} className="h-[320px]">
            <BarChart data={topRows}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="coachName" interval={0} angle={-15} textAnchor="end" height={60} />
              <YAxis allowDecimals={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="lessons" fill="var(--color-lessons)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </CardBody>
      </Card>

      <Card shadow="sm">
        <CardBody>
          <h2 className="mb-3 text-lg font-semibold">Coach Activity</h2>
          <ScrollShadow hideScrollBar className="max-h-[30rem] rounded-md bg-transparent">
            <Table
              aria-label="Coach activity"
              removeWrapper
              classNames={{ table: "bg-transparent" }}
            >
              <TableHeader>
                <TableColumn>COACH</TableColumn>
                <TableColumn className="text-right">LESSONS</TableColumn>
                <TableColumn className="text-right">PLAYERS</TableColumn>
                <TableColumn className="text-right">AVG DELAY (DAYS)</TableColumn>
              </TableHeader>
              <TableBody emptyContent="No coach activity found for this range">
                {data.coachRows.map((row) => (
                  <TableRow key={row.coachId}>
                    <TableCell>
                      <Link href={`/coaches/${row.coachId}`} className="hover:underline">
                        {row.coachName}
                      </Link>
                    </TableCell>
                    <TableCell className="text-right">{row.lessonsLogged}</TableCell>
                    <TableCell className="text-right">{row.uniquePlayers}</TableCell>
                    <TableCell className="text-right">{row.avgLogDelayDays}</TableCell>
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
