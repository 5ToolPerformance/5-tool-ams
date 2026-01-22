"use client";

import { LessonTypeImplementation } from "./lessonTypes";

export const CatchingLesson: LessonTypeImplementation<never> = {
  type: "catching",
  label: "Catching",

  // Used for mechanics filtering
  allowedMechanicTypes: ["catching"],

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  PlayerNotes({ playerId }) {
    return null;
  },
};
