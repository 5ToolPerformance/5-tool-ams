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

export type LessonFormPlayer = {
  id: string;
  firstName: string;
  lastName: string;
};

interface LessonStepperProps {
  players: LessonFormPlayer[];
}

export function LessonStepper({ players }: LessonStepperProps) {
  const { step } = useLessonFormContext();

  const StepComponent = STEP_COMPONENTS[step.current];

  return (
    <div>
      <StepComponent players={players} />

      <StepNavigation />
    </div>
  );
}

function StepNavigation() {
  const { form, step } = useLessonFormContext();

  return (
    <form.Subscribe selector={(state) => state.values}>
      {() => (
        <div style={{ marginTop: 24 }}>
          <button
            type="button"
            onClick={step.prev}
            disabled={step.current === "select-players"}
          >
            Back
          </button>

          <button
            type="button"
            onClick={step.next}
            disabled={!step.isValid(step.current)}
            style={{ marginLeft: 8 }}
          >
            Next
          </button>
        </div>
      )}
    </form.Subscribe>
  );
}
