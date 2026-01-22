"use client";

import { LessonTypeImplementation } from "./lessonTypes";

export const FieldingLesson: LessonTypeImplementation<never> = {
  type: "fielding",
  label: "Fielding",

  // Used for mechanics filtering
  allowedMechanicTypes: ["fielding"],

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  PlayerNotes({ playerId }) {
    return null;
  },
};
