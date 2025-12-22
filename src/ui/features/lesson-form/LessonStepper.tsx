"use client";

import { useLessonFormContext } from "./LessonFormProvider";
import { StepConfirm } from "./steps/StepConfirm";
import { StepPlayerNotes } from "./steps/StepPlayerNotes";
import { StepSelectPlayers } from "./steps/StepSelectPlayers";
import { StepSharedNotes } from "./steps/StepSharedNotes";

const STEP_COMPONENTS = {
  "select-players": StepSelectPlayers,
  "player-notes": StepPlayerNotes,
  "shared-notes": StepSharedNotes,
  confirm: StepConfirm,
} as const;

export function LessonStepper() {
  const { step } = useLessonFormContext();

  const StepComponent = STEP_COMPONENTS[step.current];

  return (
    <div>
      <StepComponent />

      <StepNavigation />
    </div>
  );
}

function StepNavigation() {
  const { step } = useLessonFormContext();

  return (
    <div className="mt-6">
      <button
        type="button"
        disabled={step.current === "select-players"}
        onClick={step.prev}
      >
        Back
      </button>

      <button
        className="ml-2"
        type="button"
        disabled={!step.isValid(step.current)}
        onClick={step.next}
      >
        Next
      </button>
    </div>
  );
}
