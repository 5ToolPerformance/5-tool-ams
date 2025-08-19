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

import type { PitchingAssessmentSelect } from "@/types/database";

export type PitchingAssessmentViewerProps = {
  data: PitchingAssessmentSelect | null;
};

export default function PitchingAssessmentViewer({
  data,
}: PitchingAssessmentViewerProps) {
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

  return (
    <Card className="mx-auto w-full max-w-4xl">
      <CardHeader className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Pitching Assessment</h2>
      </CardHeader>
      <Divider />
      <CardBody>
        <div className="space-y-6">
          {/* Qualitative Breakdown */}
          {(data.upper || data.mid || data.lower) && (
            <div>
              <h3 className="mb-3 text-lg font-medium">
                Qualitative Breakdown
              </h3>
              <Table aria-label="Qualitative breakdown">
                <TableHeader>
                  <TableColumn>Section</TableColumn>
                  <TableColumn>Notes</TableColumn>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Upper</TableCell>
                    <TableCell className="whitespace-pre-line">
                      {data.upper || "N/A"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Mid</TableCell>
                    <TableCell className="whitespace-pre-line">
                      {data.mid}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Lower</TableCell>
                    <TableCell className="whitespace-pre-line">
                      {data.lower}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          )}

          {/* Velocity - Mound */}
          <div>
            <h3 className="mb-3 text-lg font-medium">Velocity - Mound</h3>
            <Table aria-label="Velocity mound">
              <TableHeader>
                <TableColumn>Ball</TableColumn>
                <TableColumn>Velocity (mph)</TableColumn>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>2 oz</TableCell>
                  <TableCell>{data.velo_mound_2oz}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>4 oz</TableCell>
                  <TableCell>{data.velo_mound_4oz}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>5 oz</TableCell>
                  <TableCell>{data.velo_mound_5oz}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>6 oz</TableCell>
                  <TableCell>{data.velo_mound_6oz}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* Velocity - Pull Down */}
          <div>
            <h3 className="mb-3 text-lg font-medium">Velocity - Pull Down</h3>
            <Table aria-label="Velocity pull down">
              <TableHeader>
                <TableColumn>Ball</TableColumn>
                <TableColumn>Velocity (mph)</TableColumn>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>2 oz</TableCell>
                  <TableCell>{data.velo_pull_down_2oz}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>4 oz</TableCell>
                  <TableCell>{data.velo_pull_down_4oz}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>5 oz</TableCell>
                  <TableCell>{data.velo_pull_down_5oz}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>6 oz</TableCell>
                  <TableCell>{data.velo_pull_down_6oz}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* Outcomes & Status */}
          <div>
            <h3 className="mb-3 text-lg font-medium">Outcomes & Status</h3>
            <Table aria-label="Outcomes and status">
              <TableHeader>
                <TableColumn>Metric</TableColumn>
                <TableColumn>Value</TableColumn>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Strike %</TableCell>
                  <TableCell>{data.strike_pct}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Feel</TableCell>
                  <TableCell>{data.feel}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Last Time Pitched</TableCell>
                  <TableCell>{data.last_time_pitched || "N/A"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Next Time Pitched</TableCell>
                  <TableCell>{data.next_time_pitched || "N/A"}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* Goals */}
          {data.goals && (
            <div>
              <h3 className="mb-2 text-lg font-medium">Goals</h3>
              <div className="rounded-lg bg-default-50 p-4">
                <p className="whitespace-pre-line">{data.goals}</p>
              </div>
            </div>
          )}

          {/* Concerns */}
          {data.concerns && (
            <div>
              <h3 className="mb-2 text-lg font-medium">Concerns</h3>
              <div className="rounded-lg bg-default-50 p-4">
                <p className="whitespace-pre-line">{data.concerns}</p>
              </div>
            </div>
          )}

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
