"use client";

import {
  StrengthLessonSpecific,
  TsIsoData,
} from "@/hooks/lessons/lessonForm.types";
import { useLessonFormContext } from "@/ui/features/lesson-form/LessonFormProvider";
import {
  TS_ISO_ROWS,
  TsIsoTable,
} from "@/ui/features/lesson-form/components/TsIsoTable";

import { LessonTypeImplementation } from "./lessonTypes";

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
    label: "Shoulder Rotation RFD",
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
    label: "Hip Rotation RFD",
    leftKey: "hipRotRfdL",
    rightKey: "hipRotRfdR",
  },
];

export const StrengthLesson: LessonTypeImplementation<StrengthLessonSpecific> =
  {
    type: "strength",
    label: "Strength",

    // Used for mechanics filtering
    allowedMechanicTypes: [],

    PlayerNotes({ playerId, data }) {
      const { form } = useLessonFormContext();

      return <TsIsoTable playerId={playerId} data={data || {}} />;
    },

    Review({ data }) {
      const tsIso = (data as StrengthLessonSpecific)?.tsIso;
      if (!tsIso) return null;

      const hasAnyValues = TS_ISO_ROWS.some(
        (row) => tsIso[row.leftKey] != null || tsIso[row.rightKey] != null
      );

      if (!hasAnyValues) return null;

      return (
        <div className="space-y-1 text-sm text-foreground-600">
          <p className="font-medium text-foreground">TS ISO</p>

          {TS_ISO_ROWS.map((row) => {
            const left = tsIso[row.leftKey];
            const right = tsIso[row.rightKey];

            if (left == null && right == null) return null;

            return (
              <p key={row.label}>
                <strong>{row.label}:</strong>{" "}
                {left != null ? `L ${left}` : "L —"} /{" "}
                {right != null ? `R ${right}` : "R —"}
              </p>
            );
          })}
        </div>
      );
    },
  };
