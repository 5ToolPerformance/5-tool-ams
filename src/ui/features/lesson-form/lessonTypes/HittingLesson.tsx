"use client";

import { LessonTypeImplementation } from "./lessonTypes";

export const HittingLesson: LessonTypeImplementation<never> = {
  type: "hitting",
  label: "Hitting",

  // Used for mechanics filtering
  allowedMechanicTypes: ["hitting"],

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  PlayerNotes({ playerId }) {
    return null;
  },
};
