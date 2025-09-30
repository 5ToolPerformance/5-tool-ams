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

import type { HitTraxAssessmentSelect } from "@/types/database";

export type HitTraxViewerProps = {
  data: HitTraxAssessmentSelect | null;
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

function formatPitchType(value?: string | null) {
  if (!value) return "-";
  // Capitalize first letter
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export default function HitTraxViewer({ data }: HitTraxViewerProps) {
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

  const formattedDate = safeFormatDate(data.createdOn as unknown as string);

  return (
    <Card className="mx-auto w-full max-w-4xl">
      <CardHeader className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">HitTrax Assessment</h2>
        {formattedDate && (
          <span className="text-sm text-default-500">{formattedDate}</span>
        )}
      </CardHeader>
      <Divider />
      <CardBody>
        <div className="space-y-6">
          {/* Pitch Type */}
          {data.pitchType && (
            <div>
              <h3 className="mb-3 text-lg font-medium">Pitch Type</h3>
              <div className="rounded-lg bg-default-50 p-4">
                <p className="text-lg font-semibold">
                  {formatPitchType(data.pitchType)}
                </p>
              </div>
            </div>
          )}

          {/* Exit Velocity Metrics */}
          <div>
            <h3 className="mb-3 text-lg font-medium">Exit Velocity</h3>
            <Table aria-label="Exit velocity metrics">
              <TableHeader>
                <TableColumn>Metric</TableColumn>
                <TableColumn>Value</TableColumn>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Avg Exit Velo</TableCell>
                  <TableCell>
                    {displayNumber(data.avgExitVelo)} {data.avgExitVelo ? "mph" : ""}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Max Velo</TableCell>
                  <TableCell>
                    {displayNumber(data.maxVelo)} {data.maxVelo ? "mph" : ""}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Hard Hit %</TableCell>
                  <TableCell>
                    {typeof data.avgHardHit === "number"
                      ? `${displayNumber(data.avgHardHit, 2)}%`
                      : "-"}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* Distance & Contact Quality */}
          <div>
            <h3 className="mb-3 text-lg font-medium">Distance & Contact Quality</h3>
            <Table aria-label="Distance and contact quality metrics">
              <TableHeader>
                <TableColumn>Metric</TableColumn>
                <TableColumn>Value</TableColumn>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Max Distance</TableCell>
                  <TableCell>
                    {displayNumber(data.maxDist)} {data.maxDist ? "ft" : ""}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Line Drive %</TableCell>
                  <TableCell>
                    {typeof data.lineDrivePct === "number"
                      ? `${displayNumber(data.lineDrivePct, 2)}%`
                      : "-"}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>FB & GB %</TableCell>
                  <TableCell>
                    {typeof data.fbAndGbPct === "number"
                      ? `${displayNumber(data.fbAndGbPct, 2)}%`
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