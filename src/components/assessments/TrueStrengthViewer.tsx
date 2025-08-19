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

import type { TrueStrengthSelect } from "@/types/database";

export type TrueStrengthViewerProps = {
  data: TrueStrengthSelect | null;
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

export default function TrueStrengthViewer({ data }: TrueStrengthViewerProps) {
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
        <h2 className="text-xl font-semibold">True Strength Assessment</h2>
        {formattedDate && (
          <span className="text-sm text-default-500">{formattedDate}</span>
        )}
      </CardHeader>
      <Divider />
      <CardBody>
        <div className="space-y-6">
          {/* Seated Shoulder ER/IR */}
          <div>
            <h3 className="mb-3 text-lg font-medium">Seated Shoulder ER / IR</h3>
            <Table aria-label="Seated shoulder ER/IR">
              <TableHeader>
                <TableColumn>Metric</TableColumn>
                <TableColumn>Left</TableColumn>
                <TableColumn>Right</TableColumn>
                <TableColumn>Diff (L - R)</TableColumn>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>External Rotation</TableCell>
                  <TableCell
                    className={
                      hasSignificantDifference(
                        data.seated_shoulder_er_l,
                        data.seated_shoulder_er_r
                      )
                        ? "text-warning"
                        : ""
                    }
                  >
                    {displayNumber(data.seated_shoulder_er_l)}
                  </TableCell>
                  <TableCell
                    className={
                      hasSignificantDifference(
                        data.seated_shoulder_er_l,
                        data.seated_shoulder_er_r
                      )
                        ? "text-warning"
                        : ""
                    }
                  >
                    {displayNumber(data.seated_shoulder_er_r)}
                  </TableCell>
                  <TableCell>
                    {calcDiff(
                      data.seated_shoulder_er_l,
                      data.seated_shoulder_er_r
                    )}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Internal Rotation</TableCell>
                  <TableCell
                    className={
                      hasSignificantDifference(
                        data.seated_shoulder_ir_l,
                        data.seated_shoulder_ir_r
                      )
                        ? "text-warning"
                        : ""
                    }
                  >
                    {displayNumber(data.seated_shoulder_ir_l)}
                  </TableCell>
                  <TableCell
                    className={
                      hasSignificantDifference(
                        data.seated_shoulder_ir_l,
                        data.seated_shoulder_ir_r
                      )
                        ? "text-warning"
                        : ""
                    }
                  >
                    {displayNumber(data.seated_shoulder_ir_r)}
                  </TableCell>
                  <TableCell>
                    {calcDiff(
                      data.seated_shoulder_ir_l,
                      data.seated_shoulder_ir_r
                    )}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* Shoulder Rotation Strength and RFD */}
          <div>
            <h3 className="mb-3 text-lg font-medium">Shoulder Rotation</h3>
            <Table aria-label="Shoulder rotation">
              <TableHeader>
                <TableColumn>Metric</TableColumn>
                <TableColumn>Left</TableColumn>
                <TableColumn>Right</TableColumn>
                <TableColumn>Diff (L - R)</TableColumn>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Strength</TableCell>
                  <TableCell
                    className={
                      hasSignificantDifference(
                        data.shoulder_rotation_l,
                        data.shoulder_rotation_r
                      )
                        ? "text-warning"
                        : ""
                    }
                  >
                    {displayNumber(data.shoulder_rotation_l)}
                  </TableCell>
                  <TableCell
                    className={
                      hasSignificantDifference(
                        data.shoulder_rotation_l,
                        data.shoulder_rotation_r
                      )
                        ? "text-warning"
                        : ""
                    }
                  >
                    {displayNumber(data.shoulder_rotation_r)}
                  </TableCell>
                  <TableCell>
                    {calcDiff(
                      data.shoulder_rotation_l,
                      data.shoulder_rotation_r
                    )}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>RFD</TableCell>
                  <TableCell
                    className={
                      hasSignificantDifference(
                        data.shoulder_rotation_rfd_l,
                        data.shoulder_rotation_rfd_r
                      )
                        ? "text-warning"
                        : ""
                    }
                  >
                    {displayNumber(data.shoulder_rotation_rfd_l)}
                  </TableCell>
                  <TableCell
                    className={
                      hasSignificantDifference(
                        data.shoulder_rotation_rfd_l,
                        data.shoulder_rotation_rfd_r
                      )
                        ? "text-warning"
                        : ""
                    }
                  >
                    {displayNumber(data.shoulder_rotation_rfd_r)}
                  </TableCell>
                  <TableCell>
                    {calcDiff(
                      data.shoulder_rotation_rfd_l,
                      data.shoulder_rotation_rfd_r
                    )}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* Hip Rotation Strength and RFD */}
          <div>
            <h3 className="mb-3 text-lg font-medium">Hip Rotation</h3>
            <Table aria-label="Hip rotation">
              <TableHeader>
                <TableColumn>Metric</TableColumn>
                <TableColumn>Left</TableColumn>
                <TableColumn>Right</TableColumn>
                <TableColumn>Diff (L - R)</TableColumn>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Strength</TableCell>
                  <TableCell
                    className={
                      hasSignificantDifference(
                        data.hip_rotation_l,
                        data.hip_rotation_r
                      )
                        ? "text-warning"
                        : ""
                    }
                  >
                    {displayNumber(data.hip_rotation_l)}
                  </TableCell>
                  <TableCell
                    className={
                      hasSignificantDifference(
                        data.hip_rotation_l,
                        data.hip_rotation_r
                      )
                        ? "text-warning"
                        : ""
                    }
                  >
                    {displayNumber(data.hip_rotation_r)}
                  </TableCell>
                  <TableCell>
                    {calcDiff(data.hip_rotation_l, data.hip_rotation_r)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>RFD</TableCell>
                  <TableCell
                    className={
                      hasSignificantDifference(
                        data.hip_rotation_rfd_l,
                        data.hip_rotation_rfd_r
                      )
                        ? "text-warning"
                        : ""
                    }
                  >
                    {displayNumber(data.hip_rotation_rfd_l)}
                  </TableCell>
                  <TableCell
                    className={
                      hasSignificantDifference(
                        data.hip_rotation_rfd_l,
                        data.hip_rotation_rfd_r
                      )
                        ? "text-warning"
                        : ""
                    }
                  >
                    {displayNumber(data.hip_rotation_rfd_r)}
                  </TableCell>
                  <TableCell>
                    {calcDiff(
                      data.hip_rotation_rfd_l,
                      data.hip_rotation_rfd_r
                    )}
                  </TableCell>
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
