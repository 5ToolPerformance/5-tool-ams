"use client";

import { createContext, useContext } from "react";

import { useLessonForm } from "@/hooks/lessons/useLessonForm";

type LessonFormContextValue = ReturnType<typeof useLessonForm>;

const LessonFormContext = createContext<LessonFormContextValue | null>(null);

export function useLessonFormContext() {
  const context = useContext(LessonFormContext);
  if (!context) {
    throw new Error(
      "useLessonFormContext must be used within LessonFormProvider"
    );
  }
  return context;
}

export function LessonFormProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const lessonForm = useLessonForm();
  const { form } = lessonForm;

  return (
    <LessonFormContext.Provider value={lessonForm}>
      <form.Subscribe selector={(state) => state.values}>
        {() => children}
      </form.Subscribe>
    </LessonFormContext.Provider>
  );
}
