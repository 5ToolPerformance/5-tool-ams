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

import type { SmfaSelect } from "@/types/database";

export type SmfaViewerProps = {
  data: SmfaSelect | null;
};

function safeFormatDate(value: string | Date) {
  try {
    const d = new Date(value);
    return isNaN(d.getTime()) ? "" : format(d, "MMMM d, yyyy");
  } catch {
    return "";
  }
}

function BoolCell({ value }: { value?: boolean }) {
  const isTrue = value === true;
  const label = isTrue ? "Yes" : "No";
  const cls = isTrue ? "text-success" : "text-danger";
  return <span className={cls}>{label}</span>;
}

export default function SmfaViewer({ data }: SmfaViewerProps) {
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
        <h2 className="text-xl font-semibold">SMFA Assessment</h2>
        {formattedDate && (
          <span className="text-sm text-default-500">{formattedDate}</span>
        )}
      </CardHeader>
      <Divider />
      <CardBody>
        <div className="space-y-6">
          {/* Rotation and Mobility Tests */}
          <div>
            <h3 className="mb-3 text-lg font-medium">Rotation & Mobility</h3>
            <Table aria-label="Rotation and mobility tests">
              <TableHeader>
                <TableColumn>Test</TableColumn>
                <TableColumn>Left</TableColumn>
                <TableColumn>Right</TableColumn>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Pelvic Rotation</TableCell>
                  <TableCell><BoolCell value={data.pelvic_rotation_l} /></TableCell>
                  <TableCell><BoolCell value={data.pelvic_rotation_r} /></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Seated Trunk Rotation</TableCell>
                  <TableCell><BoolCell value={data.seated_trunk_rotation_l} /></TableCell>
                  <TableCell><BoolCell value={data.seated_trunk_rotation_r} /></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Ankle Test</TableCell>
                  <TableCell><BoolCell value={data.ankle_test_l} /></TableCell>
                  <TableCell><BoolCell value={data.ankle_test_r} /></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Forearm Test</TableCell>
                  <TableCell><BoolCell value={data.forearm_test_l} /></TableCell>
                  <TableCell><BoolCell value={data.forearm_test_r} /></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Cervical Rotation</TableCell>
                  <TableCell><BoolCell value={data.cervical_rotation_l} /></TableCell>
                  <TableCell><BoolCell value={data.cervical_rotation_r} /></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* MSF / MSE / MSR */}
          <div>
            <h3 className="mb-3 text-lg font-medium">MSF / MSE / MSR</h3>
            <Table aria-label="MSF/MSE/MSR tests">
              <TableHeader>
                <TableColumn>Test</TableColumn>
                <TableColumn>Left</TableColumn>
                <TableColumn>Right</TableColumn>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>MSF</TableCell>
                  <TableCell><BoolCell value={data.msf_l} /></TableCell>
                  <TableCell><BoolCell value={data.msf_r} /></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>MSE</TableCell>
                  <TableCell><BoolCell value={data.mse_l} /></TableCell>
                  <TableCell><BoolCell value={data.mse_r} /></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>MSR</TableCell>
                  <TableCell><BoolCell value={data.msr_l} /></TableCell>
                  <TableCell><BoolCell value={data.msr_r} /></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* Global Screens */}
          <div>
            <h3 className="mb-3 text-lg font-medium">Global Screens</h3>
            <Table aria-label="Global screens">
              <TableHeader>
                <TableColumn>Screen</TableColumn>
                <TableColumn>Result</TableColumn>
                <TableColumn>Screen</TableColumn>
                <TableColumn>Result</TableColumn>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Pelvic Tilt</TableCell>
                  <TableCell><BoolCell value={data.pelvic_tilt} /></TableCell>
                  <TableCell>Squat Test</TableCell>
                  <TableCell><BoolCell value={data.squat_test} /></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Cervical Flexion</TableCell>
                  <TableCell><BoolCell value={data.cervical_flexion} /></TableCell>
                  <TableCell>Cervical Extension</TableCell>
                  <TableCell><BoolCell value={data.cervical_extension} /></TableCell>
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
