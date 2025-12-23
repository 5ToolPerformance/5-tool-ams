"use client";

import { PitchingPhase } from "@/hooks/lessons/lessonForm.types";

import { useLessonFormContext } from "../LessonFormProvider";
import { LessonTypeImplementation } from "./lessonTypes";

const PITCHING_PHASES: { value: PitchingPhase; label: string }[] = [
  { value: "1", label: "Phase 1" },
  { value: "2", label: "Phase 2" },
  { value: "3", label: "Phase 3" },
  { value: "4", label: "Phase 4" },
] as const;

export const PitchingLesson: LessonTypeImplementation = {
  type: "pitching",
  label: "Pitching",

  // Used for mechanics filtering
  allowedMechanicTypes: ["pitching"],

  PlayerNotes({ playerId }) {
    const { form } = useLessonFormContext();

    function setPhase(value: PitchingPhase) {
      form.setFieldValue(
        `players.${playerId}.lessonSpecific.pitching.phase`,
        value
      );
    }

    function setPitchCount(value: number) {
      form.setFieldValue(
        `players.${playerId}.lessonSpecific.pitching.pitchCount`,
        value
      );
    }

    function setIntent(value: number) {
      form.setFieldValue(
        `players.${playerId}.lessonSpecific.pitching.intentPercent`,
        value
      );
    }

    return (
      <div style={{ marginTop: 12 }}>
        <h4>Pitching Details</h4>

        {/* Phase */}
        <label>
          Phase
          <select
            onChange={(e) => setPhase(e.target.value as PitchingPhase)}
            defaultValue=""
          >
            <option value="" disabled>
              Select phase
            </option>
            {PITCHING_PHASES.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </label>

        {/* Pitch Count */}
        <label>
          Pitch Count
          <input
            type="number"
            min={0}
            onChange={(e) => setPitchCount(Number(e.target.value))}
          />
        </label>

        {/* Intent */}
        <label>
          Intent Level (%)
          <input
            type="number"
            min={0}
            max={100}
            onChange={(e) => setIntent(Number(e.target.value))}
          />
        </label>
      </div>
    );
  },
};
