"use client";

import { Button, Divider } from "@heroui/react";

import { SuccessModal } from "@/ui/features/lesson-form/components/SuccessModal";

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
  const { step, showSuccess, handleSuccessClose } = useLessonFormContext();

  const StepComponent = STEP_COMPONENTS[step.current];

  return (
    <>
      <div className="space-y-6">
        <StepComponent />

        {/* Divider keeps content + nav visually separate */}
        <Divider />

        <StepNavigation />
      </div>
      <SuccessModal isOpen={showSuccess} onClose={handleSuccessClose} />
    </>
  );
}
function StepNavigation() {
  const { form, step } = useLessonFormContext();

  const isFirstStep = step.current === "select-players";
  const isLastStep = step.current === "confirm";

  return (
    <form.Subscribe selector={(state) => state.values}>
      {() => (
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          {/* Back */}
          {!isFirstStep && (
            <Button variant="flat" onPress={step.prev}>
              Back
            </Button>
          )}

          {/* Next (hidden on final step) */}
          {!isLastStep && (
            <Button
              color="primary"
              onPress={step.next}
              isDisabled={!step.isValid(step.current)}
            >
              Next
            </Button>
          )}
        </div>
      )}
    </form.Subscribe>
  );
}
