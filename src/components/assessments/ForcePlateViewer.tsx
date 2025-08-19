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

import type { ForcePlateSelect } from "@/types/database";

export type ForcePlateViewerProps = {
  data: ForcePlateSelect | null;
};

function safeFormatDate(value: string | Date) {
  try {
    const d = new Date(value);
    return isNaN(d.getTime()) ? "" : format(d, "MMMM d, yyyy");
  } catch {
    return "";
  }
}

function displayNumber(value?: number) {
  if (typeof value !== "number" || Number.isNaN(value)) return "-";
  return value.toFixed(2);
}

function calcDiff(left?: number, right?: number) {
  if (typeof left !== "number" || typeof right !== "number") return "-";
  return `${(left - right).toFixed(2)}`;
}

function hasSignificantDifference(left?: number, right?: number, threshold = 5) {
  if (typeof left !== "number" || typeof right !== "number") return false;
  return Math.abs(left - right) >= threshold;
}

export default function ForcePlateViewer({ data }: ForcePlateViewerProps) {
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

  const formattedDate = safeFormatDate(data.lessonDate as unknown as string);

  return (
    <Card className="mx-auto w-full max-w-4xl">
      <CardHeader className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Force Plate Assessment</h2>
        {formattedDate && (
          <span className="text-sm text-default-500">{formattedDate}</span>
        )}
      </CardHeader>
      <Divider />
      <CardBody>
        <div className="space-y-6">
          {/* Jump & Pull Metrics */}
          <div>
            <h3 className="mb-3 text-lg font-medium">Jump & Pull Metrics</h3>
            <Table aria-label="Force plate jump and pull metrics">
              <TableHeader>
                <TableColumn>Metric</TableColumn>
                <TableColumn>Value</TableColumn>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>CMJ</TableCell>
                  <TableCell>{displayNumber(data.cmj)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Drop Jump</TableCell>
                  <TableCell>{displayNumber(data.drop_jump)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Pogo</TableCell>
                  <TableCell>{displayNumber(data.pogo)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Mid-Thigh Pull</TableCell>
                  <TableCell>{displayNumber(data.mid_thigh_pull)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>MTP Time</TableCell>
                  <TableCell>{displayNumber(data.mtp_time)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* Center of Pressure (CoP) */}
          <div>
            <h3 className="mb-3 text-lg font-medium">Center of Pressure (CoP)</h3>
            <Table aria-label="Center of pressure symmetry">
              <TableHeader>
                <TableColumn>Axis</TableColumn>
                <TableColumn>Left</TableColumn>
                <TableColumn>Right</TableColumn>
                <TableColumn>Diff (L - R)</TableColumn>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>ML</TableCell>
                  <TableCell
                    className={
                      hasSignificantDifference(data.cop_ml_l, data.cop_ml_r)
                        ? "text-warning"
                        : ""
                    }
                  >
                    {displayNumber(data.cop_ml_l)}
                  </TableCell>
                  <TableCell
                    className={
                      hasSignificantDifference(data.cop_ml_l, data.cop_ml_r)
                        ? "text-warning"
                        : ""
                    }
                  >
                    {displayNumber(data.cop_ml_r)}
                  </TableCell>
                  <TableCell>{calcDiff(data.cop_ml_l, data.cop_ml_r)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>AP</TableCell>
                  <TableCell
                    className={
                      hasSignificantDifference(data.cop_ap_l, data.cop_ap_r)
                        ? "text-warning"
                        : ""
                    }
                  >
                    {displayNumber(data.cop_ap_l)}
                  </TableCell>
                  <TableCell
                    className={
                      hasSignificantDifference(data.cop_ap_l, data.cop_ap_r)
                        ? "text-warning"
                        : ""
                    }
                  >
                    {displayNumber(data.cop_ap_r)}
                  </TableCell>
                  <TableCell>{calcDiff(data.cop_ap_l, data.cop_ap_r)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* Notes */}
          {data.notes && (
            <div>
              <h3 className="mb-2 text-lg font-medium">Notes</h3>
              <div className="rounded-lg bg-default-50 p-4">
                <p className="whitespace-pre-line">{data.notes}</p>
              </div>
            </div>
          )}
        </div>
      </CardBody>
      <CardFooter className="text-xs text-default-400">Assessment ID: {data.id}</CardFooter>
    </Card>
  );
}
