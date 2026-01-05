"use client";

import { createContext, useContext, useMemo } from "react";

import { useLessonForm } from "@/hooks/lessons/useLessonForm";

type LessonFormContextValue = ReturnType<typeof useLessonForm> & {
  players: {
    id: string;
    firstName: string;
    lastName: string;
  }[];
  playerById: Record<string, string>;
};

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

type LessonFormProviderProps = {
  players: {
    id: string;
    firstName: string;
    lastName: string;
  }[];
  children: React.ReactNode;
};

export function LessonFormProvider({
  players = [],
  children,
}: LessonFormProviderProps) {
  const lessonForm = useLessonForm();
  const { form } = lessonForm;

  const playerById = useMemo(() => {
    return Object.fromEntries(
      players.map((p) => [p.id, `${p.firstName} ${p.lastName}`])
    );
  }, [players]);

  return (
    <LessonFormContext.Provider
      value={{
        ...lessonForm,
        players,
        playerById,
      }}
    >
      <form.Subscribe selector={(state) => state.values}>
        {() => children}
      </form.Subscribe>
    </LessonFormContext.Provider>
  );
}
