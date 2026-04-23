import { useRouter } from "next/navigation";
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
  const router = useRouter();

  const [showSuccess, setShowSuccess] = useState(false);

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
      form.setFieldValue("sharedNotes", { general: "" });
    }
  }

  function shouldSkipSharedNotes() {
    return form.state.values.selectedPlayerIds.length === 1;
  }

  function getActiveSteps(): LessonStep[] {
    if (!shouldSkipSharedNotes()) return LESSON_STEPS;
    return LESSON_STEPS.filter((step) => step !== "shared-notes");
  }

  function syncSharedNotesForPlayerCount() {
    if (!shouldSkipSharedNotes()) return;
    form.setFieldValue("sharedNotes.general", "");
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
        return true;

      case "shared-notes":
        return true;

      case "confirm":
        return true;
    }
  }

  function nextStep() {
    if (!isStepValid(currentStep)) return;

    syncSharedNotesForPlayerCount();

    const activeSteps = getActiveSteps();
    const index = activeSteps.indexOf(currentStep);
    if (index < activeSteps.length - 1) {
      setCurrentStep(activeSteps[index + 1]);
    }
  }

  function prevStep() {
    const activeSteps = getActiveSteps();
    const index = activeSteps.indexOf(currentStep);
    if (index > 0) {
      setCurrentStep(activeSteps[index - 1]);
    }
  }

  async function submit() {
    if (!isStepValid("confirm")) return;
    try {
      syncSharedNotesForPlayerCount();
      const values = form.state.values;

      if (mode === "edit") {
        if (!lessonId) {
          throw new Error("Missing lessonId for edit mode");
        }

        await updateLessonAction(lessonId, values);
        return { mode: "edit" as const };
      } else {
        const result = await submitLesson(values);
        return { mode: "create" as const, ...result };
      }
    } catch (error) {
      console.error("Failed to submit lesson:", error);
      throw new Error("Failed to submit lesson");
    }
  }

  function completeSuccess() {
    setShowSuccess(true);
  }

  function handleSuccessClose() {
    setShowSuccess(false);

    // choose ONE:
    router.push("/");
    // or: router.push(`/lessons/${createdLessonId}`);
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
    completeSuccess,
    showSuccess,
    handleSuccessClose,

    mode,
    lessonId,
  };
}
