import { useState } from "react";

import { useForm } from "@tanstack/react-form";

import { LESSON_STEPS, LessonFormValues, LessonStep } from "./lessonForm.types";

const INITIAL_VALUES: LessonFormValues = {
  selectedPlayerIds: [],
  players: {},
};

export function useLessonForm() {
  const [currentStep, setCurrentStep] = useState<LessonStep>("select-players");

  const form = useForm({
    defaultValues: INITIAL_VALUES,
  });

  function ensurePlayers(playerIds: string[]) {
    playerIds.forEach((playerId) => {
      ensurePlayer(playerId);
    });
  }

  function ensurePlayer(playerId: string) {
    const players = form.getFieldValue("players");

    if (!players[playerId]) {
      form.setFieldValue(`players.${playerId}`, {});
    }
  }

  function ensureSharedNotes() {
    const sharedNotes = form.getFieldValue("sharedNotes");

    if (!sharedNotes) {
      form.setFieldValue("sharedNotes", {});
    }
  }

  function isStepValid(step: LessonStep): boolean {
    const values = form.state.values;

    switch (step) {
      case "select-players":
        return !!values.lessonType && values.selectedPlayerIds.length > 0;

      case "player-notes":
        return values.selectedPlayerIds.every(
          (id) => !!values.players[id]?.notes
        );

      case "shared-notes":
        return true;

      case "confirm":
        return true;
    }
  }

  function nextStep() {
    if (!isStepValid(currentStep)) return;

    const index = LESSON_STEPS.indexOf(currentStep);
    if (index < LESSON_STEPS.length - 1) {
      setCurrentStep(LESSON_STEPS[index + 1]);
    }
  }

  function prevStep() {
    const index = LESSON_STEPS.indexOf(currentStep);
    if (index > 0) {
      setCurrentStep(LESSON_STEPS[index - 1]);
    }
  }

  async function submit() {
    if (!isStepValid("confirm")) return;

    const values = form.state.values;

    // normalization + orchestrator call goes here
    // submitLesson(values)

    console.log("Submitting lesson", values);
  }

  return {
    form,

    values: form.state.values,
    errors: form.state.errors,
    isSubmitting: form.state.isSubmitting,

    step: {
      current: currentStep,
      next: nextStep,
      prev: prevStep,
      isValid: isStepValid,
    },

    ensurePlayers,
    ensurePlayer,
    ensureSharedNotes,

    submit,
  };
}
