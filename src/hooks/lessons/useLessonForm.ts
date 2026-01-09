import { useState } from "react";

import { useForm } from "@tanstack/react-form";

import { submitLesson, updateLessonAction } from "@/app/actions/lessons";

import { LESSON_STEPS, LessonFormValues, LessonStep } from "./lessonForm.types";

const INITIAL_VALUES: LessonFormValues = {
  selectedPlayerIds: [],
  players: {},
};

type UseLessonFormOptions = {
  mode: "create" | "edit";
  lessonId?: string;
  defaultValues?: LessonFormValues;
};

export function useLessonForm({
  mode,
  lessonId,
  defaultValues,
}: UseLessonFormOptions) {
  const [currentStep, setCurrentStep] = useState<LessonStep>("select-players");

  const form = useForm({
    defaultValues: defaultValues ?? INITIAL_VALUES,
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
        return (
          !!values.lessonType &&
          !!values.lessonDate &&
          values.selectedPlayerIds.length > 0
        );

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
    try {
      const values = form.state.values;

      if (mode === "edit") {
        if (!lessonId) {
          throw new Error("Missing lessonId for edit mode");
        }

        await updateLessonAction(lessonId, values);
        console.log("Lesson updated successfully");
      } else {
        await submitLesson(values);
        console.log("Lesson submitted successfully");
      }
    } catch (error) {
      console.error("Failed to submit lesson:", error);
      throw new Error("Failed to submit lesson");
    }
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

    mode,
    lessonId,
  };
}
