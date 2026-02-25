"use client";

import { Select, SelectItem, Textarea } from "@heroui/react";

import { PitchingLessonData } from "@/hooks/lessons/lessonForm.types";

import { useLessonFormContext } from "../LessonFormProvider";
import { LessonTypeImplementation } from "./lessonTypes";

const LESSON_FOCUS: {
  value: string;
  label: string;
}[] = [
  { value: "flat_ground", label: "Flat Ground" },
  { value: "bullpen", label: "Bullpen" },
  { value: "drill_work", label: "Drill Work" },
  { value: "arm_care", label: "Arm Care" },
];

export const PitchingLesson: LessonTypeImplementation<PitchingLessonData> = {
  type: "pitching",
  label: "Pitching",

  // Used for mechanics filtering
  allowedMechanicTypes: ["pitching"],
  allowedDrillTypes: ["pitching"],
  fatigueCheck: true,

  PlayerNotes({ playerId }) {
    const { form } = useLessonFormContext();

    const data =
      form.getFieldValue(`players.${playerId}.lessonSpecific.pitching`) ?? {};

    return (
      <div className="space-y-4">
        <p className="text-sm font-medium">Pitching Details</p>

        {/* Summary */}
        <Textarea
          label="Summary"
          placeholder="Brief summary of the lesson"
          value={data.summary ?? ""}
          onChange={(e) =>
            form.setFieldValue(
              `players.${playerId}.lessonSpecific.pitching.summary`,
              e.target.value
            )
          }
        />

        <Select
          label="Lesson Type"
          placeholder="Select a lesson type"
          selectedKeys={data.focus ? [data.focus] : []}
          onSelectionChange={(keys) => {
            const value = Array.from(keys)[0];
            form.setFieldValue(
              `players.${playerId}.lessonSpecific.pitching.focus`,
              value as string
            );
          }}
          isRequired
        >
          {LESSON_FOCUS.map((focus) => (
            <SelectItem key={focus.value} textValue={focus.label}>
              {focus.label}
            </SelectItem>
          ))}
        </Select>
      </div>
    );
  },

  Review({ data }) {
    return (
      <div className="space-y-1 text-sm text-foreground-600">
        <p>
          <strong>Summary:</strong> {data.summary}
        </p>

        {data.focus != null && (
          <p>
            <strong>Focus:</strong> {data.focus}
          </p>
        )}
      </div>
    );
  },
};
