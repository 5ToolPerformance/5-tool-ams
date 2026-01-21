"use client";

import {
  Input,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";

import type { TsIsoData } from "@/hooks/lessons/lessonForm.types";

import { useLessonFormContext } from "../LessonFormProvider";

type Row = {
  key: string;
  label: string;
  leftKey: keyof TsIsoData;
  rightKey: keyof TsIsoData;
};

const ROWS: Row[] = [
  {
    key: "shoulderEr",
    label: "Shoulder ER",
    leftKey: "shoulderErL",
    rightKey: "shoulderErR",
  },
  {
    key: "shoulderErTtpf",
    label: "Shoulder ER TTPF",
    leftKey: "shoulderErTtpfL",
    rightKey: "shoulderErTtpfR",
  },
  {
    key: "shoulderIr",
    label: "Shoulder IR",
    leftKey: "shoulderIrL",
    rightKey: "shoulderIrR",
  },
  {
    key: "shoulderIrTtpf",
    label: "Shoulder IR TTPF",
    leftKey: "shoulderIrTtpfL",
    rightKey: "shoulderIrTtpfR",
  },
  {
    key: "shoulderRot",
    label: "Shoulder Rotation",
    leftKey: "shoulderRotL",
    rightKey: "shoulderRotR",
  },
  {
    key: "shoulderRotRfd",
    label: "Shoulder Rot RFD",
    leftKey: "shoulderRotRfdL",
    rightKey: "shoulderRotRfdR",
  },
  {
    key: "hipRot",
    label: "Hip Rotation",
    leftKey: "hipRotL",
    rightKey: "hipRotR",
  },
  {
    key: "hipRotRfd",
    label: "Hip Rot RFD",
    leftKey: "hipRotRfdL",
    rightKey: "hipRotRfdR",
  },
];

export function TsIsoTable({
  playerId,
  data,
}: {
  playerId: string;
  data: TsIsoData;
}) {
  const { form } = useLessonFormContext();

  return (
    <div className="space-y-3">
      <div>
        <p className="text-sm font-medium text-foreground">TS ISO</p>
        <p className="text-xs text-foreground-500">
          Enter left and right values. Leave blank if not tested.
        </p>
      </div>
      <pre className="text-xs text-foreground-500">
        {JSON.stringify(data, null, 2)}
      </pre>

      <Table
        aria-label="TS ISO Assessment"
        removeWrapper
        classNames={{
          table: "border border-divider rounded-xl",
          th: "bg-content2 text-xs font-semibold text-foreground-600",
          td: "align-middle",
          tr: "hover:bg-content2/60",
        }}
      >
        <TableHeader>
          <TableColumn>Metric</TableColumn>
          <TableColumn>Left</TableColumn>
          <TableColumn>Right</TableColumn>
        </TableHeader>

        <TableBody>
          {ROWS.map((row) => (
            <TableRow key={row.key}>
              <TableCell>
                <span className="text-sm font-medium text-foreground">
                  {row.label}
                </span>
              </TableCell>

              <TableCell>
                <Input
                  type="number"
                  size="sm"
                  placeholder="—"
                  value={
                    data[row.leftKey] != null ? String(data[row.leftKey]) : ""
                  }
                  onChange={(e) =>
                    form.setFieldValue(
                      `players.${playerId}.lessonSpecific.strength.tsIso.${row.leftKey}`,
                      Number(e.target.value)
                    )
                  }
                />
              </TableCell>

              <TableCell>
                <Input
                  type="number"
                  size="sm"
                  placeholder="—"
                  value={
                    data[row.rightKey] != null ? String(data[row.rightKey]) : ""
                  }
                  onChange={(e) =>
                    form.setFieldValue(
                      `players.${playerId}.lessonSpecific.strength.tsIso.${row.rightKey}`,
                      Number(e.target.value)
                    )
                  }
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
