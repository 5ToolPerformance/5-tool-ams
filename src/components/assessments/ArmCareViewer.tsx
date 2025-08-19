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

import { ArmCareSelect } from "@/types/database";

export type ArmCareViewerProps = {
  data: ArmCareSelect | null;
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
  return typeof value === "number" ? `${value}°` : "N/A";
}

function calcDiff(left?: number, right?: number) {
  if (typeof left !== "number" || typeof right !== "number") return "N/A";
  return `${Math.abs(left - right).toFixed(1)}°`;
}

function hasSignificantDifference(
  left?: number,
  right?: number,
  threshold = 5
) {
  if (typeof left !== "number" || typeof right !== "number") return false;
  return Math.abs(left - right) >= threshold;
}

export function ArmCareViewer({ data }: ArmCareViewerProps) {
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
        <h2 className="text-xl font-semibold">Arm Care Assessment</h2>
        {formattedDate && (
          <span className="text-sm text-default-500">{formattedDate}</span>
        )}
      </CardHeader>
      <Divider />
      <CardBody>
        <div className="space-y-6">
          {/* Shoulder Range of Motion */}
          <div>
            <h3 className="mb-3 text-lg font-medium">
              Shoulder Range of Motion (Degrees)
            </h3>
            <Table aria-label="Shoulder range of motion">
              <TableHeader>
                <TableColumn>Movement</TableColumn>
                <TableColumn>Left</TableColumn>
                <TableColumn>Right</TableColumn>
                <TableColumn>Difference</TableColumn>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>External Rotation</TableCell>
                  <TableCell
                    className={
                      hasSignificantDifference(
                        data.shoulder_er_l,
                        data.shoulder_er_r
                      )
                        ? "text-warning"
                        : ""
                    }
                  >
                    {displayNumber(data.shoulder_er_l)}
                  </TableCell>
                  <TableCell
                    className={
                      hasSignificantDifference(
                        data.shoulder_er_l,
                        data.shoulder_er_r
                      )
                        ? "text-warning"
                        : ""
                    }
                  >
                    {displayNumber(data.shoulder_er_r)}
                  </TableCell>
                  <TableCell>
                    {calcDiff(data.shoulder_er_l, data.shoulder_er_r)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Internal Rotation</TableCell>
                  <TableCell
                    className={
                      hasSignificantDifference(
                        data.shoulder_ir_l,
                        data.shoulder_ir_r
                      )
                        ? "text-warning"
                        : ""
                    }
                  >
                    {displayNumber(data.shoulder_ir_l)}
                  </TableCell>
                  <TableCell
                    className={
                      hasSignificantDifference(
                        data.shoulder_ir_l,
                        data.shoulder_ir_r
                      )
                        ? "text-warning"
                        : ""
                    }
                  >
                    {displayNumber(data.shoulder_ir_r)}
                  </TableCell>
                  <TableCell>
                    {calcDiff(data.shoulder_ir_l, data.shoulder_ir_r)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Flexion</TableCell>
                  <TableCell
                    className={
                      hasSignificantDifference(
                        data.shoulder_flexion_l,
                        data.shoulder_flexion_r
                      )
                        ? "text-warning"
                        : ""
                    }
                  >
                    {displayNumber(data.shoulder_flexion_l)}
                  </TableCell>
                  <TableCell
                    className={
                      hasSignificantDifference(
                        data.shoulder_flexion_l,
                        data.shoulder_flexion_r
                      )
                        ? "text-warning"
                        : ""
                    }
                  >
                    {displayNumber(data.shoulder_flexion_r)}
                  </TableCell>
                  <TableCell>
                    {calcDiff(data.shoulder_flexion_l, data.shoulder_flexion_r)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* Hip Range of Motion */}
          <div>
            <h3 className="mb-3 text-lg font-medium">
              Hip Range of Motion (Degrees)
            </h3>
            <Table aria-label="Hip range of motion">
              <TableHeader>
                <TableColumn>Movement</TableColumn>
                <TableColumn>Left</TableColumn>
                <TableColumn>Right</TableColumn>
                <TableColumn>Difference</TableColumn>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>External Rotation (Supine)</TableCell>
                  <TableCell
                    className={
                      hasSignificantDifference(
                        data.supine_hip_er_l,
                        data.supine_hip_er_r
                      )
                        ? "text-warning"
                        : ""
                    }
                  >
                    {displayNumber(data.supine_hip_er_l)}
                  </TableCell>
                  <TableCell
                    className={
                      hasSignificantDifference(
                        data.supine_hip_er_l,
                        data.supine_hip_er_r
                      )
                        ? "text-warning"
                        : ""
                    }
                  >
                    {displayNumber(data.supine_hip_er_r)}
                  </TableCell>
                  <TableCell>
                    {calcDiff(data.supine_hip_er_l, data.supine_hip_er_r)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Internal Rotation (Supine)</TableCell>
                  <TableCell
                    className={
                      hasSignificantDifference(
                        data.supine_hip_ir_l,
                        data.supine_hip_ir_r
                      )
                        ? "text-warning"
                        : ""
                    }
                  >
                    {displayNumber(data.supine_hip_ir_l)}
                  </TableCell>
                  <TableCell
                    className={
                      hasSignificantDifference(
                        data.supine_hip_ir_l,
                        data.supine_hip_ir_r
                      )
                        ? "text-warning"
                        : ""
                    }
                  >
                    {displayNumber(data.supine_hip_ir_r)}
                  </TableCell>
                  <TableCell>
                    {calcDiff(data.supine_hip_ir_l, data.supine_hip_ir_r)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* Hamstring Flexibility */}
          <div>
            <h3 className="mb-3 text-lg font-medium">
              Hamstring Flexibility (Degrees)
            </h3>
            <Table aria-label="Hamstring flexibility">
              <TableHeader>
                <TableColumn>Leg</TableColumn>
                <TableColumn>Straight Leg Raise</TableColumn>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Left</TableCell>
                  <TableCell>{displayNumber(data.straight_leg_l)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Right</TableCell>
                  <TableCell>{displayNumber(data.straight_leg_r)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Difference</TableCell>
                  <TableCell
                    className={
                      hasSignificantDifference(
                        data.straight_leg_l,
                        data.straight_leg_r,
                        10
                      )
                        ? "text-warning"
                        : ""
                    }
                  >
                    {calcDiff(data.straight_leg_l, data.straight_leg_r)}
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
      <CardFooter className="text-xs text-default-400">
        Assessment ID: {data.id}
      </CardFooter>
    </Card>
  );
}

export default ArmCareViewer;
