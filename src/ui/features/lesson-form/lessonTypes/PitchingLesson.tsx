"use client";

import { Input, Select, SelectItem } from "@heroui/react";

import { PitchingPhase } from "@/hooks/lessons/lessonForm.types";

import { useLessonFormContext } from "../LessonFormProvider";
import { LessonTypeImplementation } from "./lessonTypes";

const PITCHING_PHASES: {
  value: PitchingPhase;
  label: string;
}[] = [
  { value: "1", label: "Phase 1" },
  { value: "2", label: "Phase 2" },
  { value: "3", label: "Phase 3" },
  { value: "4", label: "Phase 4" },
];

export const PitchingLesson: LessonTypeImplementation = {
  type: "pitching",
  label: "Pitching",

  // Used for mechanics filtering
  allowedMechanicTypes: ["pitching"],

  PlayerNotes({ playerId }) {
    const { form } = useLessonFormContext();

    const data =
      form.getFieldValue(`players.${playerId}.lessonSpecific.pitching`) ?? {};

    return (
      <div className="space-y-4">
        <p className="text-sm font-medium">Pitching Details</p>

        {/* Phase */}
        <Select
          label="Phase"
          placeholder="Select phase"
          selectedKeys={data.phase ? [data.phase] : []}
          onSelectionChange={(keys) => {
            const value = Array.from(keys)[0];
            form.setFieldValue(
              `players.${playerId}.lessonSpecific.pitching.phase`,
              value as PitchingPhase
            );
          }}
          isRequired
        >
          {PITCHING_PHASES.map((p) => (
            <SelectItem key={p.value} textValue={p.label}>
              {p.label}
            </SelectItem>
          ))}
        </Select>

        {/* Pitch Count */}
        <Input
          type="number"
          label="Pitch Count"
          placeholder="Total pitches thrown"
          min={0}
          value={data.pitchCount != null ? String(data.pitchCount) : ""}
          onChange={(e) =>
            form.setFieldValue(
              `players.${playerId}.lessonSpecific.pitching.pitchCount`,
              Number(e.target.value)
            )
          }
        />

        {/* Intent */}
        <Input
          type="number"
          label="Intent Level (%)"
          placeholder="0–100"
          min={0}
          max={100}
          value={data.intentPercent != null ? String(data.intentPercent) : ""}
          onChange={(e) =>
            form.setFieldValue(
              `players.${playerId}.lessonSpecific.pitching.intentPercent`,
              Number(e.target.value)
            )
          }
        />
      </div>
    );
  },

  Review({ data }) {
    return (
      <div className="space-y-1 text-sm text-foreground-600">
        <p>
          <strong>Phase:</strong> {data.phase}
        </p>

        {data.pitchCount != null && (
          <p>
            <strong>Pitch Count:</strong> {data.pitchCount}
          </p>
        )}

        {data.intentPercent != null && (
          <p>
            <strong>Intent:</strong> {data.intentPercent}%
          </p>
        )}
      </div>
    );
  },
};
