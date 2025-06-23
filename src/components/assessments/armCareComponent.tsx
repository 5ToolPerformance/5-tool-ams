"use client";

import { useEffect, useState } from "react";

import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { format } from "date-fns";

interface ArmCareAssessmentViewerProps {
  assessmentId: string;
}

interface ArmCareAssessment {
  id: string;
  playerId: string;
  coachId: string;
  lessonId: string;
  notes: string | null;
  shoulder_er_l: number;
  shoulder_er_r: number;
  shoulder_ir_l: number;
  shoulder_ir_r: number;
  shoulder_flexion_l: number;
  shoulder_flexion_r: number;
  supine_hip_er_l: number;
  supine_hip_er_r: number;
  supine_hip_ir_l: number;
  supine_hip_ir_r: number;
  straight_leg_l: number;
  straight_leg_r: number;
  lessonDate: string;
  createdOn: string;
}

export function ArmCareAssessmentViewer({
  assessmentId,
}: ArmCareAssessmentViewerProps) {
  const [assessment, setAssessment] = useState<ArmCareAssessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/assessments/arm-care/${assessmentId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch assessment");
        }

        const data = await response.json();
        setAssessment(data);
      } catch (err) {
        console.error("Error fetching assessment:", err);
        setError("Failed to load assessment data");
      } finally {
        setLoading(false);
      }
    };

    if (assessmentId) {
      fetchAssessment();
    }
  }, [assessmentId]);

  if (loading) {
    return (
      <Card className="mx-auto w-full max-w-4xl">
        <CardHeader className="flex items-center justify-between">
          <Skeleton className="h-8 w-48 rounded-lg" />
        </CardHeader>
        <Divider />
        <CardBody>
          <div className="space-y-4">
            <Skeleton className="h-6 w-full rounded-lg" />
            <Skeleton className="h-6 w-5/6 rounded-lg" />
            <Skeleton className="h-6 w-4/6 rounded-lg" />
          </div>
        </CardBody>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="mx-auto w-full max-w-4xl">
        <CardBody>
          <div className="p-4 text-center text-danger-500">
            <p>{error}</p>
          </div>
        </CardBody>
      </Card>
    );
  }

  if (!assessment) {
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

  // Format the assessment date
  const formattedDate = format(new Date(assessment.lessonDate), "MMMM d, yyyy");

  // Calculate the difference between left and right for each measurement
  const calculateDifference = (left: number, right: number) => {
    return Math.abs(left - right).toFixed(1);
  };

  // Determine if there's a significant difference between left and right
  const hasSignificantDifference = (
    left: number,
    right: number,
    threshold = 5
  ) => {
    return Math.abs(left - right) >= threshold;
  };

  return (
    <Card className="mx-auto w-full max-w-4xl">
      <CardHeader className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Arm Care Assessment</h2>
        <span className="text-sm text-default-500">{formattedDate}</span>
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
                        assessment.shoulder_er_l,
                        assessment.shoulder_er_r
                      )
                        ? "text-warning"
                        : ""
                    }
                  >
                    {assessment.shoulder_er_l}°
                  </TableCell>
                  <TableCell
                    className={
                      hasSignificantDifference(
                        assessment.shoulder_er_l,
                        assessment.shoulder_er_r
                      )
                        ? "text-warning"
                        : ""
                    }
                  >
                    {assessment.shoulder_er_r}°
                  </TableCell>
                  <TableCell>
                    {calculateDifference(
                      assessment.shoulder_er_l,
                      assessment.shoulder_er_r
                    )}
                    °
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Internal Rotation</TableCell>
                  <TableCell
                    className={
                      hasSignificantDifference(
                        assessment.shoulder_ir_l,
                        assessment.shoulder_ir_r
                      )
                        ? "text-warning"
                        : ""
                    }
                  >
                    {assessment.shoulder_ir_l}°
                  </TableCell>
                  <TableCell
                    className={
                      hasSignificantDifference(
                        assessment.shoulder_ir_l,
                        assessment.shoulder_ir_r
                      )
                        ? "text-warning"
                        : ""
                    }
                  >
                    {assessment.shoulder_ir_r}°
                  </TableCell>
                  <TableCell>
                    {calculateDifference(
                      assessment.shoulder_ir_l,
                      assessment.shoulder_ir_r
                    )}
                    °
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Flexion</TableCell>
                  <TableCell
                    className={
                      hasSignificantDifference(
                        assessment.shoulder_flexion_l,
                        assessment.shoulder_flexion_r
                      )
                        ? "text-warning"
                        : ""
                    }
                  >
                    {assessment.shoulder_flexion_l}°
                  </TableCell>
                  <TableCell
                    className={
                      hasSignificantDifference(
                        assessment.shoulder_flexion_l,
                        assessment.shoulder_flexion_r
                      )
                        ? "text-warning"
                        : ""
                    }
                  >
                    {assessment.shoulder_flexion_r}°
                  </TableCell>
                  <TableCell>
                    {calculateDifference(
                      assessment.shoulder_flexion_l,
                      assessment.shoulder_flexion_r
                    )}
                    °
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
                        assessment.supine_hip_er_l,
                        assessment.supine_hip_er_r
                      )
                        ? "text-warning"
                        : ""
                    }
                  >
                    {assessment.supine_hip_er_l}°
                  </TableCell>
                  <TableCell
                    className={
                      hasSignificantDifference(
                        assessment.supine_hip_er_l,
                        assessment.supine_hip_er_r
                      )
                        ? "text-warning"
                        : ""
                    }
                  >
                    {assessment.supine_hip_er_r}°
                  </TableCell>
                  <TableCell>
                    {calculateDifference(
                      assessment.supine_hip_er_l,
                      assessment.supine_hip_er_r
                    )}
                    °
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Internal Rotation (Supine)</TableCell>
                  <TableCell
                    className={
                      hasSignificantDifference(
                        assessment.supine_hip_ir_l,
                        assessment.supine_hip_ir_r
                      )
                        ? "text-warning"
                        : ""
                    }
                  >
                    {assessment.supine_hip_ir_l}°
                  </TableCell>
                  <TableCell
                    className={
                      hasSignificantDifference(
                        assessment.supine_hip_ir_l,
                        assessment.supine_hip_ir_r
                      )
                        ? "text-warning"
                        : ""
                    }
                  >
                    {assessment.supine_hip_ir_r}°
                  </TableCell>
                  <TableCell>
                    {calculateDifference(
                      assessment.supine_hip_ir_l,
                      assessment.supine_hip_ir_r
                    )}
                    °
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
                  <TableCell>{assessment.straight_leg_l}°</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Right</TableCell>
                  <TableCell>{assessment.straight_leg_r}°</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Difference</TableCell>
                  <TableCell
                    className={
                      hasSignificantDifference(
                        assessment.straight_leg_l,
                        assessment.straight_leg_r,
                        10
                      )
                        ? "text-warning"
                        : ""
                    }
                  >
                    {calculateDifference(
                      assessment.straight_leg_l,
                      assessment.straight_leg_r
                    )}
                    °
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* Notes */}
          {assessment.notes && (
            <div>
              <h3 className="mb-2 text-lg font-medium">Notes</h3>
              <div className="rounded-lg bg-default-50 p-4">
                <p className="whitespace-pre-line">{assessment.notes}</p>
              </div>
            </div>
          )}
        </div>
      </CardBody>
      <CardFooter className="text-xs text-default-400">
        Assessment ID: {assessment.id}
      </CardFooter>
    </Card>
  );
}

export default ArmCareAssessmentViewer;
