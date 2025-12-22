// STILL NEEDS DESIGN SYSTEM
import { createContext, useContext } from "react";

import { useLessonForm } from "@/hooks/lessons/useLessonForm";

type LessonFormContextValue = ReturnType<typeof useLessonForm>;

const LessonFormContext = createContext<LessonFormContextValue | null>(null);

export function useLessonFormContext() {
  const context = useContext(LessonFormContext);

  if (!context) {
    throw new Error(
      "[useLessonFormContext] must be used within a <LessonFormProvider />"
    );
  }

  return context;
}

type LessonFormProviderProps = {
  children: React.ReactNode;
};

export function LessonFormProvider({ children }: LessonFormProviderProps) {
  const lessonForm = useLessonForm();

  return (
    <LessonFormContext.Provider value={lessonForm}>
      {children}
    </LessonFormContext.Provider>
  );
}
