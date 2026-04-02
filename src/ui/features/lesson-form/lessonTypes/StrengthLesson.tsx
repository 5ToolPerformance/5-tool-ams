"use client";

import { LessonTypeImplementation } from "./lessonTypes";

export const StrengthLesson: LessonTypeImplementation<never> = {
  type: "strength",
  label: "Strength",

  // Used for mechanics filtering
  allowedMechanicTypes: [],
  allowedDrillTypes: ["strength"],

  fatigueCheck: false,

  PlayerNotes() {
    return null;
  },
};
