"use client";

import { LessonTypeImplementation } from "./lessonTypes";

export const HittingLesson: LessonTypeImplementation = {
  type: "hitting",
  label: "Hitting",

  // Used for mechanics filtering
  allowedMechanicTypes: ["hitting"],

  PlayerNotes({ playerId }) {
    return null;
  },
};
