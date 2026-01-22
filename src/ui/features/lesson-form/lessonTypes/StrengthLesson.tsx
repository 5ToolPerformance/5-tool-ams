"use client";

import { StrengthLessonSpecific } from "@/hooks/lessons/lessonForm.types";
import {
  TS_ISO_ROWS,
  TsIsoTable,
} from "@/ui/features/lesson-form/components/TsIsoTable";

import { LessonTypeImplementation } from "./lessonTypes";

export const StrengthLesson: LessonTypeImplementation<StrengthLessonSpecific> =
  {
    type: "strength",
    label: "Strength",

    // Used for mechanics filtering
    allowedMechanicTypes: [],

    PlayerNotes({ playerId, data }) {
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
