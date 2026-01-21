"use client";

import { LessonTypeImplementation } from "./lessonTypes";

export const CatchingLesson: LessonTypeImplementation = {
  type: "catching",
  label: "Catching",

  // Used for mechanics filtering
  allowedMechanicTypes: ["catching"],

  PlayerNotes({ playerId }) {
    return null;
  },
};
