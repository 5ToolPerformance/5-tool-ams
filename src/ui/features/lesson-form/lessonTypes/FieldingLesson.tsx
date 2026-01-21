"use client";

import { LessonTypeImplementation } from "./lessonTypes";

export const FieldingLesson: LessonTypeImplementation = {
  type: "fielding",
  label: "Fielding",

  // Used for mechanics filtering
  allowedMechanicTypes: ["fielding"],

  PlayerNotes({ playerId }) {
    return null;
  },
};
