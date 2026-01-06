"use client";

import { createContext, useContext, useMemo } from "react";

import { useLessonForm } from "@/hooks/lessons/useLessonForm";

export type LessonFormPlayer = {
  id: string;
  firstName: string;
  lastName: string;
};

export type LessonFormMechanic = {
  id: string;
  name: string;
  description: string | null;
  type: string | null;
  tags: string[] | null;
};

type LessonFormContextValue = ReturnType<typeof useLessonForm> & {
  players: LessonFormPlayer[];
  playerById: Record<string, string>;

  mechanics: LessonFormMechanic[];
  mechanicById: Record<string, LessonFormMechanic>;
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
  players: LessonFormPlayer[];
  mechanics: LessonFormMechanic[];
  children: React.ReactNode;
};

export function LessonFormProvider({
  players = [],
  mechanics = [],
  children,
}: LessonFormProviderProps) {
  const lessonForm = useLessonForm();
  const { form } = lessonForm;

  const playerById = useMemo(() => {
    return Object.fromEntries(
      players.map((p) => [p.id, `${p.firstName} ${p.lastName}`])
    );
  }, [players]);

  const mechanicById = useMemo(() => {
    return Object.fromEntries(mechanics.map((m) => [m.id, m]));
  }, [mechanics]);

  return (
    <LessonFormContext.Provider
      value={{
        ...lessonForm,
        players,
        playerById,

        mechanics,
        mechanicById,
      }}
    >
      <form.Subscribe selector={(state) => state.values}>
        {() => children}
      </form.Subscribe>
    </LessonFormContext.Provider>
  );
}
