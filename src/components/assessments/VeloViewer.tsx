"use client";

import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { format } from "date-fns";

import type { VeloAssessmentSelect } from "@/types/database";

export type VeloViewerProps = {
  data: VeloAssessmentSelect | null;
};

function safeFormatDate(value?: string | Date | null) {
  try {
    if (!value) return "";
    const d = new Date(value);
    return isNaN(d.getTime()) ? "" : format(d, "MMMM d, yyyy");
  } catch {
    return "";
  }
}

function displayNumber(value?: number | null, digits = 2) {
  if (typeof value !== "number" || Number.isNaN(value)) return "-";
  return value.toFixed(digits);
}

export default function VeloViewer({ data }: VeloViewerProps) {
  if (!data) {
    return (
      <Card className="mx-auto w-full max-w-4xl">
        <CardBody>
          <div className="p-4 text-center">
            <p>No assessment data available</p>
          </div>
        </CardBody>
      </Card>
    );
  }

  // veloAssessment does not include lessonDate; use createdOn for display context
  const formattedDate = safeFormatDate(data.createdOn as unknown as string);

  return (
    <Card className="mx-auto w-full max-w-4xl">
      <CardHeader className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Velocity Assessment</h2>
        {formattedDate && (
          <span className="text-sm text-default-500">{formattedDate}</span>
        )}
      </CardHeader>
      <Divider />
      <CardBody>
        <div className="space-y-6">
          {/* Simple Metrics */}
          <div>
            <h3 className="mb-3 text-lg font-medium">Session Metrics</h3>
            <Table aria-label="Velocity assessment metrics">
              <TableHeader>
                <TableColumn>Metric</TableColumn>
                <TableColumn>Value</TableColumn>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Intent</TableCell>
                  <TableCell>
                    {typeof data.intent === "number" ? `${data.intent}%` : "-"}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Avg Velo</TableCell>
                  <TableCell>
                    {displayNumber(data.avgVelo)} {data.avgVelo ? "mph" : ""}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Top Velo</TableCell>
                  <TableCell>
                    {displayNumber(data.topVelo)} {data.topVelo ? "mph" : ""}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Strike %</TableCell>
                  <TableCell>
                    {typeof data.strikePct === "number"
                      ? `${displayNumber(data.strikePct, 2)}%`
                      : "-"}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </CardBody>
      <CardFooter className="text-xs text-default-400">
        Assessment ID: {data.id}
      </CardFooter>
    </Card>
  );
}

